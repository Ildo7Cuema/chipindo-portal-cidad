import { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { EventsHero } from "@/components/sections/EventsHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  ArrowLeft,
  ExternalLink,
  Heart,
  Share2,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EventRegistrationModal from "@/components/ui/event-registration-modal";
import { useEvents, type Event } from "@/hooks/useEvents";

import { GuidelinesModal } from "@/components/ui/guidelines-modal";
import { useSystemSettings } from "@/hooks/useSystemSettings";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [favoriteEvents, setFavoriteEvents] = useState<number[]>([]);
  const [participatingEvents, setParticipatingEvents] = useState<number[]>([]);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  // const [showGuidelines, setShowGuidelines] = useState(false); // Removed state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const { toast } = useToast();

  // Usar hook para buscar eventos do banco de dados
  const { events, loading: eventsLoading } = useEvents({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    search: searchTerm
  });

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'cultural', label: 'Cultura' },
    { value: 'business', label: 'Comércio' },
    { value: 'educational', label: 'Educação' },
    { value: 'health', label: 'Saúde' },
    { value: 'sports', label: 'Desporto' },
    { value: 'community', label: 'Comunidade' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os Estados' },
    { value: 'upcoming', label: 'Próximos' },
    { value: 'ongoing', label: 'Em Curso' },
    { value: 'completed', label: 'Concluídos' }
  ];

  // Usar eventos diretamente do hook (já filtrados)
  const filteredEvents = events;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ongoing': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Próximo';
      case 'ongoing': return 'Em Curso';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-AO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Funções para gerenciar ações dos botões
  const handleParticipate = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const handleFavorite = (event: Event) => {
    setFavoriteEvents(prev =>
      prev.includes(event.id)
        ? prev.filter(id => id !== event.id)
        : [...prev, event.id]
    );

    const isFavorited = favoriteEvents.includes(event.id);

    toast({
      title: isFavorited ? "Removido dos favoritos" : "Adicionado aos favoritos!",
      description: isFavorited
        ? `"${event.title}" removido dos favoritos`
        : `"${event.title}" adicionado aos favoritos`
    });
  };

  const handleShare = async (event: Event) => {
    try {
      const shareData = {
        title: event.title,
        text: event.description,
        url: `${window.location.origin}/eventos?event=${event.id}`
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback para copiar para clipboard
        await navigator.clipboard.writeText(`${event.title}\n${event.description}\n${shareData.url}`);
        toast({
          title: "Link copiado!",
          description: "O link do evento foi copiado para a área de transferência."
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao partilhar",
        description: "Não foi possível partilhar o evento.",
        variant: "destructive"
      });
    }
  };

  const handleContact = (event: Event, type: 'phone' | 'email' | 'website') => {
    switch (type) {
      case 'phone':
        window.open(`tel:${event.contact}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:${event.email}?subject=Informações sobre ${event.title}`, '_blank');
        break;
      case 'website':
        if (event.website) {
          window.open(event.website, '_blank');
        }
        break;
    }

    toast({
      title: "Contacto aberto",
      description: `Abrindo ${type === 'phone' ? 'telefone' : type === 'email' ? 'email' : 'website'} para "${event.organizer}"`
    });
  };

  const { systemConfig } = useSystemSettings();

  const handleContactAdministration = () => {
    // Get phone from event settings or fallback to site settings or default
    const phone = systemConfig.eventsContactPhone || '+244926123459';
    // Clean phone number for WhatsApp URL (remove spaces, parentheses, etc)
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    // Construct WhatsApp message
    const message = encodeURIComponent("Olá, gostaria de obter informações sobre como promover um evento na plataforma do município de Chipindo.");

    // Open WhatsApp
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');

    toast({
      title: "WhatsApp aberto",
      description: "A iniciar conversa com a administração municipal..."
    });
  };

  const handleRegistrationSuccess = () => {
    // Atualizar o estado local se necessário
    toast({
      title: "Inscrição confirmada",
      description: "A sua inscrição foi processada com sucesso!"
    });
  };

  /* const handleViewGuidelines = () => {
    setShowGuidelines(true);
  }; */

  // Calcular estatísticas dos eventos
  const totalEvents = events.length;
  const featuredEvents = events.filter(event => event.featured).length;
  const upcomingEvents = events.filter(event => event.status === 'upcoming').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <EventsHero
        totalEvents={totalEvents}
        featuredEvents={featuredEvents}
        upcomingEvents={upcomingEvents}
      />

      <main className="pt-20">

        {/* Filters Section */}
        <section className="py-6 md:py-8 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="space-y-3 md:space-y-0 md:flex md:flex-row md:gap-4">
              {/* Search Input - Touch Friendly */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 md:w-4 md:h-4 md:left-3" />
                  <Input
                    placeholder="Pesquisar eventos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 md:pl-10 h-12 md:h-10 text-base md:text-sm rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Category Select */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 h-12 md:h-10 rounded-xl text-base md:text-sm transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.value} 
                      value={category.value}
                      className="min-h-[44px] md:min-h-[36px] flex items-center"
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Select */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-48 h-12 md:h-10 rounded-xl text-base md:text-sm transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem 
                      key={status.value} 
                      value={status.value}
                      className="min-h-[44px] md:min-h-[36px] flex items-center"
                    >
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section id="events-list" className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {eventsLoading ? (
              /* Loading State - Larger spinner for mobile */
              <div className="flex flex-col items-center justify-center py-16 md:py-20">
                <div className="animate-spin rounded-full h-14 w-14 md:h-12 md:w-12 border-b-2 border-blue-600 mb-6"></div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">
                  Carregando eventos...
                </h3>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center px-4">
                  Aguarde enquanto buscamos os eventos
                </p>
              </div>
            ) : filteredEvents.length === 0 ? (
              /* Empty State - Properly sized for all screens */
              <div className="flex flex-col items-center justify-center py-16 md:py-20">
                <Calendar className="w-14 h-14 md:w-16 md:h-16 text-gray-400 mb-6" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">
                  Nenhum evento encontrado
                </h3>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center px-4 max-w-md">
                  Tente ajustar os filtros de pesquisa
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className={cn(
                      "overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 rounded-xl",
                      "active:scale-[0.98] md:hover:-translate-y-1",
                      event.featured && "ring-2 ring-yellow-400"
                    )}
                  >
                    {event.featured && (
                      <div className="bg-yellow-400 text-yellow-900 px-3 py-1.5 text-xs font-semibold text-center">
                        ⭐ Evento Destacado
                      </div>
                    )}

                    <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base md:text-lg leading-tight line-clamp-2">
                          {event.title}
                        </CardTitle>
                        <Badge className={cn(getStatusColor(event.status), "text-xs shrink-0")}>
                          {getStatusLabel(event.status)}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="w-fit text-xs mt-2">
                        {event.category}
                      </Badge>
                    </CardHeader>

                    <CardContent className="p-4 md:p-6 pt-0 md:pt-0 space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>

                      {/* Meta Info - Responsive and Wrappable */}
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="font-medium">{formatDate(event.date)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600 shrink-0" />
                          <span>{event.event_time}</span>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-600 shrink-0" />
                          <span>
                            {event.current_participants} inscritos
                            {event.max_participants > 0 && ` / ${event.max_participants} vagas`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-base md:text-lg">{event.price}</span>
                        </div>
                      </div>

                      {/* Organizer & Contact Buttons */}
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium mb-3">Organizador: {event.organizer}</p>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs min-h-[40px] md:min-h-[36px] px-3 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 font-medium rounded-lg transition-all duration-200 active:scale-[0.98]"
                            onClick={() => handleContact(event, 'phone')}
                          >
                            <Phone className="w-3.5 h-3.5 mr-1.5" />
                            Contactar
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs min-h-[40px] md:min-h-[36px] px-3 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 font-medium rounded-lg transition-all duration-200 active:scale-[0.98]"
                            onClick={() => handleContact(event, 'email')}
                          >
                            <Mail className="w-3.5 h-3.5 mr-1.5" />
                            Email
                          </Button>

                          {event.website && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs min-h-[40px] md:min-h-[36px] px-3 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 font-medium rounded-lg transition-all duration-200 active:scale-[0.98]"
                              onClick={() => handleContact(event, 'website')}
                            >
                              <Globe className="w-3.5 h-3.5 mr-1.5" />
                              Website
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons - Large Touch Targets */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          className="flex-1 min-h-[44px] md:min-h-[40px] rounded-xl text-sm md:text-base font-medium transition-all duration-200 active:scale-[0.98]"
                          onClick={() => handleParticipate(event)}
                          disabled={event.max_participants > 0 && event.current_participants >= event.max_participants}
                        >
                          {event.max_participants > 0 && event.current_participants >= event.max_participants
                            ? 'Evento Lotado'
                            : 'Participar'
                          }
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleFavorite(event)}
                          className={cn(
                            "min-w-[44px] min-h-[44px] md:min-w-[40px] md:min-h-[40px] p-0 rounded-xl transition-all duration-200 active:scale-[0.98]",
                            "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
                            favoriteEvents.includes(event.id) && "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                          )}
                        >
                          <Heart className={cn("w-5 h-5", favoriteEvents.includes(event.id) && "fill-current")} />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleShare(event)}
                          className="min-w-[44px] min-h-[44px] md:min-w-[40px] md:min-h-[40px] p-0 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-all duration-200 active:scale-[0.98]"
                        >
                          <Share2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section id="guidelines-section" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-10 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
              Organiza um Evento?
            </h2>
            <p className="text-base md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
              Quer promover o seu evento em Chipindo? Entre em contacto connosco para divulgar o seu evento na nossa plataforma.
            </p>
            <div className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center max-w-md md:max-w-none mx-auto">
              <Button
                size="lg"
                variant="secondary"
                onClick={handleContactAdministration}
                className="min-h-[48px] md:min-h-[44px] rounded-xl text-base font-medium transition-all duration-200 active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contactar (WhatsApp)
              </Button>
              <GuidelinesModal trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="min-h-[48px] md:min-h-[44px] rounded-xl text-base text-white border-white/80 bg-white/10 hover:bg-white hover:text-blue-600 font-semibold shadow-lg transition-all duration-200 active:scale-[0.98]"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Ver Diretrizes
                </Button>
              } />
            </div>
          </div>
        </section>

        {/* Modal de Diretrizes */}
        {/* Modal de Diretrizes removed - using component now */}

        {/* Event Registration Modal */}
        <EventRegistrationModal
          event={selectedEvent}
          isOpen={showRegistrationModal}
          onClose={() => {
            setShowRegistrationModal(false);
            setSelectedEvent(null);
          }}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Events; 