// Test login for the admin user
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kgcesxbglicfvwwuscxy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jMY8AlPtDpnxyJBlNM3B-A_zyKDu51V';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testLogin() {
  console.log('Testing admin login...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'gabtheadmin@yahoo.com',
    password: '12345678',
  });

  if (error) {
    console.error('Login FAILED:', error.message);
    if (error.message.includes('Email not confirmed')) {
      console.log('');
      console.log('>>> Email confirmation is required!');
      console.log('>>> Go to Supabase Dashboard → Authentication → Users');
      console.log('>>> Find gabtheadmin@yahoo.com and confirm the email manually.');
    }
  } else {
    console.log('Login SUCCESS!');
    console.log('User ID:', data.user?.id);
    console.log('Role:', data.user?.user_metadata?.role);
  }
}

testLogin();
