import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateReview } from '@/hooks/useReviews';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  placeId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ placeId, onSuccess }: ReviewFormProps) {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const createReview = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || rating === 0 || !comment.trim()) {
      return;
    }

    const reviewData = {
      place_id: placeId,
      author: author.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    };

    createReview.mutate(reviewData, {
      onSuccess: () => {
        // Reset form
        setAuthor('');
        setRating(0);
        setComment('');
        onSuccess?.();
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tulis Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Author Name */}
          <div className="space-y-2">
            <Label htmlFor="author">Nama</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nama Anda"
              required
            />
          </div>

          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  <Star
                    className={cn(
                      'w-8 h-8 transition-colors',
                      (hoveredRating >= star || rating >= star)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Komentar</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ceritakan pengalaman Anda..."
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={createReview.isPending || !author.trim() || rating === 0 || !comment.trim()}
            className="w-full"
          >
            {createReview.isPending ? 'Mengirim...' : 'Kirim Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
