# Supabase Storage Setup for Image Uploads

The app now supports direct file uploads for photos. Follow these steps to enable image uploads.

## Step 1: Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Set the following:
   - **Name**: `foundit-images`
   - **Public**: ✅ Enable (so images are publicly accessible)
5. Click **Create Bucket**

## Step 2: Set Bucket Policies

After creating the bucket, you need to set up policies to allow uploads:

1. Click on the `foundit-images` bucket
2. Go to **Policies** tab
3. Click **New Policy**

### Policy 1: Allow Public Reads

```sql
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'foundit-images');
```

### Policy 2: Allow Public Uploads

```sql
CREATE POLICY "Public can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'foundit-images');
```

### Policy 3: Allow Public Updates (optional)

```sql
CREATE POLICY "Public can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'foundit-images');
```

### Policy 4: Allow Public Deletes (optional)

```sql
CREATE POLICY "Public can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'foundit-images');
```

## Alternative: Quick Setup via SQL

You can also run this in the SQL Editor:

```sql
-- Create the bucket (if not already created via UI)
INSERT INTO storage.buckets (id, name, public)
VALUES ('foundit-images', 'foundit-images', true)
ON CONFLICT DO NOTHING;

-- Set up policies
CREATE POLICY "Public access for foundit-images"
ON storage.objects FOR ALL
USING (bucket_id = 'foundit-images')
WITH CHECK (bucket_id = 'foundit-images');
```

## How It Works

1. **Admin Upload**: When admins upload an item, they can now select a file instead of pasting a URL
2. **Student Report**: Students can optionally attach a photo when reporting a lost item
3. **Edit Items**: Admins can upload a new photo when editing existing items

### Upload Process

1. User selects an image file (JPG, PNG, or WEBP)
2. File is validated (max 5MB)
3. Unique filename is generated
4. File is uploaded to `foundit-images/items/` folder
5. Public URL is retrieved and saved to database

## File Organization

Images are stored with this structure:
```
foundit-images/
  └── items/
      ├── abc123-1696531200000.jpg
      ├── def456-1696531201000.png
      └── ...
```

## Testing

After setup:
1. Go to `/admin/upload`
2. Click the file input and select an image
3. Wait for "Uploading..." to complete
4. You should see a preview of the uploaded image
5. Complete the form and save
6. Image should display on both admin and student portals

## Security Notes

⚠️ **For MVP**: Policies allow public upload/delete. For production:

1. Restrict uploads to authenticated users only
2. Add file size limits at the bucket level
3. Implement virus scanning
4. Add rate limiting
5. Clean up orphaned images (images not referenced in database)

## Troubleshooting

**"Failed to upload image" error:**
- Check that the bucket name is exactly `foundit-images`
- Verify the bucket is set to public
- Confirm policies are properly set
- Check browser console for detailed error messages

**Images not showing:**
- Verify the bucket is public
- Check that the SELECT policy is in place
- Ensure the image URL is being saved correctly to the database

