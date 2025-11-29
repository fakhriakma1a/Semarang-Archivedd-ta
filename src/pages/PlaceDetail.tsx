import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { categories } from '@/data/categories';
import { ArrowLeft, Star, MapPin, Clock, DollarSign, Heart, Check, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { usePlace, useDeletePlace, useToggleFavorite, useToggleVisited } from '@/hooks/usePlaces';

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Use hooks
  const { data: place, isLoading, error } = usePlace(id);
  const deleteMutation = useDeletePlace();
  const toggleFavoriteMutation = useToggleFavorite();
  const toggleVisitedMutation = useToggleVisited();

  const handleToggleVisited = async () => {
    if (!place) return;
    
    toggleVisitedMutation.mutate({
      id: place.id,
      visited: !place.visited,
    });
  };

  const handleToggleFavorite = async () => {
    if (!place) return;
    
    toggleFavoriteMutation.mutate({
      id: place.id,
      isFavorite: !place.is_favorite,
    });
  };

  const handleDelete = async () => {
    if (!place) return;

    deleteMutation.mutate(place.id, {
      onSuccess: () => {
        navigate('/places');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat detail tempat...</p>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Tempat tidak ditemukan</h2>
          <p className="text-muted-foreground">Tempat yang Anda cari tidak ada.</p>
        </div>
      </div>
    );
  }

  const category = categories.find((c) => c.id === place.category);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[40vh] md:h-[50vh]">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite();
          }}
          className={cn(
            'absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-colors',
            place.is_favorite
              ? 'text-red-500 hover:text-red-600'
              : 'text-gray-400 hover:text-red-500'
          )}
        >
          <Heart
            className={cn('w-5 h-5', place.is_favorite && 'fill-current')}
          />
        </button>

        {place.visited && (
          <div className="absolute top-4 right-16">
            <Badge className="bg-primary text-primary-foreground">
              <Check className="w-3 h-3 mr-1" />
              Visited
            </Badge>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{place.name}</h1>
                <div className="flex items-center text-muted-foreground mb-3">
                  <span className="text-2xl mr-2">{category?.emoji}</span>
                  <span className="text-lg">{category?.name}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-amber-500 bg-amber-50 dark:bg-amber-950 px-4 py-2 rounded-lg">
                <Star className="w-6 h-6 fill-current" />
                <span className="text-2xl font-bold">{place.rating}</span>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {place.description}
            </p>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Informasi Tempat</h2>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Alamat</p>
                  <p className="text-muted-foreground">{place.address}</p>
                </div>
              </div>

              {place.opening_hours && (
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Jam Buka</p>
                    <p className="text-muted-foreground">{place.opening_hours}</p>
                  </div>
                </div>
              )}

              {place.ticket_price && (
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Harga</p>
                    <p className="text-muted-foreground">{place.ticket_price}</p>
                  </div>
                </div>
              )}

              {place.facilities && place.facilities.length > 0 && (
                <div>
                  <p className="font-medium mb-2">Fasilitas</p>
                  <div className="flex flex-wrap gap-2">
                    {place.facilities.map((facility, index) => (
                      <Badge key={index} variant="secondary">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews section - Coming soon */}
            {/* TODO: Implement reviews feature */}

            <div className="mt-6 space-y-3">
              <Button
                variant={place.visited ? 'secondary' : 'default'}
                size="lg"
                className="w-full"
                onClick={handleToggleVisited}
              >
                {place.visited ? 'Mark as Not Visited' : 'Mark as Visited'}
              </Button>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={() => navigate(`/edit-place/${place.id}`)}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tempat</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus "{place.name}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlaceDetail;
