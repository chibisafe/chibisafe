-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rateLimitWindow" INTEGER NOT NULL,
    "rateLimitMax" INTEGER NOT NULL,
    "secret" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "chunkSize" TEXT NOT NULL,
    "chunkedUploadsTimeout" INTEGER NOT NULL,
    "maxSize" TEXT NOT NULL,
    "generateZips" BOOLEAN NOT NULL,
    "generateOriginalFileNameWithIdentifier" BOOLEAN NOT NULL DEFAULT false,
    "generatedFilenameLength" INTEGER NOT NULL,
    "generatedAlbumLength" INTEGER NOT NULL,
    "generatedLinksLength" INTEGER NOT NULL DEFAULT 8,
    "blockedExtensions" TEXT NOT NULL,
    "blockNoExtension" BOOLEAN NOT NULL,
    "publicMode" BOOLEAN NOT NULL,
    "userAccounts" BOOLEAN NOT NULL,
    "disableStatisticsCron" BOOLEAN NOT NULL,
    "disableUpdateCheck" BOOLEAN NOT NULL DEFAULT false,
    "backgroundImageURL" TEXT NOT NULL,
    "logoURL" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "metaKeywords" TEXT NOT NULL,
    "metaTwitterHandle" TEXT NOT NULL,
    "metaDomain" TEXT NOT NULL DEFAULT '',
    "serveUploadsFrom" TEXT NOT NULL DEFAULT '',
    "enableMixedCaseFilenames" BOOLEAN NOT NULL DEFAULT true,
    "usersStorageQuota" TEXT NOT NULL DEFAULT '0',
    "useNetworkStorage" BOOLEAN NOT NULL DEFAULT false,
    "useMinimalHomepage" BOOLEAN NOT NULL DEFAULT false,
    "useUrlShortener" BOOLEAN NOT NULL DEFAULT false,
    "generateThumbnails" BOOLEAN NOT NULL DEFAULT true,
    "privacyPolicyPageContent" TEXT NOT NULL DEFAULT '',
    "termsOfServicePageContent" TEXT NOT NULL DEFAULT '',
    "rulesPageContent" TEXT NOT NULL DEFAULT '',
    "S3Region" TEXT NOT NULL DEFAULT '',
    "S3Bucket" TEXT NOT NULL DEFAULT '',
    "S3AccessKey" TEXT NOT NULL DEFAULT '',
    "S3SecretKey" TEXT NOT NULL DEFAULT '',
    "S3Endpoint" TEXT NOT NULL DEFAULT '',
    "S3PublicUrl" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_settings" ("S3AccessKey", "S3Bucket", "S3Endpoint", "S3PublicUrl", "S3Region", "S3SecretKey", "backgroundImageURL", "blockNoExtension", "blockedExtensions", "chunkSize", "chunkedUploadsTimeout", "disableStatisticsCron", "disableUpdateCheck", "enableMixedCaseFilenames", "generateOriginalFileNameWithIdentifier", "generateThumbnails", "generateZips", "generatedAlbumLength", "generatedFilenameLength", "generatedLinksLength", "id", "logoURL", "maxSize", "metaDescription", "metaDomain", "metaKeywords", "metaTwitterHandle", "publicMode", "rateLimitMax", "rateLimitWindow", "secret", "serveUploadsFrom", "serviceName", "useMinimalHomepage", "useNetworkStorage", "useUrlShortener", "userAccounts", "usersStorageQuota") SELECT "S3AccessKey", "S3Bucket", "S3Endpoint", "S3PublicUrl", "S3Region", "S3SecretKey", "backgroundImageURL", "blockNoExtension", "blockedExtensions", "chunkSize", "chunkedUploadsTimeout", "disableStatisticsCron", "disableUpdateCheck", "enableMixedCaseFilenames", "generateOriginalFileNameWithIdentifier", "generateThumbnails", "generateZips", "generatedAlbumLength", "generatedFilenameLength", "generatedLinksLength", "id", "logoURL", "maxSize", "metaDescription", "metaDomain", "metaKeywords", "metaTwitterHandle", "publicMode", "rateLimitMax", "rateLimitWindow", "secret", "serveUploadsFrom", "serviceName", "useMinimalHomepage", "useNetworkStorage", "useUrlShortener", "userAccounts", "usersStorageQuota" FROM "settings";
DROP TABLE "settings";
ALTER TABLE "new_settings" RENAME TO "settings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
