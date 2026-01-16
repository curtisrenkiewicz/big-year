#!/usr/bin/env node
/**
 * Setup Supabase connection string with proper URL encoding
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const password = 'K9#mP2$vL8@nQ4&xR7!wT5%yU3*zA6';
const encodedPassword = encodeURIComponent(password);
const connectionString = `postgresql://postgres:${encodedPassword}@db.fwnbnwudglaprhxofkyt.supabase.co:5432/postgres`;

const envPath = path.join(process.cwd(), '.env');

// Use process.cwd() for current working directory
const getCwd = () => process.cwd();

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  process.exit(1);
}

// Read .env file
let envContent = fs.readFileSync(envPath, 'utf8');

// Update DATABASE_URL
const lines = envContent.split('\n');
let updated = false;

const updatedLines = lines.map(line => {
  if (line.startsWith('DATABASE_URL=')) {
    updated = true;
    return `DATABASE_URL=${connectionString}`;
  }
  return line;
});

if (!updated) {
  // Add DATABASE_URL if it doesn't exist
  updatedLines.push(`DATABASE_URL=${connectionString}`);
}

fs.writeFileSync(envPath, updatedLines.join('\n'));

console.log('✅ Updated DATABASE_URL in .env file');
console.log('');
console.log('Password encoded properly for URL');
console.log('Connection string format: postgresql://postgres:[ENCODED_PASSWORD]@host:port/database');
console.log('');
console.log('Next steps:');
console.log('  1. Run: npm run setup:check');
console.log('  2. Run: npx prisma db push');
