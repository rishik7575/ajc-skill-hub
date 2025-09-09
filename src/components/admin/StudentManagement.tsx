import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  Download,
  Eye,
  Award,
  Mail,
  User
} from 'lucide-react';
import { getUserData, getCourseData, Course } from '@/lib/mockData';
import { StudentDataService } from '@/lib/studentData';
import { formatDistanceToNow } from 'date-fns';

interface StudentData {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  joinDate: string;
  totalProgress: number;
  certificatesEarned: number;
  lastActivity: string;
  status: string;
}

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadStudents = useCallback(() => {
    setLoading(true);
    try {
      const users = getUserData();

      const studentUsers = users.filter(user => user.role === 'student');

      const studentsData = studentUsers.map(user => {
        const progress = StudentDataService.getStudentProgress(user.id);
        const totalProgress = progress.length > 0
          ? progress.reduce((sum, p) => sum + p.progress, 0) / progress.length
          : 0;

        const certificatesEarned = progress.filter(p => p.certificate).length;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          enrolledCourses: user.enrolledCourses || [], // Use actual enrolled courses array
          totalProgress: Math.round(totalProgress),
          certificatesEarned,
          joinDate: user.createdAt ?? new Date().toISOString().split('T')[0], // Use createdAt as joinDate with fallback
          lastActivity: new Date().toISOString(), // Full ISO string for proper date parsing
          status: totalProgress > 80 ? 'active' : totalProgress > 0 ? 'in-progress' : 'inactive'
        };
      });

      setStudents(studentsData);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load student data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // Also load course data for mapping IDs to titles
    setCourses(getCourseData());
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    // Filter students based on search term
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students, searchTerm]);



  const exportStudentData = () => {
    // Mock export functionality
    toast({
      title: "Export Started",
      description: "Student data is being exported to CSV.",
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };



  const getCourseTitleById = (courseId: string): string => {
    return courses.find(c => c.id === courseId)?.title || courseId;
  };

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
            <User className="h-5 w-5" />
            Student Management
          </CardTitle>
          <CardDescription>
            Manage student enrollments, track progress, and view detailed analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportStudentData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Students Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Enrolled Courses</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Certificates</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {student.enrolledCourses.length} course{student.enrolledCourses.length !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={student.totalProgress} className="w-16" />
                        <span className={`text-sm font-medium ${getProgressColor(student.totalProgress)}`}>
                          {student.totalProgress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.certificatesEarned > 0 ? 'default' : 'secondary'}>
                        <Award className="h-3 w-3 mr-1" />
                        {student.certificatesEarned}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {(() => {
                          try {
                            const joinDate = new Date(student.joinDate);
                            if (isNaN(joinDate.getTime())) {
                              return 'Unknown';
                            }
                            return formatDistanceToNow(joinDate, { addSuffix: true });
                          } catch {
                            return 'Unknown';
                          }
                        })()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Student Details</DialogTitle>
                            <DialogDescription>
                              Detailed information about {student.name}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedStudent && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Name</label>
                                  <p className="text-sm text-muted-foreground">{selectedStudent.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Join Date</label>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(selectedStudent.joinDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Overall Progress</label>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Progress value={selectedStudent.totalProgress} className="flex-1" />
                                    <span className="text-sm font-medium">{selectedStudent.totalProgress}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium mb-2 block">Enrolled Courses</label>
                                <div className="space-y-2">
                                  {selectedStudent.enrolledCourses.length > 0 ? (
                                    selectedStudent.enrolledCourses.map((courseId, index) => (
                                      <Badge key={index} variant="outline">
                                        {getCourseTitleById(courseId)}
                                      </Badge>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No courses enrolled</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Email
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Award className="h-4 w-4 mr-2" />
                                  Generate Certificate
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No students found matching your search.' : 'No students enrolled yet.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
