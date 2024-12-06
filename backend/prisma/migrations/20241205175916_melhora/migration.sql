-- CreateEnum
CREATE TYPE "Relacionamento" AS ENUM ('SOLTEIRO', 'CASADO');

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "idade" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "relacionamento" "Relacionamento" DEFAULT 'SOLTEIRO';
