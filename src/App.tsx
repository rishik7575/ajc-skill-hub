import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./components/theme-provider";

// Lazy load components for better performance
const Landing = lazy(() =>
  import("./pages/Landing").then(module => ({ default: module.default }))
);
const Login = lazy(() =>
  import("./pages/Login").then(module => ({ default: module.default }))
);
const Signup = lazy(() =>
  import("./pages/Signup").then(module => ({ default: module.default }))
);
const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard").then(module => ({ default: module.default }))
);
const StudentDashboard = lazy(() =>
  import("./pages/StudentDashboard").then(module => ({ default: module.default }))
);
const StudentCoursePage = lazy(() => import("./pages/StudentCoursePage"));
const VerifyCertificate = lazy(() =>
  import("./pages/VerifyCertificate").then(module => ({ default: module.default }))
);
const Faculty = lazy(() => import("./pages/Faculty").then(module => ({ default: module.default })));
const FacultyDashboard = lazy(() => import("./pages/FacultyDashboard").then(module => ({ default: module.default })));
const Contact = lazy(() => import("./pages/Contact").then(module => ({ default: module.default })));
const CourseDetails = lazy(() =>
  import("./pages/CourseDetails").then(module => ({ default: module.default }))
);
const ForgotPassword = lazy(() => import("./pages/ForgotPassword").then(module => ({ default: module.default })));
const NotFound = lazy(() => import("./pages/NotFound").then(module => ({ default: module.default })));

// Optimized loading component with better performance
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="ajc-ui-theme">
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/student" element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/student/course/:courseId" element={
                  <ProtectedRoute>
                    <StudentCoursePage />
                  </ProtectedRoute>
                } />
                <Route path="/verify-certificate" element={<VerifyCertificate />} />
                <Route path="/faculty" element={<Faculty />} />
                <Route path="/faculty-dashboard" element={
                  <ProtectedRoute requireFaculty={true}>
                    <FacultyDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/contact" element={<Contact />} />
                <Route path="/course/:courseId" element={<CourseDetails />} />
                <Route path="/courses" element={<Landing />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </ThemeProvider>
);

export default App;
