-- Add documents column to markets table to store uploaded document URLs
ALTER TABLE public.markets
ADD COLUMN documents JSONB DEFAULT '{}'::jsonb;

-- Add comment to describe the structure
COMMENT ON COLUMN public.markets.documents IS 'Stores URLs for uploaded documents in format: {"businessLicense": "url", "liabilityInsurance": "url", "foodHandlersPermit": "url"}';
