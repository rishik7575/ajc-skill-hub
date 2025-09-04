import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
  showStats?: boolean;
  animated?: boolean;
  className?: string;
}

export const ProgressIndicator = ({
  current,
  total,
  label,
  size = 'md',
  variant = 'default',
  showPercentage = true,
  showStats = false,
  animated = true,
  className
}: ProgressIndicatorProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const percentage = Math.round((current / total) * 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(percentage);
    }
  }, [percentage, animated]);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const getStatusBadge = () => {
    if (percentage === 100) return { text: 'Completed', variant: 'default' as const, color: 'bg-green-500' };
    if (percentage >= 75) return { text: 'Excellent', variant: 'secondary' as const, color: 'bg-blue-500' };
    if (percentage >= 50) return { text: 'Good', variant: 'outline' as const, color: 'bg-yellow-500' };
    if (percentage >= 25) return { text: 'Fair', variant: 'outline' as const, color: 'bg-orange-500' };
    return { text: 'Getting Started', variant: 'outline' as const, color: 'bg-red-500' };
  };

  if (showStats) {
    const status = getStatusBadge();
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {label || 'Progress'}
            </span>
            <Badge variant={status.variant} className="flex items-center gap-1">
              <div className={cn('w-2 h-2 rounded-full', status.color)} />
              {status.text}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-medium">{current} / {total}</span>
            </div>
            <Progress 
              value={animatedProgress} 
              className={cn(sizeClasses[size], 'transition-all duration-1000 ease-out')}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {total - current} remaining
              </span>
              <span className="text-sm font-semibold text-primary">
                {percentage}%
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <Trophy className="h-3 w-3" />
                <span className="text-xs font-medium">Completed</span>
              </div>
              <span className="text-lg font-bold text-green-600">{current}</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-medium">Progress</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{percentage}%</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs font-medium">Remaining</span>
              </div>
              <span className="text-lg font-bold text-orange-600">{total - current}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {showPercentage && (
            <span className="text-sm text-muted-foreground">
              {current}/{total} ({percentage}%)
            </span>
          )}
        </div>
      )}
      <Progress 
        value={animatedProgress} 
        className={cn(
          sizeClasses[size],
          'transition-all duration-1000 ease-out',
          animated && 'animate-pulse'
        )}
      />
    </div>
  );
};

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export const CircularProgress = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  className,
  children
}: CircularProgressProps) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 2;
  const dash = (animatedPercentage * circumference) / 100;

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          r={radius}
          className="text-muted opacity-20"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          r={radius}
          className="text-primary transition-all duration-1000 ease-out"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <span className="text-xl font-bold text-foreground">
            {Math.round(animatedPercentage)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;