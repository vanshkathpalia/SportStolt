-- AlterTable
ALTER TABLE "Storyimages" ADD COLUMN     "isRewarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verficationCount" INTEGER NOT NULL DEFAULT 0;
