# Ping Daily Frontend Configuration

## Environment Variables

Create a `.env.local` file in the frontend root directory with:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For production, update the URL to your backend deployment:

```bash
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

## Development Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create `.env.local` with the environment variables above

3. Start the development server:
   ```bash
   pnpm dev
   ```

The frontend will run on http://localhost:3000

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **TanStack Query** - Powerful data fetching and caching
- **Zustand** - Lightweight state management
- **TypeScript** - Type safety throughout
- **Lucide React** - Beautiful icons

## Features

- ✅ **Modern Landing Page** - Beautiful hero section with feature showcase
- ✅ **Slack OAuth Integration** - Seamless authentication flow
- ✅ **Responsive Design** - Works perfectly on all devices
- ✅ **Dark Mode Support** - Built-in theme switching
- ✅ **Error Handling** - Global error handling with toast notifications
- ✅ **Loading States** - Smooth loading experiences
- ✅ **Type Safety** - Full TypeScript coverage
- 🚧 **Dashboard** - Coming next!
- 🚧 **Channel Management** - Create and configure channels
- 🚧 **History Views** - View past check-ins and analytics

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── dashboard/       # Dashboard pages (next step)
│   ├── auth/           # Auth callback handling (next step)
│   └── globals.css     # Global styles
├── components/
│   ├── ui/             # shadcn/ui components
│   └── dashboard/      # Dashboard components (next step)
├── hooks/
│   └── useAPI.ts       # React Query hooks
├── lib/
│   ├── api.ts          # API client
│   ├── react-query.tsx # Query configuration
│   ├── store.ts        # Zustand stores
│   └── utils.ts        # Utility functions
└── types/
    └── index.ts        # TypeScript types
```
