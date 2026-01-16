#!/usr/bin/env node
/**
 * Create .env file with all required values
 */

import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(process.cwd(), '.env');

console.log('🔧 Creating .env file...\n');

// Generate NEXTAUTH_SECRET
const secret = execSync('openssl rand -base64 32', { encoding: 'utf8' }).trim();

// Encode Supabase password
const password = 'K9#mP2$vL8@nQ4&xR7!wT5%yU3*zA6';
const encodedPassword = encodeURIComponent(password);
const connectionString = `postgresql://postgres:${encodedPassword}@db.fwnbnwudglaprhxofkyt.supabase.co:5432/postgres`;

// Create .env content
const envContent = `# Database
DATABASE_URL=${connectionString}

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${secret}

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
`;

// Write .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ Created .env file');
console.log(`   Location: ${envPath}`);
console.log(`   Size: ${envContent.length} bytes\n`);

// Verify it was created
if (fs.existsSync(envPath)) {
  console.log('✅ Verification: .env file exists');
  const readBack = fs.readFileSync(envPath, 'utf8');
  console.log(`✅ Verification: File readable (${readBack.length} bytes)\n`);
  
  // Check if DATABASE_URL is set
  if (readBack.includes('DATABASE_URL=postgresql://')) {
    console.log('✅ DATABASE_URL is set');
  }
  if (readBack.includes('NEXTAUTH_SECRET=') && !readBack.includes('replace-with')) {
    console.log('✅ NEXTAUTH_SECRET is set');
  }
  if (readBack.includes('NEXTAUTH_URL=')) {
    console.log('✅ NEXTAUTH_URL is set');
  }
  
  console.log('\n📝 Next: Run "npm run setup:check" to verify all variables\n');
} else {
  console.error('❌ ERROR: .env file was not created!');
  process.exit(1);
}
