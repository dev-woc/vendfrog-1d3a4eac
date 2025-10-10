-- Create a function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND is_admin = true
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT
  USING (public.is_admin());

-- Allow admins to view all markets
CREATE POLICY "Admins can view all markets" ON public.markets
  FOR SELECT
  USING (public.is_admin());

-- Allow admins to view all documents
CREATE POLICY "Admins can view all documents" ON public.documents
  FOR SELECT
  USING (public.is_admin());
