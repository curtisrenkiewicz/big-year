#!/usr/bin/env node
/**
 * Check if all required environment variables are set
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const requiredVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
];

const envPath = path.join(process.cwd(), '.env');
const envLocalPath = path.join(process.cwd(), '.env.local');

let envContent = '';

if (fs.existsSync(envLocalPath)) {
  envContent = fs.readFileSync(envLocalPath, 'utf8');
} else if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
} else {
  console.error('❌ No .env or .env.local file found!');
  console.log('\n📝 Create one by copying .env.example:');
  console.log('   cp .env.example .env\n');
  process.exit(1);
}

const envVars = {};
const placeholders = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    if (value) {
      if (value.includes('your-') || value.includes('replace-')) {
        placeholders[key] = value;
      } else {
        envVars[key] = value;
      }
    }
  }
});

let allSet = true;
const missing = [];
const placeholder = [];

requiredVars.forEach(varName => {
  if (placeholders[varName]) {
    allSet = false;
    placeholder.push(varName);
  } else if (!envVars[varName]) {
    allSet = false;
    missing.push(varName);
  }
});

console.log('\n🔍 Environment Variables Check\n');

if (allSet) {
  console.log('✅ All required environment variables are set!\n');
  process.exit(0);
} else {
  if (missing.length > 0) {
    console.log('❌ Missing environment variables:');
    missing.forEach(v => console.log(`   - ${v}`));
    console.log('');
  }
  if (placeholder.length > 0) {
    console.log('⚠️  Environment variables with placeholder values:');
    placeholder.forEach(v => console.log(`   - ${v}`));
    console.log('');
  }
  console.log('📝 Please update your .env file with actual values.\n');
  console.log('💡 Generate NEXTAUTH_SECRET with:');
  console.log('   npm run generate:secret\n');
  process.exit(1);
}
