-- Migration: Add SKU column to game_items for Celestial integration
-- Run this in Supabase SQL Editor

-- Add SKU column if not exists
ALTER TABLE game_items ADD COLUMN IF NOT EXISTS sku TEXT;

-- Add index for SKU lookups
CREATE INDEX IF NOT EXISTS idx_game_items_sku ON game_items(sku);

-- Add celestial_price column to track original Celestial cost
ALTER TABLE game_items ADD COLUMN IF NOT EXISTS celestial_price DECIMAL(10,2);

COMMENT ON COLUMN game_items.sku IS 'Celestial TopUp SKU code for auto-fulfillment';
COMMENT ON COLUMN game_items.celestial_price IS 'Original cost from Celestial TopUp';
