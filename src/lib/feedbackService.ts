import { 
  CourseFeedback, 
  CourseRating, 
  getCourseFeedback, 
  saveCourseFeedback, 
  getCourseRatings, 
  saveCourseRatings,
  getUserData
} from './mockData';

export class FeedbackService {
  // Submit new feedback
  static submitFeedback(
    userId: string, 
    courseId: string, 
    rating: number, 
    review: string
  ): boolean {
    try {
      const allFeedback = getCourseFeedback();
      const users = getUserData();
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Check if user already submitted feedback for this course
      const existingFeedback = allFeedback.find(
        f => f.userId === userId && f.courseId === courseId
      );

      if (existingFeedback) {
        // Update existing feedback
        existingFeedback.rating = rating;
        existingFeedback.review = review;
        existingFeedback.createdAt = new Date().toISOString();
        existingFeedback.isApproved = false; // Reset approval status
        existingFeedback.adminResponse = undefined;
        existingFeedback.adminResponseDate = undefined;
      } else {
        // Create new feedback
        const newFeedback: CourseFeedback = {
          id: `feedback_${Date.now()}`,
          userId,
          courseId,
          studentName: user.name,
          rating,
          review,
          createdAt: new Date().toISOString(),
          isApproved: false
        };
        allFeedback.push(newFeedback);
      }

      // Save feedback
      const saved = saveCourseFeedback(allFeedback);
      
      if (saved) {
        // Update course ratings
        this.updateCourseRating(courseId);
      }
      
      return saved;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  }

  // Get feedback for a specific course
  static getCourseFeedbackList(courseId: string, approvedOnly: boolean = true): CourseFeedback[] {
    try {
      const allFeedback = getCourseFeedback();
      return allFeedback.filter(f => 
        f.courseId === courseId && (!approvedOnly || f.isApproved)
      );
    } catch (error) {
      console.error('Error getting course feedback:', error);
      return [];
    }
  }

  // Get feedback by user
  static getUserFeedback(userId: string): CourseFeedback[] {
    try {
      const allFeedback = getCourseFeedback();
      return allFeedback.filter(f => f.userId === userId);
    } catch (error) {
      console.error('Error getting user feedback:', error);
      return [];
    }
  }

  // Get course rating
  static getCourseRating(courseId: string): CourseRating | null {
    try {
      const ratings = getCourseRatings();
      return ratings.find(r => r.courseId === courseId) || null;
    } catch (error) {
      console.error('Error getting course rating:', error);
      return null;
    }
  }

  // Update course rating based on all feedback
  static updateCourseRating(courseId: string): boolean {
    try {
      const allFeedback = getCourseFeedback();
      const courseFeedback = allFeedback.filter(f => f.courseId === courseId && f.isApproved);
      
      if (courseFeedback.length === 0) {
        return true; // No feedback yet
      }

      const totalRating = courseFeedback.reduce((sum, f) => sum + f.rating, 0);
      const averageRating = totalRating / courseFeedback.length;
      
      // Calculate rating distribution
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      courseFeedback.forEach(f => {
        distribution[f.rating as keyof typeof distribution]++;
      });

      const newRating: CourseRating = {
        courseId,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews: courseFeedback.length,
        ratingDistribution: distribution
      };

      const allRatings = getCourseRatings();
      const existingIndex = allRatings.findIndex(r => r.courseId === courseId);
      
      if (existingIndex >= 0) {
        allRatings[existingIndex] = newRating;
      } else {
        allRatings.push(newRating);
      }

      return saveCourseRatings(allRatings);
    } catch (error) {
      console.error('Error updating course rating:', error);
      return false;
    }
  }

  // Admin functions
  static approveFeedback(feedbackId: string): boolean {
    try {
      const allFeedback = getCourseFeedback();
      const feedback = allFeedback.find(f => f.id === feedbackId);
      
      if (!feedback) {
        return false;
      }

      feedback.isApproved = true;
      const saved = saveCourseFeedback(allFeedback);
      
      if (saved) {
        // Update course rating
        this.updateCourseRating(feedback.courseId);
      }
      
      return saved;
    } catch (error) {
      console.error('Error approving feedback:', error);
      return false;
    }
  }

  static rejectFeedback(feedbackId: string): boolean {
    try {
      const allFeedback = getCourseFeedback();
      const feedback = allFeedback.find(f => f.id === feedbackId);
      
      if (!feedback) {
        return false;
      }

      feedback.isApproved = false;
      const saved = saveCourseFeedback(allFeedback);
      
      if (saved) {
        // Update course rating
        this.updateCourseRating(feedback.courseId);
      }
      
      return saved;
    } catch (error) {
      console.error('Error rejecting feedback:', error);
      return false;
    }
  }

  static respondToFeedback(feedbackId: string, response: string): boolean {
    try {
      const allFeedback = getCourseFeedback();
      const feedback = allFeedback.find(f => f.id === feedbackId);
      
      if (!feedback) {
        return false;
      }

      feedback.adminResponse = response;
      feedback.adminResponseDate = new Date().toISOString();
      
      return saveCourseFeedback(allFeedback);
    } catch (error) {
      console.error('Error responding to feedback:', error);
      return false;
    }
  }

  // Get all feedback for admin review
  static getAllFeedback(): CourseFeedback[] {
    try {
      return getCourseFeedback();
    } catch (error) {
      console.error('Error getting all feedback:', error);
      return [];
    }
  }

  // Get pending feedback for admin review
  static getPendingFeedback(): CourseFeedback[] {
    try {
      const allFeedback = getCourseFeedback();
      return allFeedback.filter(f => !f.isApproved);
    } catch (error) {
      console.error('Error getting pending feedback:', error);
      return [];
    }
  }
}
