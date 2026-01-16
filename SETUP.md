# Google Sign-In Setup Guide

This guide will walk you through setting up Google OAuth authentication for Big Year.

## Quick Start

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Generate NEXTAUTH_SECRET:**
   ```bash
   ./scripts/generate-secret.sh
   # Copy the output and add it to your .env file
   ```
   Or manually:
   ```bash
   openssl rand -base64 32
   ```

3. **Set up your database** (see Database Setup below)

4. **Create Google OAuth app** (see Google OAuth Setup below)

5. **Initialize database schema:**
   ```bash
   npx prisma db push
   ```

6. **Start the dev server:**
   ```bash
   npm run dev
   ```

## Step-by-Step Setup

### 1. Environment Variables

Edit `.env` file with your actual values:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for local)
- `NEXTAUTH_SECRET` - Random secret (generate with `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

### 2. Database Setup

**Option A: Free Hosted PostgreSQL (Recommended for quick start)**

1. Sign up for [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Create a new database
3. Copy the connection string to `DATABASE_URL` in `.env`
4. Run: `npx prisma db push`

**Option B: Local PostgreSQL**

1. Install PostgreSQL locally
2. Create a database: `createdb bigyear`
3. Update `DATABASE_URL` in `.env`
4. Run: `npx prisma db push`

**Option C: Vercel Postgres (for production)**

See [`VERCEL_SETUP.md`](VERCEL_SETUP.md) for detailed instructions.

### 3. Google OAuth Setup

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Big Year" (or your preferred name)
4. Click "Create"

#### Step 2: Enable Google Calendar API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google Calendar API"
3. Click on it and click **Enable**

#### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen first (see Step 4)
4. Application type: **Web application**
5. Name: "Big Year Calendar"
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for local)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Click **Create**
8. Copy the **Client ID** and **Client Secret** to your `.env` file

#### Step 4: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. User Type: **External** (unless you have Google Workspace)
3. Fill required fields:
   - **App name**: Big Year
   - **User support email**: Your email
   - **Developer contact information**: Your email
   - **Application home page**: `http://localhost:3000` (or your production URL)
   - **Privacy Policy link**: `http://localhost:3000/privacy` (or production URL)
   - **Terms of Service link**: `http://localhost:3000/terms` (or production URL)
4. Click **Save and Continue**
5. **Scopes** - Click **Add or Remove Scopes**:
   - `openid`
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/calendar.events`
6. Click **Update** → **Save and Continue**
7. **Test users** (if app is in Testing mode):
   - Add your Google account email
   - Click **Save and Continue**
8. Review and go back to dashboard

#### Step 5: Publish Your App (Required)

**Important:** Apps requesting sensitive scopes (like `calendar.events`) must be published.

1. In OAuth consent screen, check **Publishing status**
2. If it says "Testing", click **Publish App**
3. Confirm publishing
4. Wait 5-10 minutes for changes to propagate

**Note:** Published apps are available to all Google users. Users may see an "unverified app" warning until you complete Google verification (optional, can take weeks).

### 4. Initialize Database

After setting up your database and environment variables:

```bash
npx prisma db push
```

This creates all the necessary tables (User, Account, Session, etc.) in your database.

### 5. Test Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:3000`

3. Click "Sign in with Google"

4. Complete the OAuth flow

5. Verify you're signed in and calendars load

## Troubleshooting

### "This application is blocked" Error

- **App is in Testing mode**: Publish the app in OAuth consent screen
- **User not in test users**: Add your email to test users or publish the app
- **Missing scopes**: Verify all scopes are added in OAuth consent screen

### "Invalid redirect URI" Error

- Verify redirect URI in Google Cloud Console matches exactly: `http://localhost:3000/api/auth/callback/google`
- Check `NEXTAUTH_URL` in `.env` matches your actual URL
- Make sure there are no trailing slashes

### Database Connection Errors

- Verify `DATABASE_URL` is correct
- Check database is accessible from your network
- For hosted databases, ensure your IP is whitelisted (if required)
- Run `npx prisma db push` to create tables

### Token Refresh Errors

- Ensure `access_type: "offline"` is set (already configured in `lib/auth.ts`)
- Verify `prompt: "consent"` is set (already configured) to force refresh token issuance
- Check that refresh tokens are being saved in the database

## Production Deployment

For production (e.g., Vercel):

1. Set all environment variables in your hosting platform
2. Add production redirect URI to Google OAuth app: `https://yourdomain.com/api/auth/callback/google`
3. Update `NEXTAUTH_URL` to your production URL
4. Publish OAuth app in Google Cloud Console
5. Verify domain ownership if required (see [`README.md`](README.md))
6. Test sign-in flow in production

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Documentation](https://www.prisma.io/docs)
