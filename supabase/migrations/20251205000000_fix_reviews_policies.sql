-- =============================================
-- FIX REVIEWS POLICIES
-- Add missing UPDATE and DELETE policies for reviews
-- =============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can delete reviews" ON public.reviews;

-- Create policy for updating reviews
CREATE POLICY "Anyone can update reviews"
  ON public.reviews
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy for deleting reviews
CREATE POLICY "Anyone can delete reviews"
  ON public.reviews
  FOR DELETE
  USING (true);

-- Add index for review author (untuk query performance)
CREATE INDEX IF NOT EXISTS idx_reviews_author ON public.reviews(author);

-- Add index for review rating (untuk statistics)
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- Verify policies
-- SELECT schemaname, tablename, policyname, cmd 
-- FROM pg_policies 
-- WHERE tablename = 'reviews';
