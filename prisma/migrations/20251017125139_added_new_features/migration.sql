-- CreateEnum
CREATE TYPE "public"."ItemStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."Item" ADD COLUMN     "status" "public"."ItemStatus" NOT NULL DEFAULT 'DRAFT';
