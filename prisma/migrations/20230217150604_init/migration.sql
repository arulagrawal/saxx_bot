/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `CurrentSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CurrentSession_userId_key" ON "CurrentSession"("userId");
