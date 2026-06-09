-- CreateTable
CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `nomeSocial` VARCHAR(191) NOT NULL,
    `dataNascimento` DATETIME(3) NOT NULL,
    `dataCadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `titularId` INTEGER NULL,
    `acomodacaoId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `telefones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ddd` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `clienteId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enderecos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rua` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `pais` VARCHAR(191) NOT NULL,
    `codigoPostal` VARCHAR(191) NOT NULL,
    `clienteId` INTEGER NOT NULL,

    UNIQUE INDEX `enderecos_clienteId_key`(`clienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(191) NOT NULL,
    `tipo` ENUM('CPF', 'RG', 'PASSAPORTE') NOT NULL,
    `dataExpedicao` DATETIME(3) NOT NULL,
    `clienteId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `acomodacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` ENUM('CASAL_SIMPLES', 'FAMILIA_MAIS', 'FAMILIA_SIMPLES', 'FAMILIA_SUPER', 'SOLTEIRO_MAIS', 'SOLTEIRO_SIMPLES') NOT NULL,
    `camaSolteiro` INTEGER NOT NULL,
    `camaCasal` INTEGER NOT NULL,
    `suite` INTEGER NOT NULL,
    `climatizacao` BOOLEAN NOT NULL,
    `garagem` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clientes` ADD CONSTRAINT `clientes_titularId_fkey` FOREIGN KEY (`titularId`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clientes` ADD CONSTRAINT `clientes_acomodacaoId_fkey` FOREIGN KEY (`acomodacaoId`) REFERENCES `acomodacoes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `telefones` ADD CONSTRAINT `telefones_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enderecos` ADD CONSTRAINT `enderecos_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
