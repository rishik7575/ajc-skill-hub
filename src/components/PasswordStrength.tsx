import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ 
  password, 
  className 
}) => {
  const requirements = [
    {
      label: 'At least 6 characters',
      test: (pwd: string) => pwd.length >= 6
    },
    {
      label: 'Contains uppercase letter',
      test: (pwd: string) => /[A-Z]/.test(pwd)
    },
    {
      label: 'Contains lowercase letter',
      test: (pwd: string) => /[a-z]/.test(pwd)
    },
    {
      label: 'Contains number',
      test: (pwd: string) => /\d/.test(pwd)
    }
  ];

  const passedRequirements = requirements.filter(req => req.test(password));
  const strength = (passedRequirements.length / requirements.length) * 100;

  const getStrengthColor = () => {
    if (strength < 25) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (strength < 25) return 'Weak';
    if (strength < 50) return 'Fair';
    if (strength < 75) return 'Good';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          <span className={cn(
            'font-medium',
            strength < 25 && 'text-red-600',
            strength >= 25 && strength < 50 && 'text-orange-600',
            strength >= 50 && strength < 75 && 'text-yellow-600',
            strength >= 75 && 'text-green-600'
          )}>
            {getStrengthLabel()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              getStrengthColor()
            )}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      <div className="space-y-1">
        {requirements.map((requirement, index) => {
          const passed = requirement.test(password);
          return (
            <div
              key={index}
              className={cn(
                'flex items-center gap-2 text-xs transition-colors duration-200',
                passed ? 'text-green-600' : 'text-muted-foreground'
              )}
            >
              {passed ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              <span>{requirement.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
