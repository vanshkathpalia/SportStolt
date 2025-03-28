/*
  Warnings:

  - A unique constraint covering the columns `[storyImageId,userId]` on the table `StoryAttendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `storyImageId` to the `StoryAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StoryAttendance" DROP CONSTRAINT "StoryAttendance_storyId_fkey";

-- DropForeignKey
ALTER TABLE "Storyimages" DROP CONSTRAINT "Storyimages_storyImageId_fkey";

-- DropIndex
DROP INDEX "StoryAttendance_storyId_userId_key";

-- AlterTable
ALTER TABLE "StoryAttendance" ADD COLUMN     "storyImageId" TEXT NOT NULL,
ALTER COLUMN "storyId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StoryAttendance_storyImageId_userId_key" ON "StoryAttendance"("storyImageId", "userId");

-- AddForeignKey
ALTER TABLE "Storyimages" ADD CONSTRAINT "Storyimages_storyImageId_fkey" FOREIGN KEY ("storyImageId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAttendance" ADD CONSTRAINT "StoryAttendance_storyImageId_fkey" FOREIGN KEY ("storyImageId") REFERENCES "Storyimages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAttendance" ADD CONSTRAINT "StoryAttendance_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;
