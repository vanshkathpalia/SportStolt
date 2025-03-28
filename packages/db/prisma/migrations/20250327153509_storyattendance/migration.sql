/*
  Warnings:

  - You are about to drop the column `UserId` on the `Storyimages` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Storyimages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Storyimages" DROP CONSTRAINT "Storyimages_UserId_fkey";

-- AlterTable
ALTER TABLE "Storyimages" DROP COLUMN "UserId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "StoryAttendance" (
    "id" TEXT NOT NULL,
    "storyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "attendedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoryAttendance_storyId_userId_key" ON "StoryAttendance"("storyId", "userId");

-- AddForeignKey
ALTER TABLE "Storyimages" ADD CONSTRAINT "Storyimages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAttendance" ADD CONSTRAINT "StoryAttendance_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAttendance" ADD CONSTRAINT "StoryAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
