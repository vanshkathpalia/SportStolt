/*
  Warnings:

  - You are about to drop the column `locationImage` on the `Story` table. All the data in the column will be lost.
  - The primary key for the `Storyimages` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Story" DROP COLUMN "locationImage";

-- AlterTable
ALTER TABLE "Storyimages" DROP CONSTRAINT "Storyimages_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Storyimages_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Storyimages_id_seq";
