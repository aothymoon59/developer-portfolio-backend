-- AlterTable
ALTER TABLE "BlogPost" ALTER COLUMN "tags" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "skills" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SiteSetting" ALTER COLUMN "phoneNumbers" DROP DEFAULT,
ALTER COLUMN "emailAddresses" DROP DEFAULT;
