# Web (Next.js Frontend)

This is the Next.js frontend for Campus Companion.

## Setup

1. Install dependencies (from root):
   ```bash
   pnpm install
   ```

2. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001"
   ```

3. Start development server:
   ```bash
   pnpm dev
   ```

The app will run on http://localhost:3000

## Project Structure

```
src/
├── app/            # Next.js App Router pages
│   ├── page.tsx    # Landing page
│   ├── login/      # Login page
│   ├── signup/     # Signup page
│   ├── dashboard/  # User dashboard
│   ├── communities/ # Communities listing and detail
│   ├── events/     # Event detail pages
│   ├── buddy/      # Buddy system page
│   └── tips/       # Tips page
└── lib/
    └── api.ts      # API client functions
```

## Features

- Authentication (login/signup)
- Dashboard with quick links
- Community browsing and joining
- Event RSVPs
- Buddy matching status
- Tips browsing

## Styling

Uses Tailwind CSS for styling. Configuration is in `tailwind.config.ts`.

## API Client

The API client in `src/lib/api.ts` handles all backend communication using Axios. JWT tokens are stored in localStorage and automatically added to requests.

## Building

```bash
pnpm build
pnpm start
```

