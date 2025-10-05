# Setup Guide for FoundIt

## 1. Create Environment File

Create a file called `.env.local` in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sjkbraluzebtmsgssrsp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqa2JyYWx1emVwYnRtc2dzcnNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MTcwMjMsImV4cCI6MjA3NTE5MzAyM30.FApiFiu5HehKvttxE-qx1LkA1-4xqjtvhvuZFoUNNu0

# Simple admin password (change this!)
ADMIN_PASSWORD=admin123
```

## 2. Set Up Supabase

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `instructions/supabase-setup.sql`
4. Paste into the SQL Editor
5. Click **Run**

That's it! This will create:

- Database tables (items, reports)
- Row Level Security policies
- Storage bucket for images
- Storage access policies

## 3. Install Dependencies

```bash
npm install
```

## 4. Run Development Server

```bash
npm run dev
```

## 5. Access the App

- **Student Portal**: http://localhost:3000
- **Admin Portal**: http://localhost:3000/admin/login
  - Password: `admin123`

## Admin Functions

Once logged in as admin, you can:

- View all found items
- Add new items
- Edit/delete items
- View lost reports
- Find matches between reports and found items

## Student Functions

Students can:

- Browse all found items
- Search and filter items
- View item details
- Report lost items
- See possible matches when reporting

## Features

- ✅ File uploads for photos (no more URL pasting!)
- ✅ Admin dashboard with edit/delete
- ✅ Student reporting with image upload
- ✅ Automatic matching between lost reports and found items
- ✅ Simple password authentication

## Notes

- Currently using simple password auth (not production-ready)
- Hidden notes are only visible to admins
- Email notifications not yet implemented
