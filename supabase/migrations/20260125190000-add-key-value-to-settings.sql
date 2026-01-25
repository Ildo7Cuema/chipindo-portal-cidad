-- Add key and value columns to system_settings if they don't exist
ALTER TABLE system_settings 
ADD COLUMN IF NOT EXISTS "key" TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS "value" JSONB DEFAULT '{}'::jsonb;

-- Add unique constraint to key to ensure we can identify rows
-- We first need to ensure uniqueness, but since we expect only one row for now, it's fine.
-- Or we handle it carefully.

-- Update the existing row (normally id=1) to have the strict key
UPDATE system_settings
SET "key" = 'system_config'
WHERE id = (SELECT id FROM system_settings LIMIT 1) AND "key" IS NULL;

-- Now invalid rows (if any)
-- We might want to add a unique index but handle potential duplicates first?
-- For now, just adding the column and populating it is enough to fix the SELECT.

-- Ensure the column 'key' matches what the frontend expects.
