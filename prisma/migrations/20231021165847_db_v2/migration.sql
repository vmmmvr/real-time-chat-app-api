/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "description" TEXT,
ADD COLUMN     "profile_image" TEXT,
ADD COLUMN     "username" TEXT;

-- CreateTable
CREATE TABLE "MessagesImage" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "messageuuid" TEXT NOT NULL,

    CONSTRAINT "MessagesImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessagesImage_uuid_key" ON "MessagesImage"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "MessagesImage" ADD CONSTRAINT "MessagesImage_messageuuid_fkey" FOREIGN KEY ("messageuuid") REFERENCES "Message"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
