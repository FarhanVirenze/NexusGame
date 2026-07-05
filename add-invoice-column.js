// Add invoice_url column using Supabase SQL endpoint
async function addColumn() {
  const SUPABASE_URL = 'https://tlgvmiwdjjaeqpqmxgnd.supabase.co';
  const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ3ZtaXdkamphZXFwcW14Z25kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzE1MDkzNywiZXhwIjoyMDk4NzI2OTM3fQ.9z6PqYQfVREPMTNWsanMN5Qd9ig_gFluSXOkHJTUDNo';

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({})
  });

  // Try the pg_net/SQL approach via PostgREST
  // Actually, let's use the Supabase SQL API
  const sqlRes = await fetch(`${SUPABASE_URL}/sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    },
    body: JSON.stringify({
      query: 'ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS invoice_url TEXT;'
    })
  });

  console.log('SQL response status:', sqlRes.status);
  const text = await sqlRes.text();
  console.log('SQL response:', text);
}

addColumn();
