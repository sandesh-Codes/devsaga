/*
  Warnings:

  - Made the column `userId` on table `DebugSession` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "DebugSession" DROP CONSTRAINT "DebugSession_userId_fkey";

-- AlterTable
ALTER TABLE "DebugSession" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "DebugSession" ADD CONSTRAINT "DebugSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
