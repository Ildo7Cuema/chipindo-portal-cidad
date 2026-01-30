import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  MenuIcon,
  HomeIcon,
  FileTextIcon,
  CalendarIcon,
  ImageIcon,
  UserIcon,
  PhoneIcon,
  WrenchIcon,
  ChevronDownIcon,
  GraduationCapIcon,
  HeartIcon,
  SproutIcon,
  PickaxeIcon,
  TrendingUpIcon,
  PaletteIcon,
  CpuIcon,
  ZapIcon,
  BuildingIcon,
  ChevronRightIcon
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ className }) => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSetoresOpen, setIsSetoresOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/");
  const [showBottomNav, setShowBottomNav] = useState(false);

  useEffect(() => {
    setActiveItem(window.location.pathname);
  }, []);

  // Scroll listener com requestAnimationFrame para melhor performance em mobile
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setShowBottomNav((prev) => {
          const next = y > 100;
          return next !== prev ? next : prev;
        });
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNavItems = [
    { label: "Início", href: "/", icon: HomeIcon },
    { label: "Notícias", href: "/noticias", icon: FileTextIcon },
    { label: "Concursos", href: "/concursos", icon: CalendarIcon },
    { label: "Acervo", href: "/acervo", icon: ImageIcon },
  ];

  const secondaryNavItems = [
    { label: "Organigrama", href: "/organigrama", icon: UserIcon },
    { label: "Serviços", href: "/servicos", icon: WrenchIcon },
    { label: "Contactos", href: "/contactos", icon: PhoneIcon },
  ];

  const setoresItems = [
    { label: "Educação", href: "/educacao", icon: GraduationCapIcon },
    { label: "Saúde", href: "/saude", icon: HeartIcon },
    { label: "Agricultura", href: "/agricultura", icon: SproutIcon },
    { label: "Sector Mineiro", href: "/setor-mineiro", icon: PickaxeIcon },
    { label: "Desenvolvimento Económico", href: "/desenvolvimento-economico", icon: TrendingUpIcon },
    { label: "Cultura", href: "/cultura", icon: PaletteIcon },
    { label: "Tecnologia", href: "/tecnologia", icon: CpuIcon },
    { label: "Energia e Água", href: "/energia-agua", icon: ZapIcon },
  ];

  const handleNavClick = useCallback((href: string) => {
    setActiveItem(href);
    setIsDrawerOpen(false);
    setIsSetoresOpen(false);
    navigate(href);
  }, [navigate]);

  const isActive = (href: string) => activeItem === href;

  return (
    <>
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-10 w-10 p-0 rounded-full bg-background/80 border border-border/50"
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-[85vw] max-w-sm p-0 bg-background border-r border-border/50 flex flex-col h-full data-[state=open]:duration-300 data-[state=closed]:duration-250"
          style={{ height: '100vh' }}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            requestAnimationFrame(() => (document.activeElement as HTMLElement)?.blur());
          }}
        >
          <SheetHeader className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5 flex-shrink-0">
            <SheetTitle className="text-left flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shrink-0">
                <BuildingIcon className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold text-foreground">Portal de Chipindo</div>
                <div className="text-xs text-muted-foreground">Administração Municipal</div>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div
            className="flex-1 overflow-y-auto min-h-0 overscroll-contain"
            style={{ height: 'calc(100vh - 80px)', WebkitOverflowScrolling: 'touch' }}
          >
            <div className="py-2">
              <div className="px-3 py-2 space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Navegação Principal
                </div>
                {mainNavItems.map((item) => {
                  const IconComponent = item.icon;
                  const active = isActive(item.href);
                  return (
                    <button
                      key={item.label}
                      className={cn(
                        "w-full flex items-center gap-3 text-left p-2.5 rounded-lg transition-colors duration-200",
                        active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                      )}
                      onClick={() => handleNavClick(item.href)}
                    >
                      <IconComponent className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium text-sm">{item.label}</span>
                      {active && <div className="w-1.5 h-1.5 bg-primary rounded-full ml-auto" />}
                    </button>
                  );
                })}
              </div>

              <div className="px-3 py-2 space-y-1 border-t border-border/50">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Sectores Estratégicos
                </div>
                <button
                  className="w-full flex items-center justify-between p-2.5 rounded-lg transition-colors duration-200 hover:bg-muted/50"
                  onClick={() => setIsSetoresOpen(!isSetoresOpen)}
                >
                  <div className="flex items-center gap-3">
                    <BuildingIcon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-medium text-sm text-left">Ver Todos os Sectores</span>
                  </div>
                  <ChevronDownIcon className={cn("w-4 h-4 transition-transform duration-200", isSetoresOpen && "rotate-180")} />
                </button>
                {isSetoresOpen && (
                  <div className="ml-4 space-y-0.5 animate-in slide-in-from-top-2 duration-200">
                    {setoresItems.map((item) => {
                      const IconComponent = item.icon;
                      const active = isActive(item.href);
                      return (
                        <button
                          key={item.label}
                          className={cn(
                            "w-full flex items-center gap-3 text-left p-2 rounded-lg transition-colors duration-200 text-sm",
                            active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/30"
                          )}
                          onClick={() => handleNavClick(item.href)}
                        >
                          <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="text-left">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="px-3 py-2 space-y-1 border-t border-border/50">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Outros Serviços
                </div>
                {secondaryNavItems.map((item) => {
                  const IconComponent = item.icon;
                  const active = isActive(item.href);
                  return (
                    <button
                      key={item.label}
                      className={cn(
                        "w-full flex items-center gap-3 text-left p-2.5 rounded-lg transition-colors duration-200",
                        active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                      )}
                      onClick={() => handleNavClick(item.href)}
                    >
                      <IconComponent className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="px-3 py-2 border-t border-border/50">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Administração
                </div>
                <button
                  className="w-full flex items-center gap-3 text-left p-2.5 rounded-lg transition-colors duration-200 text-foreground hover:bg-muted/50"
                  onClick={() => handleNavClick('/auth')}
                >
                  <UserIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-sm">Área Administrativa</span>
                  <ChevronRightIcon className="w-4 h-4 flex-shrink-0 ml-auto" />
                </button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300",
        showBottomNav ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="bg-background border-t border-border/50 shadow-lg">
          <div className="flex items-center justify-around p-2">
            {mainNavItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);

              return (
                <button
                  key={item.label}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1",
                    active
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => handleNavClick(item.href)}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-xs font-medium truncate">{item.label}</span>
                </button>
              );
            })}

            <button
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={() => setIsDrawerOpen(true)}
            >
              <MenuIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Mais</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}; 