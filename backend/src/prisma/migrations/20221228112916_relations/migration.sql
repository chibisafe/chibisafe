/*
  Warnings:

  - You are about to drop the `albumsFiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fileTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "albumsFiles";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "fileTags";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_filesTotags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_filesTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "files" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_filesTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_albumsTofiles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_albumsTofiles_A_fkey" FOREIGN KEY ("A") REFERENCES "albums" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_albumsTofiles_B_fkey" FOREIGN KEY ("B") REFERENCES "files" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_filesTotags_AB_unique" ON "_filesTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_filesTotags_B_index" ON "_filesTotags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_albumsTofiles_AB_unique" ON "_albumsTofiles"("A", "B");

-- CreateIndex
CREATE INDEX "_albumsTofiles_B_index" ON "_albumsTofiles"("B");
