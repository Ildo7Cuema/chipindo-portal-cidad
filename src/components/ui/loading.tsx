import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Loader2, Zap, Activity } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "pulse" | "dots" | "bars" | "wave";
  text?: string;
  icon?: LucideIcon;
  className?: string;
  fullScreen?: boolean;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ 
    size = "md", 
    variant = "spinner", 
    text, 
    icon: Icon, 
    className, 
    fullScreen = false,
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6", 
      lg: "w-8 h-8",
      xl: "w-12 h-12"
    };

    const textSizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg", 
      xl: "text-xl"
    };

    const renderSpinner = () => (
      <Loader2 className={cn(sizeClasses[size], "animate-spin text-primary")} />
    );

    const renderPulse = () => (
      <div className={cn(
        sizeClasses[size], 
        "bg-primary rounded-full animate-pulse"
      )} />
    );

    const renderDots = () => (
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-primary rounded-full animate-bounce",
              size === "sm" ? "w-1.5 h-1.5" : 
              size === "md" ? "w-2 h-2" :
              size === "lg" ? "w-3 h-3" : "w-4 h-4"
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: "0.6s"
            }}
          />
        ))}
      </div>
    );

    const renderBars = () => (
      <div className="flex items-end gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-primary animate-pulse",
              size === "sm" ? "w-0.5 h-3" :
              size === "md" ? "w-1 h-4" :
              size === "lg" ? "w-1.5 h-6" : "w-2 h-8"
            )}
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: "1.2s"
            }}
          />
        ))}
      </div>
    );

    const renderWave = () => (
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-primary rounded-full",
              size === "sm" ? "w-1 h-1" :
              size === "md" ? "w-1.5 h-1.5" :
              size === "lg" ? "w-2 h-2" : "w-3 h-3"
            )}
            style={{
              animation: `wave 1.4s ease-in-out ${i * 0.1}s infinite`,
            }}
          />
        ))}
      </div>
    );

    const renderVariant = () => {
      switch (variant) {
        case "pulse":
          return renderPulse();
        case "dots":
          return renderDots();
        case "bars":
          return renderBars();
        case "wave":
          return renderWave();
        default:
          return renderSpinner();
      }
    };

    const content = (
      <div className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullScreen && "min-h-screen",
        className
      )} ref={ref} {...props}>
        <div className="flex items-center gap-3">
          {Icon && <Icon className={cn(sizeClasses[size], "text-primary")} />}
          {renderVariant()}
        </div>
        
        {text && (
          <p className={cn(
            textSizeClasses[size],
            "text-muted-foreground font-medium animate-pulse"
          )}>
            {text}
          </p>
        )}
      </div>
    );

    if (fullScreen) {
      return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          {content}
        </div>
      );
    }

    return content;
  }
);

Loading.displayName = "Loading";

// Specific loading components for common use cases
export const AdminLoading = () => (
  <Loading
    size="lg"
    variant="spinner"
    text="Carregando painel administrativo..."
    icon={Activity}
    fullScreen
    className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
  />
);

export const ContentLoading = ({ text = "Carregando conteúdo..." }: { text?: string }) => (
  <Loading
    size="md"
    variant="dots"
    text={text}
    className="py-12"
  />
);

export const QuickLoading = () => (
  <Loading
    size="sm"
    variant="spinner"
    className="py-2"
  />
);

export { Loading, type LoadingProps };

// Add CSS for wave animation
const style = document.createElement('style');
style.textContent = `
  @keyframes wave {
    0%, 40%, 100% {
      transform: scaleY(0.4);
      opacity: 0.5;
    }
    20% {
      transform: scaleY(1);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style); 