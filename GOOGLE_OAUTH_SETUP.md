# Google OAuth Setup Guide

Follow these steps to set up Google OAuth for your Big Year app.

## Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account

## Step 2: Create or Select a Project

1. Click **"Select a project"** dropdown at the top
2. Click **"New Project"**
3. Enter project name: **"Big Year"** (or your preferred name)
4. Click **"Create"**
5. Wait for project creation (a few seconds)
6. Select your new project from the dropdown

## Step 3: Enable Google Calendar API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Calendar API"**
3. Click on **"Google Calendar API"**
4. Click the blue **"Enable"** button
5. Wait for it to enable (a few seconds)

## Step 4: Configure OAuth Consent Screen

**Important:** You must configure the consent screen before creating OAuth credentials.

1. Go to **"APIs & Services"** → **"OAuth consent screen"** (in the left sidebar)
2. Select **"External"** user type (unless you have Google Workspace)
3. Click **"Create"**

### Fill in App Information:

- **App name:** `Big Year` (or your preferred name)
- **User support email:** Your email address
- **App logo:** (Optional - can skip)
- **Application home page:** `http://localhost:3000`
- **Application privacy policy link:** `http://localhost:3000/privacy`
- **Application terms of service link:** `http://localhost:3000/terms`
- **Authorized domains:** Leave empty for now (or add `localhost` if you want)
- **Developer contact information:** Your email address

4. Click **"Save and Continue"**

### Add Scopes:

1. Click **"Add or Remove Scopes"**
2. In the filter/search box, search for and add these scopes one by one:
   - `openid` (should be pre-selected)
   - `email` (should be pre-selected)
   - `profile` (should be pre-selected)
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/calendar.events`
3. Click **"Update"**
4. Click **"Save and Continue"**

### Add Test Users (if app is in Testing mode):

1. Click **"Add Users"**
2. Add your Google account email address
3. Click **"Add"**
4. Click **"Save and Continue"**

### Review:

1. Review the summary
2. Click **"Back to Dashboard"**

## Step 5: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"** (in the left sidebar)
2. Click **"+ Create Credentials"** at the top
3. Select **"OAuth client ID"**

### Configure OAuth Client:

- **Application type:** Select **"Web application"**
- **Name:** `Big Year Calendar` (or your preferred name)

### Authorized redirect URIs:

Click **"+ Add URI"** and add:
```
http://localhost:3000/api/auth/callback/google
```

4. Click **"Create"**

### Copy Your Credentials:

A popup will appear with:
- **Your Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
- **Your Client Secret** (looks like: `GOCSPX-abcdefghijklmnopqrstuvwxyz`)

**Important:** Copy both of these immediately - you won't be able to see the secret again!

## Step 6: Publish Your App (REQUIRED!)

**This is critical!** Apps requesting sensitive scopes (like `calendar.events`) must be published.

1. Go back to **"APIs & Services"** → **"OAuth consent screen"**
2. Look at the **"Publishing status"** section at the top
3. If it says **"Testing"**, click **"Publish App"**
4. Click **"Confirm"** in the popup
5. Wait 5-10 minutes for changes to propagate

**Note:** Published apps are available to all Google users. Users may see an "unverified app" warning until you complete Google verification (optional, can take weeks).

## Step 7: Add Credentials to Your .env File

1. Open your `.env` file in the project root
2. Find these lines:
   ```
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
   ```
3. Replace with your actual values:
   ```
   GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
   ```
4. Save the file

## Step 8: Verify Setup

Run the check command:
```bash
npm run setup:check
```

You should now see:
```
✅ All required environment variables are set!
```

## Step 9: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:3000` in your browser

3. Click **"Sign in with Google"**

4. Complete the OAuth flow

5. You should be signed in and see your calendars!

## Troubleshooting

### "This application is blocked" Error

- **App is in Testing mode:** Make sure you published the app (Step 6)
- **User not in test users:** Add your email to test users or publish the app
- **Missing scopes:** Verify all scopes are added in OAuth consent screen

### "Invalid redirect URI" Error

- Verify redirect URI in Google Cloud Console matches exactly: `http://localhost:3000/api/auth/callback/google`
- Check `NEXTAUTH_URL` in `.env` matches `http://localhost:3000`
- Make sure there are no trailing slashes

### Can't See Client Secret

- If you didn't copy it, you'll need to create new credentials
- Go to Credentials → Click on your OAuth client → Delete it → Create a new one

## Production Setup

When deploying to production (e.g., Vercel):

1. Add production redirect URI in Google Cloud Console:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

2. Update `NEXTAUTH_URL` in your hosting platform's environment variables:
   ```
   NEXTAUTH_URL=https://yourdomain.com
   ```

3. Make sure your OAuth consent screen URLs point to production:
   - Application home page: `https://yourdomain.com`
   - Privacy Policy: `https://yourdomain.com/privacy`
   - Terms of Service: `https://yourdomain.com/terms`

## Quick Reference Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
- [Credentials](https://console.cloud.google.com/apis/credentials)
- [API Library](https://console.cloud.google.com/apis/library)
