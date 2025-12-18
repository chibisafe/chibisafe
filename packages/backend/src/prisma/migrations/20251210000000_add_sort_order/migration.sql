-- Add sortOrder column to albums table
ALTER TABLE "albums" ADD COLUMN "sortOrder" TEXT;

-- Add defaultSortOrder column to settings table
ALTER TABLE "settings" ADD COLUMN "defaultSortOrder" TEXT NOT NULL DEFAULT 'createdAt:desc';
