import * as React from 'react';
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
import { useState, useEffect } from "react";

interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ className }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSetoresOpen, setIsSetoresOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/");
  const [showBottomNav, setShowBottomNav] = useState(false);

  useEffect(() => {
    setActiveItem(window.location.pathname);
  }, []);

  // Scroll listener simplificado
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowBottomNav(currentScrollY > 100);
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

  const handleNavClick = (href: string) => {
    setActiveItem(href);
    setIsDrawerOpen(false);
    setIsSetoresOpen(false);
    window.location.href = href;
  };

  const isActive = (href: string) => activeItem === href;

  return (
    <>
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-10 w-10 p-0 rounded-full bg-background/80 backdrop-blur-sm border border-border/50"
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-[85vw] max-w-sm p-0 bg-background/95 backdrop-blur-xl border-r border-border/50 flex flex-col h-full"
          style={{ height: '100vh' }}
        >
          <SheetHeader className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5 flex-shrink-0">
            <SheetTitle className="text-left flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BuildingIcon className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold text-foreground">Portal de Chipindo</div>
                <div className="text-xs text-muted-foreground">Administração Municipal</div>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto min-h-0" style={{ height: 'calc(100vh - 80px)' }}>
            <div className="py-2">
              <div className="p-4 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                  Navegação Principal
                </div>

                {mainNavItems.map((item) => {
                  const IconComponent = item.icon;
                  const active = isActive(item.href);

                  return (
                    <button
                      key={item.label}
                      className={cn(
                        "w-full flex items-center gap-3 text-left p-3 rounded-xl transition-all duration-200",
                        active
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-foreground hover:bg-muted/50 hover:text-primary"
                      )}
                      onClick={() => handleNavClick(item.href)}
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                      {active && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 space-y-2 border-t border-border/50">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                  Sectores Estratégicos
                </div>

                <button
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-muted/50"
                  onClick={() => setIsSetoresOpen(!isSetoresOpen)}
                >
                  <div className="flex items-center gap-3">
                    <BuildingIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium flex-1 text-left">Ver Todos os Sectores</span>
                  </div>
                  <ChevronDownIcon className={cn(
                    "w-4 h-4 transition-transform duration-200 flex-shrink-0",
                    isSetoresOpen && "rotate-180"
                  )} />
                </button>

                {isSetoresOpen && (
                  <div className="ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {setoresItems.map((item) => {
                      const IconComponent = item.icon;
                      const active = isActive(item.href);

                      return (
                        <button
                          key={item.label}
                          className={cn(
                            "w-full flex items-center gap-3 text-left p-2.5 rounded-lg transition-all duration-200 text-sm",
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                          )}
                          onClick={() => handleNavClick(item.href)}
                        >
                          <IconComponent className="w-4 h-4 flex-shrink-0" />
                          <span className="flex-1 text-left">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2 border-t border-border/50">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                  Outros Serviços
                </div>

                {secondaryNavItems.map((item) => {
                  const IconComponent = item.icon;
                  const active = isActive(item.href);

                  return (
                    <button
                      key={item.label}
                      className={cn(
                        "w-full flex items-center gap-3 text-left p-3 rounded-xl transition-all duration-200",
                        active
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-foreground hover:bg-muted/50 hover:text-primary"
                      )}
                      onClick={() => handleNavClick(item.href)}
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 space-y-2 border-t border-border/50">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                  Administração
                </div>

                <button
                  className="w-full flex items-center gap-3 text-left p-3 rounded-xl transition-all duration-200 text-foreground hover:bg-muted/50 hover:text-primary"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    window.location.href = '/auth';
                  }}
                >
                  <UserIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium flex-1 text-left">Área Administrativa</span>
                  <ChevronRightIcon className="w-4 h-4 flex-shrink-0" />
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
        <div className="bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-lg">
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