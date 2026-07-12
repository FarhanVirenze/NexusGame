-- NexusPay Database Improvements
-- Run this migration in Supabase SQL Editor

-- 1. Add updated_at column and trigger to all tables
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY['users', 'games', 'game_items', 'transactions', 'content', 'promotions']) LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns WHERE table_name = t AND column_name = 'updated_at'
    ) THEN
      EXECUTE format('ALTER TABLE %I ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW()', t);
    END IF;
  END LOOP;
END $$;

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for all tables
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

-- 2. Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_game_id ON transactions(game_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_items_game_id ON game_items(game_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. Add status constraint to transactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transactions_status_check'
  ) THEN
    ALTER TABLE transactions ADD CONSTRAINT transactions_status_check
    CHECK (status IN ('pending', 'completed', 'failed', 'expired'));
  END IF;
END $$;

-- 4. Add player_info and payment_method columns to transactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'player_info'
  ) THEN
    ALTER TABLE transactions ADD COLUMN player_info TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE transactions ADD COLUMN payment_method TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'item_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN item_id UUID REFERENCES game_items(id);
  END IF;
END $$;

-- 5. Enable Row-Level Security as defense-in-depth
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: allow service_role (used by server) to do everything
-- These policies are permissive by default, so the service_role key bypasses them.
-- For client-side access, we rely on the anon key + auth.uid()

-- Users: can read own profile, admins can read all
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Games: publicly readable
CREATE POLICY "Games are publicly readable" ON games FOR SELECT USING (true);

-- Game items: publicly readable
CREATE POLICY "Game items are publicly readable" ON game_items FOR SELECT USING (true);

-- Transactions: users can read own, admins can read all
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions" ON transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Content: publicly readable
CREATE POLICY "Content is publicly readable" ON content FOR SELECT USING (true);

-- Promotions: publicly readable
CREATE POLICY "Promotions are publicly readable" ON promotions FOR SELECT USING (true);
