const { createClient } = require('@supabase/supabase-js');

// Usage: node create-admin.js <email> <password> <first_name> <last_name>
// Example: node create-admin.js admin@example.com mypassword John Doe

const args = process.argv.slice(2);
const email = args[0] || process.env.ADMIN_EMAIL;
const password = args[1] || process.env.ADMIN_PASSWORD;
const firstName = args[2] || 'Admin';
const lastName = args[3] || 'User';

if (!email || !password) {
  console.error('Usage: node create-admin.js <email> <password> [first_name] [last_name]');
  console.error('Or set ADMIN_EMAIL and ADMIN_PASSWORD environment variables');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createAdmin() {
  console.log(`Creating admin user: ${email}`);

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName }
  });

  if (authError) {
    console.error('Error creating auth user:', authError.message);
    return;
  }

  console.log('Auth user created! ID:', authData.user.id);

  await new Promise(r => setTimeout(r, 1000));

  const { error: updateError } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('id', authData.user.id);

  if (updateError) {
    console.log('Trying manual insert...');
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        email,
        role: 'admin',
      });
    if (insertError) {
      console.error('Manual insert also failed:', insertError.message);
    } else {
      console.log('Admin user manually inserted!');
    }
  } else {
    console.log('User role updated to admin!');
  }

  console.log('\n✅ Admin account created successfully!');
  console.log(`   Email: ${email}`);
  console.log('   Role: admin');
}

createAdmin();
