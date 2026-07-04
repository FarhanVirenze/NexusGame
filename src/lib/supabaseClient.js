import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// Create a real client if the user provided real keys, otherwise this client won't connect.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock Data for fallback
export const mockGames = [
  {
    id: '1',
    title: 'Mobile Legends',
    description: 'Diamonds & Twilight Passes',
    price: 0.99,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz31MX0ycIMxoSyE_UdJyF70j1tuogdaQVP9lv5507OdmqSWfHDgkpLVaYgV1wbqAOeUpKbfMsmcn5Pk4A9FvfLqmpSSs_pFiF6PFLHLLHCnES7lCizd4NPv8cz7L2jkvfJB1m4kT4HyE6ZO-slkI3N2YLdzKsnHOxqHeii8XQWkArgUC3auNbFQnsUrHJtKebM6sDhVC04glPwSkEwRZRdOzPLSUoA4eGLJtBuzh-sGyK_OS7BJEK5epLPgWGXsrAHSGAmeZcm32m',
    category: 'Hot',
  },
  {
    id: '2',
    title: 'Valorant',
    description: 'Valorant Points (VP)',
    price: 4.99,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG_XO6IpFp_EadDhd-DfEqX9RU9i3M1bLsKwVSRJ3GYqfaan5FrQC-oAqtrkeU2jW4gf8pFUBPrF63JMLWPG8QlAnozVdieBaSrdzMY1RjP-Z5IJm8ONct3lDpkc3TAhWD-S8FsNRm3wmohUEfl5oSjVOaY2bTozW6zExp7XapFmg6vZLBhhr5pPmgpUyoL8y6HLtXVItB65SUgWiRyfgoRYRcIFKi5lu3XxmSjbv4rUxcEEp8Ru7HOMQp9TUgKQhkkx9glU1v2F9O',
    category: 'Trending',
  },
  {
    id: '3',
    title: 'Genshin Impact',
    description: 'Genesis Crystals & Welkin',
    price: 0.99,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQNslIvdNVHxqzl42-APmStfu2f8ec-6JA5V0uImHe6JMF3iH_fWGTQKNe0TUBYtW9AK_wFuW1O_zmgXLpjuP7uzgZU_d5xM4lYQDa1IJEKiCXUHmaCbRijAhflKZ6Q8UpD-QzxJj1hjcJDLMLncik3NeQTSqY0c-rGYcodpceQsVkeDTwMxOTiBaJhyoBt8ZscCt7rMvhaJAHC0EeQx6DrV_v5mBzw8tZpTrVOsFXfRXhOZWaVmf0zzclEjXTa8ras_ESZDvheIQv',
    category: 'RPG',
  },
  {
    id: '4',
    title: 'Free Fire',
    description: 'Diamonds Top-Up',
    price: 0.99,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA6UNY5XMy_ktsO-yPTNmBLhoXLj-mVEREfKVTAAwBdWxXIm8FOBVV-UXA1sNeIL64mqA4YD4N2TYlCM7oGlkzynu2ug7JNr1vkUyWBJEKGlvTs0FjHD_TlNVuM7bdn7UY2vgRxIYkaZ1P6AQezuk5jCUNEaSumMj-cvjYeRsFKH-sjqbpQkmRy5FAYF7JoJl7dgvCcpCoGlnOV6cxdzU86Ge4jdrKPMOea-HK93i5TYb_OROEq3HzKBvKdKxnAy3I-Lu-6zoc1jb2',
    category: 'Sale',
  }
];

export async function fetchGames() {
  if (supabaseUrl === 'https://placeholder.supabase.co') {
    return mockGames;
  }
  const { data, error } = await supabase.from('games').select('*');
  if (error) {
    console.error('Supabase fetch error:', error);
    return mockGames;
  }
  return data;
}
