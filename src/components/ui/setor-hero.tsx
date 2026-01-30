import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  GraduationCapIcon,
  HeartIcon,
  SproutIcon,
  MountainIcon,
  BuildingIcon,
  PaletteIcon,
  ZapIcon,
  DropletsIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  UsersIcon,
  TargetIcon,
  StarIcon,
  SparklesIcon,
  GlobeIcon,
  AwardIcon,
  ClockIcon,
  MapPinIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectorHeroProps {
  setor: {
    slug: string;
    nome: string;
    descricao: string;
    missao?: string;
    estatisticas?: Array<{ nome: string; valor: string }>;
    programas?: Array<{ id: string; titulo: string }>;
    oportunidades?: Array<{ id: string; titulo: string }>;
    infraestruturas?: Array<{ id: string; nome: string }>;
  };
  className?: string;
  onExplorarProgramas?: () => void;
  onVerOportunidades?: () => void;
}

const getSectorIcon = (slug: string) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'educacao': GraduationCapIcon,
    'saude': HeartIcon,
    'agricultura': SproutIcon,
    'setor-mineiro': MountainIcon,
    'desenvolvimento-economico': BuildingIcon,
    'cultura': PaletteIcon,
    'tecnologia': ZapIcon,
    'energia-agua': DropletsIcon
  };
  return iconMap[slug] || BuildingIcon;
};

const getSectorGradient = (slug: string) => {
  const gradientMap: { [key: string]: string } = {
    'educacao': 'from-blue-700 via-blue-800 to-indigo-900',
    'saude': 'from-red-700 via-red-800 to-pink-900',
    'agricultura': 'from-green-700 via-emerald-800 to-teal-900',
    'setor-mineiro': 'from-slate-700 via-gray-800 to-zinc-900',
    'desenvolvimento-economico': 'from-purple-700 via-violet-800 to-indigo-900',
    'cultura': 'from-pink-700 via-rose-800 to-red-900',
    'tecnologia': 'from-indigo-700 via-blue-800 to-cyan-900',
    'energia-agua': 'from-cyan-700 via-blue-800 to-teal-900',
    'turismo': 'from-emerald-700 via-teal-800 to-cyan-900'
  };
  return gradientMap[slug] || 'from-blue-600 via-blue-700 to-indigo-800';
};

const getSectorAccent = (slug: string) => {
  const accentMap: { [key: string]: string } = {
    'educacao': 'from-blue-400 to-indigo-500',
    'saude': 'from-red-400 to-pink-500',
    'agricultura': 'from-green-400 to-emerald-500',
    'setor-mineiro': 'from-slate-400 to-gray-500',
    'desenvolvimento-economico': 'from-purple-400 to-violet-500',
    'cultura': 'from-pink-400 to-rose-500',
    'tecnologia': 'from-indigo-400 to-blue-500',
    'energia-agua': 'from-cyan-400 to-blue-500',
    'turismo': 'from-emerald-400 to-teal-500'
  };
  return accentMap[slug] || 'from-blue-400 to-indigo-500';
};

const getSectorColors = (slug: string) => {
  const colorMap: { [key: string]: { light: string; medium: string; dark: string; border: string; text: string; icon: string } } = {
    'educacao': {
      light: 'blue-100',
      medium: 'blue-300',
      dark: 'blue-800',
      border: 'blue-300',
      text: 'blue-800',
      icon: 'blue-700'
    },
    'saude': {
      light: 'red-100',
      medium: 'red-300',
      dark: 'red-800',
      border: 'red-300',
      text: 'red-800',
      icon: 'red-700'
    },
    'agricultura': {
      light: 'green-100',
      medium: 'green-300',
      dark: 'green-800',
      border: 'green-300',
      text: 'green-800',
      icon: 'green-700'
    },
    'setor-mineiro': {
      light: 'slate-100',
      medium: 'slate-300',
      dark: 'slate-800',
      border: 'slate-300',
      text: 'slate-800',
      icon: 'slate-700'
    },
    'desenvolvimento-economico': {
      light: 'purple-100',
      medium: 'purple-300',
      dark: 'purple-800',
      border: 'purple-300',
      text: 'purple-800',
      icon: 'purple-700'
    },
    'cultura': {
      light: 'pink-100',
      medium: 'pink-300',
      dark: 'pink-800',
      border: 'pink-300',
      text: 'pink-800',
      icon: 'pink-700'
    },
    'tecnologia': {
      light: 'indigo-100',
      medium: 'indigo-300',
      dark: 'indigo-800',
      border: 'indigo-300',
      text: 'indigo-800',
      icon: 'indigo-700'
    },
    'energia-agua': {
      light: 'cyan-100',
      medium: 'cyan-300',
      dark: 'cyan-800',
      border: 'cyan-300',
      text: 'cyan-800',
      icon: 'cyan-700'
    },
    'turismo': {
      light: 'emerald-100',
      medium: 'emerald-300',
      dark: 'emerald-800',
      border: 'emerald-300',
      text: 'emerald-800',
      icon: 'emerald-700'
    }
  };
  return colorMap[slug] || colorMap['educacao'];
};

const getSectorImages = (slug: string) => {
  const imageMap: { [key: string]: string[] } = {
    'educacao': [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85'
    ],
    'saude': [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85'
    ],
    'agricultura': [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
      'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85'
    ],
    'setor-mineiro': [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85'
    ],
    'desenvolvimento-economico': [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85'
    ],
    'cultura': [
      'https://images.unsplash.com/photo-1544216717-3bbf52512659?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85'
    ],
    'tecnologia': [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85'
    ],
    'energia-agua': [
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85'
    ]
  };
  return imageMap[slug] || [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85'
  ];
};

export const SectorHero: React.FC<SectorHeroProps> = ({ setor, className, onExplorarProgramas, onVerOportunidades }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Parallax mouse effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Image rotation effect
  useEffect(() => {
    if (!setor) return;
    const sectorImages = getSectorImages(setor.slug);
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sectorImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [setor]);

  // Intersection observer for entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!setor) return null;

  const IconComponent = getSectorIcon(setor.slug);
  const gradientClass = getSectorGradient(setor.slug);
  const accentClass = getSectorAccent(setor.slug);
  const sectorImages = getSectorImages(setor.slug);
  const sectorColors = getSectorColors(setor.slug);

  return (
    <section className={cn("relative overflow-hidden min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh] flex items-center", className)}>
      {/* Dynamic Background Images */}
      <div className="absolute inset-0">
        {sectorImages.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-2000",
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            )}
            style={{
              backgroundImage: `url(${image})`,
              transform: `translate(${(mousePosition.x - 50) * 0.02}px, ${(mousePosition.y - 50) * 0.02}px)`
            }}
          />
        ))}

        {/* Gradient Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br",
          gradientClass
        )}>
          {/* Additional dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/30"></div>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"
              style={{
                transform: `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px)`
              }}
            />
            <div
              className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse delay-1000"
              style={{
                transform: `translate(${(mousePosition.x - 50) * -0.05}px, ${(mousePosition.y - 50) * -0.05}px)`
              }}
            />
            <div
              className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-xl animate-pulse delay-500"
              style={{
                transform: `translate(${(mousePosition.x - 50) * 0.03}px, ${(mousePosition.y - 50) * 0.03}px)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

            {/* Left Column - Enhanced Main Content */}
            <div className={cn("text-white space-y-10", isVisible && "animate-fade-in-up")}>
              {/* Premium Location Badges */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 animate-fade-in-up">
                <Badge
                  variant="secondary"
                  className={cn(
                    `bg-gradient-to-r from-${sectorColors.light}/80 to-${sectorColors.medium}/60 text-${sectorColors.text} border-${sectorColors.border}/50 backdrop-blur-xl px-3 sm:px-4 py-2 shadow-lg hover:shadow-${sectorColors.medium}/25 transition-all duration-300 font-semibold text-xs sm:text-sm`
                  )}
                >
                  <MapPinIcon className={cn(`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-${sectorColors.icon}`)} />
                  <span className="whitespace-nowrap">Sector Estratégico</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn(
                    `bg-gradient-to-r from-${sectorColors.light}/80 to-${sectorColors.medium}/60 text-${sectorColors.text} border-${sectorColors.border}/50 backdrop-blur-xl px-3 sm:px-4 py-2 shadow-lg hover:shadow-${sectorColors.medium}/25 transition-all duration-300 font-semibold text-xs sm:text-sm`,
                    "animate-pulse"
                  )}
                >
                  <TrendingUpIcon className={cn(`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-${sectorColors.icon}`)} />
                  <span className="whitespace-nowrap">Em Crescimento</span>
                </Badge>
                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn(`w-2 h-2 rounded-full bg-gradient-to-r from-${sectorColors.medium} to-${sectorColors.dark} flex-shrink-0`)} />
                  <span className={cn(`text-${sectorColors.light} font-medium text-xs sm:text-sm drop-shadow-sm truncate`)}>
                    {setor.estatisticas?.length || 0} Indicadores
                  </span>
                </div>
              </div>

              {/* Enhanced Title with Professional Typography */}
              <div className="space-y-4 sm:space-y-6 animate-slide-up">
                <div className="relative">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                    <span className="block text-white/95 mb-1 sm:mb-2 text-sm sm:text-base">Sector de</span>
                    <span className={cn(
                      "block bg-gradient-to-r bg-clip-text text-transparent drop-shadow-2xl break-words",
                      accentClass
                    )}>
                      {setor.nome}
                    </span>
                  </h1>

                  {/* Accent line */}
                  <div className={cn(
                    "absolute -bottom-2 sm:-bottom-4 left-0 w-20 sm:w-32 h-0.5 sm:h-1 bg-gradient-to-r rounded-full shadow-lg animate-pulse",
                    accentClass
                  )} />
                </div>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-relaxed max-w-2xl font-medium drop-shadow-lg">
                  {setor.descricao}
                </p>
              </div>

              {/* Enhanced Quick Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 animate-fade-in-up delay-300">
                {setor.estatisticas?.slice(0, 3).map((stat: { nome: string; valor: string }, index: number) => (
                  <div key={index} className="text-center group">
                    <div className={cn(
                      "text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300",
                      "bg-gradient-to-r bg-clip-text text-transparent",
                      accentClass
                    )}>
                      {stat.valor}
                    </div>
                    <div className="text-xs sm:text-sm text-white font-semibold drop-shadow-sm leading-tight">
                      {stat.nome}
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up delay-500">
                <Button
                  size="lg"
                  className={cn(
                    "bg-white text-gray-900 hover:bg-white/90 font-bold shadow-xl hover:shadow-2xl transition-all duration-300",
                    "group relative overflow-hidden border-2 border-white text-sm sm:text-base"
                  )}
                  onClick={onExplorarProgramas}
                >
                  <span className="relative z-10 flex items-center">
                    <span className="whitespace-nowrap">Explorar Programas</span>
                    <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    accentClass
                  )} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={cn(
                    `border-2 border-${sectorColors.border} text-${sectorColors.text} hover:bg-${sectorColors.light}/50 backdrop-blur-xl shadow-lg hover:shadow-${sectorColors.medium}/25 transition-all duration-300 font-black bg-${sectorColors.light}/80 text-sm sm:text-base`
                  )}
                  onClick={onVerOportunidades}
                >
                  <span className="whitespace-nowrap">Ver Oportunidades</span>
                </Button>
              </div>
            </div>

            {/* Right Column - Enhanced Visual Elements */}
            <div className="relative animate-fade-in-up delay-200">
              {/* Main Icon with Enhanced Design */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative group">
                  {/* Icon Background with Enhanced Effects */}
                  <div className={cn(
                    "w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-2xl sm:rounded-3xl flex items-center justify-center",
                    "bg-white/20 backdrop-blur-xl border border-white/30",
                    "shadow-2xl hover:shadow-white/25 transition-all duration-500",
                    "group-hover:scale-110 group-hover:rotate-3"
                  )}>
                    <IconComponent className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 text-white group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  {/* Floating Elements with Enhanced Design */}
                  <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 animate-bounce">
                    <Card className={cn(
                      `bg-gradient-to-r from-${sectorColors.light}/80 to-${sectorColors.medium}/60 backdrop-blur-xl border-2 border-${sectorColors.border}/50 p-2 sm:p-4 shadow-xl`,
                      "hover:scale-105 transition-transform duration-300"
                    )}>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <TrendingUpIcon className={cn(`w-4 h-4 sm:w-5 sm:h-5 text-${sectorColors.icon} drop-shadow-md`)} />
                        <div>
                          <div className={cn(`text-${sectorColors.text} text-xs sm:text-sm font-black drop-shadow-md`)}>Crescimento</div>
                          <div className={cn(`text-${sectorColors.icon} text-xs font-bold drop-shadow-md`)}>+15% este ano</div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 animate-bounce delay-1000">
                    <Card className={cn(
                      `bg-gradient-to-r from-${sectorColors.light}/80 to-${sectorColors.medium}/60 backdrop-blur-xl border-2 border-${sectorColors.border}/50 p-2 sm:p-4 shadow-xl`,
                      "hover:scale-105 transition-transform duration-300"
                    )}>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <UsersIcon className={cn(`w-4 h-4 sm:w-5 sm:h-5 text-${sectorColors.icon} drop-shadow-md`)} />
                        <div>
                          <div className={cn(`text-${sectorColors.text} text-xs sm:text-sm font-black drop-shadow-md`)}>Comunidade</div>
                          <div className={cn(`text-${sectorColors.icon} text-xs font-bold drop-shadow-md`)}>Engajada</div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Additional floating elements */}
                  <div className="absolute top-1/2 -right-8 sm:-right-12 animate-pulse">
                    <div className={cn(
                      `w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-${sectorColors.medium} to-${sectorColors.dark} flex items-center justify-center`
                    )}>
                      <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-1/2 -left-8 sm:-left-12 animate-pulse delay-500">
                    <div className={cn(
                      `w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-${sectorColors.medium} to-${sectorColors.dark} flex items-center justify-center`
                    )}>
                      <SparklesIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Info Cards */}
              <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-4 sm:gap-6">
                <Card className={cn(
                  `bg-gradient-to-r from-${sectorColors.light}/90 to-${sectorColors.medium}/70 backdrop-blur-xl border-2 border-${sectorColors.border}/60 hover:scale-105 transition-all duration-300`,
                  `shadow-xl hover:shadow-${sectorColors.medium}/25`
                )}>
                  <CardContent className="p-4 sm:p-6 text-center">
                    <TargetIcon className={cn(`w-6 h-6 sm:w-8 sm:h-8 text-${sectorColors.icon} mx-auto mb-2 sm:mb-3 drop-shadow-md`)} />
                    <div className={cn(`text-${sectorColors.text} font-black text-sm sm:text-lg mb-1 sm:mb-2 drop-shadow-md`)}>Missão</div>
                    <div className={cn(`text-${sectorColors.icon} text-xs sm:text-sm leading-relaxed font-bold drop-shadow-md`)}>
                      {setor.missao?.substring(0, 50)}...
                    </div>
                  </CardContent>
                </Card>

                <Card className={cn(
                  `bg-gradient-to-r from-${sectorColors.light}/90 to-${sectorColors.medium}/70 backdrop-blur-xl border-2 border-${sectorColors.border}/60 hover:scale-105 transition-all duration-300`,
                  `shadow-xl hover:shadow-${sectorColors.medium}/25`
                )}>
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className={cn(`text-${sectorColors.text} font-black text-sm sm:text-lg mb-1 sm:mb-2 drop-shadow-md`)}>Programas</div>
                    <div className={cn(
                      `text-2xl sm:text-3xl md:text-4xl font-black mb-1 bg-gradient-to-r from-${sectorColors.medium} to-${sectorColors.dark} bg-clip-text text-transparent drop-shadow-xl`
                    )}>
                      {setor.programas?.length || 0}
                    </div>
                    <div className={cn(`text-${sectorColors.icon} text-xs sm:text-sm font-bold drop-shadow-md`)}>Activos</div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Stats Row */}
              <div className="mt-6 sm:mt-8 flex justify-center">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className={cn(`text-xl sm:text-2xl font-bold text-${sectorColors.light} drop-shadow-sm`)}>
                      {setor.oportunidades?.length || 0}
                    </div>
                    <div className={cn(`text-${sectorColors.light} text-xs sm:text-sm font-semibold drop-shadow-sm`)}>Oportunidades</div>
                  </div>
                  <div className={cn(`w-px h-6 sm:h-8 bg-${sectorColors.light}/50`)} />
                  <div className="text-center">
                    <div className={cn(`text-xl sm:text-2xl font-bold text-${sectorColors.light} drop-shadow-sm`)}>
                      {setor.infraestruturas?.length || 0}
                    </div>
                    <div className={cn(`text-${sectorColors.light} text-xs sm:text-sm font-semibold drop-shadow-sm`)}>Infraestruturas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12 sm:h-16 lg:h-20 text-white"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="currentColor"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="currentColor"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}; 