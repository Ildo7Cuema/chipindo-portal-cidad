import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  className?: string;
  variant?: "default" | "glass" | "elevated";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ 
    icon: Icon, 
    label, 
    value, 
    description, 
    trend, 
    className, 
    variant = "default",
    size = "md",
    loading = false,
    ...props 
  }, ref) => {
    const baseClasses = "group relative overflow-hidden rounded-xl transition-all duration-300";
    
    const variantClasses = {
      default: "bg-gradient-card border border-border shadow-card hover:shadow-floating",
      glass: "surface-glass backdrop-blur-lg",
      elevated: "surface-elevated shadow-floating hover:shadow-glow"
    };

    const sizeClasses = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8"
    };

    const iconSizeClasses = {
      sm: "w-5 h-5",
      md: "w-6 h-6",
      lg: "w-8 h-8"
    };

    const valueSizeClasses = {
      sm: "text-lg font-semibold",
      md: "text-2xl font-bold",
      lg: "text-3xl font-bold"
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          "hover:-translate-y-1",
          className
        )}
        {...props}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 bg-muted animate-pulse rounded" />
              {trend && <div className="w-12 h-4 bg-muted animate-pulse rounded" />}
            </div>
            <div className="w-16 h-8 bg-muted animate-pulse rounded" />
            <div className="w-24 h-4 bg-muted animate-pulse rounded" />
          </div>
        ) : (
          <>
            {/* Header with icon and trend */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className={cn(iconSizeClasses[size])} />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {label}
                </span>
              </div>
              
              {trend && (
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  trend.isPositive !== false 
                    ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950" 
                    : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950"
                )}>
                  <span>{trend.isPositive !== false ? "↗" : "↘"}</span>
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>

            {/* Value */}
            <div className={cn(
              valueSizeClasses[size],
              "text-foreground mb-2 group-hover:text-primary transition-colors duration-300"
            )}>
              {typeof value === 'number' ? value.toLocaleString('pt-AO') : value}
            </div>

            {/* Description */}
            {description && (
              <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                {description}
              </p>
            )}

            {/* Bottom shine effect */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        )}
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

export { StatCard, type StatCardProps }; 