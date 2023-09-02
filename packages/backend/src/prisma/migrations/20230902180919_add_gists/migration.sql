-- CreateTable
CREATE TABLE "gists" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "userId" INTEGER,
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "parentUuid" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "gists_uuid_key" ON "gists"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "gists_identifier_key" ON "gists"("identifier");
