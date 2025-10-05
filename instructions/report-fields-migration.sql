-- Migration: Add new fields to reports table
-- Run this in Supabase SQL Editor

-- Add title field (what they lost)
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS title TEXT;

-- Add phone field (optional contact)
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add date_lost field
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS date_lost DATE;

-- Update existing reports to have a default date_lost (use created_at date)
UPDATE reports 
SET date_lost = created_at::date 
WHERE date_lost IS NULL;

