Absolutely ✅ — here’s your **final, complete, Cursor-ready PRD** for **FoundIt**, rewritten from scratch to reflect your newest rule:
👉 _no item status — if it’s given away, it’s deleted._
Everything else is organized, production-grade, and designed for **Next.js + Tailwind + Supabase**, with “AI image checker” and “email notifications” marked _Not Implemented Yet_.

---

# 🧭 FoundIt — Campus Lost & Found SaaS

**Version:** v1.0 (Hackathon / SFU Pilot)
**Stack:** Next.js 14 (App Router) · TailwindCSS · Supabase (Postgres + Storage)
**Deployment:** Vercel + Supabase Cloud
**Goal:** Replace messy paper or inbox lost-and-found systems with one fast, visual web app that feels like **Facebook Marketplace**.

---

## 1️⃣ Purpose

Enable campus staff to upload photos of found items and allow students to browse or report lost items online — no login friction, no complicated states.

---

## 2️⃣ Users

| Role                 | Purpose                                                         |
| -------------------- | --------------------------------------------------------------- |
| **Admin (staff)**    | Upload, edit, or delete found items; view student lost reports. |
| **Student / Public** | Browse found items, report a lost item with email contact.      |

---

## 3️⃣ Core Principles

- **Visual first:** Marketplace-style card grid.
- **Simple logic:** If it’s still listed, it’s still at the desk. If given → delete.
- **No login for students:** Email-only reports.
- **Offline verification:** Real-world pickup handled by staff.

---

## 4️⃣ System Overview

| Portal             | Description                                               |
| ------------------ | --------------------------------------------------------- |
| **Admin Portal**   | Private dashboard for uploading and managing found items. |
| **Student Portal** | Public site for browsing and reporting lost items.        |

---

## 5️⃣ Admin Portal

### 🧱 Pages

| Route              | Purpose                                  |
| ------------------ | ---------------------------------------- |
| `/admin/login`     | Simple login placeholder (no real auth). |
| `/admin/dashboard` | Visual grid of all found items.          |
| `/admin/upload`    | Form to add new found items.             |
| `/admin/reports`   | Grid of student lost reports.            |
| `/admin/help`      | Verification guide modal / PDF.          |

---

### 🖥 Dashboard Layout (`/admin/dashboard`)

- **Top bar:** `FoundIt Admin | Dashboard | Upload | Reports | Help`
- **Filters:** Search ▢ | Category ▼ | Campus ▼
- **Grid cards (3–4 per row):**

  ```
  +---------------------------------------------+
  | 📸 [Photo]                                  |
  | "Black hoodie with white strings"           |
  | 🏷 Clothing | 📍 Burnaby | 🗓 Oct 3 2025     |
  | ⋮  Edit | Delete                            |
  +---------------------------------------------+
  ```

- **Actions**

  - **Edit** → side drawer with form (photo / category / campus / date / description / hidden notes).
  - **Delete** → confirm modal “Item given away or donated?” → remove permanently.

> ⚙️ Advanced View toggle (optional): inline edit + bulk delete.

---

### 📤 Upload Page (`/admin/upload`)

Form fields:

- Photo 📸 (required)
- Category 🏷
- Campus 📍
- Date Found 🗓 (default today)
- Description ✏️
- Hidden Notes 🔒 (optional)

Buttons:
`[Save Item]` (red) `[Cancel]` (gray)
→ On save → toast “✅ Item added” → returns to Dashboard.

---

### 📩 Reports Page (`/admin/reports`)

Marketplace-style grid of student reports:

```
+---------------------------------------------+
| 📸 [Student photo or icon]                  |
| "Lost: Brown Wallet near Library"          |
| 🏷 Wallet | 📍 Burnaby | 🗓 Reported Oct 4 |
| 👤 jane@sfu.ca                              |
| 🔍 See Possible Matches                     |
+---------------------------------------------+
```

Click **See Possible Matches** → side drawer lists found items with same category + campus.

---

### 🆘 Help Modal

Popup checklist (no PDF yet):

1. Ask for ID or proof of ownership.
2. Ask about non-visible details.
3. Compare with hidden notes.
4. Record pickup date manually.
   [Download PDF (coming soon)]

---

## 6️⃣ Student Portal

### 🏠 Browse / Home (`/`)

- Top nav: `FoundIt | Browse | Report Lost | About`
- Search bar + filters (Category ▼ Campus ▼ Sort: Most Recent)
- Marketplace grid of found items:

  ```
  📸 Photo
  "Black hoodie with white strings"
  🏷 Clothing | 📍 Burnaby
  🗓 Found Oct 3 2025
  [View Details]
  ```

- **View Details** → modal/page with full photo, description, pickup location, “Bring ID to desk.”

---

### 🧾 Report Lost Item (`/report`)

Form card:

| Field      | Type            | Req |
| ---------- | --------------- | --- |
| Category   | Dropdown        | ✅  |
| Campus     | Dropdown        | ✅  |
| Where Lost | Textarea        | ✅  |
| When Lost  | Date Picker     | ✅  |
| Details    | Textarea        | ✅  |
| Photo      | File (optional) | ❌  |
| Email      | Input           | ✅  |

Submit →

1. Shows “Possible Matches” grid (filtered by campus + category).
2. Message: “✅ Report saved! We’ll email you if something similar is found.”
3. Email notifications = **Not Implemented Yet**.

---

### 🪪 Item Detail (`/item/[id]`)

- Large photo + description.
- Category / Campus / Date Found.
- “Visit the [location] desk with ID to claim.”

---

## 7️⃣ Database Schema (Supabase)

### `items`

| Column       | Type                      | Notes       |
| ------------ | ------------------------- | ----------- |
| id           | uuid PK                   | —           |
| photo_url    | text                      | Storage URL |
| category     | text                      | —           |
| campus       | text                      | —           |
| date_found   | date                      | —           |
| description  | text                      | public      |
| hidden_notes | text                      | private     |
| created_at   | timestamptz default now() | —           |
| updated_at   | timestamptz               | —           |

### `reports`

| Column               | Type                      | Notes                        |
| -------------------- | ------------------------- | ---------------------------- |
| id                   | uuid PK                   | —                            |
| email                | text                      | reporter contact             |
| category             | text                      | —                            |
| campus               | text                      | —                            |
| location_description | text                      | where lost                   |
| details              | text                      | color / brand / unique marks |
| photo_url            | text                      | optional                     |
| created_at           | timestamptz default now() | —                            |

---

## 8️⃣ UI / Design System

| Element           | Spec                                                  |
| ----------------- | ----------------------------------------------------- |
| **Color palette** | SFU red #C8102E (primary), white, slate gray (bg)     |
| **Font**          | Inter / system sans                                   |
| **Buttons**       | Rounded, red fill for primary, gray outline secondary |
| **Cards**         | `rounded-xl shadow-sm bg-white p-4`                   |
| **Layout**        | Grid (3–4 columns desktop, 1–2 mobile)                |
| **Hover effects** | Subtle scale + shadow lift                            |
| **Accessibility** | Keyboard nav + aria labels for icons                  |

---

## 9️⃣ APIs (Placeholder, no backend yet)

| Endpoint       | Method                      | Notes                                           |
| -------------- | --------------------------- | ----------------------------------------------- |
| `/api/items`   | GET / POST / PATCH / DELETE | **Not implemented** – stubbed with local state. |
| `/api/reports` | GET / POST                  | **Not implemented** – stubbed with local state. |

---

## 🔟 Non-Goals for MVP

- AI photo classifier (_Not Implemented Yet_)
- Email or SMS notifications (_Not Implemented Yet_)
- Multi-organization tenancy
- Payment / donation tracking
- Mobile app (native)

---

## 11️⃣ Future Enhancements

1. AI image matching (Gemini API).
2. Automated email match alerts.
3. Admin analytics dashboard.
4. Multi-campus deployments.
5. Retention rules (auto-delete after 30 days).

---

## 12️⃣ Success Criteria

- Upload → Item appears instantly in grid.
- Edit and Delete work without refresh.
- Responsive UI (Lighthouse > 90 mobile).
- All data local (mocked) until Supabase integration.

---

## 13️⃣ Timeline

| Phase              | Deliverable         | Time    |
| ------------------ | ------------------- | ------- |
| **M1**             | Admin Dashboard UI  | 1 day   |
| **M2**             | Upload Form         | 0.5 day |
| **M3**             | Reports View        | 0.5 day |
| **M4**             | Student Browse Grid | 1 day   |
| **M5**             | Report Lost Flow    | 1 day   |
| **M6**             | Polish + Deploy     | 0.5 day |
| **≈ 4 days total** |                     |         |

---

## 14️⃣ Pitch Summary

> **FoundIt** digitizes campus lost & found.
> Staff upload found items in seconds; students browse or report theirs just like Facebook Marketplace.
> No logins, no clutter — if it’s still listed, it’s still at the desk.
> Simple. Visual. Instant.

---

✅ **End of PRD** — ready for Cursor AI to generate front-end code with mock data and real layout.
