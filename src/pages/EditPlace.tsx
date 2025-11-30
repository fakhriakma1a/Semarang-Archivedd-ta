import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { usePlace, useUpdatePlace } from '@/hooks/usePlaces';

const placeSchema = z.object({
  name: z.string().min(1, 'Nama tempat harus diisi').max(200),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter').max(1000),
  address: z.string().min(5, 'Alamat harus diisi').max(500),
  category: z.enum(['cafe', 'restaurant', 'mall', 'historical_place']),
  image: z.string().url('URL gambar tidak valid'),
  rating: z.number().min(0, 'Rating minimal 0').max(5, 'Rating maksimal 5'),
  openingHours: z.string().max(200).optional(),
  ticketPrice: z.string().max(200).optional(),
});

const EditPlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: place, isLoading: initialLoading, error } = usePlace(id);
  const updatePlaceMutation = useUpdatePlace();
  const [facilities, setFacilities] = useState<string[]>([]);
  const [newFacility, setNewFacility] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    category: 'cafe' as 'cafe' | 'restaurant' | 'mall' | 'historical_place',
    image: '',
    rating: 0,
    openingHours: '',
    ticketPrice: '',
  });

  useEffect(() => {
    if (place) {
      setFormData({
        name: place.name || '',
        description: place.description || '',
        address: place.address || '',
        category: place.category || 'cafe',
        image: place.image || '',
        rating: place.rating || 0,
        openingHours: place.opening_hours || '',
        ticketPrice: place.ticket_price || '',
      });
      setFacilities(place.facilities || []);
    }
  }, [place]);

  useEffect(() => {
    if (error) {
      toast.error('Gagal memuat data tempat');
      navigate('/places');
    }
  }, [error, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      placeSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
        return;
      }
    }
    
    updatePlaceMutation.mutate(
      {
        id,
        data: {
          name: formData.name,
          description: formData.description,
          address: formData.address,
          category: formData.category,
          image: formData.image,
          rating: formData.rating,
          opening_hours: formData.openingHours || null,
          ticket_price: formData.ticketPrice || null,
          facilities: facilities.length > 0 ? facilities : null,
        },
      },
      {
        onSuccess: () => {
          navigate(`/place/${id}`, { replace: true });
        },
      }
    );
  };

  const addFacility = () => {
    if (newFacility.trim() && !facilities.includes(newFacility.trim())) {
      setFacilities([...facilities, newFacility.trim()]);
      setNewFacility('');
    }
  };

  const removeFacility = (facility: string) => {
    setFacilities(facilities.filter((f) => f !== facility));
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Tempat</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Nama Tempat *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Alamat Lengkap *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: 'cafe' | 'restaurant' | 'mall' | 'historical_place') => 
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cafe">☕ Kafe</SelectItem>
                    <SelectItem value="restaurant">🍽️ Restoran</SelectItem>
                    <SelectItem value="mall">🏢 Mal</SelectItem>
                    <SelectItem value="historical_place">🏛️ Tempat Bersejarah</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image">URL Gambar *</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>

              <div>
                <Label htmlFor="openingHours">Jam Buka</Label>
                <Input
                  id="openingHours"
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="ticketPrice">Harga Tiket / Range Harga</Label>
                <Input
                  id="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                />
              </div>

              <div>
                <Label>Fasilitas</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    placeholder="Tambah fasilitas"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                  />
                  <Button type="button" onClick={addFacility} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {facilities.map((facility) => (
                    <div
                      key={facility}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {facility}
                      <button
                        type="button"
                        onClick={() => removeFacility(facility)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="rating">Rating (0-5) *</Label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                    required
                    className="w-full sm:w-24"
                  />
                  <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="text-xl sm:text-2xl focus:outline-none hover:scale-110 transition-transform"
                        >
                          {star <= Math.floor(formData.rating) ? '⭐' : '☆'}
                        </button>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {formData.rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={updatePlaceMutation.isPending}
              >
                {updatePlaceMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPlace;
