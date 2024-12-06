/*
  Warnings:

  - A unique constraint covering the columns `[zap]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `zap` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "zap" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_zap_key" ON "Usuario"("zap");
