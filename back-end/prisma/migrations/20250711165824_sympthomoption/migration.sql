/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `SymptomOption` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `SymptomOption` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SymptomOption_name_key";

-- AlterTable
ALTER TABLE "SymptomOption" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SymptomOption_userId_name_key" ON "SymptomOption"("userId", "name");

-- AddForeignKey
ALTER TABLE "SymptomOption" ADD CONSTRAINT "SymptomOption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
