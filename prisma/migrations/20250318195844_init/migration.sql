/*
  Warnings:

  - You are about to drop the column `content` on the `books` table. All the data in the column will be lost.
  - Added the required column `name` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `books` DROP COLUMN `content`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
