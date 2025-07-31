import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, UsersIcon, SparklesIcon, StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface EventsHeroProps {
  totalEvents?: number;
  featuredEvents?: number;
  upcomingEvents?: number;
}

export const EventsHero = ({ totalEvents = 0, featuredEvents = 0, upcomingEvents = 0 }: EventsHeroProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }}></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Back Button */}
            <div className="flex justify-start mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Voltar à Página Inicial
              </Button>
            </div>

            {/* Main Title */}
            <div className="mb-6">
              <Badge 
                variant="secondary" 
                className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Eventos do Município
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Eventos de
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Chipindo
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Descubra e participe dos eventos culturais, educacionais e comunitários que fazem de Chipindo um município vibrante e em constante desenvolvimento.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-blue-300" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{totalEvents}</div>
                  <div className="text-white/70 text-sm">Total de Eventos</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <StarIcon className="w-6 h-6 text-purple-300" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{featuredEvents}</div>
                  <div className="text-white/70 text-sm">Eventos em Destaque</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-indigo-300" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{upcomingEvents}</div>
                  <div className="text-white/70 text-sm">Próximos Eventos</div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                Explorar Eventos
                <ArrowLeftIcon className="w-5 h-5 ml-2 rotate-180" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/60 text-white bg-white/5 hover:bg-white/20 hover:text-white px-8 py-3 transition-all duration-300 font-semibold shadow-lg"
                onClick={() => document.getElementById('guidelines-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <MapPinIcon className="w-5 h-5 mr-2" />
                Ver Diretrizes
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 text-white/60 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Eventos atualizados em tempo real
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 