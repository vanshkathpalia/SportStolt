/*
  Warnings:

  - You are about to drop the column `viewed` on the `Story` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Story" DROP COLUMN "viewed",
ADD COLUMN     "isViewed" BOOLEAN NOT NULL DEFAULT false;
