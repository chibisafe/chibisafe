-- Restore column that was accidentally dropped by 20250705_add_s3pathstyle_setting
ALTER TABLE "settings" ADD COLUMN "saveDuplicatesToAlbum" BOOLEAN NOT NULL DEFAULT false;
