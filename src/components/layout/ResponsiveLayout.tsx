import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

export const ResponsiveLayout = ({ 
  children, 
  className,
  maxWidth = "xl",
  padding = "md",
  spacing = "md"
}: ResponsiveLayoutProps) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full"
  };

  const paddingClasses = {
    none: "",
    sm: "px-4 sm:px-6",
    md: "px-4 sm:px-6 lg:px-8",
    lg: "px-6 sm:px-8 lg:px-12"
  };

  const spacingClasses = {
    none: "",
    sm: "py-8 sm:py-12",
    md: "py-12 sm:py-16 lg:py-20",
    lg: "py-16 sm:py-20 lg:py-24",
    xl: "py-20 sm:py-24 lg:py-32"
  };

  return (
    <div className={cn(
      "w-full mx-auto",
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      spacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  );
};

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  fluid?: boolean;
}

export const ResponsiveContainer = ({ 
  children, 
  className,
  fluid = false 
}: ResponsiveContainerProps) => {
  return (
    <div className={cn(
      "w-full mx-auto",
      fluid ? "px-4 sm:px-6 lg:px-8" : "container mx-auto px-4 sm:px-6 lg:px-8",
      className
    )}>
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "sm" | "md" | "lg" | "xl";
}

export const ResponsiveGrid = ({ 
  children, 
  className,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = "md"
}: ResponsiveGridProps) => {
  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8", 
    xl: "gap-10"
  };

  const gridColsClasses = [
    "grid",
    cols.sm ? `grid-cols-${cols.sm}` : "grid-cols-1",
    cols.md ? `md:grid-cols-${cols.md}` : "",
    cols.lg ? `lg:grid-cols-${cols.lg}` : "",
    cols.xl ? `xl:grid-cols-${cols.xl}` : "",
    gapClasses[gap]
  ].filter(Boolean).join(" ");

  return (
    <div className={cn(gridColsClasses, className)}>
      {children}
    </div>
  );
};

interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  elevated?: boolean;
}

export const ResponsiveCard = ({ 
  children, 
  className,
  interactive = false,
  elevated = false
}: ResponsiveCardProps) => {
  return (
    <div className={cn(
      "bg-card border border-border rounded-xl p-4 sm:p-6 transition-all duration-300",
      interactive && "hover:shadow-elegant hover:-translate-y-1 cursor-pointer",
      elevated && "shadow-elevated hover:shadow-floating",
      className
    )}>
      {children}
    </div>
  );
};

interface ResponsiveSectionProps {
  children: ReactNode;
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "default" | "muted" | "gradient";
}

export const ResponsiveSection = ({ 
  children, 
  className,
  spacing = "md",
  background = "default"
}: ResponsiveSectionProps) => {
  const spacingClasses = {
    none: "",
    sm: "py-8 sm:py-12",
    md: "py-12 sm:py-16 lg:py-20",
    lg: "py-16 sm:py-20 lg:py-24",
    xl: "py-20 sm:py-24 lg:py-32"
  };

  const backgroundClasses = {
    default: "bg-background",
    muted: "bg-muted/50",
    gradient: "bg-gradient-surface"
  };

  return (
    <section className={cn(
      spacingClasses[spacing],
      backgroundClasses[background],
      className
    )}>
      {children}
    </section>
  );
};

interface ResponsiveTextProps {
  children: ReactNode;
  className?: string;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "lead" | "small" | "muted";
  align?: "left" | "center" | "right";
}

export const ResponsiveText = ({ 
  children, 
  className,
  variant = "body",
  align = "left"
}: ResponsiveTextProps) => {
  const variantClasses = {
    h1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight",
    h2: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight",
    h3: "text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-tight",
    h4: "text-base sm:text-lg md:text-xl lg:text-2xl font-semibold leading-tight",
    h5: "text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-tight",
    h6: "text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-tight",
    body: "text-sm sm:text-base leading-relaxed",
    lead: "text-base sm:text-lg md:text-xl leading-relaxed",
    small: "text-xs sm:text-sm leading-relaxed",
    muted: "text-sm sm:text-base text-muted-foreground leading-relaxed"
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <div className={cn(
      variantClasses[variant],
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  );
}; 