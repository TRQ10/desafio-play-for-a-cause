/*
  Warnings:

  - You are about to drop the column `perfil` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `usuario` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_usuario_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "perfil",
DROP COLUMN "usuario",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "picture" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
