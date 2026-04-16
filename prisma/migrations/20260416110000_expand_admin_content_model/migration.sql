-- AlterTable
ALTER TABLE "SiteSetting"
ADD COLUMN "logoUrl" TEXT,
ADD COLUMN "fullName" TEXT,
ADD COLUMN "jobTitle" TEXT,
ADD COLUMN "homeDescription" TEXT,
ADD COLUMN "aboutTitle" TEXT,
ADD COLUMN "aboutDescription" TEXT,
ADD COLUMN "aboutDetails" TEXT,
ADD COLUMN "aboutImageUrl" TEXT,
ADD COLUMN "aboutImageLgUrl" TEXT,
ADD COLUMN "instagramUrl" TEXT,
ADD COLUMN "youtubeUrl" TEXT,
ADD COLUMN "contactDescription" TEXT,
ADD COLUMN "phoneNumbers" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "emailAddresses" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Project"
ALTER COLUMN "summary" DROP NOT NULL,
ADD COLUMN "subTitle" TEXT,
ADD COLUMN "frontendRepoUrl" TEXT,
ADD COLUMN "backendRepoUrl" TEXT,
ADD COLUMN "additionalLinks" JSONB,
ADD COLUMN "skills" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "BlogPost"
ADD COLUMN "subTitle" TEXT,
ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
