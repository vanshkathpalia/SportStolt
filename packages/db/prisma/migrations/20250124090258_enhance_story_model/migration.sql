-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "description" TEXT,
ADD COLUMN     "eventLink" TEXT,
ADD COLUMN     "rewardAmount" DOUBLE PRECISION,
ADD COLUMN     "rewardStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "swipeUpEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Storyimages" ADD COLUMN     "verifiedBy" INTEGER[];
