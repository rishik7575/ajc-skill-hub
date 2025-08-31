import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Trophy, 
  Target,
  BookOpen,
  Award,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  progress?: number;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: number;
  overallProgress: number;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  overallProgress,
  className
}) => {
  return (
    <Card className={cn('card-modern', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Learning Progress
        </CardTitle>
        <CardDescription>
          Track your journey through the course
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            {overallProgress >= 80 ? 'Excellent progress!' : 
             overallProgress >= 60 ? 'Good progress!' : 
             overallProgress >= 30 ? 'Keep going!' : 'Just getting started!'}
          </div>
        </div>

        {/* Step Progress */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3">
              {/* Step Icon */}
              <div className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
                step.status === 'completed' && 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                step.status === 'current' && 'bg-primary/10 text-primary border-2 border-primary/30',
                step.status === 'upcoming' && 'bg-muted text-muted-foreground'
              )}>
                {step.status === 'completed' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : step.status === 'current' ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={cn(
                    'text-sm font-medium',
                    step.status === 'completed' && 'text-green-600 dark:text-green-400',
                    step.status === 'current' && 'text-primary',
                    step.status === 'upcoming' && 'text-muted-foreground'
                  )}>
                    {step.title}
                  </h4>
                  <Badge 
                    variant={step.status === 'completed' ? 'default' : 'secondary'}
                    className={cn(
                      'text-xs',
                      step.status === 'completed' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                      step.status === 'current' && 'bg-primary/10 text-primary',
                    )}
                  >
                    {step.status === 'completed' ? 'Complete' : 
                     step.status === 'current' ? 'In Progress' : 'Upcoming'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {step.description}
                </p>
                
                {/* Step Progress Bar */}
                {step.status === 'current' && step.progress !== undefined && (
                  <div className="space-y-1">
                    <Progress value={step.progress} className="h-1" />
                    <span className="text-xs text-muted-foreground">
                      {step.progress}% complete
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Badges */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Achievements
          </h4>
          <div className="flex flex-wrap gap-2">
            {overallProgress >= 25 && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                <BookOpen className="h-3 w-3 mr-1" />
                First Steps
              </Badge>
            )}
            {overallProgress >= 50 && (
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
                <Target className="h-3 w-3 mr-1" />
                Halfway Hero
              </Badge>
            )}
            {overallProgress >= 75 && (
              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                Almost There
              </Badge>
            )}
            {overallProgress >= 100 && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                <Trophy className="h-3 w-3 mr-1" />
                Course Master
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  className,
  showValue = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-500 ease-out"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">
            {Math.round(value)}%
          </span>
        </div>
      )}
    </div>
  );
};

interface MilestoneProgressProps {
  milestones: Array<{
    id: string;
    title: string;
    completed: boolean;
    date?: string;
  }>;
  className?: string;
}

export const MilestoneProgress: React.FC<MilestoneProgressProps> = ({
  milestones,
  className
}) => {
  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercentage = (completedCount / milestones.length) * 100;

  return (
    <Card className={cn('card-modern', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Milestones
        </CardTitle>
        <CardDescription>
          {completedCount} of {milestones.length} milestones completed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center gap-3">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300',
                  milestone.completed 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-muted text-muted-foreground'
                )}>
                  {milestone.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    'text-sm font-medium',
                    milestone.completed ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {milestone.title}
                  </p>
                  {milestone.date && (
                    <p className="text-xs text-muted-foreground">
                      {milestone.completed ? 'Completed' : 'Target'}: {milestone.date}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
