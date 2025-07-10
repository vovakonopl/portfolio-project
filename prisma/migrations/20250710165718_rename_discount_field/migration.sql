/*
  Warnings:

  - You are about to drop the column `totalDiscountProcent` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discountProcent` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "totalDiscountProcent",
ADD COLUMN     "totalDiscountPercent" INTEGER;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "discountProcent",
ADD COLUMN     "discountPercent" INTEGER;
