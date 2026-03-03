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
  variant?: "default" | "glass" | "elevated" | "hero";
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
    // Sharp edges and brutalist spacing override standard rounded boxes
    const baseClasses = "group relative overflow-hidden transition-all duration-300 min-w-0 flex flex-col justify-between";

    // Removing the "Soft Gradient/Glass Trap", favoring solid contrast and minimal geometry.
    const variantClasses = {
      default: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl",
      glass: "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-100/50 dark:border-slate-800/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl",
      elevated: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl",
      hero: "bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 backdrop-blur-md border border-slate-200/50 dark:border-white/20 shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl"
    };

    const sizeClasses = {
      sm: "p-4 min-h-[120px]",
      md: "p-5 sm:p-6 min-h-[140px]",
      lg: "p-6 sm:p-8 min-h-[180px]"
    };

    const iconSizeClasses = {
      sm: "w-4 h-4 sm:w-5 sm:h-5",
      md: "w-5 h-5 sm:w-6 sm:h-6",
      lg: "w-6 h-6 sm:w-8 sm:h-8"
    };

    const valueSizeClasses = {
      sm: "text-lg sm:text-xl font-bold tracking-tight",
      md: "text-xl sm:text-2xl font-bold tracking-tight",
      lg: "text-2xl sm:text-3xl font-bold tracking-tight"
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Anti-cliché: No background gradients or floating blobs */}

        {loading ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className={cn("w-8 h-8 animate-pulse rounded-sm", variant === "hero" ? "bg-slate-300/50 dark:bg-white/20" : "bg-slate-200 dark:bg-slate-800")} />
              {trend && <div className={cn("w-16 h-5 animate-pulse rounded-sm", variant === "hero" ? "bg-slate-300/50 dark:bg-white/20" : "bg-slate-200 dark:bg-slate-800")} />}
            </div>
            <div className={cn("w-24 h-10 animate-pulse rounded-sm mt-4", variant === "hero" ? "bg-slate-300/50 dark:bg-white/20" : "bg-slate-200 dark:bg-slate-800")} />
            <div className={cn("w-32 h-4 animate-pulse rounded-sm mt-2", variant === "hero" ? "bg-slate-300/50 dark:bg-white/20" : "bg-slate-200 dark:bg-slate-800")} />
          </div>
        ) : (
          <div className="flex flex-col h-full min-w-0">
            {/* Header: Icon, Label, Trend in a responsive flex layout */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={cn(
                  "flex-shrink-0 p-2 border-2 rounded-sm transition-colors duration-200",
                  variant === "hero"
                    ? "bg-white/50 dark:bg-white/10 border-slate-300/50 dark:border-white/20 text-slate-800 dark:text-white group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
                    : "border-slate-900 dark:border-slate-100/20 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
                )}>
                  <Icon className={cn(iconSizeClasses[size])} strokeWidth={2.5} />
                </div>
                {/* min-w-0 and line-clamp ensure long titles don't overflow or abruptly truncate */}
                <span className={cn(
                  "text-xs sm:text-sm font-semibold line-clamp-2 flex-1 min-w-0 leading-tight",
                  variant === "hero" ? "text-slate-700 dark:text-white/80" : "text-slate-500 dark:text-slate-400"
                )}>
                  {label}
                </span>
              </div>

              {trend && (
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 border rounded-full flex-shrink-0 whitespace-nowrap shadow-sm",
                  variant === "hero"
                    ? (trend.isPositive !== false
                      ? "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20 dark:border-emerald-500/30"
                      : "text-rose-700 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/20 dark:border-rose-500/30")
                    : (trend.isPositive !== false
                      ? "text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20"
                      : "text-rose-700 bg-rose-50 border-rose-100 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20")
                )}>
                  <span className="text-xs">{trend.isPositive !== false ? "↑" : "↓"}</span>
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>

            <div className="mt-auto min-w-0">
              {/* Value text: Enormous and sharply truncated if necessary */}
              <div className={cn(
                valueSizeClasses[size],
                "mb-1 break-words leading-tight transition-transform duration-300 origin-left",
                variant === "hero" ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-slate-50"
              )} title={String(value)}>
                {typeof value === 'number' ? value.toLocaleString('pt-AO') : value}
              </div>

              {/* Description constrained with line-clamp to survive small screens gracefully */}
              {description && (
                <p className={cn(
                  "text-xs sm:text-sm font-medium line-clamp-2 leading-snug",
                  variant === "hero" ? "text-slate-600 dark:text-white/70" : "text-slate-500 dark:text-slate-400"
                )}>
                  {description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

export { StatCard, type StatCardProps }; 