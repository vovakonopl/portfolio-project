/*
  Warnings:

  - You are about to drop the column `href` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "href",
ADD COLUMN     "url" TEXT;
