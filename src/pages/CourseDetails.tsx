import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link, useParams } from "react-router-dom";
import { FeedbackForm } from "@/components/FeedbackForm";
import { CourseReviews } from "@/components/CourseReviews";
import { StarDisplay } from "@/components/ui/star-rating";
import { FeedbackService } from "@/lib/feedbackService";
import { useAuth } from "@/lib/auth";
import { 
  ArrowLeft, 
  Play, 
  Download, 
  Users, 
  Clock, 
  Star, 
  CheckCircle,
  Target,
  BookOpen,
  Award,
  Calendar,
  CreditCard
} from "lucide-react";

const CourseDetails = () => {
  const { courseId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [courseRating, setCourseRating] = useState<any>(null);

  useEffect(() => {
    // Load course rating
    if (courseId) {
      const rating = FeedbackService.getCourseRating('fullstack'); // Default to fullstack for demo
      setCourseRating(rating);
    }
  }, [courseId]);

  // Mock course data - in real app, this would be fetched based on courseId
  const course = {
    id: courseId,
    title: "Full Stack Development",
    subtitle: "Master Modern Web Development from Frontend to Backend",
    description: "Comprehensive internship program covering React, Node.js, databases, and deployment. Build real-world projects and gain industry-ready skills.",
    price: "₹7,999",
    originalPrice: "₹12,999",
    duration: "12 weeks",
    students: "300+",
    rating: "4.9",
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
  };

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      // Simulate enrollment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Enrollment Successful!",
        description: "You have been enrolled in the course. Check your email for payment details.",
      });
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
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
              <h1 className="text-4xl font-bold text-foreground mb-4">{course.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{course.subtitle}</p>
              <p className="text-lg leading-relaxed mb-6">{course.description}</p>
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
                    <span className="font-semibold">{course.rating}</span>
                  </>
                )}
                <span className="text-muted-foreground">({course.students} students)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span>{course.level}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{course.instructor.image}</span>
              </div>
              <div>
                <h4 className="font-semibold">{course.instructor.name}</h4>
                <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
              </div>
            </div>
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl">
              <CardHeader>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-primary">{course.price}</span>
                    <span className="text-lg text-muted-foreground line-through">{course.originalPrice}</span>
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
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span className="font-medium">{course.language}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Certificate:</span>
                    <span className="font-medium">{course.certificate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Access:</span>
                    <span className="font-medium">Lifetime</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">This course includes:</h4>
                  <div className="space-y-2">
                    {course.features.map((feature, index) => (
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
                  {course.curriculum.map((week, index) => (
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
                  {course.projects.map((project, index) => (
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
                  {course.requirements.map((requirement, index) => (
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
                  {course.outcomes.map((outcome, index) => (
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
              courseId="fullstack"
              courseName={course.title}
            />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <FeedbackForm
              courseId="fullstack"
              courseName={course.title}
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