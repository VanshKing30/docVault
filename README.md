# DocVault

DocVault is a secure family document management web application designed to make it easy to store, organize, and access important family documents from any device.

Instead of keeping documents scattered across phones, laptops, WhatsApp chats, or physical folders, DocVault organizes them by family member and keeps the actual files in private cloud storage.

## Features

### 🔐 Authentication

- Google OAuth authentication
- Secure session handling using Supabase Auth
- Protected dashboard routes
- Automatic redirection for unauthenticated users
- Logout functionality

### 👨‍👩‍👧‍👦 Family Members

- Add family members
- Organize documents by family member
- View each family member's dedicated document collection
- Each user's family members are isolated using database Row Level Security

### 📄 Document Management

- Upload documents for a specific family member
- Supported formats:
  - PDF
  - JPEG
  - PNG
- Maximum file size: 10 MB
- Document types:
  - Aadhaar Card
  - PAN Card
  - Passport
  - Driving Licence
  - Birth Certificate
  - Voter ID
  - Other
- Optional expiry date
- View documents
- Download documents
- Delete documents
- Delete confirmation dialog
- Upload/download/delete loading states

### 📱 Mobile Friendly

DocVault is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

The application also includes Progressive Web App (PWA) support so it can be added to a compatible device's home screen and launched in an app-like standalone experience.

### 🛡️ Security

Security is a core part of the architecture.

- Supabase Authentication
- PostgreSQL Row Level Security (RLS)
- Private Supabase Storage bucket
- Storage access controlled by authenticated user
- Short-lived signed URLs for document access
- No public document URLs
- No Supabase service-role key exposed to the browser
- User data isolated by `owner_id`

---

# Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

## Backend / Platform

- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- PostgreSQL Row Level Security

## Validation

- Zod

## Development

- Bun
- Maven-style? No — this project uses Bun as the JavaScript package/runtime tool.

## Deployment

- Vercel

---

# Architecture

```text
                    ┌──────────────────────┐
                    │      User Device     │
                    │ Mobile / Desktop     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Next.js        │
                    │   App Router + UI    │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
       ┌──────────────────┐       ┌──────────────────┐
       │  Supabase Auth   │       │ Supabase Database│
       │                  │       │   PostgreSQL     │
       │ Google OAuth     │       │                  │
       │ Sessions         │       │ RLS Policies     │
       └──────────────────┘       └────────┬─────────┘
                                           │
                                           ▼
                                ┌────────────────────┐
                                │  Supabase Storage   │
                                │                    │
                                │ Private Documents  │
                                └────────────────────┘

Project Structure : 

docvault/
│
├── public/
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
│
├── src/
│   │
│   ├── app/
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   │   └── route.ts
│   │   │   └── page.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── [memberId]/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── icon.svg
│   │   ├── apple-icon.png
│   │   ├── manifest.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── documents/
│   │   ├── family/
│   │   └── ui/
│   │
│   ├── hooks/
│   │   ├── useDocuments.ts
│   │   ├── useFamilyMembers.ts
│   │   └── ...
│   │
│   └── lib/
│       ├── supabase/
│       │   ├── client.ts
│       │   ├── server.ts
│       │   └── database.types.ts
│       │
│       └── validations/
│           └── document.ts
│
├── proxy.ts
├── components.json
├── package.json
├── tsconfig.json
├── next.config.ts
├── .env.local
└── README.md

V1 Scope

The current V1 focuses on the core problem: Store and access important family documents securely from one place.
Included in V1
Google authentication
Protected dashboard
Family member management
Document upload
Document categorization
Optional expiry date
Private document storage
Database RLS
Storage RLS
Signed document URLs
Document viewing
Document downloading
Document deletion
Delete confirmation
Loading/error feedback
Responsive UI
PWA foundation
Mobile-friendly experience


### One important cleanup

I deliberately **didn't claim features that aren't actually implemented yet**, such as PDF preview, expiry notifications, search, or family sharing. Those are listed under future improvements instead.

Also, there's one accidental line in the README above:

> `Maven-style? No — this project uses Bun...`

That's an internal joke from our build discussion and **should not be in the final README** 😄

Delete that line from the **Development** section, leaving:

```md
## Development

- Bun