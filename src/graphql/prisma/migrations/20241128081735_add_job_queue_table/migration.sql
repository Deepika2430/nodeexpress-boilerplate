-- CreateTable
CREATE TABLE "JobQueue" (
    "id" TEXT NOT NULL,
    "queueName" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "JobQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobQueue_queueName_jobId_key" ON "JobQueue"("queueName", "jobId");
