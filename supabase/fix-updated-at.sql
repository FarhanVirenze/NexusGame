-- Fix: Add missing updated_at column to users table
-- Run this in Supabase SQL Editor if you see "record new has no field updated_at"

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE users ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name = 'games' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE games ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name = 'game_items' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE game_items ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE transactions ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name = 'content' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE content ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name = 'promotions' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE promotions ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Create trigger function if missing
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers if missing
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY['users', 'games', 'game_items', 'transactions', 'content', 'promotions']) LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = format('update_%s_updated_at', t)
    ) THEN
      EXECUTE format(
        'CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column()',
        t, t
      );
    END IF;
  END LOOP;
END $$;
