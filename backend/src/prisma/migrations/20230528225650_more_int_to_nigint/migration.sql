/*
  Warnings:

  - You are about to alter the column `chunkSize` on the `settings` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `maxSize` on the `settings` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "domain" TEXT NOT NULL,
    "rateLimitWindow" INTEGER NOT NULL,
    "rateLimitMax" INTEGER NOT NULL,
    "secret" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "chunkSize" BIGINT NOT NULL,
    "chunkedUploadsTimeout" INTEGER NOT NULL,
    "maxSize" BIGINT NOT NULL,
    "generateZips" BOOLEAN NOT NULL,
    "generatedFilenameLength" INTEGER NOT NULL,
    "generatedAlbumLength" INTEGER NOT NULL,
    "blockedExtensions" TEXT NOT NULL,
    "blockNoExtension" BOOLEAN NOT NULL,
    "publicMode" BOOLEAN NOT NULL,
    "userAccounts" BOOLEAN NOT NULL,
    "disableStatisticsCron" BOOLEAN NOT NULL,
    "backgroundImageURL" TEXT NOT NULL,
    "logoURL" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "metaKeywords" TEXT NOT NULL,
    "metaTwitterHandle" TEXT NOT NULL
);
INSERT INTO "new_settings" ("backgroundImageURL", "blockNoExtension", "blockedExtensions", "chunkSize", "chunkedUploadsTimeout", "disableStatisticsCron", "domain", "generateZips", "generatedAlbumLength", "generatedFilenameLength", "id", "logoURL", "maxSize", "metaDescription", "metaKeywords", "metaTwitterHandle", "publicMode", "rateLimitMax", "rateLimitWindow", "secret", "serviceName", "userAccounts") SELECT "backgroundImageURL", "blockNoExtension", "blockedExtensions", "chunkSize", "chunkedUploadsTimeout", "disableStatisticsCron", "domain", "generateZips", "generatedAlbumLength", "generatedFilenameLength", "id", "logoURL", "maxSize", "metaDescription", "metaKeywords", "metaTwitterHandle", "publicMode", "rateLimitMax", "rateLimitWindow", "secret", "serviceName", "userAccounts" FROM "settings";
DROP TABLE "settings";
ALTER TABLE "new_settings" RENAME TO "settings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
