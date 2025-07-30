import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Section, SectionContent } from "@/components/ui/section";
import { ArrowRightIcon, MapPinIcon, UsersIcon, BuildingIcon, FileTextIcon, SparklesIcon, TrendingUpIcon, PlayCircleIcon, StarIcon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useRealTimeStats } from "@/hooks/useRealTimeStats";
import { useHeroCarousel } from "@/hooks/useHeroCarousel";
import { useHeroStats } from "@/hooks/useHeroStats";
import { cn } from "@/lib/utils";

export const Hero = () => {
  const plugin = useRef(
    Autoplay({ delay: 7000, stopOnInteraction: true })
  );
  const { settings } = useSiteSettings();
  const { stats } = useRealTimeStats();
  const { images: carouselImages, loading: carouselLoading } = useHeroCarousel();
  const { 
    populationFormatted, 
    growthRate, 
    sectors, 
    projects, 
    opportunities,
    loading: heroStatsLoading 
  } = useHeroStats();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // High-quality 4K images from Unsplash - Angola/Africa focused
  const highQualityImages = [
    { 
      src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=85", 
      title: "Agricultura Sustentável",
      description: "Terras férteis de Chipindo produzindo culturas diversificadas com técnicas modernas e sustentáveis para alimentar a comunidade e gerar prosperidade econômica",
      category: "Agricultura",
      overlay: "from-green-900/90 via-green-800/70 to-emerald-900/80",
      accent: "emerald"
    },
    { 
      src: "https://images.unsplash.com/photo-1544216717-3bbf52512659?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=85", 
      title: "Cultura Angolana Vibrante",
      description: "Celebrando a rica herança cultural de Angola através de tradições, música, dança e artesanato que conectam gerações e fortalecem nossa identidade",
      category: "Cultura",
      overlay: "from-orange-900/90 via-red-800/70 to-yellow-900/80",
      accent: "orange"
    },
    { 
      src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=85", 
      title: "Recursos Hídricos Abundantes",
      description: "Rios cristalinos e recursos hídricos naturais de Chipindo proporcionando água pura, energia hidroelétrica e oportunidades de desenvolvimento sustentável",
      category: "Recursos Hídricos",
      overlay: "from-blue-900/90 via-cyan-800/70 to-teal-900/80",
      accent: "blue"
    },
    { 
      src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=85", 
      title: "Riqueza Mineral - Ouro",
      description: "Depósitos auríferos e recursos minerais preciosos que impulsionam a economia local através da mineração responsável e desenvolvimento tecnológico",
      category: "Recursos Minerais",
      overlay: "from-yellow-900/90 via-amber-800/70 to-orange-900/80",
      accent: "gold"
    },
    { 
      src: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=85", 
      title: "Turismo Natural Exuberante",
      description: "Paisagens deslumbrantes da savana africana e biodiversidade única criando oportunidades de ecoturismo e preservação ambiental",
      category: "Turismo",
      overlay: "from-purple-900/90 via-indigo-800/70 to-blue-900/80",
      accent: "purple"
    },
    { 
      src: "https://images.unsplash.com/photo-1580500550469-4e3ad1f36eff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=85", 
      title: "Desenvolvimento Urbano Moderno",
      description: "Infraestrutura moderna e planejamento urbano inteligente transformando Chipindo em uma cidade modelo de crescimento equilibrado e qualidade de vida",
      category: "Desenvolvimento",
      overlay: "from-slate-900/90 via-gray-800/70 to-zinc-900/80",
      accent: "slate"
    },
    { 
      src: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=85", 
      title: "Comunidade e Tradição",
      description: "O povo de Chipindo mantendo vivas as tradições ancestrais enquanto abraça o progresso e constrói um futuro próspero para as novas gerações",
      category: "Comunidade",
      overlay: "from-rose-900/90 via-pink-800/70 to-red-900/80",
      accent: "rose"
    }
  ];

  // Use custom images if available and not loading, otherwise use high-quality fallback
  const imagesToDisplay = !carouselLoading && carouselImages.length > 0 
    ? carouselImages.map(img => ({
    src: img.image_url,
    title: img.title,
        description: img.description || "",
        category: "Personalizado",
        overlay: "from-primary/90 via-primary/70 to-primary/80",
        accent: "gold"
      }))
    : highQualityImages;

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imagesToDisplay.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [imagesToDisplay.length]);

  // Reset slide when images change
  useEffect(() => {
    setCurrentSlide(0);
  }, [carouselImages.length]);

  // Intersection observer for entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Preload images for better performance
  useEffect(() => {
    highQualityImages.forEach(image => {
      const img = new Image();
      img.src = image.src;
    });
  }, []);

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Agricultura': '🌾',
      'Cultura': '🎭',
      'Recursos Hídricos': '💧',
      'Recursos Minerais': '⚡',
      'Turismo': '🏞️',
      'Desenvolvimento': '🏗️',
      'Comunidade': '👥',
      'Personalizado': '✨'
    };
    return icons[category as keyof typeof icons] || '✨';
  };

  const currentImage = imagesToDisplay[currentSlide];

  return (
    <Section variant="primary" size="xl" className="relative py-16 lg:py-24">
      {/* Hero Content - Main Section */}
      <SectionContent className="relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center w-full min-h-[60vh]">
          {/* Left Column - Enhanced Hero Content */}
          <div className={cn("space-y-10", isVisible && "animate-fade-in-up")}>
            {/* Premium Location Badges */}
            <div className="flex items-center gap-3 animate-fade-in-up">
              <Badge 
                variant="secondary" 
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-primary-foreground border-yellow-400/40 backdrop-blur-xl px-4 py-2 shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
              >
                <MapPinIcon className="w-4 h-4 mr-2 text-yellow-400" />
              {settings?.hero_location_badge || 'Província de Huíla, Angola'}
            </Badge>
              <Badge 
                variant="secondary" 
                className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-primary-foreground border-emerald-400/40 backdrop-blur-xl px-4 py-2 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
              >
                <TrendingUpIcon className="w-4 h-4 mr-2 text-emerald-400 animate-pulse" />
                Rica em Potencialidades
              </Badge>
          </div>
          
            {/* Golden Title with Professional Typography */}
            <div className="space-y-8 animate-slide-up">
              <div className="relative">
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
                  {settings?.hero_title || (
                    <>
                      <span className="block text-primary-foreground/95 mb-2">Bem-vindos ao</span>
                      <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
                        Portal de
                      </span>
                      <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
                        Chipindo
                      </span>
                    </>
                  )}
          </h1>
          
                {/* Golden accent line */}
                <div className="absolute -bottom-4 left-0 w-32 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 rounded-full shadow-lg shadow-yellow-500/50 animate-pulse" />
              </div>
              
              <p className="text-xl md:text-2xl xl:text-3xl text-primary-foreground/95 max-w-3xl leading-relaxed font-light">
                {settings?.hero_subtitle || (
                  <>
                    Descobra as{' '}
                    <span className="font-semibold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      riquezas naturais
                    </span>
                    , culturais e econômicas que fazem de Chipindo um{' '}
                    <span className="font-semibold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      tesouro de potencialidades
                    </span>{' '}
                    no coração de Angola.
                  </>
                )}
              </p>
            </div>
            
            {/* Simplified Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
            <Button 
              size="lg" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white shadow-2xl hover:shadow-yellow-500/40 transition-all duration-500 hover:scale-105 px-8 py-4 text-lg font-semibold group"
                onClick={() => window.location.href = '/servicos'}
            >
                <SparklesIcon className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Explorar Serviços
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
              
            <Button 
              size="lg" 
                className="bg-white/90 hover:bg-white text-gray-900 border-2 border-white/50 hover:border-white backdrop-blur-xl shadow-2xl hover:shadow-white/30 transition-all duration-500 hover:scale-105 px-8 py-4 text-lg font-semibold"
                onClick={() => window.location.href = '/noticias'}
            >
                Ver Notícias
            </Button>
          </div>
          
            {/* Interactive Achievement Showcase */}
            <div className="flex items-center gap-6 pt-4 animate-fade-in-up">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white shadow-lg" />
                  ))}
                </div>
                <span className="text-sm text-primary-foreground/80 font-medium ml-2">
                  {heroStatsLoading ? '...' : `${populationFormatted} cidadãos prósperos`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-sm text-primary-foreground/80 font-medium">
                  Excelência Municipal
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Interactive Statistics */}
          <div className={cn("space-y-8", isVisible && "animate-slide-in-right")}>
            <div className="grid gap-6">
              {/* Featured Stat Cards with Hover Effects */}
              <div className="grid grid-cols-2 gap-6">
                <StatCard
                  icon={UsersIcon}
                  label="População"
                  value={heroStatsLoading ? '...' : populationFormatted}
                  description={heroStatsLoading ? 'Carregando...' : 'Habitantes prósperos'}
                  variant="glass"
                  size="lg"
                  className="hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/10"
                  trend={{
                    value: growthRate,
                    isPositive: growthRate > 0
                  }}
                  loading={heroStatsLoading}
                />
                
                <StatCard
                  icon={BuildingIcon}
                  label="Setores"
                  value={heroStatsLoading ? '...' : `${sectors}+`}
                  description="Áreas de potencial"
                  variant="glass"
                  size="lg"
                  className="hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10"
                  loading={heroStatsLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <StatCard
                  icon={FileTextIcon}
                  label="Projetos"
                  value={heroStatsLoading ? '...' : `${projects}+`}
                  description="Iniciativas ativas"
                  variant="glass"
                  size="lg"
                  className="hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
                  loading={heroStatsLoading}
                  trend={{
                    value: Math.min(projects * 0.6, 15), // Dynamic trend based on projects
                    isPositive: projects > 0
                  }}
                />

                <StatCard
                  icon={SparklesIcon}
                  label="Oportunidades"
                  value={heroStatsLoading ? '...' : `${opportunities}+`}
                  description="Potencial ilimitado"
                  variant="glass"
                  size="lg"
                  className="hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10"
                  loading={heroStatsLoading}
                />
              </div>
            </div>
            
            {/* Dynamic Info Card with Current Image Context */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-primary-foreground/10 backdrop-blur-2xl rounded-2xl p-8 border border-primary-foreground/30 shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 hover:scale-[1.02]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping opacity-75" />
                  </div>
                  <span className="text-primary-foreground/95 font-bold text-lg">
                    {currentImage?.category || 'Portal Atualizado'}
                  </span>
                  <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-200 border-yellow-400/30">
                    Ao Vivo
                  </Badge>
                </div>
                <p className="text-primary-foreground/85 leading-relaxed text-base">
                  {currentImage?.description || 'Informações em tempo real sobre as potencialidades e oportunidades de Chipindo.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionContent>

      {/* Professional Horizontal Carousel */}
      <div className="relative mt-16 z-10">
        <SectionContent>
          <div className="mb-8 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              Potencialidades de Chipindo
            </h3>
            <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
              Conheça as riquezas que fazem de Chipindo um município próspero e cheio de oportunidades
            </p>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-background/5 backdrop-blur-xl border border-primary-foreground/20 shadow-2xl">
            <Carousel
              plugins={[plugin.current]}
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-0">
                {imagesToDisplay.map((image, index) => (
                  <CarouselItem key={`carousel-${index}`} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-0 p-2">
                    <div className="relative group cursor-pointer h-64 rounded-xl overflow-hidden">
                      {/* Image */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${image.src})`,
                        }}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLElement;
                          target.style.backgroundImage = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)';
                        }}
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge 
                          variant="secondary" 
                          className="bg-background/90 text-foreground border-0 text-xs px-2 py-1"
                        >
                          <span className="mr-1">{getCategoryIcon(image.category)}</span>
                          {image.category}
                        </Badge>
                      </div>
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-yellow-300 transition-colors duration-300">
                          {image.title}
                        </h4>
                        <p className="text-white/80 text-sm line-clamp-3 leading-relaxed">
                          {image.description}
                        </p>
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            
            {/* Carousel Navigation Dots */}
            <div className="flex justify-center mt-6 mb-4 space-x-2">
              {Array.from({ length: Math.ceil(imagesToDisplay.length / 4) }).map((_, index) => (
                <div
                  key={index}
                  className="h-2 w-2 rounded-full bg-primary-foreground/30 hover:bg-primary-foreground/60 transition-all duration-300"
                />
              ))}
            </div>
          </div>
        </SectionContent>
      </div>



    </Section>
  );
};