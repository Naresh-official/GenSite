/*
  Warnings:

  - You are about to drop the column `data` on the `Message` table. All the data in the column will be lost.
  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ASSISTANT');

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "data",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL;
