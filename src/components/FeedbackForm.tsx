import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/ui/star-rating';
import { useToast } from '@/hooks/use-toast';
import { FeedbackService } from '@/lib/feedbackService';
import { useAuth } from '@/lib/auth';
import { Loader2, MessageSquare } from 'lucide-react';

interface FeedbackFormProps {
  courseId: string;
  courseName: string;
  onSubmitSuccess?: () => void;
  className?: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  courseId,
  courseName,
  onSubmitSuccess,
  className
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Check if user already submitted feedback for this course
      const userFeedback = FeedbackService.getUserFeedback(user.id);
      const existing = userFeedback.find(f => f.courseId === courseId);
      if (existing) {
        setExistingFeedback(existing);
        setRating(existing.rating);
        setReview(existing.review);
      }
    }
  }, [user, courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit feedback.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (review.trim().length < 10) {
      toast({
        title: "Review Too Short",
        description: "Please provide a review with at least 10 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = FeedbackService.submitFeedback(
        user.id,
        courseId,
        rating,
        review.trim()
      );

      if (success) {
        toast({
          title: existingFeedback ? "Feedback Updated!" : "Feedback Submitted!",
          description: existingFeedback 
            ? "Your feedback has been updated and is pending approval."
            : "Thank you for your feedback! It will be reviewed before being published.",
        });
        
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRating(0);
    setReview('');
    setExistingFeedback(null);
  };

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Please log in to submit course feedback.</p>
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
          {existingFeedback ? 'Update Your Feedback' : 'Share Your Feedback'}
        </CardTitle>
        <CardDescription>
          {existingFeedback 
            ? `Update your review for ${courseName}`
            : `Help others by sharing your experience with ${courseName}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rating">Rating *</Label>
            <div className="flex items-center gap-4">
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size="lg"
              />
              {rating > 0 && (
                <span className="text-sm text-muted-foreground">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">Your Review *</Label>
            <Textarea
              id="review"
              placeholder="Share your thoughts about the course content, instructor, and overall experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Minimum 10 characters</span>
              <span>{review.length}/500</span>
            </div>
          </div>

          {existingFeedback && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You previously submitted feedback for this course. 
                Updating your feedback will require admin approval again.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || review.trim().length < 10}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {existingFeedback ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                existingFeedback ? 'Update Feedback' : 'Submit Feedback'
              )}
            </Button>
            
            {existingFeedback && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
