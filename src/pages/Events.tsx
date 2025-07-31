import { useState } from 'react';
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
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  event_time: string;
  location: string;
  category: string;
  organizer: string;
  contact: string;
  email: string;
  website?: string;
  isFeatured: boolean;
  attendees: number;
  price: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [favoriteEvents, setFavoriteEvents] = useState<number[]>([]);
  const [participatingEvents, setParticipatingEvents] = useState<number[]>([]);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});
  const [showGuidelines, setShowGuidelines] = useState(false);
  const { toast } = useToast();

  // Dados de eventos do município
  const events: Event[] = [
    {
      id: 1,
      title: "Festival Cultural de Chipindo",
      description: "Celebração anual da cultura local com danças tradicionais, música, artesanato e gastronomia típica da região.",
      date: "2025-08-15",
      event_time: "09:00 - 18:00",
      location: "Praça Central de Chipindo",
      category: "Cultura",
      organizer: "Câmara Municipal",
      contact: "+244 123 456 789",
      email: "cultura@chipindo.gov.ao",
      website: "https://festival.chipindo.gov.ao",
      isFeatured: true,
      attendees: 2500,
      price: "Gratuito",
      status: 'upcoming'
    },
    {
      id: 2,
      title: "Feira Agrícola e Comercial",
      description: "Exposição de produtos agrícolas locais, artesanato e oportunidades de negócio para agricultores e comerciantes.",
      date: "2025-09-20",
      event_time: "08:00 - 17:00",
      location: "Mercado Municipal",
      category: "Comércio",
      organizer: "Direcção de Agricultura",
      contact: "+244 123 456 790",
      email: "agricultura@chipindo.gov.ao",
      isFeatured: true,
      attendees: 800,
      price: "Gratuito",
      status: 'upcoming'
    },
    {
      id: 3,
      title: "Conferência de Desenvolvimento Sustentável",
      description: "Discussão sobre projetos de desenvolvimento sustentável, meio ambiente e crescimento económico do município.",
      date: "2025-07-30",
      event_time: "14:00 - 17:00",
      location: "Auditório Municipal",
      category: "Educação",
      organizer: "Direcção de Educação",
      contact: "+244 123 456 791",
      email: "educacao@chipindo.gov.ao",
      attendees: 150,
      price: "Gratuito",
      status: 'upcoming',
      isFeatured: false
    }
  ];

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'Cultura', label: 'Cultura' },
    { value: 'Comércio', label: 'Comércio' },
    { value: 'Educação', label: 'Educação' },
    { value: 'Saúde', label: 'Saúde' },
    { value: 'Desporto', label: 'Desporto' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os Estados' },
    { value: 'upcoming', label: 'Próximos' },
    { value: 'ongoing', label: 'Em Curso' },
    { value: 'completed', label: 'Concluídos' }
  ];

  // Filtrar eventos
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
  const handleParticipate = async (event: Event) => {
    setLoadingStates(prev => ({ ...prev, [`participate-${event.id}`]: true }));
    
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setParticipatingEvents(prev => 
        prev.includes(event.id) 
          ? prev.filter(id => id !== event.id)
          : [...prev, event.id]
      );
      
      const isParticipating = participatingEvents.includes(event.id);
      
      toast({
        title: isParticipating ? "Inscrição cancelada" : "Inscrição realizada!",
        description: isParticipating 
          ? `Cancelou a inscrição no evento "${event.title}"`
          : `Inscrito com sucesso no evento "${event.title}"`
      });
    } catch (error) {
      toast({
        title: "Erro na inscrição",
        description: "Não foi possível processar a inscrição. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [`participate-${event.id}`]: false }));
    }
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

  const handleContactAdministration = () => {
    const email = 'eventos@chipindo.gov.ao';
    const subject = 'Informações sobre Promoção de Eventos';
    const body = `Olá,\n\nGostaria de obter informações sobre como promover um evento na plataforma do município de Chipindo.\n\nAguardo o vosso contacto.\n\nObrigado.`;
    
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    
    toast({
      title: "Email aberto",
      description: "Abrindo email para a administração municipal"
    });
  };

  const handleViewGuidelines = () => {
    setShowGuidelines(true);
  };

  // Calcular estatísticas dos eventos
  const totalEvents = events.length;
  const featuredEvents = events.filter(event => event.isFeatured).length;
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
            {filteredEvents.length === 0 ? (
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
                      event.isFeatured && "ring-2 ring-yellow-400"
                    )}
                  >
                    {event.isFeatured && (
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
                          <span>{event.attendees} participantes esperados</span>
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
                          disabled={loadingStates[`participate-${event.id}`]}
                        >
                          {loadingStates[`participate-${event.id}`] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : null}
                          {participatingEvents.includes(event.id) ? 'Cancelar Inscrição' : 'Participar'}
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
                <Mail className="w-5 h-5 mr-2" />
                Contactar Administração
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white/80 bg-white/10 hover:bg-white hover:text-blue-600 font-semibold shadow-lg transition-all duration-300"
                onClick={handleViewGuidelines}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Ver Diretrizes
              </Button>
            </div>
          </div>
        </section>

        {/* Modal de Diretrizes */}
        <Dialog open={showGuidelines} onOpenChange={setShowGuidelines}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Diretrizes para Promoção de Eventos
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Critérios de Elegibilidade */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  1. Critérios de Elegibilidade
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Eventos devem ser de interesse público</li>
                  <li>• Organizadores devem ter sede ou representação no município</li>
                  <li>• Eventos devem respeitar a legislação local</li>
                </ul>
              </div>

              {/* Informações Obrigatórias */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                  2. Informações Obrigatórias
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Título e descrição do evento</li>
                  <li>• Data, hora e local</li>
                  <li>• Organizador e contactos</li>
                  <li>• Número esperado de participantes</li>
                  <li>• Medidas de segurança</li>
                </ul>
              </div>

              {/* Processo de Submissão */}
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3">
                  3. Processo de Submissão
                </h3>
                <ol className="space-y-2 text-sm">
                  <li>1. Contactar a administração municipal</li>
                  <li>2. Preencher formulário de solicitação</li>
                  <li>3. Aguardar aprovação (até 5 dias úteis)</li>
                  <li>4. Fornecer materiais promocionais</li>
                </ol>
              </div>

              {/* Responsabilidades */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
                  4. Responsabilidades
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Organizador é responsável pela execução do evento</li>
                  <li>• Município fornece suporte promocional</li>
                  <li>• Cumprimento de normas de segurança obrigatório</li>
                </ul>
              </div>

              {/* Contactos */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  5. Contactos
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">eventos@chipindo.gov.ao</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">+244 123 456 789</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Segunda a Sexta, 8h-17h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button 
                onClick={handleContactAdministration}
                className="flex-1"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contactar Administração
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events; 