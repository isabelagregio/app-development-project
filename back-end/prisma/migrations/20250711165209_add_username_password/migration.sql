/*
  Warnings:

  - You are about to drop the column `name` on the `Symptom` table. All the data in the column will be lost.
  - Added the required column `symptomOptionId` to the `Symptom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Symptom" DROP COLUMN "name",
ADD COLUMN     "symptomOptionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SymptomOption" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SymptomOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SymptomOption_name_key" ON "SymptomOption"("name");

-- AddForeignKey
ALTER TABLE "Symptom" ADD CONSTRAINT "Symptom_symptomOptionId_fkey" FOREIGN KEY ("symptomOptionId") REFERENCES "SymptomOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
