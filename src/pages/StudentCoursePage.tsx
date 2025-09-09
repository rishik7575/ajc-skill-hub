import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Play,
  Users,
  Star,
  Video,
  Brain,
  ClipboardList,
  Trophy
} from 'lucide-react';
import { Course, getCourseData } from '@/lib/mockData';
import { useAuth } from '@/lib/auth';
import { StudentDataService } from '@/lib/studentData';
import { MCQQuiz } from '@/components/MCQQuiz';
import { TaskSubmission } from '@/components/TaskSubmission';
import { MCQService } from '@/lib/mcqSystem';
import { TaskService, DailyTask, TaskSubmission as TaskSubmissionType } from '@/lib/taskSystem';

const StudentCoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeTasks, setActiveTasks] = useState<DailyTask[]>([]);
  const [userSubmissions, setUserSubmissions] = useState<TaskSubmissionType[]>([]);
  const [mcqPerformance, setMcqPerformance] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const loadCourseData = useCallback(async () => {
    try {
      setLoading(true);

      // Load course information
      const courses = getCourseData();
      const foundCourse = courses.find(c => c.id === courseId);

      if (!foundCourse) {
        toast({
          title: "Course Not Found",
          description: "The requested course could not be found.",
          variant: "destructive",
        });
        navigate('/student');
        return;
      }

      setCourse(foundCourse);

      if (user) {
        // Load student progress
        const studentProgress = StudentDataService.getStudentProgress(user.id);
        const courseProgress = studentProgress.find(p => p.courseId === courseId);
        setProgress(courseProgress?.progress || 0);

        // Load active tasks
        const tasks = TaskService.getTasksByCourse(courseId!);
        setActiveTasks(tasks);

        // Load user submissions
        const submissions = TaskService.getUserSubmissions(user.id, courseId!);
        setUserSubmissions(submissions);

        // Load MCQ performance
        const performance = MCQService.getUserPerformance(user.id, courseId!);
        setMcqPerformance(performance);
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      toast({
        title: "Error",
        description: "Failed to load course data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [courseId, user, toast, navigate]);

  useEffect(() => {
    if (courseId && user) {
      loadCourseData();
    }
  }, [courseId, user, loadCourseData]);

  const handleTaskSubmissionComplete = (submission: TaskSubmissionType) => {
    setUserSubmissions(prev => [...prev, submission]);
    toast({
      title: "Task Submitted!",
      description: "Your task has been submitted successfully.",
    });
  };

  const handleMCQComplete = () => {
    // Reload MCQ performance after completion
    if (user && courseId) {
      const performance = MCQService.getUserPerformance(user.id, courseId);
      setMcqPerformance(performance);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Course not found.</p>
          <Button onClick={() => navigate('/student')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const pendingTasks = activeTasks.filter(task =>
    !userSubmissions.some(sub => sub.taskId === task.id)
  );

  const completedTasks = activeTasks.filter(task =>
    userSubmissions.some(sub => sub.taskId === task.id)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/student')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{progress}%</div>
          <div className="text-sm text-muted-foreground">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <Progress value={progress} className="h-3" />
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{course.students}</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{completedTasks.length}</div>
                <div className="text-sm text-muted-foreground">Tasks Done</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">
                  {mcqPerformance?.accuracy.toFixed(0) || 0}%
                </div>
                <div className="text-sm text-muted-foreground">MCQ Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{course.rating}</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="mcq">MCQ Quiz</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Course Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Duration</h4>
                  <p className="text-muted-foreground">{course.duration}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Faculty</h4>
                  <p className="text-muted-foreground">{course.faculty}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Total Lessons</h4>
                  <p className="text-muted-foreground">{course.totalLessons}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <Badge variant="default">{course.status}</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Syllabus</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {course.syllabus?.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks Alert */}
          {pendingTasks.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800">Pending Tasks</CardTitle>
                <CardDescription className="text-orange-600">
                  You have {pendingTasks.length} pending task(s) to complete.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setActiveTab('tasks')} className="bg-orange-600 hover:bg-orange-700">
                  View Tasks
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Videos</CardTitle>
              <CardDescription>Watch recorded lectures and tutorials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.syllabus?.map((topic, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Video className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{topic}</h4>
                          <p className="text-sm text-muted-foreground">Lesson {index + 1}</p>
                        </div>
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Watch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          {activeTasks.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No active tasks available.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {activeTasks.map(task => {
                const existingSubmission = userSubmissions.find(sub => sub.taskId === task.id);
                return (
                  <TaskSubmission
                    key={task.id}
                    task={task}
                    existingSubmission={existingSubmission}
                    onSubmissionComplete={handleTaskSubmissionComplete}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mcq" className="space-y-6">
          <MCQQuiz
            courseId={courseId!}
            courseName={course.title}
            onComplete={handleMCQComplete}
          />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Course Leaderboard
              </CardTitle>
              <CardDescription>Top performers in this course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Leaderboard feature coming soon!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Complete more tasks and MCQs to improve your ranking.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentCoursePage;