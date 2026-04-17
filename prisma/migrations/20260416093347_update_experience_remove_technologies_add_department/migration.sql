/*
  Warnings:

  - You are about to drop the column `technologies` on the `Experience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "technologies",
ADD COLUMN     "department" TEXT;
