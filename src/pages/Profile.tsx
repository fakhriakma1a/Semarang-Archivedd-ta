import { useState, useEffect } from 'react';
import { User, MapPin, Heart, Star, Trash2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceCard } from '@/components/PlaceCard';
import { storage } from '@/lib/storage';
import { Place } from '@/types/place';
import { categories } from '@/data/categories';
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
import { places as initialPlaces } from '@/data/places';

const Profile = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    visited: 0,
    favorites: 0,
    avgRating: '0',
    favoriteCategory: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPlaces(storage.getPlaces());
    setStats(storage.getStats());
  };

  const handleToggleVisited = (id: string) => {
    storage.toggleVisited(id);
    loadData();
  };

  const handleToggleFavorite = (id: string) => {
    storage.toggleFavorite(id);
    loadData();
  };

  const handleClearData = () => {
    storage.clearData();
    storage.savePlaces(initialPlaces);
    loadData();
    toast.success('Data berhasil direset!');
  };

  const recentVisits = places
    .filter((p) => p.visited && p.visitedDate)
    .sort((a, b) => {
      const dateA = a.visitedDate ? new Date(a.visitedDate).getTime() : 0;
      const dateB = b.visitedDate ? new Date(b.visitedDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 6);

  const favorites = places.filter((p) => p.isFavorite);

  const favoriteCategoryInfo = categories.find(
    (c) => c.id === stats.favoriteCategory
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Profile Saya</h1>
            <p className="text-muted-foreground">Statistik & tempat favorit</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.visited}</div>
            <div className="text-sm text-muted-foreground">Dikunjungi</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.favorites}</div>
            <div className="text-sm text-muted-foreground">Favorit</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.avgRating}</div>
            <div className="text-sm text-muted-foreground">Rating Rata2</div>
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
              Dibuat dengan ❤️ untuk Kota Semarang
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
