# Quick Start Guide

## 1. Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://sjkbraluzebtmsgssrsp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqa2JyYWx1emVwYnRtc2dzcnNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MTcwMjMsImV4cCI6MjA3NTE5MzAyM30.FApiFiu5HehKvttxE-qx1LkA1-4xqjtvhvuZFoUNNu0
```

## 2. Setup Supabase

1. Open `instructions/supabase-setup.sql`
2. Copy the entire file
3. Go to Supabase → SQL Editor
4. Paste and run

This sets up everything: tables, policies, storage.

## 3. Install & Run

```bash
npm install
npm run dev
```

## 4. Test It Out

- **Student view**: http://localhost:3000
- **Admin login**: http://localhost:3000/admin/login
- **Password**: `admin123`

## Done!

You now have a fully working lost & found system with:

- ✅ Supabase backend
- ✅ File uploads for photos
- ✅ Admin & student portals
- ✅ Real-time data
