import { supabase } from '@/integrations/supabase/client';
import { Place } from '@/types/place';

export const fetchPlaces = async (): Promise<Place[]> => {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching places:', error);
    return [];
  }

  return (data || []).map((place) => ({
    ...place,
    openingHours: place.opening_hours,
    ticketPrice: place.ticket_price,
    isFavorite: place.is_favorite,
    visitedDate: place.visited_date,
  }));
};

export const calculateStats = (places: Place[]) => {
  const visited = places.filter((p) => p.visited).length;
  const favorites = places.filter((p) => p.isFavorite).length;
  const avgRating =
    places.length > 0
      ? (places.reduce((sum, p) => sum + p.rating, 0) / places.length).toFixed(1)
      : '0';

  // Calculate favorite category
  const categoryCounts = places.reduce((acc, place) => {
    acc[place.category] = (acc[place.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const favoriteCategory = Object.entries(categoryCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] || '';

  return {
    total: places.length,
    visited,
    favorites,
    avgRating,
    favoriteCategory,
  };
};
