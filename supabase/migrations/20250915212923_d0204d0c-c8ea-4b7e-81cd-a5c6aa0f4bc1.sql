-- Create markets table to persist user market data
CREATE TABLE public.markets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  load_in_time TIME NOT NULL,
  market_start_time TIME NOT NULL,
  market_end_time TIME NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  fee DECIMAL(10,2) NOT NULL,
  estimated_profit DECIMAL(10,2) NOT NULL,
  actual_revenue DECIMAL(10,2),
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'confirmed', 'pending', 'completed')),
  description TEXT,
  organizer_contact TEXT,
  requirements TEXT[],
  checklist JSONB DEFAULT '[]'::jsonb,
  completed BOOLEAN DEFAULT FALSE,
  completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own markets" 
ON public.markets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own markets" 
ON public.markets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own markets" 
ON public.markets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own markets" 
ON public.markets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_markets_updated_at
BEFORE UPDATE ON public.markets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();