/*
  Warnings:

  - You are about to drop the column `storyId` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_storyId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "storyId",
ADD COLUMN     "storyImageId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_storyImageId_fkey" FOREIGN KEY ("storyImageId") REFERENCES "Storyimages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
