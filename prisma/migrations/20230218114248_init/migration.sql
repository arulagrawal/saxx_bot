-- CreateTable
CREATE TABLE "User" (
    "snowflake" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "totalTime" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "CurrentSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "joinTime" DATETIME NOT NULL,
    "userSnowflake" TEXT NOT NULL,
    CONSTRAINT "CurrentSession_userSnowflake_fkey" FOREIGN KEY ("userSnowflake") REFERENCES "User" ("snowflake") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompletedSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "joinTime" DATETIME NOT NULL,
    "leaveTime" DATETIME NOT NULL,
    "userSnowflake" TEXT NOT NULL,
    CONSTRAINT "CompletedSession_userSnowflake_fkey" FOREIGN KEY ("userSnowflake") REFERENCES "User" ("snowflake") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_snowflake_key" ON "User"("snowflake");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentSession_userSnowflake_key" ON "CurrentSession"("userSnowflake");
