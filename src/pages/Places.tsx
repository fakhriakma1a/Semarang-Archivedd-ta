import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlaceCard } from '@/components/PlaceCard';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePlaces, useToggleFavorite, useToggleVisited } from '@/hooks/usePlaces';
import type { Database } from '@/integrations/supabase/types';

type Place = Database['public']['Tables']['places']['Row'];

const Places = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');

  // Use React Query hooks
  const { data: places = [], isLoading, error } = usePlaces({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchQuery,
  });

  const toggleFavoriteMutation = useToggleFavorite();
  const toggleVisitedMutation = useToggleVisited();

  const filteredAndSortedPlaces = useMemo(() => {
    const result = [...places];

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'visited':
        result.sort((a, b) => {
          if (a.visited && !b.visited) return -1;
          if (!a.visited && b.visited) return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [places, sortBy]);

  const handleToggleVisited = async (id: string) => {
    const place = places.find((p) => p.id === id);
    if (!place) return;

    toggleVisitedMutation.mutate({
      id,
      visited: !place.visited,
    });
  };

  const handleToggleFavorite = async (id: string) => {
    const place = places.find((p) => p.id === id);
    if (!place) return;

    toggleFavoriteMutation.mutate(
      { id, isFavorite: !place.is_favorite },
      {
        onSuccess: () => {
          toast.success(place.is_favorite ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat tempat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-16">
          <p className="text-destructive">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Tempat di Semarang
        </h1>
        <p className="text-muted-foreground">
          Jelajahi {filteredAndSortedPlaces.length} tempat menarik di Kota Lumpia
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari tempat di Semarang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating Tertinggi</SelectItem>
              <SelectItem value="name">Nama (A-Z)</SelectItem>
              <SelectItem value="visited">Sudah Dikunjungi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2"
            onClick={() => setSelectedCategory('all')}
          >
            Semua
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={
                selectedCategory === category.id ? 'default' : 'outline'
              }
              className="cursor-pointer px-4 py-2"
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="mr-1">{category.emoji}</span>
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredAndSortedPlaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onToggleVisited={handleToggleVisited}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Tidak ada tempat ditemukan
          </h3>
          <p className="text-muted-foreground mb-4">
            Coba kata kunci lain atau ubah filter kategori
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            Reset Filter
          </Button>
        </div>
      )}
    </div>
  );
};

export default Places;
