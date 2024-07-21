/*
  Warnings:

  - You are about to drop the column `telNumber` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "telNumber",
ADD COLUMN     "phoneNumber" TEXT;
