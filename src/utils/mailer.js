import nodemailer from 'nodemailer';
import { getRuntimeSystemSettings } from './systemSettings.js';

const canSendMail = (settings) =>
  Boolean(
    settings.smtpHost &&
      settings.smtpPort &&
      settings.smtpUser &&
      settings.smtpPass &&
      settings.adminNotificationEmail
  );

const createTransporter = (settings) =>
  nodemailer.createTransport({
    host: settings.smtpHost,
    port: Number(settings.smtpPort),
    secure: Boolean(settings.smtpSecure),
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPass
    }
  });

export const sendAdminContactNotification = async (payload) => {
  const settings = await getRuntimeSystemSettings();
  if (!canSendMail(settings)) return { skipped: true };

  const transporter = createTransporter(settings);

  await transporter.sendMail({
    from: settings.mailFrom,
    to: settings.adminNotificationEmail,
    subject: `New Portfolio Contact: ${payload.subject || 'No subject'}`,
    replyTo: payload.email,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 12px;">New Contact Message</h2>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Subject:</strong> ${payload.subject || 'No subject'}</p>
        <div style="margin-top: 16px; padding: 16px; background: #f3f4f6; border-radius: 8px;">
          ${payload.message}
        </div>
      </div>
    `
  });

  return { skipped: false };
};
