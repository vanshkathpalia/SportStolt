/*
  Warnings:

  - You are about to drop the `Badge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Badge" DROP CONSTRAINT "Badge_userId_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "achievements" TEXT,
ADD COLUMN     "badgeLevel" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "legitimacy" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "university" TEXT;

-- DropTable
DROP TABLE "Badge";

-- DropTable
DROP TABLE "Photo";

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
