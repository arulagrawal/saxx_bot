/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Event";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "joinTime" DATETIME NOT NULL,
    "leaveTime" DATETIME,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
