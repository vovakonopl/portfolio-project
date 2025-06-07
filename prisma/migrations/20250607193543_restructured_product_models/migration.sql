/*
  Warnings:

  - You are about to drop the column `remainRnStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discountExpirationTime` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `discountPercent` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `inStock` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `mainProductId` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `productVariantId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `primaryProductId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the `_FilterToProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PurchaseToService` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `remainInStock` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainInStock` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Made the column `optionName` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `purchasedItem` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedSecondaryOptions` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedServices` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_mainProductId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_productId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_primaryProductId_fkey";

-- DropForeignKey
ALTER TABLE "_FilterToProductVariant" DROP CONSTRAINT "_FilterToProductVariant_A_fkey";

-- DropForeignKey
ALTER TABLE "_FilterToProductVariant" DROP CONSTRAINT "_FilterToProductVariant_B_fkey";

-- DropForeignKey
ALTER TABLE "_PurchaseToService" DROP CONSTRAINT "_PurchaseToService_A_fkey";

-- DropForeignKey
ALTER TABLE "_PurchaseToService" DROP CONSTRAINT "_PurchaseToService_B_fkey";

-- DropIndex
DROP INDEX "ProductVariant_optionGroup_optionName_key";

-- AlterTable
ALTER TABLE "Filter" ADD COLUMN     "productVariantId" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "remainRnStock",
ADD COLUMN     "optionGroup" TEXT,
ADD COLUMN     "optionName" TEXT,
ADD COLUMN     "productId" TEXT,
ADD COLUMN     "remainInStock" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "discountExpirationTime",
DROP COLUMN "discountPercent",
DROP COLUMN "inStock",
DROP COLUMN "mainProductId",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "remainInStock" INTEGER NOT NULL,
ADD COLUMN     "subCategoryId" TEXT,
ALTER COLUMN "optionName" SET NOT NULL;

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "productId",
DROP COLUMN "productVariantId",
ADD COLUMN     "purchasedItem" JSONB NOT NULL,
ADD COLUMN     "selectedSecondaryOptions" JSONB NOT NULL,
ADD COLUMN     "selectedServices" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "primaryProductId";

-- DropTable
DROP TABLE "_FilterToProductVariant";

-- DropTable
DROP TABLE "_PurchaseToService";

-- CreateTable
CREATE TABLE "SecondaryOption" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "priceInCents" INTEGER,
    "optionGroup" TEXT NOT NULL,
    "optionName" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "SecondaryOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToService_AB_unique" ON "_ProductToService"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToService_B_index" ON "_ProductToService"("B");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecondaryOption" ADD CONSTRAINT "SecondaryOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToService" ADD CONSTRAINT "_ProductToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToService" ADD CONSTRAINT "_ProductToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
