import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, MapPinIcon, UsersIcon, BuildingIcon, FileTextIcon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useRealTimeStats } from "@/hooks/useRealTimeStats";
import agriculturaImage from "@/assets/agricultura-chipindo.jpg";
import turismoImage from "@/assets/turismo-chipindo.jpg";
import ouroImage from "@/assets/ouro-chipindo.jpg";
import heroImage from "@/assets/hero-chipindo.jpg";

export const Hero = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );
  const { settings } = useSiteSettings();
  const { stats } = useRealTimeStats();

  const potentialityImages = [
    { 
      src: agriculturaImage, 
      title: "Agricultura",
      description: "Vastos campos cultivados com milho, feijão e outras culturas"
    },
    { 
      src: turismoImage, 
      title: "Turismo",
      description: "Paisagens naturais deslumbrantes e cachoeiras"
    },
    { 
      src: ouroImage, 
      title: "Mineração",
      description: "Recursos minerais valiosos incluindo ouro"
    },
    { 
      src: heroImage, 
      title: "Chipindo",
      description: "O coração da província de Huíla"
    }
  ];

  return (
    <section className="relative min-h-[600px] bg-gradient-hero overflow-hidden">
      {/* Automatic Background Carousel */}
      <div className="absolute inset-0">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="h-full -ml-0">
            {potentialityImages.map((image, index) => (
              <CarouselItem key={index} className="pl-0 h-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                  style={{
                    backgroundImage: `url(${image.src})`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
                
                {/* Potentiality Badge */}
                <div className="absolute top-8 right-8 z-10">
                  <Badge variant="secondary" className="bg-background/20 text-primary-foreground border-primary-foreground/30 backdrop-blur-sm">
                    {image.title}
                  </Badge>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              <MapPinIcon className="w-3 h-3 mr-1" />
              {settings?.hero_location_badge || 'Província de Huíla, Angola'}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up">
            {settings?.hero_title || 'Bem-vindos ao Portal de Chipindo'}
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl animate-fade-in">
            {settings?.hero_subtitle || 'Conectando a Administração Municipal aos cidadãos através de informação transparente, serviços digitais e oportunidades de crescimento.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up">
            <Button 
              size="lg" 
              variant="secondary" 
              className="shadow-elegant hover:shadow-glow transition-all duration-300"
              onClick={() => window.location.href = '/services'}
            >
              Explorar Serviços
              <ArrowRightIcon className="w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:shadow-elegant transition-all duration-300"
              onClick={() => window.location.href = '/concursos'}
            >
              Concursos Públicos
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
              <div className="flex items-center gap-3 mb-2">
                <UsersIcon className="w-6 h-6 text-accent" />
                <span className="text-primary-foreground text-sm font-medium">População</span>
              </div>
              <p className="text-2xl font-bold text-primary-foreground">{settings?.population_count || '150.000+'}</p>
              <p className="text-primary-foreground/70 text-sm">{settings?.population_description || 'Cidadãos servidos'}</p>
            </div>
            
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
              <div className="flex items-center gap-3 mb-2">
                <BuildingIcon className="w-6 h-6 text-accent" />
                <span className="text-primary-foreground text-sm font-medium">Direcções</span>
              </div>
              <p className="text-2xl font-bold text-primary-foreground">
                {stats.loading ? '...' : stats.totalDirecoes}
              </p>
              <p className="text-primary-foreground/70 text-sm">{settings?.departments_description || 'Áreas de atuação'}</p>
            </div>
            
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
              <div className="flex items-center gap-3 mb-2">
                <FileTextIcon className="w-6 h-6 text-accent" />
                <span className="text-primary-foreground text-sm font-medium">Notícias</span>
              </div>
              <p className="text-2xl font-bold text-primary-foreground">
                {stats.loading ? '...' : stats.publishedNews}
              </p>
              <p className="text-primary-foreground/70 text-sm">Notícias publicadas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};