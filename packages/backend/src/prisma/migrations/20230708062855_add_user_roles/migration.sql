-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_rolesTousers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_rolesTousers_A_fkey" FOREIGN KEY ("A") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_rolesTousers_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_rolesTousers_AB_unique" ON "_rolesTousers"("A", "B");

-- CreateIndex
CREATE INDEX "_rolesTousers_B_index" ON "_rolesTousers"("B");

-- Assign the corresponded roles to the users
INSERT INTO "roles" ("name") VALUES ('owner');
INSERT INTO "roles" ("name") VALUES ('admin');
INSERT INTO "roles" ("name") VALUES ('user');
INSERT INTO "_rolesTousers" ("B", "A") SELECT "id", (SELECT "id" FROM "roles" WHERE "name" = 'admin') FROM "users" WHERE "isAdmin" = true;
INSERT INTO "_rolesTousers" ("B", "A") SELECT "id", (SELECT "id" FROM "roles" WHERE "name" = 'user') FROM "users" WHERE "isAdmin" = false;

-- Grab the first admin user that is not disabled
-- and assign the owner role to it
INSERT INTO "_rolesTousers" ("B", "A") SELECT "id", (SELECT "id" FROM "roles" WHERE "name" = 'owner') FROM "users" WHERE "isAdmin" = true AND "enabled" = true LIMIT 1;

--- Delete the old isAdmin column from the users table
