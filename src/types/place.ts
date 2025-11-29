export type PlaceCategory = 'cafe' | 'restaurant' | 'mall' | 'historical_place';

export interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

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
  reviews?: Review[];
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
