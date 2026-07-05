 const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createAdmin() {
  console.log('Creating admin user in Supabase Auth...');

  // Step 1: Create the user in auth.users via Admin API
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'farhanadmin18@gmail.com',
    password: 'tempayan18!',
    email_confirm: true, // auto-confirm email so they can login immediately
    user_metadata: {
      first_name: 'Farhan',
      last_name: 'Admin',
    }
  });

  if (authError) {
    console.error('Error creating auth user:', authError.message);
    return;
  }

  console.log('Auth user created! ID:', authData.user.id);

  // Step 2: Update the role in public.users table to 'admin'
  // The trigger should have already inserted a row, so we just update the role
  // Wait a moment for the trigger to fire
  await new Promise(r => setTimeout(r, 1000));

  const { data: updateData, error: updateError } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('id', authData.user.id)
    .select();

  if (updateError) {
    console.error('Error updating role:', updateError.message);
    // Try inserting manually if trigger didn't fire
    console.log('Trying manual insert...');
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        first_name: 'Farhan',
        last_name: 'Admin',
        email: 'farhanadmin18@gmail.com',
        role: 'admin',
      });
    if (insertError) {
      console.error('Manual insert also failed:', insertError.message);
    } else {
      console.log('Admin user manually inserted into users table!');
    }
  } else {
    console.log('User role updated to admin!', updateData);
  }

  console.log('\n✅ Admin account created successfully!');
  console.log('   Email: farhanadmin18@gmail.com');
  console.log('   Password: tempayan18!');
  console.log('   Role: admin');
}

createAdmin();
