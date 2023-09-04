-- CreateTable
CREATE TABLE "snippets" (
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
CREATE UNIQUE INDEX "snippets_uuid_key" ON "snippets"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "snippets_identifier_key" ON "snippets"("identifier");
