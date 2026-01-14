-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PM', 'OPERATOR_DWG', 'REQUESTER', 'PRODUCTION_LEAD');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('REGULAR', 'PROTOTYPE');

-- CreateEnum
CREATE TYPE "ProcessName" AS ENUM ('JOINT_DRAWING', 'HOUSING_DRAWING', 'JIG_DRAWING', 'VISUAL_DRAWING', 'JOB_STATION_ACC', 'JOB_STATION_FINISHING');

-- CreateEnum
CREATE TYPE "ProductionStage" AS ENUM ('PLANNING', 'PP', 'HOUSING', 'ASSEMBLING', 'VISUAL', 'JS_ACC', 'JS_FINISHING', 'CHECKER', 'PREDEL');

-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'REWORK');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('REFERENCE', 'DRAFT_FILE', 'FINAL_DELIVERY', 'REVISION_IMG');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OPERATOR_DWG',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "assyNumber" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "totalPo" TEXT NOT NULL,
    "plotting" "ProjectType" NOT NULL DEFAULT 'REGULAR',
    "orderDate" TIMESTAMP(3) NOT NULL,
    "etd" TIMESTAMP(3) NOT NULL,
    "internalDeadline" TIMESTAMP(3) NOT NULL,
    "engineeringStatus" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "productionStage" "ProductionStage" NOT NULL DEFAULT 'PLANNING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pmId" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_orders" (
    "id" TEXT NOT NULL,
    "processName" "ProcessName" NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "WorkOrderStatus" NOT NULL DEFAULT 'PENDING',
    "operatorNote" TEXT,
    "completedAt" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,
    "assignedUserId" TEXT,

    CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revisions" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "screenshotUrl" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileType" "AssetType" NOT NULL,
    "projectId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projects_assyNumber_key" ON "projects"("assyNumber");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_pmId_fkey" FOREIGN KEY ("pmId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revisions" ADD CONSTRAINT "revisions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revisions" ADD CONSTRAINT "revisions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
