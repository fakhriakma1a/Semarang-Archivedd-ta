import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useReviewStatistics } from '@/hooks/useReviews';
import { cn } from '@/lib/utils';

interface ReviewStatisticsProps {
  placeId: string;
}

export function ReviewStatistics({ placeId }: ReviewStatisticsProps) {
  const { data: stats, isLoading } = useReviewStatistics(placeId);

  if (isLoading || !stats) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistik Review</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Average Rating */}
        <div className="flex items-center gap-4 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'w-4 h-4',
                    star <= Math.round(stats.averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {stats.totalReviews} review
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {stats.ratingDistribution.map(({ rating, count }) => {
              const percentage = stats.totalReviews > 0 
                ? (count / stats.totalReviews) * 100 
                : 0;

              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
