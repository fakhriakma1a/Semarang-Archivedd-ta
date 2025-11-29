import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Star, Building2, Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceCard } from '@/components/PlaceCard';
import { usePlaces, usePlaceStatistics, useToggleFavorite, useToggleVisited } from '@/hooks/usePlaces';
import { toast } from 'sonner';

const Home = () => {
  // Use hooks
  const { data: places = [], isLoading } = usePlaces();
  const { data: stats } = usePlaceStatistics();
  const toggleFavoriteMutation = useToggleFavorite();
  const toggleVisitedMutation = useToggleVisited();

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

    toggleFavoriteMutation.mutate({
      id,
      isFavorite: !place.is_favorite,
    });
  };

  const featuredPlaces = useMemo(() => {
    return places
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);
  }, [places]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Jelajahi & Arsipkan Semarang
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Simpan pengalaman kunjunganmu di Kota Lumpia. Dari kuliner
              legendaris hingga landmark bersejarah.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                <Link to="/places">
                  Lihat Semua Tempat
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                <Link to="/randomizer">
                  <Dices className="mr-2 w-4 h-4" />
                  Coba Random
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card p-6 rounded-xl shadow-card text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {stats?.total || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Tempat</div>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-card text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {stats?.visited || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Sudah Dikunjungi
              </div>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-card text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {places.length > 0 
                  ? (places.reduce((sum, p) => sum + (p.rating || 0), 0) / places.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <div className="text-sm text-muted-foreground">Rating Rata2</div>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-card text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <Dices className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">4</div>
              <div className="text-sm text-muted-foreground">Kategori</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Places Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Tempat Populer</h2>
              <p className="text-muted-foreground">
                Destinasi favorit di Kota Semarang
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/places">
                Lihat Semua
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onToggleVisited={handleToggleVisited}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Randomizer Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center">
              <Dices className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Bingung Mau Kemana?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Biarkan kami yang memilihkan! Gunakan fitur randomizer untuk
              mendapatkan rekomendasi tempat secara acak.
            </p>
            <Button asChild size="lg" className="gradient-hero border-0">
              <Link to="/randomizer">
                <Dices className="mr-2 w-4 h-4" />
                Coba Random Tempat
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
