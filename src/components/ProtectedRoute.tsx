import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireFaculty?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false, requireFaculty = false }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof AuthService.getCurrentUser>>(null);

  useEffect(() => {
    const checkAuth = () => {
      const user = AuthService.getCurrentUser();
      setCurrentUser(user);

      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      if (requireAdmin && user.user.role !== 'admin') {
        navigate('/student', { replace: true });
        return;
      }

      if (requireFaculty && user.user.role !== 'faculty') {
        navigate('/', { replace: true });
        return;
      }

      if (!requireAdmin && !requireFaculty && user.user.role === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }

      if (!requireAdmin && !requireFaculty && user.user.role === 'faculty') {
        navigate('/faculty-dashboard', { replace: true });
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [navigate, requireAdmin, requireFaculty]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  if (requireAdmin && currentUser.user.role !== 'admin') {
    return null;
  }

  if (requireFaculty && currentUser.user.role !== 'faculty') {
    return null;
  }

  if (!requireAdmin && !requireFaculty && currentUser.user.role === 'admin') {
    return null;
  }

  if (!requireAdmin && !requireFaculty && currentUser.user.role === 'faculty') {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;