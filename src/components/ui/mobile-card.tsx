import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  hover = false,
  onClick
}) => {
  const variantClasses = {
    default: 'bg-background border border-border',
    elevated: 'bg-background shadow-lg border-0',
    outlined: 'bg-transparent border-2 border-border',
    glass: 'bg-background/80 backdrop-blur-xl border border-border/50'
  };

  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  return (
    <Card 
      className={cn(
        'rounded-xl sm:rounded-2xl',
        'transition-all duration-300',
        'overflow-hidden',
        variantClasses[variant],
        paddingClasses[padding],
        shadowClasses[shadow],
        hover && 'hover:scale-[1.02] hover:shadow-xl cursor-pointer',
        onClick && 'cursor-pointer',
        'min-h-[80px] sm:min-h-[100px]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
};

interface MobileCardHeaderProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export const MobileCardHeader: React.FC<MobileCardHeaderProps> = ({
  children,
  className,
  icon,
  badge
}) => {
  return (
    <CardHeader className={cn('pb-3 sm:pb-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && (
            <div className="flex-shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
        {badge && (
          <div className="flex-shrink-0">
            {badge}
          </div>
        )}
      </div>
    </CardHeader>
  );
};

interface MobileCardContentProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

export const MobileCardContent: React.FC<MobileCardContentProps> = ({
  children,
  className,
  spacing = 'md'
}) => {
  const spacingClasses = {
    sm: 'space-y-2 sm:space-y-3',
    md: 'space-y-3 sm:space-y-4',
    lg: 'space-y-4 sm:space-y-6'
  };

  return (
    <CardContent className={cn(spacingClasses[spacing], className)}>
      {children}
    </CardContent>
  );
};

interface MobileCardTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MobileCardTitle: React.FC<MobileCardTitleProps> = ({
  children,
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-sm sm:text-base font-semibold leading-tight',
    md: 'text-base sm:text-lg font-semibold leading-tight',
    lg: 'text-lg sm:text-xl font-bold leading-tight'
  };

  return (
    <CardTitle className={cn(
      'break-words',
      sizeClasses[size],
      className
    )}>
      {children}
    </CardTitle>
  );
};

interface MobileCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MobileCardDescription: React.FC<MobileCardDescriptionProps> = ({
  children,
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-xs sm:text-sm leading-relaxed',
    md: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-relaxed'
  };

  return (
    <p className={cn(
      'text-muted-foreground break-words',
      sizeClasses[size],
      className
    )}>
      {children}
    </p>
  );
}; 