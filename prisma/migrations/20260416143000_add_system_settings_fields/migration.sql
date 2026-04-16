-- AlterTable
ALTER TABLE "SiteSetting"
ADD COLUMN "cloudinaryCloudName" TEXT,
ADD COLUMN "cloudinaryApiKey" TEXT,
ADD COLUMN "cloudinaryApiSecret" TEXT,
ADD COLUMN "cloudinaryFolder" TEXT,
ADD COLUMN "smtpHost" TEXT,
ADD COLUMN "smtpPort" INTEGER,
ADD COLUMN "smtpSecure" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "smtpUser" TEXT,
ADD COLUMN "smtpPass" TEXT,
ADD COLUMN "mailFrom" TEXT,
ADD COLUMN "adminNotificationEmail" TEXT;
