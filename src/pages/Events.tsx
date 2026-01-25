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
        <section className="py-8 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Pesquisar eventos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section id="events-list" className="py-12">
          <div className="container mx-auto px-4">
            {eventsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Carregando eventos...</h3>
                <p className="text-gray-500">Aguarde enquanto buscamos os eventos</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum evento encontrado</h3>
                <p className="text-gray-500">Tente ajustar os filtros de pesquisa</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className={cn(
                      "overflow-hidden hover:shadow-lg transition-all duration-300",
                      event.featured && "ring-2 ring-yellow-400"
                    )}
                  >
                    {event.featured && (
                      <div className="bg-yellow-400 text-yellow-900 px-3 py-1 text-xs font-semibold text-center">
                        ⭐ Evento Destacado
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusLabel(event.status)}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {event.category}
                      </Badge>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{formatDate(event.date)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span>{event.event_time}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span>{event.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span>
                            {event.current_participants} inscritos
                            {event.max_participants > 0 && ` / ${event.max_participants} vagas`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">{event.price}</span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-sm font-medium mb-2">Organizador: {event.organizer}</p>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                            onClick={() => handleContact(event, 'phone')}
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Contactar
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                            onClick={() => handleContact(event, 'email')}
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>

                          {event.website && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                              onClick={() => handleContact(event, 'website')}
                            >
                              <Globe className="w-3 h-3 mr-1" />
                              Website
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
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
                          size="sm"
                          onClick={() => handleFavorite(event)}
                          className={cn(
                            "border-gray-300 text-gray-700 hover:bg-gray-50",
                            favoriteEvents.includes(event.id) ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : ''
                          )}
                        >
                          <Heart className={cn("w-4 h-4", favoriteEvents.includes(event.id) && "fill-current")} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(event)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <Share2 className="w-4 h-4" />
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
        <section id="guidelines-section" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Organiza um Evento?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Quer promover o seu evento em Chipindo? Entre em contacto connosco para divulgar o seu evento na nossa plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={handleContactAdministration}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contactar (WhatsApp)
              </Button>
              <GuidelinesModal trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white/80 bg-white/10 hover:bg-white hover:text-blue-600 font-semibold shadow-lg transition-all duration-300"
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