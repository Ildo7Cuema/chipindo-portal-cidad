import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  FileTextIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  BuildingIcon,
  GraduationCapIcon,
  HeartIcon,
  HammerIcon,
  TractorIcon,
  SearchIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  SortDescIcon,
  SortAscIcon,
  XIcon,
  StarIcon,
  TrendingUpIcon,
  FlameIcon,
  EyeIcon,
  CrownIcon,
  ShieldIcon,
  BriefcaseIcon,
  DollarSignIcon,
  DropletIcon,
  PaletteIcon,
  CheckCircleIcon,
  InfoIcon,
  SendIcon,
  AlertTriangleIcon,
  ArrowRightIcon
} from "lucide-react";

interface Servico {
  id: string;
  title: string;
  description: string;
  direcao: string;
  categoria: string;
  icon: string;
  requisitos: string[];
  documentos: string[];
  horario: string;
  localizacao: string;
  contacto: string;
  email: string;
  prazo: string;
  taxa: string;
  prioridade: 'alta' | 'media' | 'baixa';
  digital: boolean;
  ativo: boolean;
  views: number;
  requests: number;
  ordem: number;
  created_at: string;
  updated_at: string;
}

interface Departamento {
  id: string;
  nome: string;
  descricao: string | null;
  codigo: string | null;
  ativo: boolean;
  ordem: number;
}

const iconMapping = {
  'UserIcon': UserIcon,
  'GraduationCapIcon': GraduationCapIcon,
  'HeartIcon': HeartIcon,
  'HammerIcon': HammerIcon,
  'TractorIcon': TractorIcon,
  'FileTextIcon': FileTextIcon,
  'DropletIcon': DropletIcon,
  'BriefcaseIcon': BriefcaseIcon,
  'CrownIcon': CrownIcon,
  'ShieldIcon': ShieldIcon,
  'DollarSignIcon': DollarSignIcon,
  'PaletteIcon': PaletteIcon,
  'BuildingIcon': BuildingIcon,
  'PhoneIcon': PhoneIcon,
  'MailIcon': MailIcon
};

const directionIcons = {
  'Gabinete do Administrador': { icon: CrownIcon, color: 'bg-purple-500' },
  'Secretaria Geral': { icon: ShieldIcon, color: 'bg-blue-500' },
  'Departamento Administrativo': { icon: BriefcaseIcon, color: 'bg-green-500' },
  'Departamento de Obras Públicas': { icon: HammerIcon, color: 'bg-orange-500' },
  'Departamento de Saúde': { icon: HeartIcon, color: 'bg-red-500' },
  'Departamento de Educação': { icon: GraduationCapIcon, color: 'bg-indigo-500' },
  'Departamento de Agricultura': { icon: TractorIcon, color: 'bg-emerald-500' },
  'Departamento de Água e Saneamento': { icon: DropletIcon, color: 'bg-cyan-500' },
  'Departamento de Segurança': { icon: ShieldIcon, color: 'bg-gray-600' },
  'Departamento de Finanças': { icon: DollarSignIcon, color: 'bg-yellow-500' },
  'Departamento de Cultura e Turismo': { icon: PaletteIcon, color: 'bg-pink-500' },
  'Departamento de Assuntos Sociais': { icon: HeartIcon, color: 'bg-teal-500' }
};

const categorias = [
  { id: 'todos', name: 'Todos os Serviços', icon: BuildingIcon, color: 'bg-slate-500' },
  { id: 'Documentação', name: 'Documentação', icon: FileTextIcon, color: 'bg-blue-500' },
  { id: 'Educação', name: 'Educação', icon: GraduationCapIcon, color: 'bg-green-500' },
  { id: 'Saúde', name: 'Saúde', icon: HeartIcon, color: 'bg-red-500' },
  { id: 'Licenciamento', name: 'Licenciamento', icon: CheckCircleIcon, color: 'bg-orange-500' },
  { id: 'Agricultura', name: 'Agricultura', icon: TractorIcon, color: 'bg-emerald-500' },
  { id: 'Infraestrutura', name: 'Infraestrutura', icon: HammerIcon, color: 'bg-purple-500' }
];

export default function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [filteredServicos, setFilteredServicos] = useState<Servico[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Servico | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedDirection, setSelectedDirection] = useState("todos");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [contactForm, setContactForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortServicos();
  }, [servicos, searchTerm, selectedCategory, selectedDirection, sortBy]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch services data
      const { data: servicosData, error: servicosError } = await supabase
        .from('servicos')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (servicosError) {
        // If table doesn't exist, show error message
        if (servicosError.code === '42P01') {
          throw new Error('A tabela de serviços ainda não foi criada. Contacte o administrador.');
        }
        throw servicosError;
      }

      // Fetch departments data
      const { data: deptData, error: deptError } = await supabase
        .from('departamentos')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (deptError) throw deptError;

      // Define a type guard for priority
      const getPriority = (p: string | null): 'alta' | 'media' | 'baixa' => {
        if (p === 'alta' || p === 'media' || p === 'baixa') return p;
        return 'baixa'; // Default fallback
      };

      const mappedServicos: Servico[] = (servicosData || []).map((s) => ({
        ...s,
        prioridade: getPriority(s.prioridade),
        // Ensure other required fields are handled if they come as null from DB but are required in Interface
        // Based on the error, prioridade was the main issue. 
        // We cast to proper types where necessary or rely on ...s if types match closely enough apart from prioridade.
        views: s.views || 0,
        requests: s.requests || 0,
        ativo: s.ativo || false,
      } as Servico));

      setServicos(mappedServicos);
      setDepartamentos(deptData || []);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Erro ao carregar dados dos serviços');
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos serviços. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortServicos = () => {
    const filtered = servicos.filter(servico => {
      const matchesSearch = servico.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servico.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servico.direcao.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'todos' || servico.categoria === selectedCategory;
      const matchesDirection = selectedDirection === 'todos' || servico.direcao === selectedDirection;

      return matchesSearch && matchesCategory && matchesDirection;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { 'alta': 3, 'media': 2, 'baixa': 1 };
          return priorityOrder[b.prioridade] - priorityOrder[a.prioridade];
        default:
          return 0;
      }
    });

    setFilteredServicos(filtered);
    setCurrentPage(1);
  };

  const getDirectionData = (directionName: string) => {
    return directionIcons[directionName as keyof typeof directionIcons] ||
      { icon: BuildingIcon, color: 'bg-gray-500' };
  };

  const getCategoryData = (categoryId: string) => {
    return categorias.find(cat => cat.id === categoryId) || categorias[0];
  };

  const getIconComponent = (iconName: string) => {
    return iconMapping[iconName as keyof typeof iconMapping] || FileTextIcon;
  };

  const getPriorityBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <Badge className="bg-red-500">Alta Prioridade</Badge>;
      case 'media':
        return <Badge className="bg-yellow-500">Média Prioridade</Badge>;
      case 'baixa':
        return <Badge variant="outline">Baixa Prioridade</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const handleContactSubmit = async () => {
    try {
      if (!selectedService) return;

      setIsSubmitting(true);

      // Create service request in database
      const { data, error } = await supabase
        .from('service_requests')
        .insert([{
          service_id: selectedService.id,
          service_name: selectedService.title,
          service_direction: selectedService.direcao,
          requester_name: contactForm.nome,
          requester_email: contactForm.email,
          requester_phone: contactForm.telefone,
          subject: contactForm.assunto,
          message: contactForm.mensagem,
          priority: 'normal'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Solicitação Enviada!",
        description: "Sua solicitação foi enviada com sucesso. Entraremos em contacto em breve.",
      });

      setShowContactForm(false);
      setContactForm({
        nome: "",
        email: "",
        telefone: "",
        assunto: "",
        mensagem: ""
      });

      // Update request count for the service
      const { error: updateError } = await supabase
        .from('servicos')
        .update({ requests: selectedService.requests + 1 })
        .eq('id', selectedService.id);

      if (!updateError) {
        // Update local state
        setServicos(prev => prev.map(s =>
          s.id === selectedService.id
            ? { ...s, requests: s.requests + 1 }
            : s
        ));
      }
    } catch (error) {
      console.error('Error submitting service request:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar solicitação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateServiceViews = async (serviceId: string) => {
    try {
      const service = servicos.find(s => s.id === serviceId);
      if (!service) return;

      const { error } = await supabase
        .from('servicos')
        .update({ views: service.views + 1 })
        .eq('id', serviceId);

      if (!error) {
        // Update local state
        setServicos(prev => prev.map(s =>
          s.id === serviceId
            ? { ...s, views: s.views + 1 }
            : s
        ));
      }
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  const paginatedServicos = filteredServicos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredServicos.length / itemsPerPage);

  const totalServices = servicos.length;
  const digitalServices = servicos.filter(s => s.digital).length;
  const totalRequests = servicos.reduce((sum, s) => sum + (s.requests || 0), 0);

  const directionStats = departamentos.map(dept => ({
    ...dept,
    serviceCount: servicos.filter(s => s.direcao === dept.nome).length
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Section variant="primary" size="lg">
            <SectionContent>
              <div className="text-center space-y-6">
                <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
                <Skeleton className="h-12 w-96 mx-auto" />
                <Skeleton className="h-6 w-64 mx-auto" />
                <div className="flex justify-center gap-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </SectionContent>
          </Section>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Section variant="primary" size="lg">
            <SectionContent>
              <div className="text-center space-y-6">
                <AlertTriangleIcon className="w-16 h-16 text-red-500 mx-auto" />
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Erro ao Carregar Serviços
                </h1>
                <p className="text-xl text-primary-foreground/95 max-w-3xl mx-auto leading-relaxed">
                  {error}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  Tentar Novamente
                </Button>
              </div>
            </SectionContent>
          </Section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[400px] md:min-h-[500px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

          {/* Floating Elements - reduced on mobile */}
          <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="hidden md:block absolute top-40 right-20 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="hidden md:block absolute bottom-20 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>
          {/* Simplified floating elements for mobile */}
          <div className="md:hidden absolute top-10 right-6 w-12 h-12 bg-white/10 rounded-full blur-lg animate-pulse"></div>
          <div className="md:hidden absolute bottom-16 left-6 w-10 h-10 bg-blue-400/15 rounded-full blur-md animate-pulse delay-500"></div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 py-10 md:py-16">
            <div className="text-center space-y-6 md:space-y-8">
              {/* Header with Enhanced Icon */}
              <div className="flex flex-col items-center gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-white/25 to-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-200 active:scale-[0.98]">
                    <BuildingIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-green-400 rounded-full flex items-center justify-center border-2 border-white">
                    <CheckCircleIcon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 text-xs md:text-sm font-medium tracking-wide uppercase">Serviços Activos</span>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
                    Serviços
                    <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      Municipais
                    </span>
                  </h1>
                  <p className="text-blue-100 text-base md:text-xl font-medium px-4 md:px-0">
                    Administração Municipal de Chipindo
                  </p>
                </div>
              </div>

              {/* Enhanced Description */}
              <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 leading-relaxed font-light px-2 md:px-0">
                  Acesso <span className="font-semibold text-white">rápido e eficiente</span> aos serviços oferecidos pela nossa Administração.
                  <span className="hidden sm:inline"> Facilitamos a vida dos cidadãos através de processos <span className="font-semibold text-white">transparentes e ágeis</span>.</span>
                </p>

                {/* Enhanced Stats - 2x2 grid on mobile, flex on desktop */}
                <div className="grid grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center justify-center gap-3 md:gap-6 px-2 md:px-0">
                  <div className="group relative">
                    <div className="h-full bg-white/15 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl px-3 py-3 md:px-6 md:py-4 hover:bg-white/20 transition-all duration-200 active:scale-[0.98]">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                          <BuildingIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <div className="text-left min-w-0">
                          <div className="text-lg md:text-2xl font-bold text-white">{totalServices}</div>
                          <div className="text-blue-100 text-xs md:text-sm truncate">Serviços</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group relative">
                    <div className="h-full bg-green-500/20 backdrop-blur-xl border border-green-400/30 rounded-xl md:rounded-2xl px-3 py-3 md:px-6 md:py-4 hover:bg-green-500/30 transition-all duration-200 active:scale-[0.98]">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-green-400/30 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                          <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <div className="text-left min-w-0">
                          <div className="text-lg md:text-2xl font-bold text-white">{digitalServices}</div>
                          <div className="text-green-100 text-xs md:text-sm truncate">Digitais</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group relative col-span-2 sm:col-span-1">
                    <div className="h-full bg-yellow-500/20 backdrop-blur-xl border border-yellow-400/30 rounded-xl md:rounded-2xl px-3 py-3 md:px-6 md:py-4 hover:bg-yellow-500/30 transition-all duration-200 active:scale-[0.98]">
                      <div className="flex items-center justify-center sm:justify-start gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-400/30 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                          <StarIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <div className="text-left min-w-0">
                          <div className="text-lg md:text-2xl font-bold text-white">{totalRequests}+</div>
                          <div className="text-yellow-100 text-xs md:text-sm truncate">Solicitações</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action - simplified on mobile */}
              <div className="pt-4 md:pt-8">
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-white/80 text-xs md:text-sm px-4 md:px-0">
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full"></div>
                    <span>Simplificados</span>
                  </div>
                  <div className="w-1 h-1 bg-white/40 rounded-full hidden sm:block"></div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full"></div>
                    <span>24/7</span>
                  </div>
                  <div className="w-1 h-1 bg-white/40 rounded-full hidden sm:block"></div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-400 rounded-full"></div>
                    <span>Transparentes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters Section */}
        <section className="relative -mt-6 md:-mt-8 z-20">
          <div className="container mx-auto px-3 sm:px-4">
            <Card className="shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="space-y-4 md:space-y-8">
                  {/* Enhanced Search - Touch friendly */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl md:rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-200"></div>
                    <div className="relative">
                      <SearchIcon className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5 md:w-6 md:h-6" />
                      <Input
                        type="text"
                        placeholder="Pesquisar serviços..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 md:h-auto pl-12 md:pl-16 pr-4 md:pr-6 py-3 md:py-4 text-base md:text-lg border-2 border-blue-200/50 focus:border-blue-500 rounded-xl md:rounded-2xl bg-white/80 backdrop-blur-sm focus:bg-white transition-all duration-200 shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Enhanced Filters Row - Vertical on mobile */}
                  <div className="flex flex-col gap-4 md:gap-6">
                    {/* Filter Controls Row */}
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-center justify-between">
                      {/* Filter Toggle and View Mode */}
                      <div className="flex items-center justify-between sm:justify-start gap-2 md:gap-4">
                        <Button
                          variant="outline"
                          onClick={() => setShowFilters(!showFilters)}
                          className="flex-1 sm:flex-none h-11 md:h-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200 text-blue-700 rounded-xl px-4 py-2 transition-all duration-200 active:scale-[0.98]"
                        >
                          <FilterIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">{showFilters ? 'Ocultar' : 'Mostrar'}</span> Filtros
                          {showFilters && <XIcon className="w-4 h-4" />}
                        </Button>

                        {/* Compact View Toggle */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                          <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 active:scale-[0.98] ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                          >
                            <GridIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 active:scale-[0.98] ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                          >
                            <ListIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Selects - Stacked on mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="h-11 bg-white/80 border-blue-200 rounded-xl hover:bg-white transition-all duration-200">
                          <InfoIcon className="w-4 h-4 mr-2 text-blue-600 shrink-0" />
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map(categoria => {
                            const IconComponent = categoria.icon;
                            return (
                              <SelectItem key={categoria.id} value={categoria.id}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="w-4 h-4" />
                                  {categoria.name}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                        <SelectTrigger className="h-11 bg-white/80 border-blue-200 rounded-xl hover:bg-white transition-all duration-200">
                          <BuildingIcon className="w-4 h-4 mr-2 text-blue-600 shrink-0" />
                          <SelectValue placeholder="Direcção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">
                            <div className="flex items-center gap-2">
                              <BuildingIcon className="w-4 h-4" />
                              Todas as Direcções
                            </div>
                          </SelectItem>
                          {departamentos.map(dept => {
                            const IconComponent = getDirectionData(dept.nome).icon;
                            return (
                              <SelectItem key={dept.id} value={dept.nome}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="w-4 h-4" />
                                  {dept.nome}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-11 bg-white/80 border-blue-200 rounded-xl hover:bg-white transition-all duration-200 sm:col-span-2 lg:col-span-1">
                          <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popular">
                            <div className="flex items-center gap-2">
                              <TrendingUpIcon className="w-4 h-4" />
                              Mais Populares
                            </div>
                          </SelectItem>
                          <SelectItem value="recent">
                            <div className="flex items-center gap-2">
                              <SortDescIcon className="w-4 h-4" />
                              Mais Recentes
                            </div>
                          </SelectItem>
                          <SelectItem value="priority">
                            <div className="flex items-center gap-2">
                              <StarIcon className="w-4 h-4" />
                              Por Prioridade
                            </div>
                          </SelectItem>
                          <SelectItem value="alphabetical">
                            <div className="flex items-center gap-2">
                              <SortAscIcon className="w-4 h-4" />
                              Alfabética
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Enhanced Category Filters - Touch friendly */}
                  {showFilters && (
                    <div className="border-t border-blue-200/50 pt-4 md:pt-6 space-y-4 md:space-y-6">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                          <FilterIcon className="w-4 h-4 text-blue-600" />
                          Filtrar por categoria:
                        </p>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                          {categorias.map(categoria => {
                            const IconComponent = categoria.icon;
                            const isSelected = selectedCategory === categoria.id;
                            return (
                              <Button
                                key={categoria.id}
                                variant={isSelected ? "default" : "outline"}
                                onClick={() => setSelectedCategory(categoria.id)}
                                className={`h-10 md:h-auto flex items-center gap-1.5 md:gap-2 rounded-xl px-3 md:px-4 py-2 transition-all duration-200 active:scale-[0.98] text-sm ${isSelected
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                  : 'bg-white/80 border-blue-200 hover:bg-blue-50'
                                  }`}
                              >
                                <IconComponent className="w-4 h-4" />
                                <span className="hidden sm:inline">{categoria.name}</span>
                                <span className="sm:hidden">{categoria.name.split(' ')[0]}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                          <BuildingIcon className="w-4 h-4 text-blue-600" />
                          Filtrar por direcção:
                        </p>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                          <Button
                            variant={selectedDirection === 'todos' ? "default" : "outline"}
                            onClick={() => setSelectedDirection('todos')}
                            className={`h-10 md:h-auto flex items-center gap-1.5 md:gap-2 rounded-xl px-3 md:px-4 py-2 transition-all duration-200 active:scale-[0.98] text-sm ${selectedDirection === 'todos'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                              : 'bg-white/80 border-blue-200 hover:bg-blue-50'
                              }`}
                          >
                            <BuildingIcon className="w-4 h-4" />
                            Todas
                          </Button>
                          {departamentos.slice(0, 8).map(dept => {
                            const IconComponent = getDirectionData(dept.nome).icon;
                            const isSelected = selectedDirection === dept.nome;
                            return (
                              <Button
                                key={dept.id}
                                variant={isSelected ? "default" : "outline"}
                                onClick={() => setSelectedDirection(dept.nome)}
                                className={`h-10 md:h-auto flex items-center gap-1.5 md:gap-2 rounded-xl px-3 md:px-4 py-2 transition-all duration-200 active:scale-[0.98] text-sm ${isSelected
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                  : 'bg-white/80 border-blue-200 hover:bg-blue-50'
                                  }`}
                              >
                                <IconComponent className="w-4 h-4" />
                                <span className="hidden md:inline">{dept.nome}</span>
                                <span className="md:hidden">{dept.nome.split(' ').slice(-1)[0]}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Results Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-blue-200/50">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 md:gap-3 min-w-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                          <SearchIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-700">
                            {filteredServicos.length} serviço{filteredServicos.length !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {searchTerm && `"${searchTerm}"`}
                            {selectedCategory !== 'todos' && ` • ${getCategoryData(selectedCategory).name}`}
                            {selectedDirection !== 'todos' && ` • ${selectedDirection.split(' ').slice(-1)[0]}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold text-blue-600">{filteredServicos.length}</div>
                        <div className="text-xs text-gray-500 hidden sm:block">Resultados</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Enhanced Services Section */}
        <section className="py-10 md:py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
                <BuildingIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Atendimento Municipal
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 px-2 md:px-0">
                Serviços{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Disponíveis
                </span>
              </h2>
              <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 md:px-0">
                Conheça todos os serviços oferecidos pela Administração municipal.
                <span className="hidden sm:inline"> Processos simplificados para melhor servir os nossos cidadãos.</span>
              </p>
            </div>
            {filteredServicos.length === 0 ? (
              <div className="text-center py-12 md:py-20">
                <div className="max-w-md mx-auto px-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <BuildingIcon className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Nenhum serviço encontrado</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 leading-relaxed">
                    {searchTerm || selectedCategory !== 'todos' || selectedDirection !== 'todos'
                      ? "Não encontramos serviços que correspondam aos seus critérios. Tente ajustar os filtros."
                      : "Os serviços estão sendo organizados e estarão disponíveis em breve."
                    }
                  </p>
                  {(searchTerm || selectedCategory !== 'todos' || selectedDirection !== 'todos') && (
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("todos");
                        setSelectedDirection("todos");
                        setSortBy("popular");
                      }}
                      className="h-11 md:h-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-6 md:px-8 py-2.5 md:py-3 transition-all duration-200 active:scale-[0.98] shadow-lg"
                    >
                      <XIcon className="w-4 h-4 mr-2" />
                      Limpar Filtros
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className={cn(
                  "grid gap-4 md:gap-6",
                  viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}>
                  {paginatedServicos.map((servico) => {
                    const directionData = getDirectionData(servico.direcao);
                    const IconComponent = getIconComponent(servico.icon);
                    const categoryData = getCategoryData(servico.categoria);

                    return (
                      <Card
                        key={servico.id}
                        className={cn(
                          "group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-200 active:scale-[0.98] md:hover:-translate-y-1 bg-white dark:bg-gray-800 rounded-xl",
                          viewMode === 'list' ? "md:flex" : ""
                        )}
                        onClick={() => {
                          setSelectedService(servico);
                          updateServiceViews(servico.id);
                        }}
                      >
                        <div className={cn(
                          "relative p-4 md:p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-blue-50 group-hover:to-blue-100 transition-colors duration-200",
                          viewMode === 'list' ? "md:w-64 border-r border-gray-100" : "h-40 md:h-48 border-b border-gray-100"
                        )}>
                          <div className={cn(
                            "w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 transition-transform duration-200 group-hover:scale-110 shadow-sm",
                            getCategoryData(servico.categoria).color.replace('bg-', 'bg-').replace('500', '100')
                          )}>
                            <IconComponent className={cn("w-7 h-7 md:w-8 md:h-8", getCategoryData(servico.categoria).color.replace('bg-', 'text-'))} />
                          </div>

                          <Badge className={cn(
                            "mb-2 text-xs",
                            getCategoryData(servico.categoria).color,
                            "text-white border-0 shadow-sm"
                          )}>
                            {servico.categoria}
                          </Badge>

                          <div className="absolute top-2 right-2 md:top-3 md:right-3">
                            {servico.digital ? (
                              <Badge className="bg-green-500 text-xs">Digital</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-200 text-gray-700 text-xs">Presencial</Badge>
                            )}
                          </div>
                        </div>

                        <CardContent className={cn("p-4 md:p-6", viewMode === 'list' ? "flex-1" : "")}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 mr-2">
                              <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1.5 md:mb-2">
                                {servico.title}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 md:mb-3">
                                <BuildingIcon className="w-3 h-3" />
                                <span className="truncate">{servico.direcao}</span>
                              </div>
                            </div>
                            <div className="shrink-0">{getPriorityBadge(servico.prioridade)}</div>
                          </div>

                          <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed">
                            {servico.description}
                          </p>

                          <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
                            <div className="flex items-center gap-1.5 md:gap-2">
                              <ClockIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 shrink-0" />
                              <span className="truncate">{servico.prazo}</span>
                            </div>
                            <div className="flex items-center gap-1.5 md:gap-2">
                              <DollarSignIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500 shrink-0" />
                              <span className="truncate">{servico.taxa || 'Gratuito'}</span>
                            </div>
                          </div>

                          <Button
                            className="w-full h-11 md:h-auto bg-white border-2 border-blue-100 hover:border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-md group/btn rounded-xl"
                          >
                            Ver detalhes
                            <ArrowRightIcon className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination - Mobile optimized */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 md:gap-2 mt-8 md:mt-12 px-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="h-11 md:h-9 px-3 md:px-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      <span className="hidden sm:inline">Anterior</span>
                      <span className="sm:hidden">←</span>
                    </Button>

                    {/* Mobile: Show current/total, Desktop: Show all page numbers */}
                    <div className="flex items-center gap-1 md:gap-2">
                      {/* Mobile indicator */}
                      <div className="flex sm:hidden items-center gap-1 px-3 py-2 bg-blue-50 rounded-xl">
                        <span className="text-sm font-semibold text-blue-600">{currentPage}</span>
                        <span className="text-sm text-gray-400">/</span>
                        <span className="text-sm text-gray-500">{totalPages}</span>
                      </div>

                      {/* Desktop page numbers */}
                      <div className="hidden sm:flex gap-1 md:gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                          // Show first, last, current, and adjacent pages
                          const showPage = page === 1 || 
                                          page === totalPages || 
                                          Math.abs(page - currentPage) <= 1 ||
                                          totalPages <= 7;
                          const showEllipsis = !showPage && 
                                              (page === 2 || page === totalPages - 1);
                          
                          if (showEllipsis) {
                            return <span key={page} className="px-1 text-gray-400">...</span>;
                          }
                          
                          if (!showPage) return null;
                          
                          return (
                            <Button
                              key={page}
                              variant={page === currentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={cn(
                                "w-9 h-9 p-0 rounded-lg transition-all duration-200 active:scale-[0.98]",
                                page === currentPage && "bg-blue-600 text-white shadow-md"
                              )}
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="h-11 md:h-9 px-3 md:px-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      <span className="hidden sm:inline">Próxima</span>
                      <span className="sm:hidden">→</span>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Enhanced Statistics Section */}
        <section className="py-10 md:py-16 bg-gradient-to-br from-gray-100 to-blue-100">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
                <TrendingUpIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Estatísticas
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-2 md:px-0">
                Serviços por{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Direcção
                </span>
              </h2>
              <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto px-4 md:px-0">
                Distribuição dos serviços pelas diferentes direcções municipais
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {directionStats.filter(dept => dept.serviceCount > 0).map(dept => {
                const directionData = getDirectionData(dept.nome);
                const IconComponent = directionData.icon;

                return (
                  <Card
                    key={dept.id}
                    className="hover:shadow-lg transition-all duration-200 active:scale-[0.98] md:hover:scale-105 cursor-pointer bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl"
                    onClick={() => setSelectedDirection(dept.nome)}
                  >
                    <CardContent className="p-3 md:p-6 text-center">
                      <div className={cn("w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4 shadow-lg", directionData.color)}>
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-xs md:text-sm leading-tight line-clamp-2">
                        {dept.nome.replace('Departamento de ', '').replace('Departamento ', '')}
                      </h3>
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-0.5 md:mb-1">{dept.serviceCount}</div>
                      <p className="text-xs md:text-sm text-gray-600">
                        {dept.serviceCount === 1 ? 'serviço' : 'serviços'}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Service Details Modal - Mobile optimized with bottom sheet behavior */}
        <Dialog open={!!selectedService && !showContactForm} onOpenChange={() => setSelectedService(null)}>
          <DialogContent className="w-full max-w-4xl h-[100dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col p-0 sm:p-6 rounded-none sm:rounded-lg">
            {selectedService && (
              <>
                {/* Fixed Header */}
                <DialogHeader className="shrink-0 p-4 sm:p-0 sm:pb-4 border-b sm:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <div className={cn("p-2.5 md:p-3 rounded-xl shrink-0", getCategoryData(selectedService.categoria).color)}>
                        {(() => {
                          const IconComponent = getIconComponent(selectedService.icon);
                          return <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />;
                        })()}
                      </div>
                      <div className="min-w-0">
                        <DialogTitle className="text-lg md:text-2xl line-clamp-2">{selectedService.title}</DialogTitle>
                        <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mt-1.5 md:mt-2">
                          <Badge className={cn("text-xs", getCategoryData(selectedService.categoria).color, "text-white")}>
                            {selectedService.categoria}
                          </Badge>
                          {selectedService.digital && (
                            <Badge className="bg-green-500 text-xs">Digital</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedService(null)}
                      className="h-10 w-10 p-0 rounded-xl shrink-0"
                    >
                      <XIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-0 space-y-4 md:space-y-6 scroll-smooth">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 md:mb-3 text-sm md:text-base">Descrição</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{selectedService.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 md:p-4">
                      <h3 className="font-semibold text-foreground mb-2 md:mb-3 text-sm md:text-base">Informações Gerais</h3>
                      <div className="space-y-2.5 md:space-y-3">
                        <div className="flex items-start gap-2.5 md:gap-3">
                          <ClockIcon className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-medium text-sm">Horário:</span>
                            <p className="text-xs md:text-sm text-muted-foreground">{selectedService.horario}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 md:gap-3">
                          <MapPinIcon className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-medium text-sm">Localização:</span>
                            <p className="text-xs md:text-sm text-muted-foreground">{selectedService.localizacao}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 md:gap-3">
                          <ClockIcon className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-medium text-sm">Prazo:</span>
                            <p className="text-xs md:text-sm text-muted-foreground">{selectedService.prazo}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 md:gap-3">
                          <DollarSignIcon className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-medium text-sm">Taxa:</span>
                            <span className="text-primary font-semibold text-sm ml-2">{selectedService.taxa}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 md:p-4">
                      <h3 className="font-semibold text-foreground mb-2 md:mb-3 text-sm md:text-base">Contactos</h3>
                      <div className="space-y-2.5 md:space-y-3">
                        <div className="flex items-start gap-2.5 md:gap-3">
                          <PhoneIcon className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-medium text-sm">Telefone:</span>
                            <p className="text-xs md:text-sm text-muted-foreground">{selectedService.contacto}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 md:gap-3">
                          <MailIcon className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-medium text-sm">Email:</span>
                            <p className="text-xs md:text-sm text-muted-foreground break-all">{selectedService.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 md:gap-3">
                          <BuildingIcon className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-medium text-sm">Direcção:</span>
                            <p className="text-xs md:text-sm text-muted-foreground">{selectedService.direcao}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2 md:mb-3 text-sm md:text-base">Documentos Necessários</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 md:p-4">
                        <h4 className="font-medium mb-2 text-sm">Requisitos:</h4>
                        <ul className="space-y-1.5">
                          {selectedService.requisitos.map((req, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 md:p-4">
                        <h4 className="font-medium mb-2 text-sm">Documentos a preencher:</h4>
                        <ul className="space-y-1.5">
                          {selectedService.documentos.map((doc, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 md:p-4">
                    <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Estatísticas</h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-lg md:text-xl font-bold text-blue-600">{selectedService.views}</div>
                        <div className="text-xs text-muted-foreground">Visualizações</div>
                      </div>
                      <div>
                        <div className="text-lg md:text-xl font-bold text-green-600">{selectedService.requests}</div>
                        <div className="text-xs text-muted-foreground">Solicitações</div>
                      </div>
                      <div>
                        <div className="text-lg md:text-xl font-bold text-purple-600">{selectedService.digital ? '✓' : '○'}</div>
                        <div className="text-xs text-muted-foreground">{selectedService.digital ? 'Digital' : 'Presencial'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Footer Actions */}
                <div className="shrink-0 flex gap-2 p-4 sm:p-0 sm:pt-4 border-t sm:border-t bg-white dark:bg-gray-900 sm:bg-transparent">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedService(null)}
                    className="flex-1 h-12 md:h-11 rounded-xl transition-all duration-200 active:scale-[0.98]"
                  >
                    Fechar
                  </Button>
                  <Button
                    onClick={() => setShowContactForm(true)}
                    className="flex-1 h-12 md:h-11 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 rounded-xl transition-all duration-200 active:scale-[0.98]"
                  >
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    Solicitar
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Contact Form Modal - Mobile optimized */}
        <Dialog open={showContactForm} onOpenChange={() => setShowContactForm(false)}>
          <DialogContent className="w-full max-w-2xl h-[100dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col p-0 sm:p-6 rounded-none sm:rounded-lg">
            <DialogHeader className="shrink-0 p-4 sm:p-0 sm:pb-4 border-b sm:border-0">
              <DialogTitle className="text-xl md:text-2xl">Solicitar Serviço</DialogTitle>
              <DialogDescription className="text-sm md:text-base">
                {selectedService && `${selectedService.title}`}
              </DialogDescription>
            </DialogHeader>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-0 space-y-4 md:space-y-6 scroll-smooth">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label htmlFor="nome" className="text-sm font-medium mb-1.5 block">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={contactForm.nome}
                    onChange={(e) => setContactForm({ ...contactForm, nome: e.target.value })}
                    placeholder="Digite seu nome completo"
                    disabled={isSubmitting}
                    className="h-12 md:h-11 rounded-xl text-base md:text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium mb-1.5 block">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="seuemail@exemplo.com"
                    disabled={isSubmitting}
                    className="h-12 md:h-11 rounded-xl text-base md:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label htmlFor="telefone" className="text-sm font-medium mb-1.5 block">Telefone</Label>
                  <Input
                    id="telefone"
                    type="tel"
                    value={contactForm.telefone}
                    onChange={(e) => setContactForm({ ...contactForm, telefone: e.target.value })}
                    placeholder="+244 900 000 000"
                    disabled={isSubmitting}
                    className="h-12 md:h-11 rounded-xl text-base md:text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="assunto" className="text-sm font-medium mb-1.5 block">Assunto *</Label>
                  <Input
                    id="assunto"
                    value={contactForm.assunto}
                    onChange={(e) => setContactForm({ ...contactForm, assunto: e.target.value })}
                    placeholder="Assunto da solicitação"
                    disabled={isSubmitting}
                    className="h-12 md:h-11 rounded-xl text-base md:text-sm"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-1.5 block">Mensagem *</Label>
                <Textarea
                  value={contactForm.mensagem}
                  onChange={(e) => setContactForm({ ...contactForm, mensagem: e.target.value })}
                  placeholder="Descreva sua solicitação ou dúvida em detalhes..."
                  rows={4}
                  disabled={isSubmitting}
                  className="rounded-xl text-base md:text-sm min-h-[120px] resize-none"
                />
              </div>
            </div>

            {/* Fixed Footer Actions */}
            <div className="shrink-0 flex gap-2 p-4 sm:p-0 sm:pt-4 border-t sm:border-t bg-white dark:bg-gray-900 sm:bg-transparent">
              <Button
                variant="outline"
                onClick={() => setShowContactForm(false)}
                disabled={isSubmitting}
                className="flex-1 h-12 md:h-11 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleContactSubmit}
                disabled={isSubmitting}
                className="flex-1 h-12 md:h-11 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    <span className="hidden sm:inline">Enviando...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <SendIcon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Enviar Solicitação</span>
                    <span className="sm:hidden">Enviar</span>
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}