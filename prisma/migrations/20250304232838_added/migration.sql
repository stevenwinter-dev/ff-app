-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "player1Points" DOUBLE PRECISION,
ADD COLUMN     "player2Points" DOUBLE PRECISION,
ADD COLUMN     "winningPlayerId" INTEGER;

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "isCorrect" BOOLEAN;
