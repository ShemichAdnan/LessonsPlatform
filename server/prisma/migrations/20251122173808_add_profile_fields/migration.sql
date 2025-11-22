-- AlterTable
ALTER TABLE `users` ADD COLUMN `bio` TEXT NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `experience` INTEGER NULL,
    ADD COLUMN `pricePerHour` INTEGER NULL;
