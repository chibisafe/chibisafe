/*
  Warnings:

  - You are about to drop the column `key` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `settings` table. All the data in the column will be lost.
  - Added the required column `backgroundImageURL` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blockNoExtension` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blockedExtensions` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chunkSize` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chunkedUploadsTimeout` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disableStatisticsCron` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `generateZips` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `generatedAlbumLength` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `generatedFilenameLength` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoURL` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxSize` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicMode` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rateLimitMax` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rateLimitWindow` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secret` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAccounts` to the `settings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rateLimitWindow" TEXT NOT NULL,
    "rateLimitMax" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "chunkSize" INTEGER NOT NULL,
    "chunkedUploadsTimeout" INTEGER NOT NULL,
    "maxSize" INTEGER NOT NULL,
    "generateZips" BOOLEAN NOT NULL,
    "generatedFilenameLength" INTEGER NOT NULL,
    "generatedAlbumLength" INTEGER NOT NULL,
    "blockedExtensions" TEXT NOT NULL,
    "blockNoExtension" BOOLEAN NOT NULL,
    "publicMode" BOOLEAN NOT NULL,
    "userAccounts" BOOLEAN NOT NULL,
    "disableStatisticsCron" BOOLEAN NOT NULL,
    "backgroundImageURL" TEXT NOT NULL,
    "logoURL" TEXT NOT NULL
);
INSERT INTO "new_settings" ("id") SELECT "id" FROM "settings";
DROP TABLE "settings";
ALTER TABLE "new_settings" RENAME TO "settings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
