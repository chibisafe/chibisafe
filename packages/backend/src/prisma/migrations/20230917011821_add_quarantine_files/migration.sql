-- CreateTable
CREATE TABLE "quarantineFiles" (
    "fileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reason" TEXT,
    CONSTRAINT "quarantineFiles_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_files" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "userId" INTEGER,
    "name" TEXT NOT NULL,
    "original" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" DATETIME,
    "quarantine" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_files" ("createdAt", "editedAt", "hash", "id", "ip", "name", "original", "size", "type", "userId", "uuid") SELECT "createdAt", "editedAt", "hash", "id", "ip", "name", "original", "size", "type", "userId", "uuid" FROM "files";
DROP TABLE "files";
ALTER TABLE "new_files" RENAME TO "files";
CREATE UNIQUE INDEX "files_uuid_key" ON "files"("uuid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "quarantineFiles_fileId_key" ON "quarantineFiles"("fileId");
