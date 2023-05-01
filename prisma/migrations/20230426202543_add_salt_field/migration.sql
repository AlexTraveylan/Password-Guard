/*
  Warnings:

  - Added the required column `salt` to the `UserApp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserApp" ADD COLUMN     "salt" TEXT NOT NULL;
