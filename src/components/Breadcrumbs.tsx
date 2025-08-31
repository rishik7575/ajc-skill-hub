import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from URL if items not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location.pathname);

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          )}
          
          {item.href && index < breadcrumbItems.length - 1 ? (
            <Link
              to={item.href}
              className="flex items-center gap-1 hover:text-foreground transition-colors duration-200 hover:underline"
            >
              {item.icon}
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              'flex items-center gap-1',
              index === breadcrumbItems.length - 1 && 'text-foreground font-medium'
            )}>
              {item.icon}
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: <Home className="h-3 w-3" />
    }
  ];

  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Convert segment to readable label
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Special cases for known routes
    switch (segment) {
      case 'admin':
        label = 'Admin Dashboard';
        break;
      case 'student':
        label = 'Student Dashboard';
        break;
      case 'verify-certificate':
        label = 'Verify Certificate';
        break;
      case 'course':
        label = 'Course Details';
        break;
      default:
        // If it's a course ID, try to make it more readable
        if (segments[index - 1] === 'course') {
          label = label.replace(/([A-Z])/g, ' $1').trim();
        }
    }

    breadcrumbs.push({
      label,
      href: index === segments.length - 1 ? undefined : currentPath
    });
  });

  return breadcrumbs;
}

// Enhanced Navigation Component
interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const location = useLocation();
  
  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'Faculty', href: '/faculty' },
    { label: 'Verify Certificate', href: '/verify-certificate' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <nav className={cn('hidden md:flex items-center space-x-8', className)}>
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'text-foreground hover:text-primary transition-colors duration-200 relative',
            'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200',
            'hover:after:w-full',
            location.pathname === item.href && 'text-primary after:w-full'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

// Mobile Navigation Menu
interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  isOpen, 
  onClose, 
  className 
}) => {
  const location = useLocation();
  
  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'Faculty', href: '/faculty' },
    { label: 'Verify Certificate', href: '/verify-certificate' },
    { label: 'Contact', href: '/contact' }
  ];

  if (!isOpen) return null;

  return (
    <div className={cn('md:hidden', className)}>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose}>
        <div 
          className="fixed inset-y-0 right-0 w-full max-w-sm bg-card border-l shadow-lg animate-slide-in-right"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <nav className="flex-1 p-6">
              <div className="space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      'block px-4 py-3 rounded-lg transition-colors duration-200',
                      'hover:bg-muted hover:text-primary',
                      location.pathname === item.href && 'bg-primary/10 text-primary font-medium'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
            
            <div className="p-6 border-t">
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="block w-full text-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
