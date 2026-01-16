# Fixing Your Supabase Connection String

## Issue

Your connection string appears to have two `@` symbols, which suggests it might be malformed. A proper PostgreSQL connection string should have this format:

```
postgresql://user:password@host:port/database
```

## How to Get the Correct Connection String

1. Go to your Supabase project dashboard
2. Click **Settings** (gear icon) → **Database**
3. Scroll to **Connection string** section
4. Look for the **URI** format
5. Copy it - it should look like:

```
postgresql://postgres:[YOUR-PASSWORD]@db.fwnbnwudglaprhxofkyt.supabase.co:5432/postgres
```

**Important:** Replace `[YOUR-PASSWORD]` with your actual database password.

## If Your Password Has Special Characters

If your password contains special characters like `@`, `#`, `$`, `%`, etc., they need to be URL-encoded in the connection string:

- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`
- `&` becomes `%26`
- `!` becomes `%21`

## Example

If your password is `K9#mP2$vL8@nQ4`, the URL-encoded version would be:
`K9%23mP2%24vL8%40nQ4`

So the connection string would be:
```
postgresql://postgres:K9%23mP2%24vL8%40nQ4@db.fwnbnwudglaprhxofkyt.supabase.co:5432/postgres
```

## Quick Fix

1. Get your database password from Supabase (Settings → Database → Database password)
2. If you don't remember it, you can reset it in the same place
3. Use this format in your `.env` file:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.fwnbnwudglaprhxofkyt.supabase.co:5432/postgres
```

Replace `YOUR_PASSWORD` with your actual password (URL-encode special characters if needed).

## Test the Connection

After updating, test it:

```bash
npm run setup:check
npx prisma db push
```

If `prisma db push` succeeds, your connection string is correct!
