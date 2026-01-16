#!/usr/bin/env node
/**
 * Update DATABASE_URL in .env file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(process.cwd(), '.env');

// Use process.cwd() for current working directory
const getCwd = () => process.cwd();

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  process.exit(1);
}

// Get connection string from command line argument
const connectionString = process.argv[2];

if (!connectionString) {
  console.error('❌ Please provide the connection string as an argument');
  console.log('\nUsage: node scripts/update-db-url.js "postgresql://..."');
  process.exit(1);
}

// Read .env file
let envContent = fs.readFileSync(envPath, 'utf8');

// Fix the connection string if it has issues
let fixedConnectionString = connectionString.trim();

// Check if there are two @ symbols (malformed)
const atCount = (fixedConnectionString.match(/@/g) || []).length;
if (atCount > 1) {
  console.warn('⚠️  Warning: Connection string appears to have multiple @ symbols');
  console.warn('   This might indicate a malformed password. Please verify.');
  console.warn('   Expected format: postgresql://user:password@host:port/database');
  console.log('');
}

// Update DATABASE_URL
const lines = envContent.split('\n');
let updated = false;

const updatedLines = lines.map(line => {
  if (line.startsWith('DATABASE_URL=')) {
    updated = true;
    return `DATABASE_URL=${fixedConnectionString}`;
  }
  return line;
});

if (!updated) {
  // Add DATABASE_URL if it doesn't exist
  updatedLines.push(`DATABASE_URL=${fixedConnectionString}`);
}

fs.writeFileSync(envPath, updatedLines.join('\n'));
console.log('✅ Updated DATABASE_URL in .env file');
console.log('');
console.log('Next steps:');
console.log('  1. Verify the connection string is correct');
console.log('  2. Run: npm run setup:check');
console.log('  3. Run: npx prisma db push');
