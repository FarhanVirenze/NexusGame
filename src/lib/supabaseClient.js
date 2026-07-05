import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// Create a real client if the user provided real keys, otherwise this client won't connect.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Remove mock fallback as we are using the real Supabase database now
export async function fetchGames() {
  const { data, error } = await supabase.from('games').select('*');
  if (error) {
    console.error('Supabase fetch error:', error);
    return [];
  }
  return data;
}
