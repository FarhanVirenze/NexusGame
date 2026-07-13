-- Migration: Clean up Celestial → APIGames columns
-- Run this in Supabase SQL Editor

-- 1. game_items: drop old celestial_price if apigames_price already exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'game_items' AND column_name = 'celestial_price')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'game_items' AND column_name = 'apigames_price') THEN
    ALTER TABLE game_items DROP COLUMN celestial_price;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'game_items' AND column_name = 'celestial_price') THEN
    ALTER TABLE game_items RENAME COLUMN celestial_price TO apigames_price;
  ELSE
    ALTER TABLE game_items ADD COLUMN IF NOT EXISTS apigames_price DECIMAL(10,2);
  END IF;
END $$;

COMMENT ON COLUMN game_items.apigames_price IS 'Original cost from APIGames.id';

-- 2. transactions: drop old celestial_trx_id if apigames_trx_id already exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'celestial_trx_id')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'apigames_trx_id') THEN
    ALTER TABLE transactions DROP COLUMN celestial_trx_id;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'celestial_trx_id') THEN
    ALTER TABLE transactions RENAME COLUMN celestial_trx_id TO apigames_trx_id;
  ELSE
    ALTER TABLE transactions ADD COLUMN IF NOT EXISTS apigames_trx_id TEXT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_transactions_apigames_trx_id ON transactions(apigames_trx_id);
COMMENT ON COLUMN transactions.apigames_trx_id IS 'Transaction ID from APIGames.id API';

-- 3. Drop unused Celestial deposit columns
ALTER TABLE transactions DROP COLUMN IF EXISTS celestial_deposit_id;
ALTER TABLE transactions DROP COLUMN IF EXISTS celestial_deposit_status;
ALTER TABLE transactions DROP COLUMN IF EXISTS celestial_deposit_qr;
