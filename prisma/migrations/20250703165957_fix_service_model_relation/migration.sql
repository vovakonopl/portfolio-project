/*
  Warnings:

  - You are about to drop the `_ProductToService` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ProductToService" DROP CONSTRAINT "_ProductToService_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToService" DROP CONSTRAINT "_ProductToService_B_fkey";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "productId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ProductToService";

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
