import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (requireAdmin && currentUser.user.role !== 'admin') {
      navigate('/student');
      return;
    }

    if (!requireAdmin && currentUser.user.role === 'admin') {
      navigate('/admin');
      return;
    }
  }, [navigate, requireAdmin]);

  const currentUser = AuthService.getCurrentUser();
  
  if (!currentUser) {
    return null;
  }

  if (requireAdmin && currentUser.user.role !== 'admin') {
    return null;
  }

  if (!requireAdmin && currentUser.user.role === 'admin') {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;