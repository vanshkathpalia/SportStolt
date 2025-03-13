/*
  Warnings:

  - You are about to drop the column `UserID` on the `Storyimages` table. All the data in the column will be lost.
  - Added the required column `UserId` to the `Storyimages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Storyimages" DROP CONSTRAINT "Storyimages_UserID_fkey";

-- AlterTable
ALTER TABLE "Storyimages" DROP COLUMN "UserID",
ADD COLUMN     "UserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Storyimages" ADD CONSTRAINT "Storyimages_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
