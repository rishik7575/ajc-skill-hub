import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  Key, 
  Users, 
  BookOpen,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  STORAGE_KEYS, 
  FacultyMember, 
  Course, 
  Message,
  getCourseData,
  getFacultyData 
} from "@/lib/mockData";

const FacultyManagement = () => {
  const { toast } = useToast();
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  // Form state for creating/editing faculty
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    email: '',
    password: '',
    course: '',
    expertise: '',
    experience: '',
    bio: '',
    assignedCourses: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const facultyData = getFacultyData();
    const courseData = getCourseData();
    const messagesData = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const allMessages = messagesData ? JSON.parse(messagesData) : [];

    setFaculty(facultyData);
    setCourses(courseData);
    setMessages(allMessages);
  };

  const handleCreateFaculty = () => {
    if (!facultyForm.name || !facultyForm.email || !facultyForm.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    // Check if email already exists
    if (faculty.find(f => f.email === facultyForm.email)) {
      toast({
        title: "Error",
        description: "Faculty with this email already exists",
      });
      return;
    }

    const newFaculty: FacultyMember = {
      id: `faculty_${Date.now()}`,
      name: facultyForm.name,
      email: facultyForm.email,
      password: facultyForm.password,
      course: facultyForm.course,
      status: 'Active',
      expertise: facultyForm.expertise.split(',').map(s => s.trim()),
      experience: facultyForm.experience,
      bio: facultyForm.bio,
      assignedCourses: facultyForm.assignedCourses
    };

    const updatedFaculty = [...faculty, newFaculty];
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(updatedFaculty));
    setFaculty(updatedFaculty);

    // Reset form
    setFacultyForm({
      name: '',
      email: '',
      password: '',
      course: '',
      expertise: '',
      experience: '',
      bio: '',
      assignedCourses: []
    });

    setIsCreateDialogOpen(false);
    toast({
      title: "Success",
      description: "Faculty member created successfully",
    });
  };

  const handleEditFaculty = () => {
    if (!selectedFaculty || !facultyForm.name || !facultyForm.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    const updatedFaculty = faculty.map(f => 
      f.id === selectedFaculty.id 
        ? {
            ...f,
            name: facultyForm.name,
            email: facultyForm.email,
            course: facultyForm.course,
            expertise: facultyForm.expertise.split(',').map(s => s.trim()),
            experience: facultyForm.experience,
            bio: facultyForm.bio,
            assignedCourses: facultyForm.assignedCourses
          }
        : f
    );

    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(updatedFaculty));
    setFaculty(updatedFaculty);
    setIsEditDialogOpen(false);
    setSelectedFaculty(null);

    toast({
      title: "Success",
      description: "Faculty member updated successfully",
    });
  };

  const handleResetPassword = (newPassword: string) => {
    if (!selectedFaculty || !newPassword) {
      toast({
        title: "Error",
        description: "Please provide a new password",
      });
      return;
    }

    const updatedFaculty = faculty.map(f => 
      f.id === selectedFaculty.id ? { ...f, password: newPassword } : f
    );

    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(updatedFaculty));
    setFaculty(updatedFaculty);
    setIsResetPasswordOpen(false);
    setSelectedFaculty(null);

    toast({
      title: "Success",
      description: "Password reset successfully",
    });
  };

  const handleDeleteFaculty = (facultyId: string) => {
    const updatedFaculty = faculty.filter(f => f.id !== facultyId);
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(updatedFaculty));
    setFaculty(updatedFaculty);

    toast({
      title: "Success",
      description: "Faculty member deleted successfully",
    });
  };

  const openEditDialog = (facultyMember: FacultyMember) => {
    setSelectedFaculty(facultyMember);
    setFacultyForm({
      name: facultyMember.name,
      email: facultyMember.email,
      password: '',
      course: facultyMember.course,
      expertise: facultyMember.expertise.join(', '),
      experience: facultyMember.experience,
      bio: facultyMember.bio,
      assignedCourses: facultyMember.assignedCourses
    });
    setIsEditDialogOpen(true);
  };

  const openResetPasswordDialog = (facultyMember: FacultyMember) => {
    setSelectedFaculty(facultyMember);
    setIsResetPasswordOpen(true);
  };

  const handleCourseAssignment = (facultyId: string, courseIds: string[]) => {
    const updatedFaculty = faculty.map(f => 
      f.id === facultyId ? { ...f, assignedCourses: courseIds } : f
    );
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(updatedFaculty));
    setFaculty(updatedFaculty);
  };

  // Get faculty-student messages for overview
  const facultyMessages = messages.filter(m => 
    m.fromRole === 'faculty' || m.toRole === 'faculty'
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Faculty Management</h2>
          <p className="text-muted-foreground">Manage faculty members and their course assignments</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Faculty Member</DialogTitle>
              <DialogDescription>
                Add a new faculty member to the system
              </DialogDescription>
            </DialogHeader>
            <FacultyForm 
              form={facultyForm}
              setForm={setFacultyForm}
              courses={courses}
              onSubmit={handleCreateFaculty}
              submitLabel="Create Faculty"
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="faculty" className="space-y-4">
        <TabsList>
          <TabsTrigger value="faculty">Faculty List</TabsTrigger>
          <TabsTrigger value="assignments">Course Assignments</TabsTrigger>
          <TabsTrigger value="messages">Message Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="faculty" className="space-y-4">
          <div className="grid gap-4">
            {faculty.map((facultyMember) => (
              <Card key={facultyMember.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {facultyMember.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{facultyMember.name}</h3>
                        <p className="text-sm text-muted-foreground">{facultyMember.email}</p>
                        <p className="text-sm text-muted-foreground mt-1">{facultyMember.experience} experience</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {facultyMember.expertise.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2">
                          <span className="text-sm font-medium">Assigned Courses: </span>
                          {facultyMember.assignedCourses.map(courseId => {
                            const course = courses.find(c => c.id === courseId);
                            return course ? (
                              <Badge key={courseId} variant="outline" className="ml-1">
                                {course.title}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={facultyMember.status === 'Active' ? 'default' : 'secondary'}>
                        {facultyMember.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(facultyMember)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openResetPasswordDialog(facultyMember)}>
                          <Key className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteFaculty(facultyMember.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Assignments</CardTitle>
              <CardDescription>Manage which courses each faculty member teaches</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty Member</TableHead>
                    <TableHead>Assigned Courses</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faculty.map((facultyMember) => (
                    <TableRow key={facultyMember.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{facultyMember.name}</div>
                          <div className="text-sm text-muted-foreground">{facultyMember.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {facultyMember.assignedCourses.map(courseId => {
                            const course = courses.find(c => c.id === courseId);
                            return course ? (
                              <Badge key={courseId} variant="outline">
                                {course.title}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <CourseAssignmentDialog
                          faculty={facultyMember}
                          courses={courses}
                          onAssign={(courseIds) => handleCourseAssignment(facultyMember.id, courseIds)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{facultyMessages.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {facultyMessages.filter(m => !m.readAt).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(facultyMessages.map(m => `${m.fromId}-${m.toId}`)).size}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Overview of faculty-student communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facultyMessages.slice(0, 5).map((message) => {
                  const faculty = faculty.find(f => f.id === message.fromId || f.id === message.toId);
                  return (
                    <div key={message.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <Eye className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{message.subject}</span>
                          {!message.readAt && <Badge variant="destructive" className="text-xs">Unread</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {message.fromRole === 'faculty' ? 'Faculty' : 'Student'} → {message.toRole === 'faculty' ? 'Faculty' : 'Student'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(message.sentAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Faculty Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Faculty Member</DialogTitle>
            <DialogDescription>
              Update faculty member information
            </DialogDescription>
          </DialogHeader>
          <FacultyForm 
            form={facultyForm}
            setForm={setFacultyForm}
            courses={courses}
            onSubmit={handleEditFaculty}
            submitLabel="Update Faculty"
            isEdit={true}
          />
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for {selectedFaculty?.name}
            </DialogDescription>
          </DialogHeader>
          <PasswordResetForm 
            onSubmit={handleResetPassword}
            onCancel={() => setIsResetPasswordOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Faculty Form Component
const FacultyForm = ({ 
  form, 
  setForm, 
  courses, 
  onSubmit, 
  submitLabel,
  isEdit = false 
}: {
  form: any;
  setForm: (form: any) => void;
  courses: Course[];
  onSubmit: () => void;
  submitLabel: string;
  isEdit?: boolean;
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            placeholder="Faculty name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            placeholder="faculty@ajc.com"
          />
        </div>
      </div>
      
      {!isEdit && (
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            placeholder="Enter password"
          />
        </div>
      )}

      <div>
        <Label htmlFor="experience">Experience</Label>
        <Input
          id="experience"
          value={form.experience}
          onChange={(e) => setForm({...form, experience: e.target.value})}
          placeholder="e.g., 5+ years"
        />
      </div>

      <div>
        <Label htmlFor="expertise">Expertise (comma-separated)</Label>
        <Input
          id="expertise"
          value={form.expertise}
          onChange={(e) => setForm({...form, expertise: e.target.value})}
          placeholder="React, Node.js, JavaScript"
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={form.bio}
          onChange={(e) => setForm({...form, bio: e.target.value})}
          placeholder="Faculty bio"
          rows={3}
        />
      </div>

      <div>
        <Label>Assigned Courses</Label>
        <div className="space-y-2">
          {courses.map((course) => (
            <label key={course.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.assignedCourses.includes(course.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setForm({...form, assignedCourses: [...form.assignedCourses, course.id]});
                  } else {
                    setForm({...form, assignedCourses: form.assignedCourses.filter((id: string) => id !== course.id)});
                  }
                }}
              />
              <span className="text-sm">{course.title}</span>
            </label>
          ))}
        </div>
      </div>

      <Button onClick={onSubmit} className="w-full">
        {submitLabel}
      </Button>
    </div>
  );
};

// Course Assignment Dialog Component
const CourseAssignmentDialog = ({ 
  faculty, 
  courses, 
  onAssign 
}: {
  faculty: FacultyMember;
  courses: Course[];
  onAssign: (courseIds: string[]) => void;
}) => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>(faculty.assignedCourses);
  const [isOpen, setIsOpen] = useState(false);

  const handleAssign = () => {
    onAssign(selectedCourses);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BookOpen className="h-3 w-3 mr-1" />
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Courses</DialogTitle>
          <DialogDescription>
            Select courses to assign to {faculty.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {courses.map((course) => (
            <label key={course.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCourses.includes(course.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCourses([...selectedCourses, course.id]);
                  } else {
                    setSelectedCourses(selectedCourses.filter(id => id !== course.id));
                  }
                }}
              />
              <span>{course.title}</span>
            </label>
          ))}
        </div>
        <Button onClick={handleAssign} className="w-full">
          Update Assignments
        </Button>
      </DialogContent>
    </Dialog>
  );
};

// Password Reset Form Component
const PasswordResetForm = ({ 
  onSubmit, 
  onCancel 
}: {
  onSubmit: (password: string) => void;
  onCancel: () => void;
}) => {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = () => {
    if (newPassword.trim()) {
      onSubmit(newPassword);
      setNewPassword('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="flex-1">
          Reset Password
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default FacultyManagement;