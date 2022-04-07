-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelsWithUsers" (
    "id" SERIAL NOT NULL,
    "useruuid" TEXT NOT NULL,
    "channeluuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChannelsWithUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "creatoruuid" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channeluuid" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "senderuuid" TEXT NOT NULL,
    "roomuuid" TEXT NOT NULL,
    "channeluuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "userAgent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelsWithUsers_useruuid_channeluuid_key" ON "ChannelsWithUsers"("useruuid", "channeluuid");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_uuid_key" ON "Channel"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Room_uuid_key" ON "Room"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Message_uuid_key" ON "Message"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Session_uuid_key" ON "Session"("uuid");

-- AddForeignKey
ALTER TABLE "ChannelsWithUsers" ADD CONSTRAINT "ChannelsWithUsers_useruuid_fkey" FOREIGN KEY ("useruuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelsWithUsers" ADD CONSTRAINT "ChannelsWithUsers_channeluuid_fkey" FOREIGN KEY ("channeluuid") REFERENCES "Channel"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_creatoruuid_fkey" FOREIGN KEY ("creatoruuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_channeluuid_fkey" FOREIGN KEY ("channeluuid") REFERENCES "Channel"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderuuid_fkey" FOREIGN KEY ("senderuuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channeluuid_fkey" FOREIGN KEY ("channeluuid") REFERENCES "Channel"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomuuid_fkey" FOREIGN KEY ("roomuuid") REFERENCES "Room"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
