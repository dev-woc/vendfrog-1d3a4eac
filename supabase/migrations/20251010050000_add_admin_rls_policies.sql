-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Allow admins to view all markets
CREATE POLICY "Admins can view all markets" ON public.markets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Allow admins to view all documents
CREATE POLICY "Admins can view all documents" ON public.documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );
