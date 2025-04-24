-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;
