# Implementation Notes

## Project Structure

```
/app
  /admin
    /login - Admin login (placeholder)
    /dashboard - View/manage all items
    /upload - Add new items
    /reports - View lost reports & matches
  /item/[id] - Item detail page
  /report - Report lost item
  /about - About page
  page.js - Home/browse page
  layout.js - Root layout
  globals.css - Tailwind imports

/components
  Navbar.js - Student portal nav
  AdminNav.js - Admin portal nav
  ItemCard.js - Reusable item card
  EditModal.js - Edit item modal
  DeleteModal.js - Delete confirmation
  MatchesModal.js - Show matching items

/lib
  mockData.js - Mock items, reports, categories, campuses
```

## Key Design Decisions

### Super Simple Approach

- No TypeScript (user preference)
- No complex state management (just useState)
- No backend yet (all mock data)
- No real auth (placeholder only)
- File URLs instead of uploads for MVP

### Component Design

- `ItemCard` is reusable with `isAdmin` prop
- All modals use fixed positioning with backdrop
- Forms use simple controlled inputs
- Filters use basic array filter methods

### Styling

- Tailwind utility classes only
- SFU red (#C8102E) as primary color
- Clean white cards on slate-100 background
- Responsive grid (1-3 columns based on screen)
- No flashy animations (user preference)
- Subtle hover effects only

### Data Flow

- Pages manage their own state
- Mock data imported from lib/mockData.js
- Items filtered client-side
- No persistence (refreshing resets data)

## Supabase Integration (COMPLETED)

✓ Supabase client configured in `/lib/supabase.js`
✓ Database tables created (items, reports)
✓ All pages fetch real data from Supabase
✓ CRUD operations working:

- Items: Create, Read, Update, Delete
- Reports: Create, Read
  ✓ RLS policies configured for public access
  ✓ Simple admin auth with localStorage

## Admin Authentication

Simple password-based auth (not production-ready):

- Password stored in .env.local
- Uses localStorage to track session
- Protected routes check `isAdmin()`
- Logout clears localStorage

For production, replace with:

- Supabase Auth
- Or proper JWT-based auth
- Or SSO integration

## Current Limitations

- Simple password auth (not production-ready)
- No file uploads (URL input only)
- No email notifications
- No AI image matching
- Hidden_notes visible in network requests (need server-side filtering for production)

## Next Steps

1. Add file upload to Supabase Storage
2. Implement proper authentication
3. Add email notifications
4. Server-side API routes for sensitive data
5. AI image matching with Gemini API
