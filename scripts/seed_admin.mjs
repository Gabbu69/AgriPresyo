// Seed the admin user into Supabase Auth
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kgcesxbglicfvwwuscxy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jMY8AlPtDpnxyJBlNM3B-A_zyKDu51V';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seedAdmin() {
  console.log('Registering admin user in Supabase Auth...');
  const { data, error } = await supabase.auth.signUp({
    email: 'agripresyo@gmail.com',
    password: '12345678',
    options: {
      data: {
        name: 'Gab The Admin',
        role: 'admin',
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      console.log('Admin user already exists in Supabase Auth. Trying to log in...');
      const loginResult = await supabase.auth.signInWithPassword({
        email: 'agripresyo@gmail.com',
        password: '12345678',
      });
      if (loginResult.error) {
        console.error('Login failed:', loginResult.error.message);
      } else {
        console.log('Login successful! Admin user ID:', loginResult.data.user?.id);
      }
    } else {
      console.error('Registration failed:', error.message);
    }
    return;
  }

  console.log('Admin user created successfully!');
  console.log('User ID:', data.user?.id);
  console.log('Email:', data.user?.email);
  console.log('');
  console.log('NOTE: If email confirmation is enabled, check your inbox at agripresyo@gmail.com');
  console.log('and click the confirmation link, OR confirm manually in Supabase Dashboard.');
}

seedAdmin();
