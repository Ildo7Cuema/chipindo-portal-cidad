import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { SparklesIcon, StarIcon, DiamondIcon } from 'lucide-react';

interface FloatingElementsProps {
  density?: 'low' | 'medium' | 'high';
  color?: 'gold' | 'primary' | 'accent';
  className?: string;
}

export const FloatingElements = ({ 
  density = 'medium', 
  color = 'gold',
  className 
}: FloatingElementsProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const elementCount = {
    low: 8,
    medium: 15,
    high: 25
  }[density];

  const colorClasses = {
    gold: 'from-yellow-400 to-orange-500',
    primary: 'from-red-500 to-orange-600',
    accent: 'from-emerald-400 to-green-500'
  };

  const icons = [SparklesIcon, StarIcon, DiamondIcon];

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-0", className)}>
      {/* Floating particles */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(elementCount)].map((_, i) => {
          const IconComponent = icons[i % icons.length];
          const delay = Math.random() * 5;
          const duration = 3 + Math.random() * 4;
          const size = 12 + Math.random() * 8;
          
          return (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                transform: `translate(${(mousePosition.x - 50) * 0.02}px, ${(mousePosition.y - 50) * 0.02}px)`
              }}
            >
              <IconComponent 
                className={cn(
                  "transition-all duration-500",
                  `w-${Math.floor(size/4)} h-${Math.floor(size/4)}`,
                  `text-gradient bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`
                )}
                style={{ fontSize: `${size}px` }}
              />
            </div>
          );
        })}
      </div>

      {/* Ambient light effects */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className={cn(
            "absolute w-96 h-96 rounded-full blur-3xl transition-all duration-1000",
            `bg-gradient-to-r ${colorClasses[color]}`
          )}
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)`,
            backgroundSize: '100px 100px, 60px 60px',
            backgroundPosition: '0 0, 50px 50px',
            transform: `translate(${(mousePosition.x - 50) * 0.05}px, ${(mousePosition.y - 50) * 0.05}px)`
          }}
        />
      </div>
    </div>
  );
};

interface PremiumBadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'premium' | 'exclusive';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  className?: string;
}

export const PremiumBadge = ({ 
  children, 
  variant = 'gold', 
  size = 'md',
  glow = false,
  className 
}: PremiumBadgeProps) => {
  const variantClasses = {
    gold: 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-yellow-900',
    premium: 'bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 text-white',
    exclusive: 'bg-gradient-to-r from-pink-500 via-red-400 to-orange-500 text-white'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center font-bold rounded-full border-0 shadow-lg transition-all duration-300",
        variantClasses[variant],
        sizeClasses[size],
        glow && "animate-glow",
        "hover:scale-110 hover:shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
};

interface GoldenTextProps {
  children: React.ReactNode;
  variant?: 'shine' | 'gradient' | 'metallic';
  className?: string;
}

export const GoldenText = ({ 
  children, 
  variant = 'gradient',
  className 
}: GoldenTextProps) => {
  const variantClasses = {
    shine: 'bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent animate-shimmer',
    gradient: 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent',
    metallic: 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-clip-text text-transparent'
  };

  return (
    <span className={cn(variantClasses[variant], "font-bold", className)}>
      {children}
    </span>
  );
};

interface InteractiveCardProps {
  children: React.ReactNode;
  glowColor?: 'gold' | 'blue' | 'green' | 'purple';
  className?: string;
}

export const InteractiveCard = ({ 
  children, 
  glowColor = 'gold',
  className 
}: InteractiveCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const glowColors = {
    gold: 'shadow-yellow-500/25',
    blue: 'shadow-blue-500/25',
    green: 'shadow-emerald-500/25',
    purple: 'shadow-purple-500/25'
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl transition-all duration-500 cursor-pointer",
        "hover:scale-105 hover:-translate-y-2",
        isHovered && `hover:shadow-2xl ${glowColors[glowColor]}`,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background */}
      <div 
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500",
          isHovered && "opacity-10"
        )}
        style={{
          background: `linear-gradient(135deg, 
            ${glowColor === 'gold' ? '#fbbf24' : 
              glowColor === 'blue' ? '#3b82f6' :
              glowColor === 'green' ? '#10b981' : '#8b5cf6'} 0%, 
            transparent 100%)`
        }}
      />
      
      {/* Shimmer effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}; 