-- =============================================
-- CREATE REVIEWS TABLE - COMPLETE SETUP
-- ERROR FIX: relation "public.reviews" does not exist
-- PASTE THIS TO SUPABASE SQL EDITOR
-- =============================================

-- 1. Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID REFERENCES public.places(id) ON DELETE CASCADE NOT NULL,
  author TEXT NOT NULL,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies (All 4 operations)
CREATE POLICY "Anyone can view reviews"
  ON public.reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update reviews"
  ON public.reviews
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete reviews"
  ON public.reviews
  FOR DELETE
  USING (true);

-- 4. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_reviews_place_id ON public.reviews(place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_author ON public.reviews(author);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at);

-- 5. Grant Permissions
GRANT ALL ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO anon;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check if table exists
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_name = 'reviews';

-- Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'reviews';

-- Check all policies (should have 4)
SELECT 
  policyname,
  cmd as operation,
  CASE 
    WHEN cmd = 'SELECT' THEN '✅ READ'
    WHEN cmd = 'INSERT' THEN '✅ CREATE'
    WHEN cmd = 'UPDATE' THEN '✅ UPDATE'
    WHEN cmd = 'DELETE' THEN '✅ DELETE'
  END as permission_type
FROM pg_policies 
WHERE tablename = 'reviews'
ORDER BY cmd;

-- Check indexes
SELECT 
  indexname,
  tablename
FROM pg_indexes 
WHERE tablename = 'reviews'
ORDER BY indexname;

-- =============================================
-- EXPECTED OUTPUT:
-- =============================================
-- Table: reviews (exists in public schema)
-- RLS: enabled (true)
-- Policies: 4 rows (SELECT, INSERT, UPDATE, DELETE)
-- Indexes: 4 indexes (place_id, author, rating, created_at)
-- =============================================

-- Test: Try to insert a sample review (optional)
-- INSERT INTO public.reviews (place_id, author, rating, comment, date)
-- SELECT 
--   id,
--   'Test User',
--   5.0,
--   'This is a test review',
--   '2025-12-05'
-- FROM public.places
-- LIMIT 1;

-- If successful, you should see: "INSERT 0 1"

-- =============================================
-- SETUP COMPLETE! ✅
-- Now try creating a review from your app.
-- =============================================
