export type PlaceCategory = 'cafe' | 'restaurant' | 'mall' | 'historical_place';

export interface Place {
  id: string;
  name: string;
  description: string;
  address: string;
  rating: number;
  category: PlaceCategory;
  image: string;
  openingHours?: string;
  ticketPrice?: string;
  facilities?: string[];
  visited?: boolean;
  visitedDate?: string;
  isFavorite?: boolean;
}

export interface CategoryInfo {
  id: PlaceCategory;
  name: string;
  icon: string;
  emoji: string;
}
