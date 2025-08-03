import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPinIcon, 
  TrendingUpIcon, 
  ArrowRightIcon,
  StarIcon,
  SparklesIcon,
  UsersIcon
} from 'lucide-react';

interface MobileHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  stats?: Array<{ nome: string; valor: string }>;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    light: string;
    dark: string;
  };
  icon: React.ReactNode;
  onExplorePrograms?: () => void;
  onViewOpportunities?: () => void;
}

export const MobileHero: React.FC<MobileHeroProps> = ({
  title,
  subtitle,
  description,
  stats = [],
  colorScheme,
  icon,
  onExplorePrograms,
  onViewOpportunities
}) => {
  return (
    <section className={cn(
      'relative overflow-hidden',
      'min-h-[100vh] sm:min-h-[90vh]',
      'flex items-center justify-center',
      'bg-gradient-to-br',
      colorScheme.primary,
      'px-4 sm:px-6 lg:px-8',
      'py-8 sm:py-12 lg:py-16'
    )}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/20 sm:bg-black/30" />
        <div className="absolute inset-0 opacity-10 sm:opacity-20">
          <div className="absolute top-8 left-8 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full blur-2xl sm:blur-3xl animate-pulse" />
          <div className="absolute bottom-8 right-8 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full blur-xl sm:blur-2xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full blur-lg sm:blur-xl animate-pulse delay-500" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto">
        <div className="text-center space-y-6 sm:space-y-8">
          
          {/* Premium Badges */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 animate-fade-in-up">
            <Badge 
              variant="secondary" 
              className={cn(
                'bg-gradient-to-r',
                colorScheme.light,
                'text-white border-white/30',
                'backdrop-blur-xl px-3 py-1.5 sm:px-4 sm:py-2',
                'shadow-lg hover:shadow-white/25',
                'transition-all duration-300 font-semibold',
                'text-xs sm:text-sm'
              )}
            >
              <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Sector Estratégico
            </Badge>
            <Badge 
              variant="secondary" 
              className={cn(
                'bg-gradient-to-r',
                colorScheme.light,
                'text-white border-white/30',
                'backdrop-blur-xl px-3 py-1.5 sm:px-4 sm:py-2',
                'shadow-lg hover:shadow-white/25',
                'transition-all duration-300 font-semibold animate-pulse',
                'text-xs sm:text-sm'
              )}
            >
              <TrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Em Crescimento
            </Badge>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-white/60 to-white/40" />
              <span className="text-white/80 font-medium text-xs sm:text-sm drop-shadow-sm">
                {stats.length} Indicadores
              </span>
            </div>
          </div>

          {/* Main Icon */}
          <div className="flex justify-center animate-fade-in-up delay-200">
            <div className="relative group">
              <div className={cn(
                'w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40',
                'rounded-2xl sm:rounded-3xl',
                'flex items-center justify-center',
                'bg-white/20 backdrop-blur-xl',
                'border border-white/30',
                'shadow-2xl hover:shadow-white/25',
                'transition-all duration-500',
                'group-hover:scale-110 group-hover:rotate-3'
              )}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white group-hover:scale-110 transition-transform duration-500">
                  {icon}
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-6 md:-right-6 animate-bounce">
                <Card className={cn(
                  'bg-gradient-to-r',
                  colorScheme.light,
                  'backdrop-blur-xl border-2 border-white/50',
                  'p-1.5 sm:p-2 md:p-4 shadow-xl',
                  'hover:scale-105 transition-transform duration-300',
                  'w-12 h-12 sm:w-16 sm:h-16 md:w-auto md:h-auto'
                )}>
                  <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                    <TrendingUpIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-5 md:h-5 text-white drop-shadow-md" />
                    <div className="hidden md:block">
                      <div className="text-white text-xs sm:text-sm font-black drop-shadow-md">Crescimento</div>
                      <div className="text-white/80 text-xs font-bold drop-shadow-md">+15%</div>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 md:-bottom-6 md:-left-6 animate-bounce delay-1000">
                <Card className={cn(
                  'bg-gradient-to-r',
                  colorScheme.light,
                  'backdrop-blur-xl border-2 border-white/50',
                  'p-1.5 sm:p-2 md:p-4 shadow-xl',
                  'hover:scale-105 transition-transform duration-300',
                  'w-12 h-12 sm:w-16 sm:h-16 md:w-auto md:h-auto'
                )}>
                  <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                    <UsersIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-5 md:h-5 text-white drop-shadow-md" />
                    <div className="hidden md:block">
                      <div className="text-white text-xs sm:text-sm font-black drop-shadow-md">Comunidade</div>
                      <div className="text-white/80 text-xs font-bold drop-shadow-md">Engajada</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Additional floating elements */}
              <div className="absolute top-1/2 -right-6 sm:-right-8 md:-right-12 animate-pulse">
                <div className={cn(
                  'w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8',
                  'rounded-full bg-gradient-to-r',
                  colorScheme.accent,
                  'flex items-center justify-center'
                )}>
                  <StarIcon className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
                </div>
              </div>
              
              <div className="absolute bottom-1/2 -left-6 sm:-left-8 md:-left-12 animate-pulse delay-500">
                <div className={cn(
                  'w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6',
                  'rounded-full bg-gradient-to-r',
                  colorScheme.accent,
                  'flex items-center justify-center'
                )}>
                  <SparklesIcon className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Title */}
          <div className="space-y-4 sm:space-y-6 animate-slide-up">
            <div className="relative">
              <h1 className={cn(
                'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
                'font-bold leading-tight',
                'text-white/95',
                'px-2 sm:px-0'
              )}>
                {subtitle && (
                  <span className="block text-sm sm:text-lg md:text-xl lg:text-2xl mb-1 sm:mb-2 md:mb-3">
                    {subtitle}
                  </span>
                )}
                <span className={cn(
                  'block bg-gradient-to-r',
                  colorScheme.accent,
                  'bg-clip-text text-transparent',
                  'drop-shadow-2xl'
                )}>
                  {title}
                </span>
              </h1>
              
              {/* Accent line */}
              <div className={cn(
                'absolute -bottom-1 sm:-bottom-2 md:-bottom-4 left-1/2 transform -translate-x-1/2',
                'w-12 sm:w-16 md:w-24 h-0.5 sm:h-1',
                'bg-gradient-to-r',
                colorScheme.accent,
                'rounded-full shadow-lg animate-pulse'
              )} />
            </div>
            
            <p className={cn(
              'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl',
              'text-white leading-relaxed',
              'font-medium drop-shadow-lg',
              'max-w-2xl mx-auto',
              'px-2 sm:px-0'
            )}>
              {description}
            </p>
          </div>

          {/* Enhanced Quick Stats */}
          {stats.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 animate-fade-in-up delay-300">
              {stats.slice(0, 3).map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={cn(
                    'text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1 md:mb-2',
                    'group-hover:scale-110 transition-transform duration-300',
                    'bg-gradient-to-r',
                    colorScheme.accent,
                    'bg-clip-text text-transparent'
                  )}>
                    {stat.valor}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-white font-semibold drop-shadow-sm leading-tight">
                    {stat.nome}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up delay-500 w-full max-w-sm sm:max-w-md mx-auto">
            <Button 
              size="lg" 
              onClick={onExplorePrograms}
              className={cn(
                'bg-white text-gray-900 hover:bg-white/90',
                'font-bold shadow-xl hover:shadow-2xl',
                'transition-all duration-300',
                'group relative overflow-hidden',
                'border-2 border-white',
                'h-12 sm:h-14 md:h-16',
                'text-xs sm:text-sm md:text-base',
                'px-3 sm:px-4 md:px-6',
                'min-h-[48px] sm:min-h-[56px] md:min-h-[64px]',
                'touch-target'
              )}
            >
              <span className="relative z-10 flex items-center justify-center w-full">
                <span className="text-xs sm:text-sm md:text-base font-bold">
                  Explorar Programas
                </span>
                <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
              </span>
              <div className={cn(
                'absolute inset-0 bg-gradient-to-r opacity-0',
                'group-hover:opacity-100 transition-opacity duration-300',
                colorScheme.accent
              )} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={onViewOpportunities}
              className={cn(
                'border-2 text-white hover:bg-white/10',
                'backdrop-blur-xl shadow-lg',
                'transition-all duration-300 font-black',
                'bg-white/10',
                'h-12 sm:h-14 md:h-16',
                'text-xs sm:text-sm md:text-base',
                'px-3 sm:px-4 md:px-6',
                'min-h-[48px] sm:min-h-[56px] md:min-h-[64px]',
                'touch-target'
              )}
            >
              <span className="text-xs sm:text-sm md:text-base font-bold">
                Ver Oportunidades
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-8 sm:h-12 md:h-16 lg:h-20 text-white"
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