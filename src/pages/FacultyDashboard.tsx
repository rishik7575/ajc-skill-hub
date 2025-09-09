import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Video, 
  FileText, 
  Link, 
  Users, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock,
  BookOpen,
  GraduationCap,
  Bell,
  Award,
  ChevronRight,
  LogOut,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { 
  STORAGE_KEYS, 
  FacultyMember, 
  Course, 
  TaskSubmission, 
  Message, 
  CourseMaterial,
  StudentProgress,
  getCourseData,
  getFacultyData
} from "@/lib/mockData";

const FacultyDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentFaculty, setCurrentFaculty] = useState<FacultyMember | null>(null);
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Material upload form state
  const [materialForm, setMaterialForm] = useState({
    title: '',
    type: 'notes' as 'notes' | 'video' | 'zoom_link',
    courseId: '',
    description: '',
    fileUrl: '',
    zoomLink: ''
  });

  useEffect(() => {
    // Check if faculty is logged in
    const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(currentUser);
    if (user.role !== 'faculty') {
      navigate('/');
      return;
    }

    loadFacultyData(user.id);
  }, [navigate]);

  const loadFacultyData = (facultyId: string) => {
    const facultyData = getFacultyData();
    const faculty = facultyData.find(f => f.id === facultyId);
    
    if (!faculty) {
      toast({
        title: "Error",
        description: "Faculty profile not found",
      });
      navigate('/login');
      return;
    }

    setCurrentFaculty(faculty);

    // Load assigned courses
    const courses = getCourseData();
    const assigned = courses.filter(course => 
      faculty.assignedCourses.includes(course.id)
    );
    setAssignedCourses(assigned);

    // Load materials
    const materialsData = localStorage.getItem(STORAGE_KEYS.COURSE_MATERIALS);
    const allMaterials = materialsData ? JSON.parse(materialsData) : [];
    const facultyMaterials = allMaterials.filter((m: CourseMaterial) => m.facultyId === facultyId);
    setMaterials(facultyMaterials);

    // Load submissions for faculty's courses
    const submissionsData = localStorage.getItem(STORAGE_KEYS.TASK_SUBMISSIONS);
    const allSubmissions = submissionsData ? JSON.parse(submissionsData) : [];
    const facultySubmissions = allSubmissions.filter((s: TaskSubmission) => 
      faculty.assignedCourses.includes(s.courseId)
    );
    setSubmissions(facultySubmissions);

    // Load messages
    const messagesData = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const allMessages = messagesData ? JSON.parse(messagesData) : [];
    const facultyMessages = allMessages.filter((m: Message) => 
      m.toId === facultyId || m.fromId === facultyId
    );
    setMessages(facultyMessages);

    // Load student progress
    const progressData = localStorage.getItem(STORAGE_KEYS.STUDENT_PROGRESS);
    const allProgress = progressData ? JSON.parse(progressData) : [];
    const relevantProgress = allProgress.filter((p: StudentProgress) => 
      faculty.assignedCourses.includes(p.courseId)
    );
    setStudentProgress(relevantProgress);
  };

  const handleMaterialUpload = () => {
    if (!materialForm.title || !materialForm.courseId || !materialForm.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    if (materialForm.type === 'zoom_link' && !materialForm.zoomLink) {
      toast({
        title: "Error",
        description: "Please provide a Zoom link",
      });
      return;
    }

    if ((materialForm.type === 'notes' || materialForm.type === 'video') && !materialForm.fileUrl) {
      toast({
        title: "Error",
        description: "Please provide a file URL",
      });
      return;
    }

    const newMaterial: CourseMaterial = {
      id: `mat_${Date.now()}`,
      courseId: materialForm.courseId,
      facultyId: currentFaculty!.id,
      title: materialForm.title,
      type: materialForm.type,
      description: materialForm.description,
      uploadedAt: new Date().toISOString(),
      ...(materialForm.type === 'zoom_link' ? { zoomLink: materialForm.zoomLink } : { fileUrl: materialForm.fileUrl })
    };

    const existingMaterials = localStorage.getItem(STORAGE_KEYS.COURSE_MATERIALS);
    const allMaterials = existingMaterials ? JSON.parse(existingMaterials) : [];
    allMaterials.push(newMaterial);
    localStorage.setItem(STORAGE_KEYS.COURSE_MATERIALS, JSON.stringify(allMaterials));

    setMaterials([...materials, newMaterial]);
    setMaterialForm({
      title: '',
      type: 'notes',
      courseId: '',
      description: '',
      fileUrl: '',
      zoomLink: ''
    });

    toast({
      title: "Success",
      description: "Material uploaded successfully",
    });
  };

  const handleSubmissionGrade = (submissionId: string, grade: number, feedback: string, status: 'approved' | 'rejected' | 'needs_revision') => {
    const submissionsData = localStorage.getItem(STORAGE_KEYS.TASK_SUBMISSIONS);
    const allSubmissions = submissionsData ? JSON.parse(submissionsData) : [];
    
    const updatedSubmissions = allSubmissions.map((s: TaskSubmission) => {
      if (s.id === submissionId) {
        return {
          ...s,
          status,
          grade,
          feedback,
          gradedAt: new Date().toISOString(),
          gradedBy: currentFaculty!.id
        };
      }
      return s;
    });

    localStorage.setItem(STORAGE_KEYS.TASK_SUBMISSIONS, JSON.stringify(updatedSubmissions));
    setSubmissions(submissions.map(s => 
      s.id === submissionId 
        ? { ...s, status, grade, feedback, gradedAt: new Date().toISOString(), gradedBy: currentFaculty!.id }
        : s
    ));

    toast({
      title: "Success",
      description: "Submission graded successfully",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    navigate('/login');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'needs_revision': return 'secondary';
      default: return 'outline';
    }
  };

  const unreadMessages = messages.filter(m => m.toId === currentFaculty?.id && !m.readAt).length;
  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;

  if (!currentFaculty) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AJC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Faculty Portal</h1>
                <p className="text-sm text-muted-foreground">Welcome, {currentFaculty.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {unreadMessages} Messages
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="submissions">
              Submissions
              {pendingSubmissions > 0 && (
                <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                  {pendingSubmissions}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="messages">
              Messages
              {unreadMessages > 0 && (
                <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                  {unreadMessages}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assigned Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{assignedCourses.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {assignedCourses.reduce((total, course) => total + course.students, 0)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingSubmissions}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{unreadMessages}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>Courses you are teaching</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignedCourses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">{course.students} students</p>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest submissions and messages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submissions.slice(0, 3).map((submission) => (
                      <div key={submission.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{submission.studentName}</p>
                          <p className="text-xs text-muted-foreground">Submitted task</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(submission.status)}>
                          {submission.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Course Materials</h2>
                <p className="text-muted-foreground">Upload and manage course materials</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Upload Course Material</DialogTitle>
                    <DialogDescription>
                      Add notes, videos, or Zoom links for your students
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={materialForm.title}
                        onChange={(e) => setMaterialForm({...materialForm, title: e.target.value})}
                        placeholder="Enter material title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="course">Course</Label>
                      <Select value={materialForm.courseId} onValueChange={(value) => setMaterialForm({...materialForm, courseId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {assignedCourses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={materialForm.type} onValueChange={(value: 'notes' | 'video' | 'zoom_link') => setMaterialForm({...materialForm, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="notes">Notes/Documents</SelectItem>
                          <SelectItem value="video">Video Lecture</SelectItem>
                          <SelectItem value="zoom_link">Zoom Link</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {materialForm.type === 'zoom_link' ? (
                      <div>
                        <Label htmlFor="zoomLink">Zoom Link</Label>
                        <Input
                          id="zoomLink"
                          value={materialForm.zoomLink}
                          onChange={(e) => setMaterialForm({...materialForm, zoomLink: e.target.value})}
                          placeholder="https://zoom.us/j/..."
                        />
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="fileUrl">File URL</Label>
                        <Input
                          id="fileUrl"
                          value={materialForm.fileUrl}
                          onChange={(e) => setMaterialForm({...materialForm, fileUrl: e.target.value})}
                          placeholder="Enter file URL"
                        />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={materialForm.description}
                        onChange={(e) => setMaterialForm({...materialForm, description: e.target.value})}
                        placeholder="Describe the material"
                      />
                    </div>
                    <Button onClick={handleMaterialUpload} className="w-full">
                      Upload Material
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {materials.map((material) => {
                const course = assignedCourses.find(c => c.id === material.courseId);
                return (
                  <Card key={material.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {material.type === 'notes' && <FileText className="h-5 w-5 text-primary" />}
                            {material.type === 'video' && <Video className="h-5 w-5 text-primary" />}
                            {material.type === 'zoom_link' && <Link className="h-5 w-5 text-primary" />}
                          </div>
                          <div>
                            <h3 className="font-semibold">{material.title}</h3>
                            <p className="text-sm text-muted-foreground">{course?.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {material.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Student Submissions</h2>
              <p className="text-muted-foreground">Review and grade student work</p>
            </div>

            <div className="grid gap-4">
              {submissions.map((submission) => {
                const course = assignedCourses.find(c => c.id === submission.courseId);
                return (
                  <Card key={submission.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{submission.studentName}</h3>
                          <p className="text-sm text-muted-foreground">{course?.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(submission.status)}>
                          {submission.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm mb-4">{submission.submissionText}</p>
                      
                      {submission.fileUrl && (
                        <div className="mb-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View File
                          </Button>
                        </div>
                      )}

                      {submission.status === 'pending' && (
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Grade
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Grade Submission</DialogTitle>
                                <DialogDescription>
                                  Provide grade and feedback for {submission.studentName}
                                </DialogDescription>
                              </DialogHeader>
                              <GradingForm 
                                submission={submission}
                                onSubmit={(grade, feedback, status) => 
                                  handleSubmissionGrade(submission.id, grade, feedback, status)
                                }
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}

                      {submission.status !== 'pending' && (
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Grade: {submission.grade}/100</span>
                            <span className="text-sm text-muted-foreground">
                              {submission.gradedAt && new Date(submission.gradedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{submission.feedback}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Student Progress</h2>
              <p className="text-muted-foreground">Track student performance across your courses</p>
            </div>

            <div className="grid gap-4">
              {studentProgress.map((progress) => {
                const course = assignedCourses.find(c => c.id === progress.courseId);
                return (
                  <Card key={`${progress.userId}-${progress.courseId}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Student ID: {progress.userId}</h3>
                          <p className="text-sm text-muted-foreground">{course?.title}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{progress.progress}%</div>
                          <div className="text-sm text-muted-foreground">Progress</div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold">{progress.completedLessons}</div>
                          <div className="text-xs text-muted-foreground">Lessons</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">#{progress.rank}</div>
                          <div className="text-xs text-muted-foreground">Rank</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">
                            {progress.mcqScores.length > 0 
                              ? Math.round(progress.mcqScores.reduce((sum, score) => sum + score.score, 0) / progress.mcqScores.length)
                              : 'N/A'
                            }
                          </div>
                          <div className="text-xs text-muted-foreground">Avg MCQ</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Messages</h2>
              <p className="text-muted-foreground">Communicate with your students</p>
            </div>

            <div className="grid gap-4">
              {messages.map((message) => (
                <Card key={message.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{message.subject}</h3>
                        <p className="text-sm text-muted-foreground">
                          {message.fromRole === 'student' ? `From: ${message.fromName}` : `To: ${message.toName}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(message.sentAt).toLocaleDateString()} at {new Date(message.sentAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {!message.readAt && message.toId === currentFaculty.id && (
                        <Badge variant="destructive">Unread</Badge>
                      )}
                    </div>
                    <p className="text-sm">{message.content}</p>
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

// Grading Form Component
const GradingForm = ({ 
  submission, 
  onSubmit 
}: { 
  submission: TaskSubmission; 
  onSubmit: (grade: number, feedback: string, status: 'approved' | 'rejected' | 'needs_revision') => void;
}) => {
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<'approved' | 'rejected' | 'needs_revision'>('approved');

  const handleSubmit = () => {
    if (!feedback.trim()) {
      alert('Please provide feedback');
      return;
    }
    onSubmit(grade, feedback, status);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="grade">Grade (0-100)</Label>
        <Input
          id="grade"
          type="number"
          min="0"
          max="100"
          value={grade}
          onChange={(e) => setGrade(parseInt(e.target.value) || 0)}
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value: 'approved' | 'rejected' | 'needs_revision') => setStatus(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="needs_revision">Needs Revision</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="feedback">Feedback</Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Provide detailed feedback for the student"
          rows={4}
        />
      </div>
      <Button onClick={handleSubmit} className="w-full">
        Submit Grade
      </Button>
    </div>
  );
};

export default FacultyDashboard;