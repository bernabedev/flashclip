/*
  Warnings:

  - You are about to drop the `Clip` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Clip" DROP CONSTRAINT "Clip_userId_fkey";

-- DropTable
DROP TABLE "Clip";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT,
    "username" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clips" (
    "id" TEXT NOT NULL,
    "twitchClipId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "creatorName" TEXT,
    "gameName" TEXT,
    "duration" INTEGER,
    "viewCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "clips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkUserId_key" ON "users"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_clerkUserId_idx" ON "users"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "clips_twitchClipId_key" ON "clips"("twitchClipId");

-- CreateIndex
CREATE INDEX "clips_userId_idx" ON "clips"("userId");

-- CreateIndex
CREATE INDEX "clips_twitchClipId_idx" ON "clips"("twitchClipId");

-- AddForeignKey
ALTER TABLE "clips" ADD CONSTRAINT "clips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
