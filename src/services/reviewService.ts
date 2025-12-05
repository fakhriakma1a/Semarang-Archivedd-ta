import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Review = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];

export class ReviewService {
  /* Get all reviews for a place */
  static async getByPlaceId(placeId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('place_id', placeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw new Error('Gagal mengambil data review');
    }
  }

  /* Get review by ID*/
  static async getById(id: string): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching review:', error);
      throw new Error('Gagal mengambil data review');
    }
  }

  /*Create new review*/
  static async create(review: ReviewInsert): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select()
        .single();

      if (error) throw error;
      
      // Update place rating after creating review
      await this.updatePlaceRating(review.place_id);
      
      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw new Error('Gagal menambahkan review');
    }
  }

  /*Update review*/
  static async update(id: string, updates: ReviewUpdate): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Update place rating after updating review
      if (data.place_id) {
        await this.updatePlaceRating(data.place_id);
      }
      
      return data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw new Error('Gagal memperbarui review');
    }
  }

  /**
   * Delete review
   */
  static async delete(id: string): Promise<void> {
    try {
      // Get review first to know place_id
      const review = await this.getById(id);
      
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update place rating after deleting review
      if (review?.place_id) {
        await this.updatePlaceRating(review.place_id);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      throw new Error('Gagal menghapus review');
    }
  }

  /**
   * Calculate and update place rating based on reviews
   */
  static async updatePlaceRating(placeId: string): Promise<void> {
    try {
      const reviews = await this.getByPlaceId(placeId);
      
      if (reviews.length === 0) {
        // No reviews, set rating to 0
        await supabase
          .from('places')
          .update({ rating: 0 })
          .eq('id', placeId);
        return;
      }

      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
      const avgRating = totalRating / reviews.length;
      const roundedRating = Math.round(avgRating * 10) / 10; // Round to 1 decimal

      // Update place rating
      await supabase
        .from('places')
        .update({ rating: roundedRating })
        .eq('id', placeId);
    } catch (error) {
      console.error('Error updating place rating:', error);
    }
  }

  /**
   * Get review statistics for a place
   */
  static async getStatistics(placeId: string): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { rating: number; count: number }[];
  }> {
    try {
      const reviews = await this.getByPlaceId(placeId);
      
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0
        ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / totalReviews
        : 0;

      // Calculate rating distribution (5 star, 4 star, etc.)
      const distribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: reviews.filter(r => Math.floor(Number(r.rating)) === rating).length,
      }));

      return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution: distribution,
      };
    } catch (error) {
      console.error('Error getting review statistics:', error);
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: [5, 4, 3, 2, 1].map(r => ({ rating: r, count: 0 })),
      };
    }
  }
}
