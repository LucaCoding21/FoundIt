# FoundIt - Campus Lost & Found

A simple, visual web app for managing campus lost and found items.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** for styling
- **JavaScript** (no TypeScript)
- **Supabase** (Postgres + Storage)

## Getting Started

**See SETUP.md for complete setup instructions!**

Quick start:

1. Create `.env.local` with your Supabase credentials
2. Run `instructions/supabase-setup.sql` in Supabase SQL Editor
3. Run `npm install && npm run dev`
4. Admin login password: `admin123`

## Structure

### Student Portal (Public)

- `/` - Browse found items with filters
- `/report` - Report a lost item
- `/item/[id]` - View item details
- `/about` - About page

### Admin Portal

- `/admin/login` - Admin login (password: admin123)
- `/admin/dashboard` - View and manage all found items
- `/admin/upload` - Add new found items
- `/admin/reports` - View student lost reports and find matches

## Features

- ✅ Visual marketplace-style grid layout
- ✅ File uploads for photos (Supabase Storage)
- ✅ Search and filter by category/campus
- ✅ Edit and delete items (admin)
- ✅ Match lost reports with found items
- ✅ Image preview and validation
- ✅ Simple, clean UI with SFU branding
- ✅ Mobile responsive

## What's Not Implemented Yet

- Production-ready authentication (using simple password for now)
- Email notifications
- AI image matching

## Development

See `DEVELOPMENT_LOG.md` for progress updates and `instructions/PRD.md` for full product requirements.
