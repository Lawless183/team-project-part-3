/*
  Warnings:

  - Added the required column `userID` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Task` ADD COLUMN `userID` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
