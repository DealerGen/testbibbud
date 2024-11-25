import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mafavoivvoclpeqeolyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZmF2b2l2dm9jbHBlcWVvbHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4MDIyMzksImV4cCI6MjA0NTM3ODIzOX0.HT6Oa-ruINUk6HiViMN1CQLy1ru6VNsdkENL1BDM664';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});