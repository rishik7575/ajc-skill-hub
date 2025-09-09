import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FeedbackForm } from "@/components/FeedbackForm";
import { CourseReviews } from "@/components/CourseReviews";
import { StarDisplay } from "@/components/ui/star-rating";
import { FeedbackService } from "@/lib/feedbackService";
import { useAuth, AuthService } from "@/lib/auth";
import { getCourseData, Course } from "@/lib/mockData";
import { 
  ArrowLeft, 
  Play, 

  Clock, 
  Star, 
  CheckCircle,
  Target,
  BookOpen,
  Award,
  CreditCard
} from "lucide-react";

const CourseDetails = () => {
  const { courseId } = useParams();
  const { toast } = useToast();
  const { user: _user } = useAuth();
  const navigate = useNavigate();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [courseRating, setCourseRating] = useState<any>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to convert courseId parameter to actual course ID
  const getCourseIdFromParam = (param: string): string => {
    // Handle both formats: course IDs and slugified titles
    const courseMap: { [key: string]: string } = {
      'powerbi': 'powerbi',
      'power-bi': 'powerbi',
      'fullstack': 'fullstack',
      'full-stack-development': 'fullstack',
      'frontend': 'frontend',
      'frontend-development': 'frontend',
      'backend': 'backend',
      'backend-development': 'backend',
      'database': 'database',
      'database-management': 'database',
      'flutter': 'flutter',
      'flutter-development': 'flutter'
    };

    return courseMap[param.toLowerCase()] || param;
  };

  useEffect(() => {
    if (courseId) {
      setLoading(true);
      const actualCourseId = getCourseIdFromParam(courseId);
      const courses = getCourseData();
      const foundCourse = courses.find(c => c.id === actualCourseId);

      if (foundCourse) {
        setCourse(foundCourse);
        const rating = FeedbackService.getCourseRating(actualCourseId);
        setCourseRating(rating);
      } else {
        // Course not found, redirect to 404 or courses page
        navigate('/courses');
        return;
      }
      setLoading(false);
    }
  }, [courseId, navigate]);

  // Get detailed course information based on course data
  const getDetailedCourseInfo = (courseData: Course) => {
    const courseDetails: { [key: string]: any } = {
      powerbi: {
        subtitle: "Master Data Visualization and Business Intelligence",
        description: "Comprehensive Power BI training covering data modeling, DAX functions, and advanced visualizations. Build professional dashboards and reports.",
        price: "₹4,999",
        originalPrice: "₹7,999",
        level: "Beginner to Intermediate",
        language: "English/Hindi",
        certificate: "Gold/Silver/Participation",
        instructor: {
          name: "Dr. Amit Sharma",
          title: "Senior Data Analyst",
          experience: "8+ years",
          image: "AS"
        },
        features: [
          "16 recorded video lessons",
          "8 live Zoom sessions",
          "Hands-on projects",
          "Real business datasets",
          "Certificate of completion",
          "Career guidance",
          "Lifetime access to materials",
          "Community support"
        ],
        curriculum: [
          {
            week: 1,
            title: "Introduction to Power BI",
            lessons: ["Power BI Desktop Overview", "Data Sources", "Basic Visualizations", "Publishing Reports"]
          },
          {
            week: 2,
            title: "Data Modeling",
            lessons: ["Data Relationships", "Star Schema", "Data Transformation", "Power Query"]
          },
          {
            week: 3,
            title: "DAX Functions",
            lessons: ["Basic DAX", "Calculated Columns", "Measures", "Time Intelligence"]
          },
          {
            week: 4,
            title: "Advanced Visualizations",
            lessons: ["Custom Visuals", "Interactive Dashboards", "Drill-through", "Bookmarks"]
          }
        ],
        projects: [
          "Sales Dashboard",
          "Financial Report",
          "HR Analytics Dashboard",
          "Customer Analysis Report"
        ],
        requirements: [
          "Basic Excel knowledge",
          "Internet connection",
          "Windows PC/Laptop",
          "Willingness to learn"
        ],
        outcomes: [
          "Create professional dashboards",
          "Master DAX functions",
          "Build data models",
          "Generate business insights",
          "Industry-ready Power BI skills"
        ]
      },
      fullstack: {
        subtitle: "Master Modern Web Development from Frontend to Backend",
        description: "Comprehensive internship program covering React, Node.js, databases, and deployment. Build real-world projects and gain industry-ready skills.",
        price: "₹7,999",
        originalPrice: "₹12,999",
        level: "Beginner to Advanced",
        language: "English/Hindi",
        certificate: "Gold/Silver/Participation",
        instructor: {
          name: "Priya Singh",
          title: "Senior Full Stack Developer",
          experience: "6+ years",
          image: "PS"
        },
        features: [
          "24 recorded video lessons",
          "12 live Zoom sessions",
          "Daily coding challenges",
          "Real-world projects",
          "Certificate of completion",
          "Career guidance",
          "Lifetime access to materials",
          "Community support"
        ],
        curriculum: [
          {
            week: 1,
            title: "HTML & CSS Fundamentals",
            lessons: ["HTML5 Semantic Elements", "CSS Grid & Flexbox", "Responsive Design", "CSS Animations"]
          },
          {
            week: 2,
            title: "JavaScript Essentials",
            lessons: ["ES6+ Features", "DOM Manipulation", "Async Programming", "API Integration"]
          },
          {
            week: 3,
            title: "React Frontend",
            lessons: ["Components & JSX", "State Management", "React Hooks", "Context API"]
          },
          {
            week: 4,
            title: "Advanced React",
            lessons: ["React Router", "Performance Optimization", "Testing", "Deployment"]
          },
          {
            week: 5,
            title: "Node.js Backend",
            lessons: ["Express Server", "Middleware", "Authentication", "File Handling"]
          },
          {
            week: 6,
            title: "Database Integration",
            lessons: ["MongoDB Basics", "Mongoose ODM", "Database Design", "CRUD Operations"]
          }
        ],
        projects: [
          "Personal Portfolio Website",
          "E-commerce Frontend",
          "Blog Management System",
          "Social Media Dashboard",
          "Full Stack CRUD Application"
        ],
        requirements: [
          "Basic computer knowledge",
          "Internet connection",
          "Laptop/Desktop",
          "Willingness to learn"
        ],
        outcomes: [
          "Build complete web applications",
          "Understand modern development practices",
          "Deploy applications to production",
          "Work with APIs and databases",
          "Industry-ready portfolio"
        ]
      },
      frontend: {
        subtitle: "Master Modern Frontend Development with React and Next.js",
        description: "Comprehensive frontend development training covering React, Next.js, and modern UI/UX practices. Build responsive and interactive web applications.",
        price: "₹5,999",
        originalPrice: "₹9,999",
        level: "Beginner to Advanced",
        language: "English/Hindi",
        certificate: "Gold/Silver/Participation",
        instructor: {
          name: "Rohit Kumar",
          title: "Frontend Development Expert",
          experience: "5+ years",
          image: "RK"
        },
        features: [
          "20 recorded video lessons",
          "10 live Zoom sessions",
          "UI/UX design projects",
          "Responsive design challenges",
          "Certificate of completion",
          "Career guidance",
          "Lifetime access to materials",
          "Community support"
        ],
        curriculum: [
          {
            week: 1,
            title: "HTML5 & CSS3 Fundamentals",
            lessons: ["Semantic HTML", "CSS Grid & Flexbox", "CSS Animations", "Responsive Design"]
          },
          {
            week: 2,
            title: "JavaScript & ES6+",
            lessons: ["Modern JavaScript", "DOM Manipulation", "Async Programming", "Modules"]
          },
          {
            week: 3,
            title: "React.js Fundamentals",
            lessons: ["Components & JSX", "State & Props", "Event Handling", "Conditional Rendering"]
          },
          {
            week: 4,
            title: "Advanced React",
            lessons: ["Hooks", "Context API", "React Router", "Performance Optimization"]
          },
          {
            week: 5,
            title: "Next.js Framework",
            lessons: ["SSR & SSG", "API Routes", "Dynamic Routing", "Deployment"]
          }
        ],
        projects: [
          "Portfolio Website",
          "E-commerce Frontend",
          "Blog Application",
          "Dashboard Interface"
        ],
        requirements: [
          "Basic HTML/CSS knowledge",
          "Internet connection",
          "Code editor",
          "Willingness to learn"
        ],
        outcomes: [
          "Build modern web interfaces",
          "Master React ecosystem",
          "Create responsive designs",
          "Deploy web applications",
          "Frontend development expertise"
        ]
      },
      backend: {
        subtitle: "Master Backend Development with Node.js and Databases",
        description: "Comprehensive backend development training covering Node.js, Express, databases, and API development. Build scalable server-side applications.",
        price: "₹5,999",
        originalPrice: "₹9,999",
        level: "Intermediate to Advanced",
        language: "English/Hindi",
        certificate: "Gold/Silver/Participation",
        instructor: {
          name: "Sneha Patel",
          title: "Backend Development Expert",
          experience: "7+ years",
          image: "SP"
        },
        features: [
          "20 recorded video lessons",
          "10 live Zoom sessions",
          "API development projects",
          "Database design challenges",
          "Certificate of completion",
          "Career guidance",
          "Lifetime access to materials",
          "Community support"
        ],
        curriculum: [
          {
            week: 1,
            title: "Node.js Fundamentals",
            lessons: ["Node.js Basics", "NPM & Modules", "File System", "Event Loop"]
          },
          {
            week: 2,
            title: "Express.js Framework",
            lessons: ["Express Setup", "Routing", "Middleware", "Error Handling"]
          },
          {
            week: 3,
            title: "Database Integration",
            lessons: ["MongoDB Basics", "Mongoose ODM", "CRUD Operations", "Data Validation"]
          },
          {
            week: 4,
            title: "Authentication & Security",
            lessons: ["JWT Tokens", "Password Hashing", "Authorization", "Security Best Practices"]
          },
          {
            week: 5,
            title: "API Development",
            lessons: ["RESTful APIs", "API Documentation", "Testing", "Deployment"]
          }
        ],
        projects: [
          "REST API Server",
          "Authentication System",
          "Blog Backend",
          "E-commerce API"
        ],
        requirements: [
          "JavaScript knowledge",
          "Basic programming concepts",
          "Internet connection",
          "Code editor"
        ],
        outcomes: [
          "Build scalable APIs",
          "Master Node.js ecosystem",
          "Database management",
          "Server deployment",
          "Backend development expertise"
        ]
      },
      database: {
        subtitle: "Master Database Management and Optimization",
        description: "Comprehensive database training covering SQL, NoSQL, and database optimization techniques. Learn to design and manage efficient databases.",
        price: "₹4,499",
        originalPrice: "₹7,499",
        level: "Beginner to Intermediate",
        language: "English/Hindi",
        certificate: "Gold/Silver/Participation",
        instructor: {
          name: "Dr. Kiran Desai",
          title: "Database Management Expert",
          experience: "10+ years",
          image: "KD"
        },
        features: [
          "12 recorded video lessons",
          "6 live Zoom sessions",
          "Database design projects",
          "Performance optimization labs",
          "Certificate of completion",
          "Career guidance",
          "Lifetime access to materials",
          "Community support"
        ],
        curriculum: [
          {
            week: 1,
            title: "SQL Fundamentals",
            lessons: ["Basic Queries", "Joins", "Subqueries", "Functions"]
          },
          {
            week: 2,
            title: "Database Design",
            lessons: ["Normalization", "ER Diagrams", "Schema Design", "Constraints"]
          },
          {
            week: 3,
            title: "Advanced SQL",
            lessons: ["Stored Procedures", "Triggers", "Views", "Indexing"]
          },
          {
            week: 4,
            title: "NoSQL Databases",
            lessons: ["MongoDB", "Document Stores", "Key-Value Stores", "Graph Databases"]
          },
          {
            week: 5,
            title: "Performance Optimization",
            lessons: ["Query Optimization", "Indexing Strategies", "Monitoring", "Scaling"]
          }
        ],
        projects: [
          "E-commerce Database",
          "Analytics Dashboard",
          "User Management System",
          "Performance Optimization Case Study"
        ],
        requirements: [
          "Basic computer knowledge",
          "Logical thinking",
          "Internet connection",
          "Database software access"
        ],
        outcomes: [
          "Design efficient databases",
          "Write complex SQL queries",
          "Optimize database performance",
          "Work with NoSQL databases",
          "Database administration skills"
        ]
      },
      flutter: {
        subtitle: "Master Cross-Platform Mobile App Development",
        description: "Comprehensive Flutter development training for building beautiful, native mobile applications for iOS and Android from a single codebase.",
        price: "₹6,499",
        originalPrice: "₹10,999",
        level: "Beginner to Advanced",
        language: "English/Hindi",
        certificate: "Gold/Silver/Participation",
        instructor: {
          name: "Arjun Mehta",
          title: "Mobile Development Expert",
          experience: "6+ years",
          image: "AM"
        },
        features: [
          "18 recorded video lessons",
          "10 live Zoom sessions",
          "Mobile app projects",
          "App store deployment",
          "Certificate of completion",
          "Career guidance",
          "Lifetime access to materials",
          "Community support"
        ],
        curriculum: [
          {
            week: 1,
            title: "Dart Programming",
            lessons: ["Dart Basics", "OOP in Dart", "Async Programming", "Collections"]
          },
          {
            week: 2,
            title: "Flutter Fundamentals",
            lessons: ["Widgets", "Layouts", "Navigation", "State Management"]
          },
          {
            week: 3,
            title: "UI Development",
            lessons: ["Material Design", "Custom Widgets", "Animations", "Responsive Design"]
          },
          {
            week: 4,
            title: "Data & APIs",
            lessons: ["HTTP Requests", "JSON Parsing", "Local Storage", "State Management"]
          },
          {
            week: 5,
            title: "Advanced Features",
            lessons: ["Native Integration", "Push Notifications", "Testing", "App Deployment"]
          }
        ],
        projects: [
          "Todo App",
          "Weather App",
          "E-commerce App",
          "Social Media App"
        ],
        requirements: [
          "Basic programming knowledge",
          "Android Studio/VS Code",
          "Internet connection",
          "Mobile device for testing"
        ],
        outcomes: [
          "Build cross-platform apps",
          "Master Flutter framework",
          "Publish to app stores",
          "Mobile UI/UX design",
          "Mobile development expertise"
        ]
      }
    };

    // Add more course details for other courses
    const defaultDetails = {
      subtitle: `Master ${courseData.title}`,
      description: courseData.description,
      price: `₹${courseData.price.toLocaleString()}`,
      originalPrice: `₹${Math.round(courseData.price * 1.6).toLocaleString()}`,
      level: "Beginner to Advanced",
      language: "English/Hindi",
      certificate: "Gold/Silver/Participation",
      instructor: {
        name: courseData.faculty,
        title: `Senior ${courseData.title} Expert`,
        experience: "5+ years",
        image: courseData.faculty.split(' ').map(n => n[0]).join('')
      },
      features: [
        `${courseData.totalLessons} recorded video lessons`,
        `${Math.round(courseData.totalLessons / 2)} live Zoom sessions`,
        "Hands-on projects",
        "Real-world applications",
        "Certificate of completion",
        "Career guidance",
        "Lifetime access to materials",
        "Community support"
      ],
      curriculum: courseData.syllabus.map((topic, index) => ({
        week: index + 1,
        title: topic,
        lessons: [`${topic} Basics`, `${topic} Advanced`, `${topic} Projects`, `${topic} Best Practices`]
      })),
      projects: [
        `${courseData.title} Portfolio Project`,
        `${courseData.title} Dashboard`,
        `${courseData.title} Application`,
        `${courseData.title} Case Study`
      ],
      requirements: [
        "Basic computer knowledge",
        "Internet connection",
        "Laptop/Desktop",
        "Willingness to learn"
      ],
      outcomes: [
        `Master ${courseData.title}`,
        "Build real-world projects",
        "Industry-ready skills",
        "Professional portfolio",
        "Career advancement"
      ]
    };

    return courseDetails[courseData.id] || defaultDetails;
  };

  const handleEnroll = async () => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in courses.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!course) {
      toast({
        title: "Course Not Found",
        description: "Unable to enroll in this course.",
        variant: "destructive",
      });
      return;
    }

    setIsEnrolling(true);
    try {
      // Import StudentDataService dynamically to avoid circular imports
      const { StudentDataService } = await import("@/lib/studentData");

      // Enroll the user in the course
      StudentDataService.enrollInCourse(currentUser.user.id, course.id);

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Enrollment Successful!",
        description: "You have been enrolled in the course. Check your student dashboard to start learning.",
      });

      // Redirect to student dashboard after successful enrollment
      setTimeout(() => {
        navigate("/student");
      }, 2000);

    } catch (error) {
      console.error("Enrollment error:", error);
      toast({
        title: "Enrollment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  // Show loading state
  if (loading || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get detailed course information
  const courseDetails = getDetailedCourseInfo(course);
  const displayCourse = {
    ...course,
    ...courseDetails,
    students: `${course.students}+`,
    rating: course.rating.toString()
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AJC</span>
              </div>
              <span className="text-xl font-bold text-foreground">Course Details</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Badge variant="secondary" className="mb-2">Best Seller</Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4">{displayCourse.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{displayCourse.subtitle}</p>
              <p className="text-lg leading-relaxed mb-6">{displayCourse.description}</p>
            </div>

            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                {courseRating ? (
                  <StarDisplay
                    rating={courseRating.averageRating}
                    totalReviews={courseRating.totalReviews}
                    size="md"
                  />
                ) : (
                  <>
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{displayCourse.rating}</span>
                  </>
                )}
                <span className="text-muted-foreground">({displayCourse.students} students)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{displayCourse.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span>{displayCourse.level}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{displayCourse.instructor.image}</span>
              </div>
              <div>
                <h4 className="font-semibold">{displayCourse.instructor.name}</h4>
                <p className="text-sm text-muted-foreground">{displayCourse.instructor.title}</p>
              </div>
            </div>
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl">
              <CardHeader>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-primary">{displayCourse.price}</span>
                    <span className="text-lg text-muted-foreground line-through">{displayCourse.originalPrice}</span>
                  </div>
                  <Badge variant="destructive" className="mb-4">38% OFF</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleEnroll} className="w-full text-lg py-6" disabled={isEnrolling}>
                  {isEnrolling ? "Processing..." : "Enroll Now"}
                  <CreditCard className="ml-2 h-5 w-5" />
                </Button>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{displayCourse.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span className="font-medium">{displayCourse.language}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Certificate:</span>
                    <span className="font-medium">{displayCourse.certificate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Access:</span>
                    <span className="font-medium">Lifetime</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">This course includes:</h4>
                  <div className="space-y-2">
                    {displayCourse.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content */}
        <Tabs defaultValue="curriculum" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="feedback">Give Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
                <CardDescription>
                  Weekly breakdown of topics and lessons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayCourse.curriculum.map((week, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Week {week.week}: {week.title}</h4>
                        <Badge variant="outline">{week.lessons.length} lessons</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2">
                        {week.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Play className="h-3 w-3" />
                            <span>{lesson}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hands-on Projects</CardTitle>
                <CardDescription>
                  Build real-world applications to strengthen your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {displayCourse.projects.map((project, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{project}</h4>
                        <p className="text-sm text-muted-foreground">Practical implementation</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Requirements</CardTitle>
                <CardDescription>
                  What you need to get started with this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayCourse.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outcomes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Outcomes</CardTitle>
                <CardDescription>
                  What you'll be able to do after completing this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayCourse.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-primary" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <CourseReviews
              courseId={course.id}
              courseName={displayCourse.title}
            />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <FeedbackForm
              courseId={course.id}
              courseName={displayCourse.title}
              onSubmitSuccess={() => {
                toast({
                  title: "Thank you!",
                  description: "Your feedback helps us improve our courses.",
                });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetails;