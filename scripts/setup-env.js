#!/usr/bin/env node
/**
 * Setup .env file with generated NEXTAUTH_SECRET
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

// Use process.cwd() for current working directory
const getCwd = () => process.cwd();

// Copy .env.example to .env if it doesn't exist
if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ Created .env from .env.example\n');
}

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.example not found!');
  process.exit(1);
}

// Read .env file
let envContent = fs.readFileSync(envPath, 'utf8');

// Generate NEXTAUTH_SECRET if it's still a placeholder
if (envContent.includes('replace-with-a-strong-random-string')) {
  console.log('🔐 Generating NEXTAUTH_SECRET...');
  const secret = execSync('openssl rand -base64 32', { encoding: 'utf8' }).trim();
  envContent = envContent.replace(
    'NEXTAUTH_SECRET=replace-with-a-strong-random-string',
    `NEXTAUTH_SECRET=${secret}`
  );
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Generated and set NEXTAUTH_SECRET\n');
} else {
  console.log('ℹ️  NEXTAUTH_SECRET already set\n');
}

console.log('📝 Next steps:');
console.log('   1. Set DATABASE_URL in .env (PostgreSQL connection string)');
console.log('   2. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
console.log('   3. Run: npm run setup:check (to verify all variables are set)');
console.log('   4. Run: npx prisma db push (to initialize database)\n');
