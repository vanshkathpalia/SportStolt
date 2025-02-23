-- DropForeignKey
ALTER TABLE "Verification" DROP CONSTRAINT "Verification_verificationId_fkey";

-- DropIndex
DROP INDEX "Storyimages_storyImageId_key";

-- AlterTable
ALTER TABLE "Verification" ALTER COLUMN "verificationId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "Storyimages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
