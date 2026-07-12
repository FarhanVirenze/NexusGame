import { supabase } from '@/lib/supabaseClient';

// Helper to auto-attach auth header to admin API calls
export async function adminFetch(url, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = {
    ...options.headers,
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  // Don't override Content-Type for FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(url, { ...options, headers });
}
