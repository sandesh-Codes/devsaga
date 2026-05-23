/*
  Warnings:

  - Changed the type of `aiFeedback` on the `TestAttempt` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TestAttempt" DROP COLUMN "aiFeedback",
ADD COLUMN     "aiFeedback" JSONB NOT NULL;
