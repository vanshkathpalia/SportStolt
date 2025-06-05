/*
  Warnings:

  - The values [MENTION,STORY_VERIFICATION] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `attendedAt` on the `StoryAttendance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,storyId]` on the table `StoryAttendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Made the column `storyId` on table `StoryAttendance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('LIKE', 'COMMENT', 'FOLLOW', 'STORY_ATTENDANCE', 'VERIFICATION', 'EVENT', 'SYSTEM');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "StoryAttendance" DROP CONSTRAINT "StoryAttendance_storyImageId_fkey";

-- DropIndex
DROP INDEX "StoryAttendance_storyImageId_userId_key";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "likeCount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Like_id_seq";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "eventId" INTEGER,
ADD COLUMN     "targetUserId" INTEGER,
DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- AlterTable
ALTER TABLE "StoryAttendance" DROP COLUMN "attendedAt",
ADD COLUMN     "attendanceConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "storyImageId" DROP NOT NULL,
ALTER COLUMN "storyId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StoryAttendance_userId_storyId_key" ON "StoryAttendance"("userId", "storyId");

-- AddForeignKey
ALTER TABLE "StoryAttendance" ADD CONSTRAINT "StoryAttendance_storyImageId_fkey" FOREIGN KEY ("storyImageId") REFERENCES "Storyimages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
