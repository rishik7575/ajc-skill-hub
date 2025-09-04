import { useState, useEffect } from 'react';
import { Check, X, Eye, EyeOff } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
  showStrength?: boolean;
  showRequirements?: boolean;
  className?: string;
}

interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (password) => password.length >= 8
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    test: (password) => /[A-Z]/.test(password)
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    test: (password) => /[a-z]/.test(password)
  },
  {
    id: 'number',
    label: 'One number',
    test: (password) => /\d/.test(password)
  },
  {
    id: 'special',
    label: 'One special character',
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
];

export const PasswordStrength = ({
  password,
  showStrength = true,
  showRequirements = true,
  className
}: PasswordStrengthProps) => {
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');
  const [strengthColor, setStrengthColor] = useState('');

  useEffect(() => {
    const calculateStrength = () => {
      let score = 0;
      const passedRequirements = requirements.filter(req => req.test(password));
      score = passedRequirements.length;

      // Additional scoring
      if (password.length >= 12) score += 0.5;
      if (password.length >= 16) score += 0.5;
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password) && password.length >= 8) score += 0.5;

      const normalizedScore = Math.min((score / 6) * 100, 100);
      setStrength(normalizedScore);

      // Set strength label and color
      if (normalizedScore < 20) {
        setStrengthLabel('Very Weak');
        setStrengthColor('text-red-600');
      } else if (normalizedScore < 40) {
        setStrengthLabel('Weak');
        setStrengthColor('text-orange-600');
      } else if (normalizedScore < 60) {
        setStrengthLabel('Fair');
        setStrengthColor('text-yellow-600');
      } else if (normalizedScore < 80) {
        setStrengthLabel('Good');
        setStrengthColor('text-blue-600');
      } else {
        setStrengthLabel('Strong');
        setStrengthColor('text-green-600');
      }
    };

    calculateStrength();
  }, [password]);

  if (!password) return null;

  return (
    <div className={cn('space-y-3', className)}>
      {showStrength && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Password strength</span>
            <Badge variant="outline" className={strengthColor}>
              {strengthLabel}
            </Badge>
          </div>
          <Progress 
            value={strength} 
            className="h-2"
          />
        </div>
      )}

      {showRequirements && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Requirements:</span>
          <div className="space-y-1">
            {requirements.map((requirement) => {
              const isValid = requirement.test(password);
              return (
                <div
                  key={requirement.id}
                  className={cn(
                    'flex items-center gap-2 text-sm transition-colors',
                    isValid ? 'text-green-600' : 'text-muted-foreground'
                  )}
                >
                  {isValid ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{requirement.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showStrength?: boolean;
  disabled?: boolean;
}

export const PasswordInput = ({
  value,
  onChange,
  placeholder = 'Enter password',
  className,
  showStrength = true,
  disabled = false
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            'pr-10', // Make room for the toggle button
            className
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      
      {showStrength && value && (
        <PasswordStrength password={value} />
      )}
    </div>
  );
};

export default PasswordStrength;