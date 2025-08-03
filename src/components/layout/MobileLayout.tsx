import React from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none';
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  className,
  maxWidth = 'lg'
}) => {
  return (
    <div className={cn(
      'min-h-screen bg-background',
      'w-full mx-auto',
      'px-4 sm:px-6 lg:px-8',
      'py-4 sm:py-6',
      'overflow-x-hidden',
      maxWidth !== 'none' && `max-w-${maxWidth}`,
      className
    )}>
      {children}
    </div>
  );
};

export const MobileContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      'w-full',
      'max-w-md mx-auto', // Mobile-first: largura máxima para leitura confortável
      'sm:max-w-lg',
      'lg:max-w-2xl',
      'xl:max-w-4xl',
      className
    )}>
      {children}
    </div>
  );
};

export const MobileSection: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({
  children,
  className,
  spacing = 'md'
}) => {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12'
  };

  return (
    <section className={cn(
      'w-full',
      spacingClasses[spacing],
      className
    )}>
      {children}
    </section>
  );
}; 