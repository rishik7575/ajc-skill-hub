import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarDisplay, RatingDistribution } from '@/components/ui/star-rating';
import { FeedbackService } from '@/lib/feedbackService';
import { CourseFeedback, CourseRating } from '@/lib/mockData';
import { MessageSquare, ThumbsUp, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CourseReviewsProps {
  courseId: string;
  courseName: string;
  className?: string;
}

export const CourseReviews: React.FC<CourseReviewsProps> = ({
  courseId,
  courseName,
  className
}) => {
  const [reviews, setReviews] = useState<CourseFeedback[]>([]);
  const [rating, setRating] = useState<CourseRating | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [courseId]);

  const loadReviews = () => {
    setLoading(true);
    try {
      const courseReviews = FeedbackService.getCourseFeedbackList(courseId, true);
      const courseRating = FeedbackService.getCourseRating(courseId);
      
      setReviews(courseReviews);
      setRating(courseRating);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rating || reviews.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Course Reviews
          </CardTitle>
          <CardDescription>Student feedback for {courseName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No reviews yet for this course.</p>
            <p className="text-sm">Be the first to share your experience!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Course Reviews
        </CardTitle>
        <CardDescription>Student feedback for {courseName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {rating.averageRating.toFixed(1)}
              </div>
              <StarDisplay 
                rating={rating.averageRating} 
                totalReviews={rating.totalReviews}
                size="lg"
                className="justify-center"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Based on {rating.totalReviews} review{rating.totalReviews !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Rating Distribution</h4>
            <RatingDistribution 
              distribution={rating.ratingDistribution}
              totalReviews={rating.totalReviews}
            />
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-4">
          <h4 className="font-medium">Recent Reviews</h4>
          
          {displayedReviews.map((review) => (
            <Card key={review.id} className="border-l-4 border-l-primary/20">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{review.studentName}</p>
                        <div className="flex items-center gap-2">
                          <StarDisplay rating={review.rating} size="sm" />
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  </div>
                  
                  <p className="text-sm leading-relaxed">{review.review}</p>
                  
                  {review.adminResponse && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Admin Response
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(review.adminResponseDate!), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-blue-800">{review.adminResponse}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {reviews.length > 3 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="w-full"
              >
                {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
