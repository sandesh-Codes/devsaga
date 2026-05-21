/*
  Warnings:

  - You are about to drop the column `weakSpotId` on the `TestAttempt` table. All the data in the column will be lost.
  - Added the required column `testId` to the `TestAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TestAttempt" DROP CONSTRAINT "TestAttempt_weakSpotId_fkey";

-- AlterTable
ALTER TABLE "TestAttempt" DROP COLUMN "weakSpotId",
ADD COLUMN     "testId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "mcq" JSONB NOT NULL,
    "codeProblem" JSONB NOT NULL,
    "weakSpotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Test_weakSpotId_key" ON "Test"("weakSpotId");

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_weakSpotId_fkey" FOREIGN KEY ("weakSpotId") REFERENCES "WeakSpot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
