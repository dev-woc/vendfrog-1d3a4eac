-- Add calendar_synced_at column to markets table
ALTER TABLE markets ADD COLUMN IF NOT EXISTS calendar_synced_at TIMESTAMPTZ;
