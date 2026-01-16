# Next Steps - Google Sign-In Setup

## ✅ Completed Automatically

1. ✅ Created `.env` file from `.env.example`
2. ✅ Generated `NEXTAUTH_SECRET` and added to `.env`

## 🔧 Manual Steps Required

### Step 1: Set Up Database

You need a PostgreSQL database. Choose one option:

**Option A: Free Hosted Database (Recommended - Easiest)**

1. Sign up for a free account at one of these:
   - [Neon](https://neon.tech) - Free tier available
   - [Supabase](https://supabase.com) - Free tier available

2. Create a new database/project

3. Copy the connection string (it will look like: `postgresql://user:password@host:5432/dbname`)

4. Open your `.env` file and update:
   ```
   DATABASE_URL=your-actual-connection-string-here
   ```

**Option B: Local PostgreSQL**

1. Install PostgreSQL on your machine
2. Create a database:
   ```bash
   createdb bigyear
   ```
3. Update `.env`:
   ```
   DATABASE_URL=postgresql://your-username@localhost:5432/bigyear
   ```

### Step 2: Create Google OAuth Application

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select a Project:**
   - Click "Select a project" → "New Project"
   - Name it "Big Year" (or your preferred name)
   - Click "Create"

3. **Enable Google Calendar API:**
   - Go to **APIs & Services** → **Library**
   - Search for "Google Calendar API"
   - Click on it and click **Enable**

4. **Create OAuth 2.0 Credentials:**
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - If prompted, click "Configure consent screen" first (see Step 3 below)
   - Application type: **Web application**
   - Name: "Big Year Calendar"
   - **Authorized redirect URIs:**
     - Add: `http://localhost:3000/api/auth/callback/google`
   - Click **Create**
   - **Copy the Client ID and Client Secret** (you'll need these!)

5. **Update `.env` file:**
   ```
   GOOGLE_CLIENT_ID=your-client-id-here
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**

2. **User Type:** Select **External** (unless you have Google Workspace)

3. **App Information:**
   - **App name:** Big Year
   - **User support email:** Your email address
   - **Developer contact information:** Your email address
   - **Application home page:** `http://localhost:3000`
   - **Privacy Policy link:** `http://localhost:3000/privacy`
   - **Terms of Service link:** `http://localhost:3000/terms`
   - Click **Save and Continue**

4. **Scopes:**
   - Click **Add or Remove Scopes**
   - Add these scopes:
     - `openid`
     - `email`
     - `profile`
     - `https://www.googleapis.com/auth/calendar.readonly`
     - `https://www.googleapis.com/auth/calendar.events`
   - Click **Update** → **Save and Continue**

5. **Test Users** (if app is in Testing mode):
   - Add your Google account email address
   - Click **Save and Continue**

6. **Summary:** Review and go back to dashboard

### Step 4: Publish Your App (IMPORTANT!)

**This is required for the app to work!**

1. In the OAuth consent screen, check the **Publishing status** section
2. If it says "Testing", click **Publish App**
3. Confirm the publishing
4. Wait 5-10 minutes for changes to propagate

**Note:** Published apps are available to all Google users. Users may see an "unverified app" warning until you complete Google verification (optional, can take weeks).

### Step 5: Verify Setup

Run this command to check if all environment variables are set:

```bash
npm run setup:check
```

You should see: ✅ All required environment variables are set!

### Step 6: Initialize Database

Once your `DATABASE_URL` is set, run:

```bash
npx prisma db push
```

This creates all the necessary database tables.

### Step 7: Test Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:3000` in your browser

3. Click "Sign in with Google"

4. Complete the OAuth flow

5. You should be signed in and see your calendars!

## Troubleshooting

**"This application is blocked" error:**
- Make sure you published the app (Step 4)
- Add yourself as a test user if app is still in Testing mode

**"Invalid redirect URI" error:**
- Verify redirect URI in Google Cloud Console matches exactly: `http://localhost:3000/api/auth/callback/google`
- Check `NEXTAUTH_URL` in `.env` matches `http://localhost:3000`

**Database connection errors:**
- Verify `DATABASE_URL` is correct
- Make sure database is accessible
- For hosted databases, check if your IP needs to be whitelisted

## Need More Help?

- See [`SETUP.md`](SETUP.md) for detailed instructions
- See [`QUICKSTART.md`](QUICKSTART.md) for a quick reference
