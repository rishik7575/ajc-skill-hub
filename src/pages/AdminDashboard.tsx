import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { StudentManagement } from "@/components/admin/StudentManagement";
import { FeedbackManagement } from "@/components/admin/FeedbackManagement";
import { 
  Users, 
  BookOpen, 
  Award, 
  CreditCard, 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut,
  UserCheck,
  TrendingUp,
  FileText
} from "lucide-react";
import { AuthService } from "@/lib/auth";
import { getCourseData, saveCourseData, getFacultyData, saveFacultyData, Course, FacultyMember } from "@/lib/mockData";

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);

  const [students] = useState([
    { id: 1, name: "Rahul Verma", email: "rahul@example.com", course: "Full Stack Development", progress: 75, certificate: "Pending" },
    { id: 2, name: "Anita Devi", email: "anita@example.com", course: "Power BI", progress: 90, certificate: "Gold" },
    { id: 3, name: "Vikash Gupta", email: "vikash@example.com", course: "Frontend Development", progress: 60, certificate: "Silver" },
    { id: 4, name: "Riya Sharma", email: "riya@example.com", course: "Flutter Development", progress: 85, certificate: "Pending" }
  ]);

  const [newCourse, setNewCourse] = useState({ title: "", price: "", description: "" });
  const [newFaculty, setNewFaculty] = useState({ name: "", email: "", course: "" });

  useEffect(() => {
    // Load data from localStorage
    setCourses(getCourseData());
    setFaculty(getFacultyData());
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourse.title && newCourse.price) {
      const course: Course = {
        id: `course_${Date.now()}`,
        title: newCourse.title,
        description: newCourse.description || "New course description",
        price: parseInt(newCourse.price),
        duration: "8 weeks",
        students: 0,
        rating: 4.5,
        status: "Active",
        faculty: "Unassigned",
        icon: "📚",
        totalLessons: 10,
        syllabus: ["Introduction", "Basics", "Advanced Topics"]
      };
      const updatedCourses = [...courses, course];
      setCourses(updatedCourses);
      saveCourseData(updatedCourses);
      setNewCourse({ title: "", price: "", description: "" });
      toast({
        title: "Course Added",
        description: `${newCourse.title} has been added successfully.`,
      });
    }
  };

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFaculty.name && newFaculty.email && newFaculty.course) {
      const facultyMember: FacultyMember = {
        id: `faculty_${Date.now()}`,
        name: newFaculty.name,
        email: newFaculty.email,
        course: newFaculty.course,
        status: "Active",
        expertise: ["Teaching", "Industry Experience"],
        experience: "3+ years",
        bio: "Experienced instructor with industry expertise."
      };
      const updatedFaculty = [...faculty, facultyMember];
      setFaculty(updatedFaculty);
      saveFacultyData(updatedFaculty);
      setNewFaculty({ name: "", email: "", course: "" });
      toast({
        title: "Faculty Added",
        description: `${newFaculty.name} has been added successfully.`,
      });
    }
  };

  const deleteCourse = (id: string) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
    saveCourseData(updatedCourses);
    toast({
      title: "Course Deleted",
      description: "Course has been removed successfully.",
    });
  };

  const deleteFaculty = (id: string) => {
    const updatedFaculty = faculty.filter(member => member.id !== id);
    setFaculty(updatedFaculty);
    saveFacultyData(updatedFaculty);
    toast({
      title: "Faculty Removed",
      description: "Faculty member has been removed successfully.",
    });
  };

  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
  const totalRevenue = courses.reduce((sum, course) => sum + (course.students * course.price), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AJC</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, Rishik</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline">View Website</Button>
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
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">Available programs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{faculty.length}</div>
              <p className="text-xs text-muted-foreground">Active instructors</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <StudentManagement />
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Course Management</h2>
            </div>
            
            {/* Add Course Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Course</CardTitle>
                <CardDescription>Create a new course for students to enroll</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="courseTitle">Course Title</Label>
                    <Input
                      id="courseTitle"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                      placeholder="e.g., React Development"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="coursePrice">Price (₹)</Label>
                    <Input
                      id="coursePrice"
                      type="number"
                      value={newCourse.price}
                      onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
                      placeholder="4999"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Course
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Courses List */}
            <div className="grid gap-4">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.students} students enrolled</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary">₹{course.price}</Badge>
                      <Badge variant="outline">{course.status}</Badge>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteCourse(course.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Faculty Tab */}
          <TabsContent value="faculty" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Faculty Management</h2>
            </div>

            {/* Add Faculty Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Faculty</CardTitle>
                <CardDescription>Assign faculty members to courses</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddFaculty} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="facultyName">Name</Label>
                    <Input
                      id="facultyName"
                      value={newFaculty.name}
                      onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                      placeholder="Faculty name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="facultyEmail">Email</Label>
                    <Input
                      id="facultyEmail"
                      type="email"
                      value={newFaculty.email}
                      onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})}
                      placeholder="email@ajc.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="facultyCourse">Course</Label>
                    <Input
                      id="facultyCourse"
                      value={newFaculty.course}
                      onChange={(e) => setNewFaculty({...newFaculty, course: e.target.value})}
                      placeholder="Course name"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Faculty
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Faculty List */}
            <div className="grid gap-4">
              {faculty.map((member) => (
                <Card key={member.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{member.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <p className="text-sm text-muted-foreground">Teaching: {member.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{member.status}</Badge>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteFaculty(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Student Management</h2>
            </div>

            <div className="grid gap-4">
              {students.map((student) => (
                <Card key={student.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{student.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <p className="text-sm text-muted-foreground">Course: {student.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{student.progress}% Complete</div>
                        <div className="w-24 bg-muted rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all" 
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <Badge 
                        variant={student.certificate === "Gold" ? "default" : 
                                student.certificate === "Silver" ? "secondary" : "outline"}
                      >
                        {student.certificate}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Certificate Management</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Gold Certificates</CardTitle>
                  <CardDescription>Outstanding Performance (90%+ score)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">12</div>
                  <p className="text-sm text-muted-foreground">Issued this month</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Silver Certificates</CardTitle>
                  <CardDescription>Good Performance (70-89% score)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-600 mb-2">8</div>
                  <p className="text-sm text-muted-foreground">Issued this month</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Participation</CardTitle>
                  <CardDescription>Course Completion (50-69% score)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
                  <p className="text-sm text-muted-foreground">Issued this month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Certificates */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Certificate Approvals</CardTitle>
                <CardDescription>Students pending certificate approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.filter(s => s.certificate === "Pending").map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{student.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">{student.course} - {student.progress}% complete</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-yellow-500 hover:bg-yellow-600"
                          onClick={() => toast({ title: "Gold Certificate Approved", description: `${student.name} has been awarded a Gold certificate.` })}
                        >
                          Gold
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => toast({ title: "Silver Certificate Approved", description: `${student.name} has been awarded a Silver certificate.` })}
                        >
                          Silver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toast({ title: "Participation Certificate Approved", description: `${student.name} has been awarded a Participation certificate.` })}
                        >
                          Participation
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <FeedbackManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;