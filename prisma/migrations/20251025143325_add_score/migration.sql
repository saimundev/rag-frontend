-- CreateTable
CREATE TABLE `Inning` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matchId` INTEGER NOT NULL,
    `inningNumber` INTEGER NOT NULL,
    `battingTeamId` INTEGER NOT NULL,
    `bowlingTeamId` INTEGER NOT NULL,
    `runs` INTEGER NOT NULL DEFAULT 0,
    `wickets` INTEGER NOT NULL DEFAULT 0,
    `overs` DOUBLE NOT NULL DEFAULT 0,
    `isPowerPlay` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ball` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inningId` INTEGER NOT NULL,
    `overNumber` INTEGER NOT NULL,
    `ballNumber` INTEGER NOT NULL,
    `runs` INTEGER NOT NULL DEFAULT 0,
    `extras` INTEGER NOT NULL DEFAULT 0,
    `isWicket` BOOLEAN NOT NULL DEFAULT false,
    `wicketInfo` JSON NULL,
    `batsmanId` INTEGER NULL,
    `bowlerId` INTEGER NULL,
    `remark` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BatsmanStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NOT NULL,
    `inningId` INTEGER NOT NULL,
    `runs` INTEGER NOT NULL DEFAULT 0,
    `ballsFaced` INTEGER NOT NULL DEFAULT 0,
    `totalFours` INTEGER NOT NULL DEFAULT 0,
    `totalSixes` INTEGER NOT NULL DEFAULT 0,
    `isOnStrike` BOOLEAN NOT NULL DEFAULT false,
    `isOut` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BowlerStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NOT NULL,
    `inningId` INTEGER NOT NULL,
    `oversBowled` DOUBLE NOT NULL DEFAULT 0,
    `maidens` INTEGER NOT NULL DEFAULT 0,
    `runsGiven` INTEGER NOT NULL DEFAULT 0,
    `wicketsTaken` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Inning` ADD CONSTRAINT `Inning_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inning` ADD CONSTRAINT `Inning_battingTeamId_fkey` FOREIGN KEY (`battingTeamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inning` ADD CONSTRAINT `Inning_bowlingTeamId_fkey` FOREIGN KEY (`bowlingTeamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ball` ADD CONSTRAINT `Ball_inningId_fkey` FOREIGN KEY (`inningId`) REFERENCES `Inning`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ball` ADD CONSTRAINT `Ball_batsmanId_fkey` FOREIGN KEY (`batsmanId`) REFERENCES `Player`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ball` ADD CONSTRAINT `Ball_bowlerId_fkey` FOREIGN KEY (`bowlerId`) REFERENCES `Player`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatsmanStats` ADD CONSTRAINT `BatsmanStats_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatsmanStats` ADD CONSTRAINT `BatsmanStats_inningId_fkey` FOREIGN KEY (`inningId`) REFERENCES `Inning`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BowlerStats` ADD CONSTRAINT `BowlerStats_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BowlerStats` ADD CONSTRAINT `BowlerStats_inningId_fkey` FOREIGN KEY (`inningId`) REFERENCES `Inning`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
