-- AlterTable
ALTER TABLE `Task` ADD COLUMN `userID` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
