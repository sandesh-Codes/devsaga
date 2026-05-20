-- CreateTable
CREATE TABLE "WeakSpot" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL DEFAULT 1,
    "sessionCount" INTEGER NOT NULL DEFAULT 1,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeakSpot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "weakSpotId" TEXT NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestAttempt" (
    "id" TEXT NOT NULL,
    "mcqAnswers" JSONB NOT NULL,
    "codeAnswer" TEXT NOT NULL,
    "aiFeedback" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "weakSpotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestAttempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeakSpot" ADD CONSTRAINT "WeakSpot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_weakSpotId_fkey" FOREIGN KEY ("weakSpotId") REFERENCES "WeakSpot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_weakSpotId_fkey" FOREIGN KEY ("weakSpotId") REFERENCES "WeakSpot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
