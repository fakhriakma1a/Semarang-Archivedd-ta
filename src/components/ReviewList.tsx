import { ReviewCard } from './ReviewCard';
import { useReviews } from '@/hooks/useReviews';
import { Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Review = Database['public']['Tables']['reviews']['Row'];

interface ReviewListProps {
  placeId: string;
  onEdit?: (review: Review) => void;
  showActions?: boolean;
}

export function ReviewList({ placeId, onEdit, showActions = false }: ReviewListProps) {
  const { data: reviews, isLoading, error } = useReviews(placeId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat review...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Gagal memuat review</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Belum ada review untuk tempat ini.</p>
        <p className="text-sm mt-2">Jadilah yang pertama memberikan review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onEdit={onEdit}
          showActions={showActions}
        />
      ))}
    </div>
  );
}
