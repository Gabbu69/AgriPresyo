// Script to deploy schema to Supabase using the Management API
// Run: node scripts/deploy-schema.mjs

const SUPABASE_URL = 'https://kgcesxbglicfvwwuscxy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jMY8AlPtDpnxyJBlNM3B-A_zyKDu51V';

// We'll execute SQL statements one at a time via supabase.rpc or raw fetch
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Read the schema file
const schema = fs.readFileSync('./supabase_schema.sql', 'utf8');

// Split into individual statements
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Found ${statements.length} SQL statements to execute.`);

// Try executing via the Supabase REST SQL endpoint
async function executeSQL(sql) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    });
    
    if (!response.ok) {
      const text = await response.text();
      return { error: text };
    }
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

// The anon key can't run DDL. We need to use the Supabase Dashboard or service_role key.
// Let's check if we can at least verify the connection works.
async function main() {
  console.log('Testing connection to Supabase...');
  
  // Test basic connection
  const { data, error } = await supabase.from('profiles').select('count').limit(1);
  
  if (error) {
    if (error.message.includes('does not exist') || error.code === '42P01') {
      console.log('✓ Connected to Supabase successfully!');
      console.log('✗ Tables do not exist yet - schema needs to be deployed.');
      console.log('');
      console.log('The anon key cannot run DDL (CREATE TABLE) statements.');
      console.log('You need to run the schema via the Supabase SQL Editor:');
      console.log(`  https://supabase.com/dashboard/project/kgcesxbglicfvwwuscxy/sql/new`);
    } else {
      console.log('Connection error:', error.message);
    }
  } else {
    console.log('✓ Connected! Profiles table already exists.');
    console.log('Data:', data);
  }
}

main();
