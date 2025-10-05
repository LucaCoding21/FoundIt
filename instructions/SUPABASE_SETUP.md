# Supabase Setup Instructions

## Your Credentials

**Supabase URL**: `https://sjkbraluzebtmsgssrsp.supabase.co`
**Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqa2JyYWx1emVwYnRtc2dzcnNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MTcwMjMsImV4cCI6MjA3NTE5MzAyM30.FApiFiu5HehKvttxE-qx1LkA1-4xqjtvhvuZFoUNNu0`

## Database Schema

The app uses two tables: `items` and `reports`

### Items Table

Stores all found items that staff upload.

| Column       | Type        | Notes                               |
| ------------ | ----------- | ----------------------------------- |
| id           | UUID        | Primary key                         |
| photo_url    | TEXT        | Image URL                           |
| category     | TEXT        | e.g. "Wallet", "Electronics"        |
| campus       | TEXT        | "Burnaby", "Surrey", or "Vancouver" |
| date_found   | DATE        | When item was found                 |
| description  | TEXT        | Public description                  |
| hidden_notes | TEXT        | Private notes for verification      |
| created_at   | TIMESTAMPTZ | Auto-generated                      |
| updated_at   | TIMESTAMPTZ | Auto-generated                      |

### Reports Table

Stores student lost item reports.

| Column               | Type        | Notes                    |
| -------------------- | ----------- | ------------------------ |
| id                   | UUID        | Primary key              |
| email                | TEXT        | Student contact          |
| category             | TEXT        | Same categories as items |
| campus               | TEXT        | Same campuses as items   |
| location_description | TEXT        | Where they lost it       |
| details              | TEXT        | Item description         |
| photo_url            | TEXT        | Optional photo           |
| created_at           | TIMESTAMPTZ | Auto-generated           |

## SQL Setup Script

Run this in your Supabase SQL Editor:

```sql
-- Create items table
CREATE TABLE items (
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

-- Create reports table
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  campus TEXT NOT NULL,
  location_description TEXT NOT NULL,
  details TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies (for MVP - allows public access)
CREATE POLICY "Public can view items" ON items FOR SELECT USING (true);
CREATE POLICY "Public can insert items" ON items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update items" ON items FOR UPDATE USING (true);
CREATE POLICY "Public can delete items" ON items FOR DELETE USING (true);

CREATE POLICY "Public can view reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Public can insert reports" ON reports FOR INSERT WITH CHECK (true);
```

## Categories

The app uses these predefined categories:

- Clothing
- Bag
- Wallet
- Electronics
- Keys
- Water Bottle
- Umbrella
- Book
- ID/Cards
- Other

## Campuses

The app supports these campuses:

- Burnaby
- Surrey
- Vancouver

## Security Notes

⚠️ **For MVP only**: The RLS policies allow public read/write access. This is fine for testing but not production-ready.

For production, you should:

1. Implement proper authentication
2. Restrict write access to authenticated admins only
3. Filter out `hidden_notes` from public queries
4. Add server-side API routes to protect sensitive operations

## Testing

After setup, you can test by:

1. Going to admin portal and uploading an item
2. Checking if it appears on the student portal
3. Submitting a lost report as a student
4. Checking if admin can see the report and find matches
