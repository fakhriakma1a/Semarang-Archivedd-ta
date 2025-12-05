-- Create enum for place categories
CREATE TYPE place_category AS ENUM ('cafe', 'restaurant', 'mall', 'historical_place');

-- Create places table
CREATE TABLE public.places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5) DEFAULT 0,
  category place_category NOT NULL,
  image TEXT NOT NULL,
  opening_hours TEXT,
  ticket_price TEXT,
  facilities TEXT[],
  visited BOOLEAN DEFAULT FALSE,
  visited_date TIMESTAMPTZ,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID REFERENCES public.places(id) ON DELETE CASCADE NOT NULL,
  author TEXT NOT NULL,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for places (public read, no auth required for now)
CREATE POLICY "Anyone can view places"
  ON public.places
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create places"
  ON public.places
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update places"
  ON public.places
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete places"
  ON public.places
  FOR DELETE
  USING (true);

-- Create policies for reviews (public read, write, update, delete)
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_places_updated_at
  BEFORE UPDATE ON public.places
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_places_category ON public.places(category);
CREATE INDEX idx_places_rating ON public.places(rating);
CREATE INDEX idx_reviews_place_id ON public.reviews(place_id);