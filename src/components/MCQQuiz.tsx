import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { MCQService, MCQQuestion, MCQSession, MCQAttempt } from '@/lib/mcqSystem';
import { useAuth } from '@/lib/auth';

interface MCQQuizProps {
  courseId: string;
  courseName: string;
  onComplete?: (session: MCQSession) => void;
}

export const MCQQuiz: React.FC<MCQQuizProps> = ({ courseId, courseName, onComplete }) => {
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  const [session, setSession] = useState<MCQSession | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [attempts, setAttempts] = useState<MCQAttempt[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const initializeQuiz = useCallback(() => {
    try {
      const dailyQuestions = MCQService.getDailyMCQ(courseId);
      if (dailyQuestions.length === 0) {
        toast({
          title: "No Questions Available",
          description: "No MCQ questions are available for this course today.",
          variant: "destructive",
        });
        return;
      }

      setQuestions(dailyQuestions);

      if (user) {
        const newSession = MCQService.startMCQSession(
          user.id,
          courseId,
          dailyQuestions.map(q => q.id)
        );
        setSession(newSession);
        setTimeLeft(newSession.timeLimit * 60); // Convert minutes to seconds
        setStartTime(Date.now());
      }
    } catch (error) {
      console.error('Error initializing quiz:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz questions.",
        variant: "destructive",
      });
    }
  }, [courseId, user, toast]);

  useEffect(() => {
    if (user && courseId) {
      initializeQuiz();
    }
  }, [user, courseId, initializeQuiz]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (session && timeLeft > 0 && !isCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [session, timeLeft, isCompleted]);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestion.id];
    
    if (selectedAnswer === undefined) {
      toast({
        title: "Please Select an Answer",
        description: "You must select an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    // Submit the answer
    if (user && session) {
      try {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        const attempt = MCQService.submitAnswer(
          session.id,
          currentQuestion.id,
          selectedAnswer,
          timeSpent
        );
        attempt.userId = user.id; // Set user ID
        setAttempts(prev => [...prev, attempt]);
      } catch (error) {
        console.error('Error submitting answer:', error);
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setStartTime(Date.now()); // Reset timer for next question
    } else {
      completeQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const completeQuiz = () => {
    if (!session) return;

    try {
      const completedSession = MCQService.completeSession(session.id);
      if (completedSession) {
        setSession(completedSession);
        setIsCompleted(true);
        setShowResults(true);
        
        if (onComplete) {
          onComplete(completedSession);
        }

        // Show completion toast
        const percentage = completedSession.percentage;
        const grade = percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : 'Needs Improvement';
        
        toast({
          title: "Quiz Completed!",
          description: `You scored ${percentage.toFixed(1)}% - ${grade}`,
        });
      }
    } catch (error) {
      console.error('Error completing quiz:', error);
      toast({
        title: "Error",
        description: "Failed to complete quiz.",
        variant: "destructive",
      });
    }
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's Up!",
      description: "The quiz time has expired. Submitting your current answers.",
      variant: "destructive",
    });
    completeQuiz();
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
    setShowResults(false);
    setAttempts([]);
    initializeQuiz();
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!session || questions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground">Loading quiz...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResults && isCompleted) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-yellow-500" />
            Quiz Results
          </CardTitle>
          <CardDescription>
            {courseName} - Daily MCQ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">
              {session.percentage.toFixed(1)}%
            </div>
            <div className="text-lg text-muted-foreground">
              {session.totalScore} out of {session.maxScore} correct
            </div>
            <Badge 
              variant={session.percentage >= 80 ? "default" : session.percentage >= 60 ? "secondary" : "destructive"}
              className="text-lg px-4 py-2"
            >
              {session.percentage >= 80 ? 'Excellent' : session.percentage >= 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Question Review:</h3>
            {questions.map((question, index) => {
              const attempt = attempts.find(a => a.questionId === question.id);
              const selectedAnswer = selectedAnswers[question.id];
              
              return (
                <div key={question.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    {attempt?.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{index + 1}. {question.question}</p>
                      <div className="mt-2 space-y-1">
                        {question.options.map((option, optionIndex) => (
                          <div 
                            key={optionIndex}
                            className={`p-2 rounded text-sm ${
                              optionIndex === question.correctAnswer 
                                ? 'bg-green-100 text-green-800 border border-green-300' 
                                : optionIndex === selectedAnswer && optionIndex !== question.correctAnswer
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-gray-50'
                            }`}
                          >
                            {option}
                            {optionIndex === question.correctAnswer && (
                              <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                            )}
                            {optionIndex === selectedAnswer && optionIndex !== question.correctAnswer && (
                              <span className="ml-2 text-red-600 font-medium">✗ Your answer</span>
                            )}
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={restartQuiz} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daily MCQ - {courseName}</CardTitle>
            <CardDescription>
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span className={timeLeft < 300 ? 'text-red-500 font-bold' : ''}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">{currentQuestion.difficulty}</Badge>
            <Badge variant="secondary">{currentQuestion.topic}</Badge>
          </div>
          <h3 className="text-lg font-semibold mb-4">
            {currentQuestion.question}
          </h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                className={`w-full p-4 text-left border rounded-lg transition-colors ${
                  selectedAnswers[currentQuestion.id] === index
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedAnswers[currentQuestion.id] === index
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`} />
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex === questions.length - 1 ? 'Complete Quiz' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
