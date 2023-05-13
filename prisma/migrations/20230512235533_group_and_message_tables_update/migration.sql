-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_recipientID_fkey`;

-- AlterTable
ALTER TABLE `Message` ADD COLUMN `groupID` INTEGER NULL,
    MODIFY `recipientID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_recipientID_fkey` FOREIGN KEY (`recipientID`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_groupID_fkey` FOREIGN KEY (`groupID`) REFERENCES `Group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
