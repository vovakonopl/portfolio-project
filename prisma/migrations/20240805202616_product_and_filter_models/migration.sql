/*
  Warnings:

  - Added the required column `discountExpirationTime` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inStock` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentCommentId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "discountExpirationTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "inStock" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "variantFor" TEXT NOT NULL,
    "variantValue" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "discount" INTEGER,
    "discountExpirationTime" TIMESTAMP(3) NOT NULL,
    "imagePaths" TEXT[],
    "inStock" INTEGER NOT NULL,
    "description" TEXT,
    "primaryProductId" TEXT NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "discount" INTEGER,
    "description" TEXT,
    "primaryProductId" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relatedCategoryId" TEXT NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilterGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FilterGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilterOption" (
    "id" TEXT NOT NULL,
    "option" TEXT NOT NULL,
    "filterGroupId" TEXT NOT NULL,

    CONSTRAINT "FilterOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FilterGroupToSubCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FilterOptionToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_variantFor_variantValue_key" ON "ProductVariant"("variantFor", "variantValue");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_name_key" ON "SubCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FilterGroup_name_key" ON "FilterGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FilterOption_option_key" ON "FilterOption"("option");

-- CreateIndex
CREATE UNIQUE INDEX "_FilterGroupToSubCategory_AB_unique" ON "_FilterGroupToSubCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_FilterGroupToSubCategory_B_index" ON "_FilterGroupToSubCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FilterOptionToProduct_AB_unique" ON "_FilterOptionToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_FilterOptionToProduct_B_index" ON "_FilterOptionToProduct"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_primaryProductId_fkey" FOREIGN KEY ("primaryProductId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_primaryProductId_fkey" FOREIGN KEY ("primaryProductId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_relatedCategoryId_fkey" FOREIGN KEY ("relatedCategoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilterOption" ADD CONSTRAINT "FilterOption_filterGroupId_fkey" FOREIGN KEY ("filterGroupId") REFERENCES "FilterGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilterGroupToSubCategory" ADD CONSTRAINT "_FilterGroupToSubCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "FilterGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilterGroupToSubCategory" ADD CONSTRAINT "_FilterGroupToSubCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilterOptionToProduct" ADD CONSTRAINT "_FilterOptionToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "FilterOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilterOptionToProduct" ADD CONSTRAINT "_FilterOptionToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
