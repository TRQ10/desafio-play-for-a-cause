/*
  Warnings:

  - You are about to drop the `FriendList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FriendList" DROP CONSTRAINT "FriendList_invitedId_fkey";

-- DropForeignKey
ALTER TABLE "FriendList" DROP CONSTRAINT "FriendList_ownerId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "friendIds" INTEGER[];

-- DropTable
DROP TABLE "FriendList";
