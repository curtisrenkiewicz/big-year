# Quick Start Guide

Get Google sign-in working in 5 steps:

## 1. Copy Environment Template

```bash
cp .env.example .env
```

## 2. Generate NEXTAUTH_SECRET

```bash
npm run generate:secret
```

Copy the output and add it to your `.env` file as `NEXTAUTH_SECRET=...`

## 3. Set Up Database

**Option A: Free Hosted (Easiest)**
- Sign up at [Neon](https://neon.tech) or [Supabase](https://supabase.com)
- Create database → Copy connection string
- Add to `.env` as `DATABASE_URL=...`

**Option B: Local PostgreSQL**
- Install PostgreSQL
- Create database: `createdb bigyear`
- Update `DATABASE_URL` in `.env`

## 4. Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable "Google Calendar API"
3. **Credentials** → Create OAuth 2.0 Client ID
   - Type: Web application
   - Redirect URI: `http://localhost:3000/api/auth/callback/google`
4. **OAuth consent screen** → Configure:
   - App name, email, privacy/terms URLs
   - Add scopes: `openid`, `email`, `profile`, `calendar.readonly`, `calendar.events`
   - **Publish app** (required!)
5. Copy Client ID and Secret to `.env`

## 5. Initialize & Run

```bash
# Create database tables
npx prisma db push

# Start dev server
npm run dev
```

Visit `http://localhost:3000` and sign in!

## Verify Setup

Check if all environment variables are set:
```bash
npm run setup:check
```

## Need Help?

See [`SETUP.md`](SETUP.md) for detailed instructions.
