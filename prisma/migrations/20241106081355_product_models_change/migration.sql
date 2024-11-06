/*
  Warnings:

  - You are about to drop the column `discount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discountExpirationTime` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `inStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `primaryProductId` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `variantFor` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `variantValue` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `relatedCategoryId` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the `FilterGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FilterOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FilterGroupToSubCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FilterOptionToProduct` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[optionGroup,optionName]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,relatedCategoryName]` on the table `SubCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `remainRnStock` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDiscountExpirationTime` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mainProductId` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionGroup` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountExpirationTime` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relatedCategoryName` to the `SubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FilterOption" DROP CONSTRAINT "FilterOption_filterGroupId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_primaryProductId_fkey";

-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_relatedCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "_FilterGroupToSubCategory" DROP CONSTRAINT "_FilterGroupToSubCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_FilterGroupToSubCategory" DROP CONSTRAINT "_FilterGroupToSubCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "_FilterOptionToProduct" DROP CONSTRAINT "_FilterOptionToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_FilterOptionToProduct" DROP CONSTRAINT "_FilterOptionToProduct_B_fkey";

-- DropIndex
DROP INDEX "ProductVariant_variantFor_variantValue_key";

-- DropIndex
DROP INDEX "SubCategory_name_key";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "productVariantId" TEXT,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "discount",
DROP COLUMN "discountExpirationTime",
DROP COLUMN "inStock",
ADD COLUMN     "remainRnStock" INTEGER NOT NULL,
ADD COLUMN     "totalDiscountExpirationTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "totalDiscountProcent" INTEGER;

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "discount",
DROP COLUMN "name",
DROP COLUMN "primaryProductId",
DROP COLUMN "variantFor",
DROP COLUMN "variantValue",
ADD COLUMN     "discountPercent" INTEGER,
ADD COLUMN     "mainProductId" TEXT NOT NULL,
ADD COLUMN     "optionGroup" TEXT NOT NULL,
ADD COLUMN     "optionName" TEXT;

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "productVariantId" TEXT;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "discount",
ADD COLUMN     "discountExpirationTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "discountProcent" INTEGER;

-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "relatedCategoryId",
ADD COLUMN     "relatedCategoryName" TEXT NOT NULL;

-- DropTable
DROP TABLE "FilterGroup";

-- DropTable
DROP TABLE "FilterOption";

-- DropTable
DROP TABLE "_FilterGroupToSubCategory";

-- DropTable
DROP TABLE "_FilterOptionToProduct";

-- CreateTable
CREATE TABLE "Filter" (
    "id" TEXT NOT NULL,
    "option" TEXT NOT NULL,
    "filterGroup" TEXT NOT NULL,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PurchaseToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FilterToProductVariant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FilterToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FilterToSubCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Filter_option_key" ON "Filter"("option");

-- CreateIndex
CREATE UNIQUE INDEX "_PurchaseToService_AB_unique" ON "_PurchaseToService"("A", "B");

-- CreateIndex
CREATE INDEX "_PurchaseToService_B_index" ON "_PurchaseToService"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FilterToProductVariant_AB_unique" ON "_FilterToProductVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_FilterToProductVariant_B_index" ON "_FilterToProductVariant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FilterToProduct_AB_unique" ON "_FilterToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_FilterToProduct_B_index" ON "_FilterToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FilterToSubCategory_AB_unique" ON "_FilterToSubCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_FilterToSubCategory_B_index" ON "_FilterToSubCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_optionGroup_optionName_key" ON "ProductVariant"("optionGroup", "optionName");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_name_relatedCategoryName_key" ON "SubCategory"("name", "relatedCategoryName");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_mainProductId_fkey" FOREIGN KEY ("mainProductId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_relatedCategoryName_fkey" FOREIGN KEY ("relatedCategoryName") REFERENCES "Category"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PurchaseToService" ADD CONSTRAINT "_PurchaseToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PurchaseToService" ADD CONSTRAINT "_PurchaseToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilterToProductVariant" ADD CONSTRAINT "_FilterToProductVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Filter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilterToProductVariant" ADD CONSTRAINT "_FilterToProductVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilterToProduct" ADD CONSTRAINT "_FilterToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Filter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilterToProduct" ADD CONSTRAINT "_FilterToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilterToSubCategory" ADD CONSTRAINT "_FilterToSubCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Filter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilterToSubCategory" ADD CONSTRAINT "_FilterToSubCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
