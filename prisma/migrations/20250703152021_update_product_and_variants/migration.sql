/*
  Warnings:

  - You are about to drop the column `productVariantId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_productVariantId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "productVariantId";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "productId",
ALTER COLUMN "totalDiscountExpirationTime" DROP NOT NULL;

-- AlterTable
ALTER TABLE "_FilterToProduct" ADD CONSTRAINT "_FilterToProduct_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_FilterToProduct_AB_unique";

-- AlterTable
ALTER TABLE "_FilterToSubCategory" ADD CONSTRAINT "_FilterToSubCategory_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_FilterToSubCategory_AB_unique";

-- AlterTable
ALTER TABLE "_ProductToService" ADD CONSTRAINT "_ProductToService_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ProductToService_AB_unique";
