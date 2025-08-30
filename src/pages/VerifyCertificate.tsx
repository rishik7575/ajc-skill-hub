import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Search, Award, CheckCircle, X, ArrowLeft } from "lucide-react";

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  // Mock certificate database
  const certificates = {
    "AJC2024-PBI-00142": {
      studentName: "Anita Devi",
      course: "Power BI Mastery",
      grade: "Silver",
      dateIssued: "2024-08-15",
      score: "85%",
      instructorName: "Dr. Amit Sharma"
    },
    "AJC2024-FSD-00089": {
      studentName: "Rahul Verma",
      course: "Full Stack Development",
      grade: "Gold",
      dateIssued: "2024-08-20",
      score: "92%",
      instructorName: "Priya Singh"
    },
    "AJC2024-FLD-00056": {
      studentName: "Sneha Patel",
      course: "Flutter Development",
      grade: "Participation",
      dateIssued: "2024-08-10",
      score: "68%",
      instructorName: "Rohit Kumar"
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const certificate = certificates[certificateId as keyof typeof certificates];
      
      if (certificate) {
        setResult({
          valid: true,
          ...certificate
        });
        toast({
          title: "Certificate Verified!",
          description: "This is a valid AJC certificate.",
        });
      } else {
        setResult({
          valid: false
        });
        toast({
          title: "Certificate Not Found",
          description: "The certificate ID entered is not valid.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "An error occurred while verifying the certificate.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCertificateId("");
    setResult(null);
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
              <span className="text-xl font-bold text-foreground">Certificate Verification</span>
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
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Verify AJC Certificate
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter the certificate ID to verify the authenticity of an AJC internship certificate.
            </p>
          </div>

          {/* Verification Form */}
          <Card className="shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Certificate Verification</CardTitle>
              <CardDescription className="text-center">
                Enter the unique certificate ID found on your certificate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="certificateId">Certificate ID</Label>
                  <Input
                    id="certificateId"
                    type="text"
                    placeholder="e.g., AJC2024-PBI-00142"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                    required
                    className="text-center text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Certificate ID format: AJC2024-[COURSE]-[NUMBER]
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      "Verifying..."
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Verify Certificate
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Clear
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Verification Result */}
          {result && (
            <Card className={`shadow-xl ${result.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  {result.valid ? (
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <CardTitle className={`text-2xl text-center ${result.valid ? 'text-green-700' : 'text-red-700'}`}>
                  {result.valid ? "Certificate Verified ✓" : "Certificate Not Found ✗"}
                </CardTitle>
                <CardDescription className="text-center">
                  {result.valid 
                    ? "This is a valid AJC internship certificate."
                    : "The certificate ID you entered is not in our database."
                  }
                </CardDescription>
              </CardHeader>
              {result.valid && (
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3">Certificate Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Student Name:</span>
                          <span className="font-medium">{result.studentName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Course:</span>
                          <span className="font-medium">{result.course}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Grade:</span>
                          <Badge 
                            className={
                              result.grade === 'Gold' ? 'bg-yellow-500' :
                              result.grade === 'Silver' ? 'bg-gray-500' : 'bg-blue-500'
                            }
                          >
                            {result.grade}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Score:</span>
                          <span className="font-medium">{result.score}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3">Issuance Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date Issued:</span>
                          <span className="font-medium">{new Date(result.dateIssued).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Instructor:</span>
                          <span className="font-medium">{result.instructorName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Certificate ID:</span>
                          <span className="font-medium font-mono text-sm">{certificateId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-green-100 rounded-lg">
                    <p className="text-sm text-green-700 text-center">
                      <CheckCircle className="h-4 w-4 inline mr-2" />
                      This certificate has been verified as authentic and was issued by AJC Internship Platform.
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Sample Certificate IDs for Demo */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Sample Certificate IDs for Testing</CardTitle>
              <CardDescription>Try these certificate IDs to see the verification in action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <span className="font-mono text-sm">AJC2024-PBI-00142</span>
                    <span className="ml-4 text-sm text-muted-foreground">Power BI - Silver Certificate</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setCertificateId("AJC2024-PBI-00142")}
                  >
                    Try This
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <span className="font-mono text-sm">AJC2024-FSD-00089</span>
                    <span className="ml-4 text-sm text-muted-foreground">Full Stack - Gold Certificate</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setCertificateId("AJC2024-FSD-00089")}
                  >
                    Try This
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <span className="font-mono text-sm">AJC2024-FLD-00056</span>
                    <span className="ml-4 text-sm text-muted-foreground">Flutter - Participation Certificate</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setCertificateId("AJC2024-FLD-00056")}
                  >
                    Try This
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h3 className="text-xl font-semibold mb-4">Interested in earning an AJC certificate?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button>View Available Courses</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline">Sign Up Today</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;