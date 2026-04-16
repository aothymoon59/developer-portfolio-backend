/*
  Warnings:

  - You are about to drop the column `technologies` on the `Experience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlogPost" ALTER COLUMN "tags" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "technologies",
ADD COLUMN     "department" TEXT;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "skills" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SiteSetting" ALTER COLUMN "phoneNumbers" DROP DEFAULT,
ALTER COLUMN "emailAddresses" DROP DEFAULT;
