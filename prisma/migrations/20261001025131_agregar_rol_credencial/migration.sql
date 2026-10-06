/*
  Warnings:

  - Made the column `referencia` on table `Pago` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imagen_url` on table `Producto` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Pago" ALTER COLUMN "referencia" SET NOT NULL;

-- AlterTable
ALTER TABLE "Producto" ALTER COLUMN "imagen_url" SET NOT NULL;
