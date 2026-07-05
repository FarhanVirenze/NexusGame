const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length > 0) env[key.trim()] = val.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const mockGames = [
  {
    title: 'Mobile Legends: Bang Bang',
    description: 'Diamonds & Twilight Passes',
    price: 15000,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz31MX0ycIMxoSyE_UdJyF70j1tuogdaQVP9lv5507OdmqSWfHDgkpLVaYgV1wbqAOeUpKbfMsmcn5Pk4A9FvfLqmpSSs_pFiF6PFLHLLHCnES7lCizd4NPv8cz7L2jkvfJB1m4kT4HyE6ZO-slkI3N2YLdzKsnHOxqHeii8XQWkArgUC3auNbFQnsUrHJtKebM6sDhVC04glPwSkEwRZRdOzPLSUoA4eGLJtBuzh-sGyK_OS7BJEK5epLPgWGXsrAHSGAmeZcm32m',
    category: 'MOBA',
  },
  {
    title: 'Valorant',
    description: 'Valorant Points (VP)',
    price: 50000,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG_XO6IpFp_EadDhd-DfEqX9RU9i3M1bLsKwVSRJ3GYqfaan5FrQC-oAqtrkeU2jW4gf8pFUBPrF63JMLWPG8QlAnozVdieBaSrdzMY1RjP-Z5IJm8ONct3lDpkc3TAhWD-S8FsNRm3wmohUEfl5oSjVOaY2bTozW6zExp7XapFmg6vZLBhhr5pPmgpUyoL8y6HLtXVItB65SUgWiRyfgoRYRcIFKi5lu3XxmSjbv4rUxcEEp8Ru7HOMQp9TUgKQhkkx9glU1v2F9O',
    category: 'FPS',
  },
  {
    title: 'Genshin Impact',
    description: 'Genesis Crystals & Welkin',
    price: 15000,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQNslIvdNVHxqzl42-APmStfu2f8ec-6JA5V0uImHe6JMF3iH_fWGTQKNe0TUBYtW9AK_wFuW1O_zmgXLpjuP7uzgZU_d5xM4lYQDa1IJEKiCXUHmaCbRijAhflKZ6Q8UpD-QzxJj1hjcJDLMLncik3NeQTSqY0c-rGYcodpceQsVkeDTwMxOTiBaJhyoBt8ZscCt7rMvhaJAHC0EeQx6DrV_v5mBzw8tZpTrVOsFXfRXhOZWaVmf0zzclEjXTa8ras_ESZDvheIQv',
    category: 'RPG',
  },
  {
    title: 'Free Fire',
    description: 'Diamonds Top-Up',
    price: 10000,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA6UNY5XMy_ktsO-yPTNmBLhoXLj-mVEREfKVTAAwBdWxXIm8FOBVV-UXA1sNeIL64mqA4YD4N2TYlCM7oGlkzynu2ug7JNr1vkUyWBJEKGlvTs0FjHD_TlNVuM7bdn7UY2vgRxIYkaZ1P6AQezuk5jCUNEaSumMj-cvjYeRsFKH-sjqbpQkmRy5FAYF7JoJl7dgvCcpCoGlnOV6cxdzU86Ge4jdrKPMOea-HK93i5TYb_OROEq3HzKBvKdKxnAy3I-Lu-6zoc1jb2',
    category: 'Battle Royale',
  }
];

async function seed() {
  console.log("Seeding data into Supabase...");
  
  // 1. Seed Games
  const { data: gamesData, error: gamesError } = await supabase.from('games').insert(mockGames).select();
  if (gamesError) {
    console.error("Error inserting games:", gamesError);
  } else {
    console.log("Successfully inserted games:", gamesData?.length);
  }

  // 2. Sync Auth Users to Public Users
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error("Error fetching auth users:", authError);
    return;
  }
  
  const authUsers = authData.users || [];
  let userIds = [];
  for (const au of authUsers) {
    const userToInsert = {
      id: au.id,
      email: au.email,
      role: 'admin',
      first_name: 'Admin',
      last_name: 'User'
    };
    // upsert user
    const { error: insErr } = await supabase.from('users').upsert(userToInsert);
    if (insErr) {
      console.log('Failed to upsert user', au.email, insErr);
    } else {
      console.log('Successfully upserted user:', au.email);
      userIds.push(au.id);
    }
  }

  // 3. Insert Dummy Transactions
  if (gamesData && gamesData.length > 0 && userIds.length > 0) {
    const mockTx = [
      {
        user_id: userIds[0],
        game_id: gamesData[0].id,
        amount: gamesData[0].price * 2,
        status: 'completed'
      },
      {
        user_id: userIds[0],
        game_id: gamesData[1].id,
        amount: gamesData[1].price,
        status: 'pending'
      }
    ];
    const { error: txErr } = await supabase.from('transactions').insert(mockTx);
    if (txErr) {
      console.log('Error inserting transactions', txErr);
    } else {
      console.log('Successfully inserted dummy transactions');
    }
  }

}

seed();
