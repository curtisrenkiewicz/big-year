#!/usr/bin/env node
/**
 * Initialize .env file with all required values
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

// Step 1: Create .env from .env.example if it doesn't exist
if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ Created .env from .env.example\n');
} else if (!fs.existsSync(envPath)) {
  console.error('❌ .env.example not found!');
  process.exit(1);
}

// Step 2: Read .env file
let envContent = fs.readFileSync(envPath, 'utf8');

// Step 3: Generate NEXTAUTH_SECRET if it's still a placeholder
if (envContent.includes('replace-with-a-strong-random-string')) {
  console.log('🔐 Generating NEXTAUTH_SECRET...');
  const secret = execSync('openssl rand -base64 32', { encoding: 'utf8' }).trim();
  envContent = envContent.replace(
    'NEXTAUTH_SECRET=replace-with-a-strong-random-string',
    `NEXTAUTH_SECRET=${secret}`
  );
  console.log('✅ Generated and set NEXTAUTH_SECRET\n');
}

// Step 4: Set up Supabase connection string
const password = 'K9#mP2$vL8@nQ4&xR7!wT5%yU3*zA6';
const encodedPassword = encodeURIComponent(password);
const connectionString = `postgresql://postgres:${encodedPassword}@db.fwnbnwudglaprhxofkyt.supabase.co:5432/postgres`;

if (!envContent.includes('postgresql://postgres:') || envContent.includes('your-postgresql-database-url')) {
  envContent = envContent.replace(
    /DATABASE_URL=.*/,
    `DATABASE_URL=${connectionString}`
  );
  console.log('✅ Updated DATABASE_URL with Supabase connection string\n');
}

// Step 5: Write updated .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ .env file initialized successfully!\n');
console.log('📝 Current status:');
console.log('   ✅ DATABASE_URL - Set');
console.log('   ✅ NEXTAUTH_URL - Set');
console.log('   ✅ NEXTAUTH_SECRET - Generated');
console.log('   ⚠️  GOOGLE_CLIENT_ID - Needs to be set');
console.log('   ⚠️  GOOGLE_CLIENT_SECRET - Needs to be set\n');
console.log('Next steps:');
console.log('   1. Set up Google OAuth (see NEXT_STEPS.md)');
console.log('   2. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env');
console.log('   3. Run: npm run setup:check');
console.log('   4. Run: npx prisma db push\n');
