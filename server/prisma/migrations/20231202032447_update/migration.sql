-- CreateTable
CREATE TABLE "FriendList" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "invitedId" INTEGER NOT NULL,
    "usuario" TEXT NOT NULL,

    CONSTRAINT "FriendList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FriendList" ADD CONSTRAINT "FriendList_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendList" ADD CONSTRAINT "FriendList_invitedId_fkey" FOREIGN KEY ("invitedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
