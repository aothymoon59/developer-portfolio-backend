import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';

const fallbackSettings = {
  cloudinaryCloudName: env.cloudinaryCloudName,
  cloudinaryApiKey: env.cloudinaryApiKey,
  cloudinaryApiSecret: env.cloudinaryApiSecret,
  cloudinaryFolder: env.cloudinaryFolder,
  smtpHost: env.smtpHost,
  smtpPort: env.smtpPort,
  smtpSecure: env.smtpSecure,
  smtpUser: env.smtpUser,
  smtpPass: env.smtpPass,
  mailFrom: env.mailFrom,
  adminNotificationEmail: env.adminNotificationEmail
};

export const getRuntimeSystemSettings = async () => {
  const siteSetting = await prisma.siteSetting.findFirst();

  return {
    ...fallbackSettings,
    ...(siteSetting || {})
  };
};
