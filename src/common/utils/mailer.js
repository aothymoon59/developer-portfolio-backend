import nodemailer from "nodemailer";
import { getRuntimeSystemSettings } from "./systemSettings.js";

const canSendMail = (settings) =>
  Boolean(
    settings.smtpHost &&
    settings.smtpPort &&
    settings.smtpUser &&
    settings.smtpPass &&
    settings.adminNotificationEmail,
  );

const canSendReplyMail = (settings) =>
  Boolean(
    settings.smtpHost &&
    settings.smtpPort &&
    settings.smtpUser &&
    settings.smtpPass,
  );

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });

const normalizeMailSettings = (settings) => {
  const port = Number(settings.smtpPort) || 587;
  const secure = port === 465;
  const smtpUser = settings.smtpUser?.trim() || "";
  const mailFrom = settings.mailFrom?.trim() || smtpUser;

  return {
    ...settings,
    smtpPort: port,
    smtpSecure: secure,
    smtpUser,
    smtpPass: settings.smtpPass || "",
    mailFrom,
  };
};

const createTransporter = (settings) =>
  nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort,
    secure: settings.smtpSecure,
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPass,
    },
  });

export const sendAdminContactNotification = async (payload) => {
  const settings = normalizeMailSettings(await getRuntimeSystemSettings());
  if (!canSendMail(settings)) return { skipped: true };

  const transporter = createTransporter(settings);
  const subject = payload.subject?.trim() || "No subject";
  const htmlMessage = escapeHtml(payload.message).replace(/\r?\n/g, "<br />");
  const textMessage = [
    "New Contact Message",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Subject: ${subject}`,
    "",
    payload.message,
  ].join("\n");

  await transporter.sendMail({
    from: settings.mailFrom,
    to: settings.adminNotificationEmail,
    subject: `New Portfolio Contact: ${subject}`,
    replyTo: payload.email,
    text: textMessage,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 12px;">New Contact Message</h2>
        <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <div style="margin-top: 16px; padding: 16px; background: #f3f4f6; border-radius: 8px;">
          ${htmlMessage}
        </div>
      </div>
    `,
  });

  return { skipped: false };
};

export const sendContactReplyEmail = async (payload) => {
  const settings = normalizeMailSettings(await getRuntimeSystemSettings());
  if (!canSendReplyMail(settings)) return { skipped: true };

  const transporter = createTransporter(settings);
  const subject = payload.subject?.trim() || "Reply to your message";
  const htmlMessage = escapeHtml(payload.message).replace(/\r?\n/g, "<br />");

  await transporter.sendMail({
    from: settings.mailFrom,
    to: payload.email,
    replyTo: settings.adminNotificationEmail || settings.mailFrom,
    subject,
    text: payload.message,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 12px;">Reply from ${escapeHtml(settings.siteTitle)}</h2>
        <p>Hello ${escapeHtml(payload.name || "there")},</p>
        <div style="margin-top: 16px; padding: 16px; background: #f3f4f6; border-radius: 8px;">
          ${htmlMessage}
        </div>
      </div>
    `,
  });

  return { skipped: false };
};
