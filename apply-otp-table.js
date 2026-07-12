const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyOTPTable() {
  const sql = fs.readFileSync('./supabase/otp-table.sql', 'utf8');

  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' }).single();
    if (error) {
      try {
        const { error: rawError } = await supabase.from('_exec').select().throwOnError();
      } catch (e) {
        // ignore
      }
    }
  }
}

applyOTPTable().catch(console.error);
