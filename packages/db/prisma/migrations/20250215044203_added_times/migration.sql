/*
  Warnings:

  - Added the required column `activityEnded` to the `Story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activityStarted` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Story" ADD COLUMN "activityEnded" TIMESTAMP(3) NOT NULL,
ADD COLUMN "activityStarted" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "endTime" DROP DEFAULT;
