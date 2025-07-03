/*
  Warnings:

  - Made the column `priceInCents` on table `SecondaryOption` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SecondaryOption" ALTER COLUMN "priceInCents" SET NOT NULL;

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "imagePath" DROP NOT NULL,
ALTER COLUMN "discountExpirationTime" DROP NOT NULL;
