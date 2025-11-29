import { Place } from '@/types/place';
import { Star, MapPin, Heart, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { categories } from '@/data/categories';
import { useNavigate } from 'react-router-dom';

interface PlaceCardProps {
  place: Place;
  onToggleVisited?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export const PlaceCard = ({
  place,
  onToggleVisited,
  onToggleFavorite,
}: PlaceCardProps) => {
  const category = categories.find((c) => c.id === place.category);
  const navigate = useNavigate();
  
  // Support both isFavorite (camelCase) and is_favorite (snake_case) from database
  const isFavorite = place.isFavorite ?? ('is_favorite' in place ? (place as Record<string, unknown>).is_favorite as boolean : false);

  return (
    <Card 
      className="overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 group cursor-pointer"
      onClick={() => navigate(`/place/${place.id}`)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {place.visited && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary text-primary-foreground">
              <Check className="w-3 h-3 mr-1" />
              Visited
            </Badge>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(place.id);
          }}
          className={cn(
            'absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-colors',
            isFavorite
              ? 'text-red-500 hover:text-red-600'
              : 'text-gray-400 hover:text-red-500'
          )}
        >
          <Heart
            className={cn('w-4 h-4', isFavorite && 'fill-current')}
          />
        </button>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">
              {place.name}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <span className="mr-2">{category?.emoji}</span>
              <span>{category?.name}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold">{place.rating}</span>
          </div>
        </div>
        <div className="flex items-start text-xs text-muted-foreground mb-3">
          <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">{place.address}</span>
        </div>
        {onToggleVisited && (
          <Button
            variant={place.visited ? 'secondary' : 'default'}
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisited(place.id);
            }}
          >
            {place.visited ? 'Mark as Not Visited' : 'Mark as Visited'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
