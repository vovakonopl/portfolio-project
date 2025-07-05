/*
  Warnings:

  - You are about to drop the column `relatedCategoryName` on the `SubCategory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,relatedCategoryId]` on the table `SubCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `relatedCategoryId` to the `SubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_relatedCategoryName_fkey";

-- DropIndex
DROP INDEX "SubCategory_name_relatedCategoryName_key";

-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "relatedCategoryName",
ADD COLUMN     "relatedCategoryId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_name_relatedCategoryId_key" ON "SubCategory"("name", "relatedCategoryId");

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_relatedCategoryId_fkey" FOREIGN KEY ("relatedCategoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
