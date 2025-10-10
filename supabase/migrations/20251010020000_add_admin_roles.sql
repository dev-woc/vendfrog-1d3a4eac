-- Add is_admin column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = is_admin.user_id
    AND profiles.is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant admin access to specific user (jordanmason32@gmail.com)
UPDATE public.profiles
SET is_admin = true
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'jordanmason32@gmail.com'
);
