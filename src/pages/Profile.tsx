import { useMemo } from 'react';
import { User, MapPin, Heart, Star, Trash2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceCard } from '@/components/PlaceCard';
import { categories } from '@/data/categories';
import { usePlaces, usePlaceStatistics, useToggleFavorite, useToggleVisited, useClearAllPlaces } from '@/hooks/usePlaces';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const Profile = () => {
  // Use hooks
  const { data: places = [], isLoading } = usePlaces();
  const { data: stats } = usePlaceStatistics();
  const toggleFavoriteMutation = useToggleFavorite();
  const toggleVisitedMutation = useToggleVisited();
  const clearAllPlacesMutation = useClearAllPlaces();

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

  const handleClearData = async () => {
    clearAllPlacesMutation.mutate();
  };

  const recentVisits = useMemo(() => {
    return places
      .filter((p) => p.visited && p.visited_date)
      .sort((a, b) => {
        const dateA = a.visited_date ? new Date(a.visited_date).getTime() : 0;
        const dateB = b.visited_date ? new Date(b.visited_date).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 6);
  }, [places]);

  const favorites = useMemo(() => {
    return places.filter((p) => p.is_favorite);
  }, [places]);

  const favoriteCategoryInfo = useMemo(() => {
    if (!stats?.byCategory) return null;
    const entries = Object.entries(stats.byCategory);
    if (entries.length === 0) return null;
    const sorted = entries.sort(([, a], [, b]) => (b as number) - (a as number));
    const [topCategoryId] = sorted[0];
    return categories.find((c) => c.id === topCategoryId);
  }, [stats]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Profile Saya</h1>
            <p className="text-muted-foreground">Statistik & tempat favorit saya</p>
          </div>
        </div>
      </div>

      {/* User Identity Card */}
      <Card className="mb-8 shadow-card border-primary/20">
        <CardHeader>
          <CardTitle>
            Identitas Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nama</p>
              <p className="font-semibold">Muhammad Fakhri Akmal Arief</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">NIM</p>
              <p className="font-semibold">21120123140172</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Group</p>
              <p className="font-semibold">10 - Shift 2</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats?.visited || 0}</div>
            <div className="text-sm text-muted-foreground">Dikunjungi</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats?.favorites || 0}</div>
            <div className="text-sm text-muted-foreground">Favorit</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats?.total || 0}</div>
            <div className="text-sm text-muted-foreground">Total Tempat</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary/10 flex items-center justify-center">
              <span className="text-2xl">{favoriteCategoryInfo?.emoji}</span>
            </div>
            <div className="text-lg font-bold mb-1 line-clamp-1">
              {favoriteCategoryInfo?.name || '-'}
            </div>
            <div className="text-sm text-muted-foreground">Kategori Fav</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Visits */}
      {recentVisits.length > 0 && (
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Kunjungan Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentVisits.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onToggleVisited={handleToggleVisited}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favorites */}
      {favorites.length > 0 && (
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Tempat Favorit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onToggleVisited={handleToggleVisited}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Pengaturan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Semua Data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini akan menghapus semua data kunjungan dan favorit
                    Anda. Data tidak dapat dikembalikan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData}>
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p className="font-semibold mb-1">Semarang Archived v1.0.0</p>
            <p>Progressive Web App</p>
            <p className="mt-2">
              Dibuat untuk Tugas Akhir Praktikum Pemrograman Perangkat Bergerak 2025.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
