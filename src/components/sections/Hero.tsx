import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, MapPinIcon, UsersIcon, BuildingIcon } from "lucide-react";
import heroImage from "@/assets/hero-chipindo.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[600px] bg-gradient-hero overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              <MapPinIcon className="w-3 h-3 mr-1" />
              Província de Huíla, Angola
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Bem-vindos ao
            <span className="block text-accent">Portal de Chipindo</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl animate-fade-in">
            Conectando a Administração Municipal aos cidadãos através de informação transparente, 
            serviços digitais e oportunidades de crescimento.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up">
            <Button size="lg" variant="secondary" className="shadow-elegant">
              Explorar Serviços
              <ArrowRightIcon className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
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
              <p className="text-2xl font-bold text-primary-foreground">150.000+</p>
              <p className="text-primary-foreground/70 text-sm">Cidadãos servidos</p>
            </div>
            
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
              <div className="flex items-center gap-3 mb-2">
                <BuildingIcon className="w-6 h-6 text-accent" />
                <span className="text-primary-foreground text-sm font-medium">Direções</span>
              </div>
              <p className="text-2xl font-bold text-primary-foreground">12</p>
              <p className="text-primary-foreground/70 text-sm">Áreas de atuação</p>
            </div>
            
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
              <div className="flex items-center gap-3 mb-2">
                <ArrowRightIcon className="w-6 h-6 text-accent" />
                <span className="text-primary-foreground text-sm font-medium">Serviços</span>
              </div>
              <p className="text-2xl font-bold text-primary-foreground">24/7</p>
              <p className="text-primary-foreground/70 text-sm">Portal sempre ativo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};