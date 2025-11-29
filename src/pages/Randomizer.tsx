import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dices, MapPin, Star, Clock, DollarSign, Heart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PlaceCategory } from '@/types/place';
import { categories } from '@/data/categories';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRandomPlace, useToggleFavorite, useToggleVisited } from '@/hooks/usePlaces';
import type { Database } from '@/integrations/supabase/types';

type Place = Database['public']['Tables']['places']['Row'];

const Randomizer = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>(
    categories.map((c) => c.id)
  );
  const [selectedCategory, setSelectedCategory] = useState<'cafe' | 'restaurant' | 'mall' | 'historical_place' | 'all'>('all');
  const [history, setHistory] = useState<Place[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Use hooks
  const { data: currentPlace, refetch: refetchRandom, isFetching } = useRandomPlace(selectedCategory);
  const toggleFavoriteMutation = useToggleFavorite();
  const toggleVisitedMutation = useToggleVisited();

  const handleToggleCategory = (categoryId: PlaceCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((c) => c.id));
    }
  };

  const handleRandomize = () => {
    if (selectedCategories.length === 0) {
      toast.error('Pilih minimal satu kategori');
      return;
    }

    setIsAnimating(true);
    
    // Set selected category for query
    if (selectedCategories.length === categories.length) {
      setSelectedCategory('all');
    } else if (selectedCategories.length === 1) {
      setSelectedCategory(selectedCategories[0]);
    } else {
      setSelectedCategory('all');
    }

    // Animate and refetch
    setTimeout(() => {
      refetchRandom();
      setIsAnimating(false);
    }, 800);
  };

  // Update history when currentPlace changes
  if (currentPlace && !history.find(p => p.id === currentPlace.id)) {
    setHistory((prev) => {
      const newHistory = [currentPlace, ...prev];
      return newHistory.slice(0, 5);
    });
  }

  const handleToggleVisited = async () => {
    if (!currentPlace) return;

    toggleVisitedMutation.mutate({
      id: currentPlace.id,
      visited: !currentPlace.visited,
    });
  };

  const handleToggleFavorite = async () => {
    if (!currentPlace) return;

    toggleFavoriteMutation.mutate({
      id: currentPlace.id,
      isFavorite: !currentPlace.is_favorite,
    });
  };

  const category = currentPlace
    ? categories.find((c) => c.id === currentPlace.category)
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Random Tempat
        </h1>
        <p className="text-muted-foreground">
          Biarkan keberuntungan yang menentukan destinasi selanjutnya!
        </p>
      </div>

      {/* Category Selection */}
      <Card className="mb-6 shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pilih Kategori:</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedCategories.length === categories.length
                ? 'Hapus Semua'
                : 'Pilih Semua'}
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                onClick={() => handleToggleCategory(category.id)}
              >
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleToggleCategory(category.id)}
                />
                <label className="flex items-center space-x-2 cursor-pointer flex-1">
                  <span>{category.emoji}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Randomize Button */}
      <div className="flex justify-center mb-8">
        <Button
          size="lg"
          className="gradient-hero border-0 text-lg px-8 py-6"
          onClick={handleRandomize}
          disabled={selectedCategories.length === 0 || isAnimating || isFetching}
        >
          <Dices className={cn('mr-2 w-5 h-5', (isAnimating || isFetching) && 'animate-spin')} />
          {isAnimating || isFetching ? 'Mengacak...' : 'ACAK TEMPAT!'}
        </Button>
      </div>

      {/* Result */}
      {currentPlace ? (
        <Card className={cn(
          'overflow-hidden shadow-card transition-all duration-500',
          isAnimating && 'opacity-0 scale-95'
        )}>
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={currentPlace.image}
              alt={currentPlace.name}
              className="w-full h-full object-cover"
            />
            {currentPlace.visited && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">
                  <Check className="w-3 h-3 mr-1" />
                  Visited
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{currentPlace.name}</h2>
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="secondary">
                    <span className="mr-1">{category?.emoji}</span>
                    {category?.name}
                  </Badge>
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    <span className="font-semibold">{currentPlace.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">{currentPlace.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-start text-sm">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span>{currentPlace.address}</span>
              </div>
              {currentPlace.opening_hours && (
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{currentPlace.opening_hours}</span>
                </div>
              )}
              {currentPlace.ticket_price && (
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{currentPlace.ticket_price}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant={currentPlace.visited ? 'secondary' : 'default'}
                className="flex-1"
                onClick={handleToggleVisited}
              >
                <Check className="mr-2 w-4 h-4" />
                {currentPlace.visited ? 'Sudah Dikunjungi' : 'Tandai Dikunjungi'}
              </Button>
              <Button
                variant="outline"
                className={cn(
                  'flex-1',
                  currentPlace.is_favorite && 'border-red-500 text-red-500'
                )}
                onClick={handleToggleFavorite}
              >
                <Heart
                  className={cn(
                    'mr-2 w-4 h-4',
                    currentPlace.is_favorite && 'fill-current'
                  )}
                />
                {currentPlace.is_favorite ? 'Favorit' : 'Tambah Favorit'}
              </Button>
              <Button
                variant="outline"
                onClick={handleRandomize}
              >
                <Dices className="mr-2 w-4 h-4" />
                Acak Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Dices className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {selectedCategories.length === 0
              ? 'Pilih minimal 1 kategori'
              : 'Klik tombol acak untuk mulai'}
          </h3>
          <p className="text-muted-foreground">
            {selectedCategories.length === 0
              ? 'Centang kategori di atas untuk memulai'
              : 'Dapatkan rekomendasi tempat secara random'}
          </p>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Riwayat Random:</h3>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
            {history.map((place) => (
              <div
                key={place.id}
                className="flex-shrink-0 w-48 snap-start cursor-pointer"
                onClick={() => navigate(`/place/${place.id}`)}
              >
                <div className="aspect-video rounded-lg overflow-hidden mb-2">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-sm font-medium line-clamp-1">{place.name}</p>
                <p className="text-xs text-muted-foreground">
                  {categories.find((c) => c.id === place.category)?.emoji}{' '}
                  {categories.find((c) => c.id === place.category)?.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Randomizer;
