/*
  Warnings:

  - Added the required column `authorId` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "authorId" INTEGER NOT NULL;
