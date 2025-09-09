import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { StarDisplay } from '@/components/ui/star-rating';
import { FeedbackService } from '@/lib/feedbackService';
import { CourseFeedback } from '@/lib/mockData';
import { 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Reply, 
  Clock,
  User,

} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const FeedbackManagement: React.FC = () => {
  const [allFeedback, setAllFeedback] = useState<CourseFeedback[]>([]);
  const [pendingFeedback, setPendingFeedback] = useState<CourseFeedback[]>([]);
  const [_selectedFeedback, _setSelectedFeedback] = useState<CourseFeedback | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadFeedback = useCallback(() => {
    setLoading(true);
    try {
      const all = FeedbackService.getAllFeedback();
      const pending = FeedbackService.getPendingFeedback();

      setAllFeedback(all);
      setPendingFeedback(pending);
    } catch (error) {
      console.error('Error loading feedback:', error);
      toast({
        title: "Error",
        description: "Failed to load feedback data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const handleApproveFeedback = (feedbackId: string) => {
    const success = FeedbackService.approveFeedback(feedbackId);
    if (success) {
      toast({
        title: "Feedback Approved",
        description: "The feedback has been approved and is now visible to other students.",
      });
      loadFeedback();
    } else {
      toast({
        title: "Error",
        description: "Failed to approve feedback.",
        variant: "destructive",
      });
    }
  };

  const handleRejectFeedback = (feedbackId: string) => {
    const success = FeedbackService.rejectFeedback(feedbackId);
    if (success) {
      toast({
        title: "Feedback Rejected",
        description: "The feedback has been rejected and will not be visible to other students.",
      });
      loadFeedback();
    } else {
      toast({
        title: "Error",
        description: "Failed to reject feedback.",
        variant: "destructive",
      });
    }
  };

  const handleRespondToFeedback = (feedbackId: string) => {
    if (!adminResponse.trim()) {
      toast({
        title: "Response Required",
        description: "Please enter a response before submitting.",
        variant: "destructive",
      });
      return;
    }

    const success = FeedbackService.respondToFeedback(feedbackId, adminResponse.trim());
    if (success) {
      toast({
        title: "Response Sent",
        description: "Your response has been added to the feedback.",
      });
      setAdminResponse('');
      setSelectedFeedback(null);
      loadFeedback();
    } else {
      toast({
        title: "Error",
        description: "Failed to send response.",
        variant: "destructive",
      });
    }
  };

  const FeedbackCard: React.FC<{ feedback: CourseFeedback; showActions?: boolean }> = ({ 
    feedback, 
    showActions = true 
  }) => (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">{feedback.studentName}</p>
                <div className="flex items-center gap-2">
                  <StarDisplay rating={feedback.rating} size="sm" />
                  <Badge variant="outline" className="text-xs">
                    {feedback.courseId}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={feedback.isApproved ? 'default' : 'secondary'}>
                {feedback.isApproved ? 'Approved' : 'Pending'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {(() => {
                  try {
                    const createdAt = new Date(feedback.createdAt);
                    if (isNaN(createdAt.getTime())) {
                      return 'Unknown time';
                    }
                    return formatDistanceToNow(createdAt, { addSuffix: true });
                  } catch {
                    return 'Unknown time';
                  }
                })()}
              </span>
            </div>
          </div>
          
          <p className="text-sm leading-relaxed">{feedback.review}</p>
          
          {feedback.adminResponse && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  Admin Response
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {(() => {
                    try {
                      const responseDate = new Date(feedback.adminResponseDate || new Date());
                      if (isNaN(responseDate.getTime())) {
                        return 'Unknown time';
                      }
                      return formatDistanceToNow(responseDate, { addSuffix: true });
                    } catch {
                      return 'Unknown time';
                    }
                  })()}
                </span>
              </div>
              <p className="text-sm text-blue-800">{feedback.adminResponse}</p>
            </div>
          )}
          
          {showActions && (
            <div className="flex gap-2 pt-2">
              {!feedback.isApproved && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleApproveFeedback(feedback.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRejectFeedback(feedback.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedFeedback(feedback)}
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    {feedback.adminResponse ? 'Update Response' : 'Respond'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Respond to Feedback</DialogTitle>
                    <DialogDescription>
                      Send a response to {feedback.studentName}'s feedback
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <StarDisplay rating={feedback.rating} size="sm" />
                        <span className="font-medium">{feedback.studentName}</span>
                      </div>
                      <p className="text-sm">{feedback.review}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Response</label>
                      <Textarea
                        placeholder="Write your response to this feedback..."
                        value={adminResponse}
                        onChange={(e) => setAdminResponse(e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleRespondToFeedback(feedback.id)}
                        disabled={!adminResponse.trim()}
                      >
                        Send Response
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedFeedback(null);
                          setAdminResponse('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback Management
          </CardTitle>
          <CardDescription>
            Review, approve, and respond to student feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending ({pendingFeedback.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                All Feedback ({allFeedback.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingFeedback.length > 0 ? (
                pendingFeedback.map((feedback) => (
                  <FeedbackCard key={feedback.id} feedback={feedback} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending feedback to review.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {allFeedback.length > 0 ? (
                allFeedback.map((feedback) => (
                  <FeedbackCard key={feedback.id} feedback={feedback} showActions={false} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No feedback received yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
