import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewService } from '@/services/reviewService';
import type { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Review = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];

/* Hook to get all reviews for a place*/
export function useReviews(placeId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', placeId],
    queryFn: () => placeId ? ReviewService.getByPlaceId(placeId) : Promise.resolve([]),
    enabled: !!placeId,
  });
}

/* Hook to get review by ID*/
export function useReview(id: string | undefined) {
  return useQuery({
    queryKey: ['review', id],
    queryFn: () => id ? ReviewService.getById(id) : Promise.resolve(null),
    enabled: !!id,
  });
}

/*Hook to get review statistics*/
export function useReviewStatistics(placeId: string | undefined) {
  return useQuery({
    queryKey: ['review-statistics', placeId],
    queryFn: () => placeId ? ReviewService.getStatistics(placeId) : Promise.resolve({
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: [],
    }),
    enabled: !!placeId,
  });
}

/*Hook to create a review*/
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: ReviewInsert) => ReviewService.create(review),
    onSuccess: (data) => {
      // Invalidate reviews query to refetch
      queryClient.invalidateQueries({ queryKey: ['reviews', data.place_id] });
      queryClient.invalidateQueries({ queryKey: ['review-statistics', data.place_id] });
      queryClient.invalidateQueries({ queryKey: ['places'] });
      queryClient.invalidateQueries({ queryKey: ['place', data.place_id] });
      
      toast.success('Review berhasil ditambahkan!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menambahkan review');
    },
  });
}

/*Hook to update a review*/
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ReviewUpdate }) =>
      ReviewService.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', data.place_id] });
      queryClient.invalidateQueries({ queryKey: ['review-statistics', data.place_id] });
      queryClient.invalidateQueries({ queryKey: ['review', data.id] });
      queryClient.invalidateQueries({ queryKey: ['places'] });
      queryClient.invalidateQueries({ queryKey: ['place', data.place_id] });
      
      toast.success('Review berhasil diperbarui!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memperbarui review');
    },
  });
}

/**
 * Hook to delete a review
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, placeId }: { id: string; placeId: string }) => 
      ReviewService.delete(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.placeId] });
      queryClient.invalidateQueries({ queryKey: ['review-statistics', variables.placeId] });
      queryClient.invalidateQueries({ queryKey: ['places'] });
      queryClient.invalidateQueries({ queryKey: ['place', variables.placeId] });
      
      toast.success('Review berhasil dihapus!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menghapus review');
    },
  });
}
