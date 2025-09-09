import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Download,
  Clock,
  Trophy,
  LogOut,
  Award,
  Video,
  FileText,
  Users,
  Target,
  TrendingUp
} from "lucide-react";

import { NotificationSystem } from "@/components/NotificationSystem";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthService } from "@/lib/auth";
import { StudentDataService } from "@/lib/studentData";
import { getCourseData, getCertificateData, Course, Notification, Activity, Certificate } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";

// An enriched type for courses displayed on the dashboard
interface EnrichedCourse extends Course {
  progress: number;
  completedLessons: number;
  rank: number;
  certificate: 'Gold' | 'Silver' | 'Participation' | null;
  nextLive: string; // This is mock data
}

const StudentDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  

  const [enrolledCourses, setEnrolledCourses] = useState<EnrichedCourse[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [_userCertificates, _setUserCertificates] = useState<Certificate[]>([]);






  const handleLogout = () => {
    AuthService.logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const enrollInCourse = async (courseId: string) => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return;

    try {
      // Enroll in course
      StudentDataService.enrollInCourse(currentUser.user.id, courseId);

      // Refresh data without page reload
      await refreshDashboardData();

      toast({
        title: "Enrollment Successful!",
        description: "You have been enrolled in the course.",
      });
    } catch {
      toast({
        title: "Enrollment Failed",
        description: "There was an error enrolling in the course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const refreshDashboardData = useCallback(async () => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return;

    const userId = currentUser.user.id;

    try {
      // Load student data
      const studentProgress = StudentDataService.getStudentProgress(userId);
      const allCourses = getCourseData();
      const studentNotifications = StudentDataService.getStudentNotifications(userId);
      const studentActivities = StudentDataService.getStudentActivities(userId);
      const allCertificates = getCertificateData();

      // Filter enrolled courses based on progress data
      const enrolled = allCourses.filter(course =>
        studentProgress.some(p => p.courseId === course.id)
      ).map(course => {
        const progress = studentProgress.find(p => p.courseId === course.id);
        return {
          ...course,
          progress: progress?.progress || 0,
          completedLessons: progress?.completedLessons || 0,
          rank: progress?.rank || 1,
          certificate: progress?.certificate || null,
          nextLive: "Tomorrow 3:00 PM" // Mock data
        };
      });

      setEnrolledCourses(enrolled);
      setAvailableCourses(allCourses.filter(course =>
        !enrolled.some(e => e.id === course.id)
      ));
      setNotifications(studentNotifications);
      setRecentActivities(studentActivities);
      _setUserCertificates(allCertificates.filter(cert => cert.userId === userId));
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
      toast({
        title: "Data Refresh Failed",
        description: "There was an error loading your data. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Load initial data
    refreshDashboardData();
  }, [navigate, refreshDashboardData]);

  const markAllNotificationsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        StudentDataService.markNotificationRead(notification.id);
      }
    });
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({
      title: "Notifications Marked as Read",
      description: "All notifications have been marked as read.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-lg">AJC</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, Student!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationSystem />
              <ThemeToggle />
              <Link to="/">
                <Button variant="outline" className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-300">
                  View Website
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/', icon: <BookOpen className="h-3 w-3" /> },
            { label: 'Student Dashboard' }
          ]}
          className="mb-6"
        />
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="card-modern card-hover animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{enrolledCourses.length}</div>
              <p className="text-xs text-muted-foreground">Active enrollments</p>
            </CardContent>
          </Card>
          <Card className="card-modern card-hover animate-fade-in" style={{animationDelay: '0.1s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {enrolledCourses.length > 0 ? Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Average completion</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enrolledCourses.filter(course => course.certificate).length}
              </div>
              <p className="text-xs text-muted-foreground">1 Silver certificate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Rank</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                #{Math.min(...enrolledCourses.map(course => course.rank))}
              </div>
              <p className="text-xs text-muted-foreground">In Power BI course</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="enroll">Enroll More</TabsTrigger>
          </TabsList>

          {/* My Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Courses</h2>
            </div>

            <div className="grid gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{course.title}</CardTitle>
                        <CardDescription>
                          {course.completedLessons}/{course.totalLessons} lessons completed
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">Rank #{course.rank}/{course.students}</Badge>
                        {course.certificate && (
                          <Badge className="ml-2 bg-gray-500">{course.certificate} Certificate</Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={course.progress} className="w-full" />
                    <p className="text-sm text-muted-foreground">{course.progress}% Complete</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <Card className="p-4 hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center space-x-2 mb-2">
                          <Video className="h-5 w-5 text-primary" />
                          <span className="font-medium">Video Classes</span>
                        </div>
                        <p className="text-sm text-muted-foreground">18 recorded sessions</p>
                      </Card>
                      <Card className="p-4 hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="h-5 w-5 text-accent" />
                          <span className="font-medium">Live Session</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{course.nextLive}</p>
                        <Button size="sm" className="mt-2 w-full">Join Live</Button>
                      </Card>
                      <Card className="p-4 hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Notes & Tasks</span>
                        </div>
                        <p className="text-sm text-muted-foreground">12 resources available</p>
                        <Button size="sm" variant="outline" className="mt-2 w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </Card>
                      <Card className="p-4 hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="h-5 w-5 text-orange-600" />
                          <span className="font-medium">Daily MCQs</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Today's quiz available</p>
                        <Button size="sm" variant="outline" className="mt-2 w-full">Take Quiz</Button>
                      </Card>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <Link to={`/student/course/${course.id}`}>
                        <Button>Continue Learning</Button>
                      </Link>
                      <Button variant="outline">View Leaderboard</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Notifications</h2>
              <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>Mark All Read</Button>
            </div>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className={`${!notification.read ? 'border-primary/50 bg-primary/5' : ''}`}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${!notification.read ? 'bg-primary' : 'bg-muted'}`}></div>
                      <div>
                        <h4 className="font-semibold">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.course}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {(() => {
                          try {
                            const createdAt = new Date(notification.createdAt);
                            if (isNaN(createdAt.getTime())) {
                              return 'Unknown time';
                            }
                            return formatDistanceToNow(createdAt, { addSuffix: true });
                          } catch {
                            return 'Unknown time';
                          }
                        })()}
                      </p>
                      {!notification.read && <Badge variant="secondary" className="mt-1">New</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Certificates</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="text-center border-2 border-gray-300">
                <CardHeader>
                  <div className="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle>Silver Certificate</CardTitle>
                  <CardDescription>Power BI Mastery</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Awarded for excellent performance (85% score)
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Certificate ID: AJC2024-PBI-00142
                  </p>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-dashed border-muted">
                <CardHeader>
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-muted-foreground">Full Stack Development</CardTitle>
                  <CardDescription>In Progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete your course to earn a certificate
                  </p>
                  <Progress value={75} className="mb-4" />
                  <p className="text-xs text-muted-foreground">75% Complete</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Performance Tracker</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Your latest learning activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{activity.activity}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge variant={
                          activity.score.includes('8/10') ? 'default' :
                          activity.score === 'Pending' ? 'secondary' :
                          activity.score === 'Present' ? 'default' : 'outline'
                        }>
                          {activity.score}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Rankings</CardTitle>
                  <CardDescription>Your position in each course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.progress}% Complete</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Trophy className={`h-4 w-4 ${course.rank <= 5 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                            <span className="font-bold">#{course.rank}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">of {course.students}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enroll More Tab */}
          <TabsContent value="enroll" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Available Courses</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course, index) => (
                 <Card key={index} className="hover:shadow-lg transition-shadow">
                   <CardHeader>
                     <div className="text-3xl mb-2">{course.icon}</div>
                     <CardTitle>{course.title}</CardTitle>
                     <CardDescription>{course.duration} • ₹{course.price}</CardDescription>
                   </CardHeader>
                   <CardContent>
                     <Button onClick={() => enrollInCourse(course.id)} className="w-full">
                       Enroll Now
                     </Button>
                   </CardContent>
                 </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;