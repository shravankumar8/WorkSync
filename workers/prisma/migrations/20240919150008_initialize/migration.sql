/*
  Warnings:

  - The primary key for the `Action` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `apiEndpoint` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `appId` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Action` table. All the data in the column will be lost.
  - The primary key for the `Trigger` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `apiEndpoint` on the `Trigger` table. All the data in the column will be lost.
  - You are about to drop the column `appId` on the `Trigger` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Trigger` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Trigger` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Trigger` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Trigger` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Zap` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Zap` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Zap` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Zap` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Zap` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Zap` table. All the data in the column will be lost.
  - You are about to drop the `App` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Webhook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZapExecutionLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZapStep` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[zapId]` on the table `Trigger` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Zap` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actionId` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zapId` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `triggerId` to the `Trigger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zapId` to the `Trigger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `triggerId` to the `Zap` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_zapId_fkey";

-- DropForeignKey
ALTER TABLE "UserConnection" DROP CONSTRAINT "UserConnection_appId_fkey";

-- DropForeignKey
ALTER TABLE "UserConnection" DROP CONSTRAINT "UserConnection_userId_fkey";

-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_triggerId_fkey";

-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_zapId_fkey";

-- DropForeignKey
ALTER TABLE "Zap" DROP CONSTRAINT "Zap_userId_fkey";

-- DropForeignKey
ALTER TABLE "ZapExecutionLog" DROP CONSTRAINT "ZapExecutionLog_zapId_fkey";

-- DropForeignKey
ALTER TABLE "ZapStep" DROP CONSTRAINT "ZapStep_actionId_fkey";

-- DropForeignKey
ALTER TABLE "ZapStep" DROP CONSTRAINT "ZapStep_connectionId_fkey";

-- DropForeignKey
ALTER TABLE "ZapStep" DROP CONSTRAINT "ZapStep_triggerId_fkey";

-- DropForeignKey
ALTER TABLE "ZapStep" DROP CONSTRAINT "ZapStep_zapId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Action" DROP CONSTRAINT "Action_pkey",
DROP COLUMN "apiEndpoint",
DROP COLUMN "appId",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "actionId" TEXT NOT NULL,
ADD COLUMN     "zapId" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Action_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Trigger" DROP CONSTRAINT "Trigger_pkey",
DROP COLUMN "apiEndpoint",
DROP COLUMN "appId",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "triggerId" TEXT NOT NULL,
ADD COLUMN     "zapId" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "isActive",
DROP COLUMN "updatedAt",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Zap" DROP CONSTRAINT "Zap_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "isActive",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "triggerId" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Zap_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "App";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "UserConnection";

-- DropTable
DROP TABLE "Webhook";

-- DropTable
DROP TABLE "ZapExecutionLog";

-- DropTable
DROP TABLE "ZapStep";

-- CreateTable
CREATE TABLE "AvailableAction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AvailableAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailableTrigger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AvailableTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_zapId_key" ON "Trigger"("zapId");

-- CreateIndex
CREATE UNIQUE INDEX "Zap_id_key" ON "Zap"("id");

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "AvailableAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "AvailableTrigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
