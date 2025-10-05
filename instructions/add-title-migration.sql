-- Migration: Add title field to items table
-- Run this in your Supabase SQL Editor

ALTER TABLE items ADD COLUMN IF NOT EXISTS title TEXT;

-- Optional: Set default value for existing items (you can change this)
UPDATE items SET title = 'Found Item' WHERE title IS NULL;

-- Make title required for future inserts
-- (Remove NOT NULL constraint if you want it to be optional)
-- ALTER TABLE items ALTER COLUMN title SET NOT NULL;

