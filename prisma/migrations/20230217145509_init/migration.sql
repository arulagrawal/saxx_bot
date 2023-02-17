/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Session";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CurrentSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "joinTime" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "CurrentSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompletedSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "joinTime" DATETIME NOT NULL,
    "leaveTime" DATETIME,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "CompletedSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
