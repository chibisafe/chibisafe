/*
  Warnings:

  - You are about to drop the `albumsLinks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "albumsLinks";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "invites" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdBy" TEXT NOT NULL,
    "usedBy" TEXT,
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "invites_code_key" ON "invites"("code");
