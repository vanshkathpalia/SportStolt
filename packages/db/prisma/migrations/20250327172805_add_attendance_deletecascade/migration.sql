-- DropForeignKey
ALTER TABLE "StoryAttendance" DROP CONSTRAINT "StoryAttendance_storyId_fkey";

-- AddForeignKey
ALTER TABLE "StoryAttendance" ADD CONSTRAINT "StoryAttendance_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
