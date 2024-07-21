/*
  Warnings:

  - You are about to drop the column `additionalContacts` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "additionalContacts";

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "href" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
