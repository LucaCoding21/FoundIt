-- FoundIt Supabase Setup
-- Copy and paste this entire file into your Supabase SQL Editor

-- ============================================
-- 1. CREATE DATABASE TABLES
-- ============================================

-- Items table (found items uploaded by staff)
CREATE TABLE IF NOT EXISTS items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_url TEXT NOT NULL,
  category TEXT NOT NULL,
  campus TEXT NOT NULL,
  date_found DATE NOT NULL,
  description TEXT NOT NULL,
  hidden_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table (lost item reports from students)
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  campus TEXT NOT NULL,
  location_description TEXT NOT NULL,
  details TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CREATE RLS POLICIES FOR TABLES
-- ============================================

-- Items policies (allow public access for MVP)
CREATE POLICY "Public can view items" ON items
  FOR SELECT USING (true);

CREATE POLICY "Public can insert items" ON items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update items" ON items
  FOR UPDATE USING (true);

CREATE POLICY "Public can delete items" ON items
  FOR DELETE USING (true);

-- Reports policies (allow public access for MVP)
CREATE POLICY "Public can view reports" ON reports
  FOR SELECT USING (true);

CREATE POLICY "Public can insert reports" ON reports
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 4. CREATE STORAGE BUCKET FOR IMAGES
-- ============================================

-- Create the storage bucket (public for image access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('foundit-images', 'foundit-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. CREATE STORAGE POLICIES
-- ============================================

-- Allow public to upload, view, update, and delete images
-- (For MVP - restrict in production)
CREATE POLICY "Public can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'foundit-images');

CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'foundit-images');

CREATE POLICY "Public can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'foundit-images');

CREATE POLICY "Public can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'foundit-images');

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your FoundIt database is ready to use.
-- Run your app with: npm run dev
-- Admin password: admin123

