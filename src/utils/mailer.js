import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const canSendMail = () =>
  Boolean(env.smtpHost && env.smtpPort && env.smtpUser && env.smtpPass && env.adminNotificationEmail);

const createTransporter = () =>
  nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

export const sendAdminContactNotification = async (payload) => {
  if (!canSendMail()) return { skipped: true };

  const transporter = createTransporter();

  await transporter.sendMail({
    from: env.mailFrom,
    to: env.adminNotificationEmail,
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
