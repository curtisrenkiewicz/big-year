# Vercel Postgres Setup Guide

## Step 1: Create Vercel Postgres Database

1. Go to your Vercel project dashboard
2. Click on the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose the **Hobby** (free) plan
6. Click **Create**

## Step 2: Set Environment Variables

After creating the database, Vercel automatically adds `POSTGRES_URL` to your project. However, Prisma expects `DATABASE_URL`. You have two options:

### Option A: Add DATABASE_URL (Recommended)

1. Go to **Settings** → **Environment Variables** in your Vercel project
2. You should see `POSTGRES_URL` already there (added automatically)
3. Add a new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Copy the exact value from `POSTGRES_URL`
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**

### Option B: Use POSTGRES_URL directly (Alternative)

If you prefer, you can update `prisma/schema.prisma` to use `POSTGRES_URL` instead:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
}
```

**Option A is recommended** since it's the Prisma standard.

## Step 3: Set Up Database Schema

**Important**: Your existing migrations were created for SQLite and won't work with PostgreSQL. You have two options:

### Option A: Use `prisma db push` (Simplest for initial setup)

1. Install Vercel CLI if you haven't:
   ```bash
   npm install -g vercel@latest
   ```

2. Pull environment variables to your local `.env.local`:
   ```bash
   vercel env pull .env.local
   ```

3. Push the schema to your database (this will create all tables):
   ```bash
   npx prisma db push
   ```

This will sync your Prisma schema directly to the database without migrations. Perfect for getting started!

### Option B: Create a New PostgreSQL Migration (Better for production)

1. Install Vercel CLI if you haven't:
   ```bash
   npm install -g vercel@latest
   ```

2. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

3. Create a new migration for PostgreSQL:
   ```bash
   npx prisma migrate dev --name init_postgres
   ```

4. For production deployments, you can add this to your build script in `package.json`:
   ```json
   "scripts": {
     "vercel-build": "prisma migrate deploy && next build"
   }
   ```

**Note**: You may want to rename or archive your old SQLite migrations folder since they won't be used anymore.

## Step 4: Deploy

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Switch to PostgreSQL for Vercel deployment"
   git push
   ```

2. Vercel will automatically redeploy with the new database configuration

## Local Development

For local development, you have a few options:

1. **Use the same Vercel Postgres database** (simplest):
   - Run `vercel env pull .env.local` to get the connection string
   - This uses your production database locally (be careful with this)

2. **Use a free local PostgreSQL database**:
   - Install PostgreSQL locally, or
   - Use a free service like [Neon](https://neon.tech) or [Supabase](https://supabase.com) for a separate dev database
   - Add the connection string to your local `.env.local` as `DATABASE_URL`

## Important Notes

- The SQLite database file (`prisma/dev.db`) is no longer used - you can delete it if you want
- All existing migrations need to be run against the new PostgreSQL database
- If you have existing data in SQLite, you'll need to migrate it separately (not covered in this guide)

