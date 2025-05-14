/*
  Warnings:

  - You are about to drop the column `creatorName` on the `clips` table. All the data in the column will be lost.
  - You are about to drop the column `gameName` on the `clips` table. All the data in the column will be lost.
  - You are about to drop the column `twitchClipId` on the `clips` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `clips` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "clips_twitchClipId_idx";

-- DropIndex
DROP INDEX "clips_twitchClipId_key";

-- AlterTable
ALTER TABLE "clips" DROP COLUMN "creatorName",
DROP COLUMN "gameName",
DROP COLUMN "twitchClipId",
DROP COLUMN "viewCount",
ADD COLUMN     "authorName" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "width" INTEGER;
