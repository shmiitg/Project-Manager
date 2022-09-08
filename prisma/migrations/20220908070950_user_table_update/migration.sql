/*
  Warnings:

  - You are about to drop the column `updatdeAt` on the `user` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `updatdeAt`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `name` VARCHAR(255) NULL;
