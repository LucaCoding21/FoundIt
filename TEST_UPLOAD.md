# Troubleshooting Image Upload

## Error: "Failed to upload image: Failed to fetch"

This means one of these issues:

### 1. ✅ Missing .env.local (FIXED)

I just created it for you with your Supabase credentials.

### 2. ⚠️ Storage Bucket Not Created

You need to run the SQL setup first!

**Do this now:**

1. Go to your Supabase project: https://supabase.com/dashboard/project/sjkbraluzebtmsgssrsp
2. Click **SQL Editor** in the left sidebar
3. Open `instructions/supabase-setup.sql` in this project
4. Copy the ENTIRE file
5. Paste into Supabase SQL Editor
6. Click **Run**

This will create:

- Database tables
- Storage bucket `foundit-images`
- All necessary policies

### 3. Restart Dev Server

After creating .env.local, restart your server:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### 4. Check Browser Console

Open browser DevTools (F12) → Console tab and look for detailed error messages.

## Quick Test Checklist

✅ .env.local created
⬜ SQL setup run in Supabase
⬜ Dev server restarted
⬜ Storage bucket visible in Supabase dashboard

## Verify Storage Bucket Exists

1. Go to Supabase dashboard
2. Click **Storage** in left sidebar
3. You should see a bucket named `foundit-images`
4. It should be marked as **Public**

If you don't see it, run the SQL setup!

## Still Having Issues?

Check browser console and share the full error message.
