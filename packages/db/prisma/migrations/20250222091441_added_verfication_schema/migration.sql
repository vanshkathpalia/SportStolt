/*
  Warnings:

  - You are about to drop the column `storyId` on the `Storyimages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storyImageId]` on the table `Storyimages` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Storyimages" DROP CONSTRAINT "Storyimages_storyId_fkey";

-- AlterTable
ALTER TABLE "Storyimages" DROP COLUMN "storyId",
ADD COLUMN     "storyImageId" SERIAL NOT NULL;

-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "verificationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Storyimages_storyImageId_key" ON "Storyimages"("storyImageId");

-- AddForeignKey
ALTER TABLE "Storyimages" ADD CONSTRAINT "Storyimages_storyImageId_fkey" FOREIGN KEY ("storyImageId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "Storyimages"("storyImageId") ON DELETE RESTRICT ON UPDATE CASCADE;
