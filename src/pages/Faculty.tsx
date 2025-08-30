import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Linkedin, Star, Users, BookOpen, Award } from "lucide-react";

const Faculty = () => {
  const facultyMembers = [
    {
      id: 1,
      name: "Dr. Amit Sharma",
      title: "Senior Data Analytics Instructor",
      course: "Power BI & Data Analytics",
      experience: "8+ years",
      students: "500+",
      rating: "4.9",
      image: "AS",
      bio: "Former Microsoft Power BI consultant with extensive experience in business intelligence and data visualization.",
      specialties: ["Power BI", "Data Visualization", "Business Intelligence", "SQL"],
      email: "amit.sharma@ajc.com",
      linkedin: "linkedin.com/in/amitsharma"
    },
    {
      id: 2,
      name: "Priya Singh",
      title: "Full Stack Development Lead",
      course: "Full Stack Development",
      experience: "6+ years",
      students: "800+",
      rating: "4.8",
      image: "PS",
      bio: "Senior full-stack developer at a Fortune 500 company, passionate about teaching modern web technologies.",
      specialties: ["React", "Node.js", "MongoDB", "JavaScript", "TypeScript"],
      email: "priya.singh@ajc.com",
      linkedin: "linkedin.com/in/priyasingh"
    },
    {
      id: 3,
      name: "Rohit Kumar",
      title: "Frontend Development Expert",
      course: "Frontend Development",
      experience: "5+ years",
      students: "600+",
      rating: "4.7",
      image: "RK",
      bio: "UI/UX focused frontend developer with expertise in creating responsive and accessible web applications.",
      specialties: ["React", "CSS", "Tailwind", "UI/UX Design", "Responsive Design"],
      email: "rohit.kumar@ajc.com",
      linkedin: "linkedin.com/in/rohitkumar"
    },
    {
      id: 4,
      name: "Sneha Patel",
      title: "Backend Development Specialist",
      course: "Backend Development",
      experience: "7+ years",
      students: "450+",
      rating: "4.8",
      image: "SP",
      bio: "Backend architect with deep knowledge of scalable system design and API development.",
      specialties: ["Node.js", "Express", "PostgreSQL", "MongoDB", "System Design"],
      email: "sneha.patel@ajc.com",
      linkedin: "linkedin.com/in/snehapatel"
    },
    {
      id: 5,
      name: "Vikash Gupta",
      title: "Database Management Expert",
      course: "Database Management",
      experience: "9+ years",
      students: "300+",
      rating: "4.9",
      image: "VG",
      bio: "Database administrator and architect with expertise in both SQL and NoSQL database systems.",
      specialties: ["PostgreSQL", "MongoDB", "MySQL", "Database Design", "Performance Optimization"],
      email: "vikash.gupta@ajc.com",
      linkedin: "linkedin.com/in/vikashgupta"
    },
    {
      id: 6,
      name: "Riya Sharma",
      title: "Mobile App Development Lead",
      course: "Flutter Development",
      experience: "4+ years",
      students: "250+",
      rating: "4.6",
      image: "RS",
      bio: "Mobile app developer specializing in cross-platform development with Flutter and Dart.",
      specialties: ["Flutter", "Dart", "Mobile UI/UX", "State Management", "Firebase"],
      email: "riya.sharma@ajc.com",
      linkedin: "linkedin.com/in/riyasharma"
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
              <span className="text-xl font-bold text-foreground">Our Faculty</span>
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

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Meet Our Expert{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Faculty
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn from industry professionals with years of real-world experience. 
            Our faculty combines practical knowledge with excellent teaching skills to guide your learning journey.
          </p>
        </div>

        {/* Faculty Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle>Expert Faculty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">6</div>
              <p className="text-muted-foreground">Industry professionals</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <CardTitle>Combined Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">35+</div>
              <p className="text-muted-foreground">Years of expertise</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <CardTitle>Students Taught</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">2900+</div>
              <p className="text-muted-foreground">Successful graduates</p>
            </CardContent>
          </Card>
        </div>

        {/* Faculty Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {facultyMembers.map((faculty) => (
            <Card key={faculty.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{faculty.image}</span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{faculty.name}</CardTitle>
                    <CardDescription className="text-primary font-medium mb-2">
                      {faculty.title}
                    </CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {faculty.rating}
                      </div>
                      <div>{faculty.experience} exp.</div>
                      <div>{faculty.students} students</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Badge variant="outline" className="mb-3">
                    {faculty.course}
                  </Badge>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {faculty.bio}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {faculty.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-3">
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button size="sm" variant="outline">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                  <Link to={`/course/${faculty.course.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button size="sm">
                      View Course
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Join Faculty CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary to-accent text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Join Our Faculty Team</CardTitle>
              <CardDescription className="text-white/90">
                Are you an industry expert passionate about teaching? We're always looking for talented professionals to join our faculty.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button variant="secondary">
                    Apply to Teach
                  </Button>
                </Link>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Faculty;