-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('INDIVIDUAL', 'ORG');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
