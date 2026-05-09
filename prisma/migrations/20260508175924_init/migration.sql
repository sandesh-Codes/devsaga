-- CreateTable
CREATE TABLE "DebugSession" (
    "id" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "context" TEXT,
    "category" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DebugSession_pkey" PRIMARY KEY ("id")
);
