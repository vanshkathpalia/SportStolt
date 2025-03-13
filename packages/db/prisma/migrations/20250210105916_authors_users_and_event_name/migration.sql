/*
  Warnings:

  - You are about to drop the column `image` on the `Story` table. All the data in the column will be lost.
  - Added the required column `name` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationimage` to the `Story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserID` to the `Storyimages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "image",
ADD COLUMN "locationimage" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Storyimages" ADD COLUMN "UserID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Storyimages" ADD CONSTRAINT "Storyimages_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
