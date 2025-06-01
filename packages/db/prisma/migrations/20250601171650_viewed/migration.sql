/*
  Warnings:

  - You are about to drop the column `storyImageId` on the `Storyimages` table. All the data in the column will be lost.
  - Added the required column `storyId` to the `Storyimages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Storyimages" DROP CONSTRAINT "Storyimages_storyImageId_fkey";

-- AlterTable
ALTER TABLE "Storyimages" DROP COLUMN "storyImageId",
ADD COLUMN     "storyId" INTEGER NOT NULL,
ALTER COLUMN "verifiedBy" SET DEFAULT ARRAY[]::INTEGER[];

-- AddForeignKey
ALTER TABLE "Storyimages" ADD CONSTRAINT "Storyimages_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
