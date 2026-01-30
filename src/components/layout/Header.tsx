import { Navigation } from "@/components/ui/navigation";
import { MobileNavigation } from "@/components/ui/mobile-navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import insigniaAngola from "@/assets/insignia-angola.png";
import headerLogo from "@/assets/logo_Rodape_huila.png";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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
        <div className="flex items-center justify-between min-h-[3.5rem] py-2 gap-4">
          {/* Logo - aligned within TopBar margins */}
          <div className="flex items-center gap-2 shrink-0 min-w-0">
            <div className="w-8 h-8 shrink-0 bg-gradient-surface rounded-lg flex items-center justify-center shadow-sm border border-border/30 p-1 transition-all duration-300 group-hover:shadow-md">
              <img
                src={insigniaAngola}
                alt="Insígnia da República de Angola"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center h-[2.75rem]">
              <img
                src={headerLogo}
                alt="Chipindo - Huíla"
                className="max-h-[2.75rem] w-auto object-contain object-center border-0 outline-none block"
              />
            </div>
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