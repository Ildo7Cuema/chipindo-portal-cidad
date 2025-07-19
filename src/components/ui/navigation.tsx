import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon, UserIcon, FileTextIcon, ImageIcon, CalendarIcon, BuildingIcon } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  className?: string;
}

export const Navigation = ({ className }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Início", href: "/", icon: BuildingIcon },
    { label: "Notícias", href: "/noticias", icon: FileTextIcon },
    { label: "Concursos", href: "/concursos", icon: CalendarIcon },
    { label: "Acervo Digital", href: "/acervo", icon: ImageIcon },
    { label: "Serviços", href: "/servicos", icon: UserIcon },
    { label: "Contactos", href: "/contactos", icon: UserIcon },
  ];

  return (
    <nav className={cn("relative", className)}>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-foreground hover:text-primary transition-colors duration-300 font-medium flex items-center gap-2"
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </a>
        ))}
        <Button variant="institutional" size="sm">
          Área Administrativa
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2"
        >
          {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg shadow-elegant mt-2 md:hidden z-50">
          <div className="p-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-border">
              <Button variant="institutional" size="sm" className="w-full">
                Área Administrativa
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};