import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'avatar' | 'card' | 'button' | 'image';
  lines?: number;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  lines = 1,
  width,
  height
}) => {
  const baseClasses = 'animate-skeleton bg-muted rounded';

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4';
      case 'avatar':
        return 'w-10 h-10 rounded-full';
      case 'card':
        return 'w-full h-48';
      case 'button':
        return 'h-10 w-24';
      case 'image':
        return 'w-full h-32';
      default:
        return 'h-4';
    }
  };

  const style = {
    width: width || undefined,
    height: height || undefined
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, getVariantClasses())}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, getVariantClasses(), className)}
      style={style}
    />
  );
};

// Course Card Skeleton
export const CourseCardSkeleton: React.FC = () => (
  <div className="card-modern p-6 space-y-4">
    <Skeleton variant="image" className="rounded-lg" />
    <div className="space-y-3">
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" lines={2} />
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width="60px" />
        <Skeleton variant="button" width="80px" />
      </div>
    </div>
  </div>
);

// Dashboard Stats Skeleton
export const StatCardSkeleton: React.FC = () => (
  <div className="card-modern p-6 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width="120px" />
      <Skeleton variant="avatar" className="w-8 h-8" />
    </div>
    <Skeleton variant="text" width="60px" height="32px" />
    <Skeleton variant="text" width="100px" />
  </div>
);

// User Profile Skeleton
export const UserProfileSkeleton: React.FC = () => (
  <div className="flex items-center space-x-4">
    <Skeleton variant="avatar" className="w-12 h-12" />
    <div className="space-y-2">
      <Skeleton variant="text" width="120px" />
      <Skeleton variant="text" width="80px" />
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ 
  columns = 4 
}) => (
  <tr>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="p-4">
        <Skeleton variant="text" />
      </td>
    ))}
  </tr>
);

// Loading Page Skeleton
export const PageSkeleton: React.FC = () => (
  <div className="space-y-8">
    {/* Header */}
    <div className="space-y-4">
      <Skeleton variant="text" width="300px" height="32px" />
      <Skeleton variant="text" lines={2} />
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>

    {/* Content Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

// Loading Spinner with enhanced animation
export const LoadingSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-muted border-t-primary',
          sizeClasses[size]
        )}
      />
    </div>
  );
};

// Pulsing Dot Loader
export const PulsingDots: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-1', className)}>
    {[0, 1, 2].map((index) => (
      <div
        key={index}
        className="w-2 h-2 bg-primary rounded-full animate-pulse"
        style={{ animationDelay: `${index * 0.2}s` }}
      />
    ))}
  </div>
);

export default Skeleton;
