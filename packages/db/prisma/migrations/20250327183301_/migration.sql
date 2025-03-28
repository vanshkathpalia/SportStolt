/*
  Warnings:

  - The `storyImageId` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Storyimages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Storyimages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `storyImageId` on the `StoryAttendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `verificationId` on the `Verification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_storyImageId_fkey";

-- DropForeignKey
ALTER TABLE "StoryAttendance" DROP CONSTRAINT "StoryAttendance_storyImageId_fkey";

-- DropForeignKey
ALTER TABLE "Verification" DROP CONSTRAINT "Verification_verificationId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "storyImageId",
ADD COLUMN     "storyImageId" INTEGER;

-- AlterTable
ALTER TABLE "StoryAttendance" DROP COLUMN "storyImageId",
ADD COLUMN     "storyImageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Storyimages" DROP CONSTRAINT "Storyimages_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Storyimages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "verificationId",
ADD COLUMN     "verificationId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StoryAttendance_storyImageId_userId_key" ON "StoryAttendance"("storyImageId", "userId");

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "Storyimages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAttendance" ADD CONSTRAINT "StoryAttendance_storyImageId_fkey" FOREIGN KEY ("storyImageId") REFERENCES "Storyimages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_storyImageId_fkey" FOREIGN KEY ("storyImageId") REFERENCES "Storyimages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
