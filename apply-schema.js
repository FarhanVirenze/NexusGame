const fs = require('fs');
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:Tempayan18@db.tlgvmiwdjjaeqpqmxgnd.supabase.co:5432/postgres';

async function applySchema() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to database");

    const sql = fs.readFileSync('supabase/schema.sql', 'utf8');
    
    console.log("Applying schema...");
    await client.query(sql);
    console.log("Schema applied successfully!");

  } catch (err) {
    console.error("Error applying schema:", err);
  } finally {
    await client.end();
  }
}

applySchema();
