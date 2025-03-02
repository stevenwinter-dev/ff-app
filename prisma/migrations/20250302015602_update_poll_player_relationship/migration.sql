/*
  Warnings:

  - You are about to drop the column `team` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `player1Id` on the `Poll` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `Poll` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Poll" DROP CONSTRAINT "Poll_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "Poll" DROP CONSTRAINT "Poll_player2Id_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "team";

-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "player1Id",
DROP COLUMN "player2Id";

-- CreateTable
CREATE TABLE "_PlayerToPoll" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlayerToPoll_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlayerToPoll_B_index" ON "_PlayerToPoll"("B");

-- AddForeignKey
ALTER TABLE "_PlayerToPoll" ADD CONSTRAINT "_PlayerToPoll_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToPoll" ADD CONSTRAINT "_PlayerToPoll_B_fkey" FOREIGN KEY ("B") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
