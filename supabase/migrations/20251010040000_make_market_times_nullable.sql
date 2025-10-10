-- Make time fields nullable since they might not be known when creating a market
ALTER TABLE public.markets
  ALTER COLUMN load_in_time DROP NOT NULL,
  ALTER COLUMN market_start_time DROP NOT NULL,
  ALTER COLUMN market_end_time DROP NOT NULL;
