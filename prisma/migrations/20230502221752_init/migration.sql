-- CreateTable
CREATE TABLE "GuardedPassword" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "login" VARCHAR(255) NOT NULL,
    "password" BYTEA NOT NULL,
    "encryptedAESKey" BYTEA NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "GuardedPassword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserApp" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "masterPassword" BYTEA NOT NULL,
    "salt" TEXT NOT NULL,
    "publicKey" BYTEA NOT NULL,
    "privateKey" BYTEA NOT NULL,

    CONSTRAINT "UserApp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserApp_email_key" ON "UserApp"("email");

-- AddForeignKey
ALTER TABLE "GuardedPassword" ADD CONSTRAINT "GuardedPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
