/*
  Warnings:

  - Added the required column `preview` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "preview" TEXT NOT NULL;
