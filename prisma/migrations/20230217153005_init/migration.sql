/*
  Warnings:

  - Made the column `leaveTime` on table `CompletedSession` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CompletedSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "joinTime" DATETIME NOT NULL,
    "leaveTime" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "CompletedSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CompletedSession" ("id", "joinTime", "leaveTime", "userId") SELECT "id", "joinTime", "leaveTime", "userId" FROM "CompletedSession";
DROP TABLE "CompletedSession";
ALTER TABLE "new_CompletedSession" RENAME TO "CompletedSession";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
