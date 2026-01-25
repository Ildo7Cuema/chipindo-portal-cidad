import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCapIcon,
  HeartIcon,
  SproutIcon,
  PickaxeIcon,
  TrendingUpIcon,
  PaletteIcon,
  CpuIcon,
  ZapIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SetorNavigationProps {
  className?: string;
  showTitle?: boolean;
}

const setores = [
  {
    name: "Educação",
    slug: "educacao",
    icon: GraduationCapIcon,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    path: "/educacao"
  },
  {
    name: "Saúde",
    slug: "saude",
    icon: HeartIcon,
    color: "bg-red-100 text-red-800 border-red-200",
    path: "/saude"
  },
  {
    name: "Agricultura",
    slug: "agricultura",
    icon: SproutIcon,
    color: "bg-green-100 text-green-800 border-green-200",
    path: "/agricultura"
  },
  {
    name: "Sector Mineiro",
    slug: "setor-mineiro",
    icon: PickaxeIcon,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    path: "/setor-mineiro"
  },
  {
    name: "Desenvolvimento Económico",
    slug: "desenvolvimento-economico",
    icon: TrendingUpIcon,
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    path: "/desenvolvimento-economico"
  },
  {
    name: "Cultura",
    slug: "cultura",
    icon: PaletteIcon,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    path: "/cultura"
  },
  {
    name: "Tecnologia",
    slug: "tecnologia",
    icon: CpuIcon,
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    path: "/tecnologia"
  },
  {
    name: "Energia e Água",
    slug: "energia-agua",
    icon: ZapIcon,
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
    path: "/energia-agua"
  }
];

export const SetorNavigation = ({ className, showTitle = true }: SetorNavigationProps) => {
  const location = useLocation();
  const currentSetor = setores.find(setor => setor.path === location.pathname);
  const currentIndex = setores.findIndex(setor => setor.path === location.pathname);

  const prevSetor = currentIndex > 0 ? setores[currentIndex - 1] : null;
  const nextSetor = currentIndex < setores.length - 1 ? setores[currentIndex + 1] : null;

  if (!currentSetor) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {showTitle && (
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
            Navegar entre Setores
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore outros sectores estratégicos do município
          </p>
        </div>
      )}

      {/* Navegação Anterior/Próximo */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {prevSetor ? (
          <Link to={prevSetor.path}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 h-auto min-w-0 hover:bg-muted/80 hover:shadow-sm transition-all duration-200 group"
            >
              <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 group-hover:text-foreground transition-colors duration-200" />
              <span className="truncate hidden sm:inline group-hover:font-medium transition-all duration-200">{prevSetor.name}</span>
              <span className="truncate sm:hidden group-hover:font-medium transition-all duration-200">Anterior</span>
            </Button>
          </Link>
        ) : (
          <div className="w-20 sm:w-32" />
        )}

        <Badge variant="outline" className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-background border-border shadow-sm">
          <span className="hidden sm:inline font-medium">{currentIndex + 1} de {setores.length}</span>
          <span className="sm:hidden font-medium">{currentIndex + 1}/{setores.length}</span>
        </Badge>

        {nextSetor ? (
          <Link to={nextSetor.path}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 h-auto min-w-0 hover:bg-muted/80 hover:shadow-sm transition-all duration-200 group"
            >
              <span className="truncate hidden sm:inline group-hover:font-medium transition-all duration-200">{nextSetor.name}</span>
              <span className="truncate sm:hidden group-hover:font-medium transition-all duration-200">Próximo</span>
              <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 group-hover:text-foreground transition-colors duration-200" />
            </Button>
          </Link>
        ) : (
          <div className="w-20 sm:w-32" />
        )}
      </div>

      {/* Grid de Todos os Setores */}
      <Card>
        <CardContent className="p-2 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {setores.map((setor) => {
              const IconComponent = setor.icon;
              const isActive = setor.path === location.pathname;

              return (
                <Link key={setor.slug} to={setor.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full h-auto p-2 sm:p-3 flex flex-col items-center gap-1 sm:gap-2 transition-all duration-200 group",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted/80 hover:shadow-sm"
                    )}
                  >
                    <IconComponent className={cn(
                      "w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    <span className={cn(
                      "text-xs font-medium text-center leading-tight truncate w-full transition-colors duration-200",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground group-hover:font-semibold"
                    )}>
                      {setor.name}
                    </span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 