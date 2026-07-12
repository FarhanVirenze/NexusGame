-- Migration: Add Celestial fulfillment columns to transactions table
-- Run this in Supabase SQL Editor

-- Add columns for Celestial fulfillment tracking
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS celestial_trx_id TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS fulfillment_status TEXT DEFAULT 'pending';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS delivery_sn TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_celestial_trx_id ON transactions(celestial_trx_id);
CREATE INDEX IF NOT EXISTS idx_transactions_fulfillment_status ON transactions(fulfillment_status);

-- Add check constraint for fulfillment_status
ALTER TABLE transactions ADD CONSTRAINT transactions_fulfillment_status_check
  CHECK (fulfillment_status IN ('pending', 'processing', 'completed', 'failed'));

-- Comment for clarity
COMMENT ON COLUMN transactions.celestial_trx_id IS 'Transaction ID from Celestial TopUp API';
COMMENT ON COLUMN transactions.fulfillment_status IS 'Game top-up fulfillment status: pending, processing, completed, failed';
COMMENT ON COLUMN transactions.delivery_sn IS 'Serial number / receipt from Celestial delivery';
COMMENT ON COLUMN transactions.delivered_at IS 'Timestamp when game top-up was delivered';
