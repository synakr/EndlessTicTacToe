/*
  Warnings:

  - The values [LOCAL] on the enum `GameMode` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `type` on the `GamePlayer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameId,userId]` on the table `GamePlayer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `currentTurn` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `symbol` on the `GamePlayer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PlayerSymbol" AS ENUM ('X', 'O');

-- AlterEnum
BEGIN;
CREATE TYPE "GameMode_new" AS ENUM ('MULTI', 'AI', 'DEVICE');
ALTER TABLE "Game" ALTER COLUMN "mode" TYPE "GameMode_new" USING ("mode"::text::"GameMode_new");
ALTER TYPE "GameMode" RENAME TO "GameMode_old";
ALTER TYPE "GameMode_new" RENAME TO "GameMode";
DROP TYPE "GameMode_old";
COMMIT;

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "tieBreaker" INTEGER NOT NULL DEFAULT 3,
ALTER COLUMN "boardSize" SET DEFAULT 3,
ALTER COLUMN "status" SET DEFAULT 'waiting',
DROP COLUMN "currentTurn",
ADD COLUMN     "currentTurn" "PlayerSymbol" NOT NULL;

-- AlterTable
ALTER TABLE "GamePlayer" DROP COLUMN "type",
DROP COLUMN "symbol",
ADD COLUMN     "symbol" "PlayerSymbol" NOT NULL;

-- AlterTable
ALTER TABLE "Move" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "username" TEXT;

-- DropEnum
DROP TYPE "PlayerType";

-- CreateIndex
CREATE UNIQUE INDEX "GamePlayer_gameId_userId_key" ON "GamePlayer"("gameId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");
