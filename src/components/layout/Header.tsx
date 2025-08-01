import { Navigation } from "@/components/ui/navigation";
import { MobileNavigation } from "@/components/ui/mobile-navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import insigniaAngola from "@/assets/insignia-angola.png";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm" 
        : "bg-background border-b border-border/30"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title - Mobile Optimized */}
          <div className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-surface rounded-lg flex items-center justify-center shadow-sm border border-border/30 p-1 transition-all duration-300 group-hover:shadow-md">
              <img 
                src={insigniaAngola} 
                alt="Insígnia da República de Angola" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="space-y-0">
              <h1 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                Portal de Chipindo
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Administração Municipal
              </p>
            </div>

            <Badge 
              variant="outline" 
              className="hidden md:inline-flex bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-primary border-primary/30 text-xs px-2 py-0.5 ml-2 font-medium"
            >
              Oficial
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <Navigation />
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  );
};