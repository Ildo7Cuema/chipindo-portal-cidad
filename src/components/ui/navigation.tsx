import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  MenuIcon, 
  XIcon, 
  UserIcon, 
  FileTextIcon, 
  ImageIcon, 
  CalendarIcon, 
  BuildingIcon,
  HomeIcon,
  PhoneIcon,
  WrenchIcon
} from "lucide-react";
import { useState, useEffect } from "react";

interface NavigationProps {
  className?: string;
}

export const Navigation = ({ className }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/");

  useEffect(() => {
    setActiveItem(window.location.pathname);
  }, []);

  const navItems = [
    { label: "Início", href: "/", icon: HomeIcon },
    { label: "Notícias", href: "/noticias", icon: FileTextIcon },
    { label: "Concursos", href: "/concursos", icon: CalendarIcon },
    { label: "Acervo", href: "/acervo", icon: ImageIcon },
    { label: "Organigrama", href: "/organigrama", icon: UserIcon },
    { label: "Serviços", href: "/servicos", icon: WrenchIcon },
    { label: "Contactos", href: "/contactos", icon: PhoneIcon },
  ];

  const handleNavClick = (href: string) => {
    setActiveItem(href);
    setIsMenuOpen(false);
    window.location.href = href;
  };

  const isActive = (href: string) => activeItem === href;

  return (
    <nav className={cn("relative", className)}>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.href);
          
          return (
            <Button
              key={item.label}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2.5 text-sm font-medium transition-colors duration-200",
                active 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              onClick={() => handleNavClick(item.href)}
            >
              <IconComponent className="w-3.5 h-3.5 mr-2" />
              {item.label}
            </Button>
          );
        })}
        
        <div className="ml-2 pl-2 border-l border-border/50">
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 px-2.5 text-sm text-primary border-primary/30 hover:bg-primary/5"
            onClick={() => window.location.href = '/auth'}
          >
            <UserIcon className="w-3.5 h-3.5 mr-1.5" />
            Admin
          </Button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="h-8 w-8 p-0"
        >
          {isMenuOpen ? <XIcon className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          
          <div className="absolute top-full right-0 w-64 bg-card border border-border rounded-lg shadow-floating mt-2 lg:hidden z-50 overflow-hidden">
            <div className="p-3 border-b border-border bg-muted/50">
              <h3 className="font-medium text-sm text-foreground">Menu</h3>
            </div>
            
            <div className="p-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.href);
                
                return (
                  <button
                    key={item.label}
                    className={cn(
                      "w-full flex items-center gap-3 text-left p-2.5 rounded-md transition-colors duration-200",
                      active 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    onClick={() => handleNavClick(item.href)}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
              
              <div className="border-t border-border mt-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full h-8 text-sm"
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.location.href = '/auth';
                  }}
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  Área Administrativa
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};