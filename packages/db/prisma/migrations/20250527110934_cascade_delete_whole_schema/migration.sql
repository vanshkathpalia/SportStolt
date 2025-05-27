-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PostPhoto" DROP CONSTRAINT "PostPhoto_postId_fkey";

-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_userId_fkey";

-- DropForeignKey
ALTER TABLE "Save" DROP CONSTRAINT "Save_postId_fkey";

-- DropForeignKey
ALTER TABLE "Save" DROP CONSTRAINT "Save_userId_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_authorId_fkey";

-- DropForeignKey
ALTER TABLE "StoryAttendance" DROP CONSTRAINT "StoryAttendance_storyId_fkey";

-- DropForeignKey
ALTER TABLE "StoryAttendance" DROP CONSTRAINT "StoryAttendance_userId_fkey";

-- DropForeignKey
ALTER TABLE "StoryView" DROP CONSTRAINT "StoryView_storyId_fkey";

-- DropForeignKey
ALTER TABLE "StoryView" DROP CONSTRAINT "StoryView_userId_fkey";

-- DropForeignKey
ALTER TABLE "Storyimages" DROP CONSTRAINT "Storyimages_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_userId_fkey";

-- DropForeignKey
ALTER TABLE "Verification" DROP CONSTRAINT "Verification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Verification" DROP CONSTRAINT "Verification_verificationId_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPhoto" ADD CONSTRAINT "PostPhoto_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storyimages" ADD CONSTRAINT "Storyimages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryView" ADD CONSTRAINT "StoryView_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryView" ADD CONSTRAINT "StoryView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "Storyimages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAttendance" ADD CONSTRAINT "StoryAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAttendance" ADD CONSTRAINT "StoryAttendance_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
