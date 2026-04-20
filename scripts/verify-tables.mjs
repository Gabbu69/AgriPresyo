// Verify all tables exist in Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kgcesxbglicfvwwuscxy.supabase.co',
  'sb_publishable_jMY8AlPtDpnxyJBlNM3B-A_zyKDu51V'
);

const tables = [
  'profiles',
  'audit_logs', 
  'announcements',
  'complaints',
  'favorites',
  'vendor_ratings',
  'dismissed_announcements',
  'seen_announcements',
  'user_settings'
];

async function main() {
  console.log('Checking tables in Supabase...\n');
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(0);
    if (error) {
      console.log(`✗ ${table} - ${error.message}`);
    } else {
      console.log(`✓ ${table} - exists`);
    }
  }
  
  console.log('\nDone!');
}

main();
