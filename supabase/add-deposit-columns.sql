-- Migration: Add Celestial deposit tracking columns to transactions
-- Run this in Supabase SQL Editor

-- Deposit tracking columns
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS celestial_deposit_id TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS celestial_deposit_status TEXT DEFAULT NULL;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS celestial_deposit_qr TEXT DEFAULT NULL;

COMMENT ON COLUMN transactions.celestial_deposit_id IS 'Celestial deposit ID for auto-deposit flow';
COMMENT ON COLUMN transactions.celestial_deposit_status IS 'unpaid, paid, null';
COMMENT ON COLUMN transactions.celestial_deposit_qr IS 'QR image URL from Celestial deposit';
