import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Award, Star, Play, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { StarDisplay } from "@/components/ui/star-rating";
import { FeedbackService } from "@/lib/feedbackService";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getCourseData, Course as CourseType } from "@/lib/mockData";
import { CourseRating } from "@/lib/mockData";

const Landing = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [courseRatings, setCourseRatings] = useState<Record<string, CourseRating>>({});

  const loadCourseData = useCallback(() => {
    const allCourses = getCourseData();
    setCourses(allCourses);

    const ratings: Record<string, CourseRating> = {};
    allCourses.forEach(course => {
      const rating = FeedbackService.getCourseRating(course.id);
        if (rating) {
        ratings[course.id] = rating;
        }
    });
    setCourseRatings(ratings);
  }, []);

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  // Memoize course cards for better performance
  const courseCards = useMemo(() => {
    return courses.map((course, index) => (
      <Card key={course.id} className="card-modern card-interactive group animate-fade-in-up hover-lift hover-glow" style={{animationDelay: `${index * 0.1}s`}}>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 float-animation" style={{animationDelay: `${index * 0.5}s`}}>{course.icon}</span>
            <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 group-hover:shadow-glow transition-all duration-300">₹{course.price}</Badge>
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{course.title}</CardTitle>
          <CardDescription className="leading-relaxed">{course.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="mr-1">📚</span>
                {course.duration}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                {course.students}+
              </div>
            </div>
            <div className="flex items-center justify-center">
              {courseRatings[course.id] ? (
                <StarDisplay
                  rating={courseRatings[course.id]?.averageRating || 0}
                  totalReviews={courseRatings[course.id]?.totalReviews || 0}
                  size="sm"
                />
              ) : (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {course.rating}
                </div>
              )}
            </div>
          </div>
          <Link to={`/course/${course.id}`}>
            <Button className="w-full btn-gradient group-hover:shadow-glow transition-all duration-300">
              View Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    ));
  }, [courses, courseRatings]);

  const successStories = [
    {
      name: "Priya Sharma",
      course: "Full Stack Development",
      company: "Google",
      certificate: "Gold",
      testimonial: "AJC's program helped me land my dream job at Google!"
    },
    {
      name: "Rahul Kumar",
      course: "Power BI",
      company: "Microsoft",
      certificate: "Gold",
      testimonial: "The hands-on approach and daily challenges were excellent."
    },
    {
      name: "Sneha Patel",
      course: "Flutter Development",
      company: "Flipkart",
      certificate: "Silver",
      testimonial: "Amazing faculty and real-world projects made all the difference."
    }
  ];

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
              <span className="text-xl font-bold text-foreground">AJC Internship</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
              <Link to="/courses" className="text-foreground hover:text-primary transition-colors">Courses</Link>
              <Link to="/faculty" className="text-foreground hover:text-primary transition-colors">Faculty</Link>
              <Link to="/verify-certificate" className="text-foreground hover:text-primary transition-colors">Verify Certificate</Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors">Contact</Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="btn-gradient">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>

        {/* Floating Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl float-animation"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent/10 rounded-full blur-xl float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary/5 rounded-full blur-lg float-animation"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 animate-fade-in bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover-glow" variant="secondary">
              🚀 India's Leading Internship Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
              Transform Your Career with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-shimmer">
                AJC Internships
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up leading-relaxed">
              Master in-demand skills through hands-on internships. Get industry-ready with live projects,
              expert mentorship, and certified achievements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Link to="/courses">
                <Button size="lg" className="btn-gradient text-lg px-8 py-6 shadow-glow hover:shadow-glow-lg transition-all duration-300 hover-scale group">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to="/verify-certificate">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 hover-lift group">
                  <Award className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  Verify Certificate
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl animate-bounce-in"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-xl animate-bounce-in" style={{animationDelay: '0.5s'}}></div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose AJC Internships?</h2>
            <p className="text-muted-foreground text-lg">Complete learning experience with industry-standard practices</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-modern card-hover text-center group animate-fade-in-up">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">Live & Recorded Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access to both live Zoom sessions with expert faculty and recorded classes for flexible learning.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="card-modern card-hover text-center group animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">Daily Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Daily tasks and MCQs to enhance your skills with instant feedback and leaderboard rankings.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="card-modern card-hover text-center group animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">Verified Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Earn Gold, Silver, or Participation certificates with unique verification IDs recognized by industry.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">Popular Courses</h2>
            <p className="text-muted-foreground text-lg">Choose from our industry-focused internship programs</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courseCards}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Success Stories</h2>
            <p className="text-muted-foreground text-lg">See how our students transformed their careers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{story.name.charAt(0)}</span>
                  </div>
                  <CardTitle className="text-lg">{story.name}</CardTitle>
                  <CardDescription>{story.course} • {story.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className={`mb-4 ${story.certificate === 'Gold' ? 'bg-yellow-500' : 'bg-gray-400'}`}>
                    {story.certificate} Certificate
                  </Badge>
                  <p className="text-sm text-muted-foreground italic">"{story.testimonial}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of students who've transformed their careers with AJC</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Start Learning Today
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">AJC</span>
                </div>
                <span className="font-bold text-foreground">AJC Internship</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering students with industry-ready skills through comprehensive internship programs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Courses</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Power BI</li>
                <li>Full Stack Development</li>
                <li>Frontend Development</li>
                <li>Backend Development</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/verify-certificate">Verify Certificate</Link></li>
                <li>Help Center</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>LinkedIn</li>
                <li>Twitter</li>
                <li>Instagram</li>
                <li>YouTube</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 AJC Internship Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;