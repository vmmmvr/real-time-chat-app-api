-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "userIP" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false;
