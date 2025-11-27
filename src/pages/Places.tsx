import { useState, useEffect, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlaceCard } from '@/components/PlaceCard';
import { storage } from '@/lib/storage';
import { Place, PlaceCategory } from '@/types/place';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Places = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');

  useEffect(() => {
    setPlaces(storage.getPlaces());
  }, []);

  const filteredAndSortedPlaces = useMemo(() => {
    let result = [...places];

    // Filter by search
    if (searchQuery) {
      result = result.filter(
        (place) =>
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((place) => place.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
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
  }, [places, searchQuery, selectedCategory, sortBy]);

  const handleToggleVisited = (id: string) => {
    storage.toggleVisited(id);
    setPlaces(storage.getPlaces());
  };

  const handleToggleFavorite = (id: string) => {
    storage.toggleFavorite(id);
    setPlaces(storage.getPlaces());
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Tempat di Semarang
        </h1>
        <p className="text-muted-foreground">
          Jelajahi {places.length} tempat menarik di Kota Lumpia
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
