/*
  Warnings:

  - You are about to drop the column `verficationCount` on the `Storyimages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Storyimages" DROP COLUMN "verficationCount",
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verificationCount" INTEGER NOT NULL DEFAULT 0;
