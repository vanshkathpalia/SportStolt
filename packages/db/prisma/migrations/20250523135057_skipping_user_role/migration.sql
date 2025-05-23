/*
  Warnings:

  - You are about to drop the `IndividualProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IndividualProfile" DROP CONSTRAINT "IndividualProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationProfile" DROP CONSTRAINT "OrganizationProfile_userId_fkey";

-- DropTable
DROP TABLE "IndividualProfile";

-- DropTable
DROP TABLE "OrganizationProfile";

-- DropEnum
DROP TYPE "UserType";
