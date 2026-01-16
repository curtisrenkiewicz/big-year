# Getting Your Supabase Connection String

## Step 1: Find Your Connection String

1. In your Supabase project dashboard, go to **Settings** (gear icon in the left sidebar)
2. Click on **Database** in the settings menu
3. Scroll down to find the **Connection string** section
4. You'll see different connection string formats - use the **URI** format (or the one that starts with `postgresql://`)

## Step 2: Copy the Connection String

The connection string will look something like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**Important:** Replace `[YOUR-PASSWORD]` with your actual database password (the one you set when creating the project, or you can reset it in the same settings page).

## Step 3: Add to .env File

Open your `.env` file and update the `DATABASE_URL` line:

```
DATABASE_URL=postgresql://postgres:your-actual-password@db.xxxxx.supabase.co:5432/postgres
```

## Step 4: Test the Connection

After updating `.env`, run:

```bash
npm run setup:check
```

This will verify your environment variables are set correctly.

## Step 5: Initialize Database

Once `DATABASE_URL` is set, initialize your database tables:

```bash
npx prisma db push
```

This creates all the necessary tables (User, Account, Session, etc.) in your Supabase database.

## Alternative: Using Connection Pooling (Optional)

Supabase also provides a connection pooling URL (port 6543) which is better for serverless environments. However, for local development, the regular connection string (port 5432) works fine.

For production/Vercel, you might want to use the pooled connection string instead.
