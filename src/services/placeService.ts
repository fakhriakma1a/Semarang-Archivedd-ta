import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Place = Database['public']['Tables']['places']['Row'];
type PlaceInsert = Database['public']['Tables']['places']['Insert'];
type PlaceUpdate = Database['public']['Tables']['places']['Update'];

/**
 * PlaceService - Business logic layer for places
 * Handles all CRUD operations for places
 */
export class PlaceService {
  /**
   * Get all places
   */
  static async getAll(): Promise<Place[]> {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching places:', error);
      throw new Error('Gagal mengambil data tempat');
    }
  }

  /**
   * Get place by ID
   */
  static async getById(id: string): Promise<Place | null> {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching place:', error);
      throw new Error('Gagal mengambil data tempat');
    }
  }

  /**
   * Create new place
   */
  static async create(place: PlaceInsert): Promise<Place> {
    try {
      const { data, error } = await supabase
        .from('places')
        .insert([place])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating place:', error);
      throw new Error('Gagal menambahkan tempat');
    }
  }

  /**
   * Update place
   */
  static async update(id: string, updates: PlaceUpdate): Promise<Place> {
    try {
      const { data, error } = await supabase
        .from('places')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating place:', error);
      throw new Error('Gagal memperbarui tempat');
    }
  }

  /**
   * Delete place
   */
  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('places')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting place:', error);
      throw new Error('Gagal menghapus tempat');
    }
  }

  /**
   * Toggle favorite status
   */
  static async toggleFavorite(id: string, isFavorite: boolean): Promise<Place> {
    try {
      const { data, error } = await supabase
        .from('places')
        .update({ is_favorite: isFavorite })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw new Error('Gagal mengubah status favorit');
    }
  }

  /**
   * Toggle visited status
   */
  static async toggleVisited(id: string, visited: boolean): Promise<Place> {
    try {
      const visitedDate = visited ? new Date().toISOString() : null;
      
      const { data, error } = await supabase
        .from('places')
        .update({ 
          visited,
          visited_date: visitedDate 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling visited:', error);
      throw new Error('Gagal mengubah status kunjungan');
    }
  }

  /**
   * Get places by category
   */
  static async getByCategory(category: 'cafe' | 'restaurant' | 'mall' | 'historical_place'): Promise<Place[]> {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching places by category:', error);
      throw new Error('Gagal mengambil data tempat berdasarkan kategori');
    }
  }

  /**
   * Get favorite places
   */
  static async getFavorites(): Promise<Place[]> {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching favorite places:', error);
      throw new Error('Gagal mengambil tempat favorit');
    }
  }

  /**
   * Get visited places
   */
  static async getVisited(): Promise<Place[]> {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('visited', true)
        .order('visited_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching visited places:', error);
      throw new Error('Gagal mengambil tempat yang sudah dikunjungi');
    }
  }

  /**
   * Search places by name or address
   */
  static async search(query: string): Promise<Place[]> {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .or(`name.ilike.%${query}%,address.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching places:', error);
      throw new Error('Gagal mencari tempat');
    }
  }

  /**
   * Get random place (for randomizer feature)
   */
  static async getRandom(category?: 'cafe' | 'restaurant' | 'mall' | 'historical_place' | 'all'): Promise<Place | null> {
    try {
      let query = supabase
        .from('places')
        .select('*');

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      if (!data || data.length === 0) return null;

      // Get random place from results
      const randomIndex = Math.floor(Math.random() * data.length);
      return data[randomIndex];
    } catch (error) {
      console.error('Error getting random place:', error);
      throw new Error('Gagal mengambil tempat acak');
    }
  }

  /**
   * Get statistics
   */
  static async getStatistics(): Promise<{
    total: number;
    visited: number;
    favorites: number;
    byCategory: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('visited, is_favorite, category');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        visited: data?.filter(p => p.visited).length || 0,
        favorites: data?.filter(p => p.is_favorite).length || 0,
        byCategory: {} as Record<string, number>,
      };

      // Count by category
      data?.forEach(place => {
        if (place.category) {
          stats.byCategory[place.category] = (stats.byCategory[place.category] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw new Error('Gagal mengambil statistik');
    }
  }
}
