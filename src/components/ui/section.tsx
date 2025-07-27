import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "primary" | "secondary" | "muted";
  size?: "sm" | "md" | "lg" | "xl";
  pattern?: "none" | "dots" | "grid" | "diagonal";
  children: React.ReactNode;
}

interface SectionHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string;
  description?: string;
  badge?: string;
  centered?: boolean;
  className?: string;
}

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = "default", size = "md", pattern = "none", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-background",
      primary: "bg-gradient-hero text-primary-foreground",
      secondary: "bg-gradient-surface",
      muted: "bg-muted/30"
    };

    const sizeClasses = {
      sm: "py-4 md:py-6",
      md: "py-6 md:py-8",
      lg: "py-8 md:py-12",
      xl: "py-12 md:py-16"
    };

    const patternClasses = {
      none: "",
      dots: "bg-dots-pattern",
      grid: "bg-grid-pattern", 
      diagonal: "bg-diagonal-pattern"
    };

    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          variantClasses[variant],
          sizeClasses[size],
          patternClasses[pattern],
          className
        )}
        {...props}
      >
        {/* Pattern overlay */}
        {pattern !== "none" && (
          <div className="absolute inset-0 opacity-5">
            {pattern === "dots" && (
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }} />
            )}
            {pattern === "grid" && (
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }} />
            )}
            {pattern === "diagonal" && (
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 20px)`
              }} />
            )}
          </div>
        )}
        
        <div className="container mx-auto container-padding relative z-10">
          {children}
        </div>
      </section>
    );
  }
);

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  description,
  badge,
  centered = true,
  className
}) => {
  return (
    <div className={cn(
      "space-y-4 mb-6",
      centered && "text-center",
      className
    )}>
      {badge && (
        <div className={cn(
          "inline-flex items-center",
          !centered && "justify-start"
        )}>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {badge}
          </span>
        </div>
      )}
      
      {subtitle && (
        <p className="text-primary font-semibold tracking-wide uppercase text-sm">
          {subtitle}
        </p>
      )}
      
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
        {title}
      </h2>
      
      {description && (
        <p className={cn(
          "text-lg text-muted-foreground max-w-3xl",
          centered && "mx-auto"
        )}>
          {description}
        </p>
      )}
    </div>
  );
};

const SectionContent: React.FC<SectionContentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
    </div>
  );
};

const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  className
}) => {
  return (
    <h2 className={cn("text-3xl md:text-4xl lg:text-5xl font-bold text-foreground", className)}>
      {children}
    </h2>
  );
};

const SectionDescription: React.FC<SectionDescriptionProps> = ({
  children,
  className
}) => {
  return (
    <p className={cn("text-lg text-muted-foreground max-w-3xl mx-auto", className)}>
      {children}
    </p>
  );
};

Section.displayName = "Section";
SectionHeader.displayName = "SectionHeader";
SectionContent.displayName = "SectionContent";
SectionTitle.displayName = "SectionTitle";
SectionDescription.displayName = "SectionDescription";

export { Section, SectionHeader, SectionContent, SectionTitle, SectionDescription }; 