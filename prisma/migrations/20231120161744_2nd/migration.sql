-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "isEdited" SET DEFAULT false;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "lastLoginDate" DROP NOT NULL;
