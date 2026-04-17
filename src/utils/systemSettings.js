import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';

const fallbackSettings = {
  cloudinaryCloudName: env.cloudinaryCloudName,
  cloudinaryApiKey: env.cloudinaryApiKey,
  cloudinaryApiSecret: env.cloudinaryApiSecret,
  cloudinaryFolder: env.cloudinaryFolder,
  faviconUrl: '',
  footerCopyright: '',
  smtpHost: env.smtpHost,
  smtpPort: env.smtpPort,
  smtpSecure: env.smtpSecure,
  smtpUser: env.smtpUser,
  smtpPass: env.smtpPass,
  mailFrom: env.mailFrom,
  adminNotificationEmail: env.adminNotificationEmail
};

const pickConfiguredValue = (...values) =>
  values.find((value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  });

export const getRuntimeSystemSettings = async () => {
  const siteSetting = await prisma.siteSetting.findFirst();
  const smtpPort = pickConfiguredValue(siteSetting?.smtpPort, fallbackSettings.smtpPort);
  const smtpSecureSetting = pickConfiguredValue(
    siteSetting?.smtpSecure,
    siteSetting?.smtpPort ? Number(siteSetting.smtpPort) === 465 : undefined,
    Number(fallbackSettings.smtpPort) === 465 ? true : undefined,
    fallbackSettings.smtpSecure
  );

  return {
    ...fallbackSettings,
    ...(siteSetting || {}),
    cloudinaryCloudName: pickConfiguredValue(siteSetting?.cloudinaryCloudName, fallbackSettings.cloudinaryCloudName) || '',
    cloudinaryApiKey: pickConfiguredValue(siteSetting?.cloudinaryApiKey, fallbackSettings.cloudinaryApiKey) || '',
    cloudinaryApiSecret: pickConfiguredValue(siteSetting?.cloudinaryApiSecret, fallbackSettings.cloudinaryApiSecret) || '',
    cloudinaryFolder: pickConfiguredValue(siteSetting?.cloudinaryFolder, fallbackSettings.cloudinaryFolder) || '',
    faviconUrl: pickConfiguredValue(siteSetting?.faviconUrl, fallbackSettings.faviconUrl) || '',
    footerCopyright: pickConfiguredValue(siteSetting?.footerCopyright, fallbackSettings.footerCopyright) || '',
    smtpHost: pickConfiguredValue(siteSetting?.smtpHost, fallbackSettings.smtpHost) || '',
    smtpPort,
    smtpSecure: Number(smtpPort) === 465 ? true : Boolean(smtpSecureSetting),
    smtpUser: pickConfiguredValue(siteSetting?.smtpUser, fallbackSettings.smtpUser) || '',
    smtpPass: pickConfiguredValue(siteSetting?.smtpPass, fallbackSettings.smtpPass) || '',
    mailFrom:
      pickConfiguredValue(siteSetting?.mailFrom, fallbackSettings.mailFrom) ||
      pickConfiguredValue(siteSetting?.smtpUser, fallbackSettings.smtpUser) ||
      '',
    adminNotificationEmail:
      pickConfiguredValue(siteSetting?.adminNotificationEmail, fallbackSettings.adminNotificationEmail) || ''
  };
};
