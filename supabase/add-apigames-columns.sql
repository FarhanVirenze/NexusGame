-- Migration: Add APIGames columns + provider + cleanup Celestial
-- Run this in Supabase SQL Editor

-- 1. game_items: tambah kolom provider
ALTER TABLE game_items ADD COLUMN IF NOT EXISTS provider TEXT;
CREATE INDEX IF NOT EXISTS idx_game_items_provider ON game_items(provider);
COMMENT ON COLUMN game_items.provider IS 'Product provider: Smile One, Unipin ID, Gamepoint, etc.';

-- 2. game_items: bersihkan celestial_price → apigames_price
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

-- 3. transactions: bersihkan celestial_trx_id → apigames_trx_id
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

-- 4. Hapus kolom deposit Celestial yang ga kepake
ALTER TABLE transactions DROP COLUMN IF EXISTS celestial_deposit_id;
ALTER TABLE transactions DROP COLUMN IF EXISTS celestial_deposit_status;
ALTER TABLE transactions DROP COLUMN IF EXISTS celestial_deposit_qr;
