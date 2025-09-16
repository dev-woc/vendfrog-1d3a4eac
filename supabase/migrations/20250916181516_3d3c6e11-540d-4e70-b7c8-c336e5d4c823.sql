-- Allow NULL values for time fields when times are TBA
ALTER TABLE public.markets 
ALTER COLUMN load_in_time DROP NOT NULL;

ALTER TABLE public.markets 
ALTER COLUMN market_start_time DROP NOT NULL;

ALTER TABLE public.markets 
ALTER COLUMN market_end_time DROP NOT NULL;