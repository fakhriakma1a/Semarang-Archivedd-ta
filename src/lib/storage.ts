import { Place } from '@/types/place';

const STORAGE_KEY = 'semarang-archived-places';
const FAVORITES_KEY = 'semarang-archived-favorites';

export const storage = {
  getPlaces: (): Place[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  savePlaces: (places: Place[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  updatePlace: (placeId: string, updates: Partial<Place>): void => {
    const places = storage.getPlaces();
    const index = places.findIndex((p) => p.id === placeId);
    if (index !== -1) {
      places[index] = { ...places[index], ...updates };
      storage.savePlaces(places);
    }
  },

  toggleVisited: (placeId: string): void => {
    const places = storage.getPlaces();
    const place = places.find((p) => p.id === placeId);
    if (place) {
      storage.updatePlace(placeId, {
        visited: !place.visited,
        visitedDate: !place.visited ? new Date().toISOString() : undefined,
      });
    }
  },

  toggleFavorite: (placeId: string): void => {
    const places = storage.getPlaces();
    const place = places.find((p) => p.id === placeId);
    if (place) {
      storage.updatePlace(placeId, {
        isFavorite: !place.isFavorite,
      });
    }
  },

  getStats: () => {
    const places = storage.getPlaces();
    const visited = places.filter((p) => p.visited).length;
    const favorites = places.filter((p) => p.isFavorite).length;
    const avgRating =
      places.reduce((sum, p) => sum + p.rating, 0) / places.length || 0;

    const categoryCounts = places.reduce((acc, place) => {
      acc[place.category] = (acc[place.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteCategory = Object.entries(categoryCounts).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0];

    return {
      total: places.length,
      visited,
      favorites,
      avgRating: avgRating.toFixed(1),
      favoriteCategory,
    };
  },

  clearData: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FAVORITES_KEY);
  },
};
