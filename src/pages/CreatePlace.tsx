import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const placeSchema = z.object({
  name: z.string().min(1, 'Nama tempat harus diisi').max(200),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter').max(1000),
  address: z.string().min(5, 'Alamat harus diisi').max(500),
  category: z.enum(['cafe', 'restaurant', 'mall', 'historical_place']),
  image: z.string().url('URL gambar tidak valid'),
  openingHours: z.string().max(200).optional(),
  ticketPrice: z.string().max(200).optional(),
});

const CreatePlace = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [newFacility, setNewFacility] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    category: 'cafe' as const,
    image: '',
    openingHours: '',
    ticketPrice: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      placeSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
        return;
      }
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.from('places').insert({
        name: formData.name,
        description: formData.description,
        address: formData.address,
        category: formData.category,
        image: formData.image,
        opening_hours: formData.openingHours || null,
        ticket_price: formData.ticketPrice || null,
        facilities: facilities.length > 0 ? facilities : null,
        rating: 0,
      });

      if (error) throw error;

      toast.success('Tempat berhasil ditambahkan!');
      navigate('/places');
    } catch (error) {
      console.error('Error creating place:', error);
      toast.error('Gagal menambahkan tempat');
    } finally {
      setLoading(false);
    }
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
            <CardTitle className="text-2xl">Tambahkan Tempat Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Nama Tempat *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Lawang Sewu"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ceritakan tentang tempat ini..."
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
                  placeholder="Jl. Pemuda No. 1, Semarang"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
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
                  placeholder="https://example.com/image.jpg"
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
                  placeholder="Contoh: 09:00 - 21:00"
                />
              </div>

              <div>
                <Label htmlFor="ticketPrice">Harga Tiket / Range Harga</Label>
                <Input
                  id="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                  placeholder="Contoh: Gratis atau Rp 20.000 - 50.000"
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

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Tambahkan Tempat'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePlace;
