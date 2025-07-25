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
  AlertTriangleIcon
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

      setServicos(servicosData || []);
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
    let filtered = servicos.filter(servico => {
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
      // Here you could save the contact form to the database
      // For now, just show success message
      toast({
        title: "Mensagem Enviada!",
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
      if (selectedService) {
        const { error } = await supabase
          .from('servicos')
          .update({ requests: selectedService.requests + 1 })
          .eq('id', selectedService.id);

        if (!error) {
          // Update local state
          setServicos(prev => prev.map(s => 
            s.id === selectedService.id 
              ? { ...s, requests: s.requests + 1 }
              : s
          ));
        }
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar solicitação. Tente novamente.",
        variant: "destructive"
      });
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
        <Section variant="primary" size="lg">
          <SectionContent>
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                  <BuildingIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Serviços Municipais
                  </h1>
                  <p className="text-primary-foreground/90 text-lg">
                    Administração Municipal de Chipindo
                  </p>
                </div>
              </div>
              
              <p className="text-xl text-primary-foreground/95 max-w-3xl mx-auto leading-relaxed">
                Acesso rápido e eficiente aos serviços oferecidos pela nossa administração. 
                Facilitamos a vida dos cidadãos através de processos transparentes e ágeis.
              </p>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <BuildingIcon className="w-4 h-4 mr-2" />
                  {totalServices} Serviços Disponíveis
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-4 py-2">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  {digitalServices} Serviços Digitais
                </Badge>
                <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30 px-4 py-2">
                  <StarIcon className="w-4 h-4 mr-2" />
                  {totalRequests}+ Solicitações Atendidas
                </Badge>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Search and Filters Section */}
        <Section variant="muted" size="md">
          <SectionContent>
            <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Main Search */}
                  <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Pesquisar serviços por nome, descrição ou direção..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-3 text-lg border-2 border-border/50 focus:border-primary"
                    />
                  </div>

                  {/* Filters Row */}
                  <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-3 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                      >
                        <FilterIcon className="w-4 h-4" />
                        Filtros
                        {showFilters && <XIcon className="w-4 h-4" />}
                      </Button>
                      
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                          <InfoIcon className="w-4 h-4 mr-2" />
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
                        <SelectTrigger className="w-48">
                          <BuildingIcon className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Direção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">
                            <div className="flex items-center gap-2">
                              <BuildingIcon className="w-4 h-4" />
                              Todas as Direções
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
                        <SelectTrigger className="w-44">
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

                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <GridIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <ListIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Category Filters */}
                  {showFilters && (
                    <div className="border-t border-border/50 pt-4 space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-3">Filtrar por categoria:</p>
                        <div className="flex flex-wrap gap-2">
                          {categorias.map(categoria => {
                            const IconComponent = categoria.icon;
                            return (
                              <Button
                                key={categoria.id}
                                variant={selectedCategory === categoria.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(categoria.id)}
                                className="flex items-center gap-2"
                              >
                                <IconComponent className="w-4 h-4" />
                                {categoria.name}
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-3">Filtrar por direção:</p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={selectedDirection === 'todos' ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedDirection('todos')}
                            className="flex items-center gap-2"
                          >
                            <BuildingIcon className="w-4 h-4" />
                            Todas
                          </Button>
                          {departamentos.slice(0, 8).map(dept => {
                            const IconComponent = getDirectionData(dept.nome).icon;
                            return (
                              <Button
                                key={dept.id}
                                variant={selectedDirection === dept.nome ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedDirection(dept.nome)}
                                className="flex items-center gap-2"
                              >
                                <IconComponent className="w-4 h-4" />
                                {dept.nome}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Results Summary */}
                  <div className="text-sm text-muted-foreground">
                    <span>
                      {filteredServicos.length} serviço{filteredServicos.length !== 1 ? 's' : ''} encontrado{filteredServicos.length !== 1 ? 's' : ''}
                      {searchTerm && ` para "${searchTerm}"`}
                      {selectedCategory !== 'todos' && ` em ${getCategoryData(selectedCategory).name}`}
                      {selectedDirection !== 'todos' && ` na ${selectedDirection}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>

        {/* Services Section */}
        <Section variant="default" size="lg">
          <SectionHeader
            subtitle="Atendimento Municipal"
            title={
              <span>
                Serviços{' '}
                <span className="bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 bg-clip-text text-transparent">
                  Disponíveis
                </span>
              </span>
            }
            description="Conheça todos os serviços oferecidos pela administração municipal"
            centered={true}
          />
          
          <SectionContent>
            {filteredServicos.length === 0 ? (
              <div className="text-center py-16">
                <BuildingIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum serviço encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedCategory !== 'todos' || selectedDirection !== 'todos'
                    ? "Tente ajustar seus filtros de busca."
                    : "Os serviços estão sendo organizados. Volte em breve."
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
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className={cn(
                  "grid gap-6",
                  viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}>
                  {paginatedServicos.map((servico) => {
                    const directionData = getDirectionData(servico.direcao);
                    const IconComponent = getIconComponent(servico.icon);
                    const categoryData = getCategoryData(servico.categoria);
                    
                    return (
                      <Card 
                        key={servico.id}
                        className={cn(
                          "group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                          viewMode === 'list' && "md:flex"
                        )}
                        onClick={() => {
                          setSelectedService(servico);
                          updateServiceViews(servico.id);
                        }}
                      >
                        <div className={cn(
                          "relative overflow-hidden",
                          viewMode === 'list' ? "md:w-64 flex-shrink-0" : ""
                        )}>
                          <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative">
                            <div className={cn("w-full h-full flex items-center justify-center", categoryData.color)}>
                              <IconComponent className="w-12 h-12 text-white/80" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <Badge className={cn("absolute top-3 left-3", categoryData.color, "text-white border-0")}>
                              {servico.categoria}
                            </Badge>
                            <div className="absolute top-3 right-3">
                              {servico.digital ? (
                                <Badge className="bg-green-500">Digital</Badge>
                              ) : (
                                <Badge variant="outline" className="text-white border-white/50">Presencial</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 p-6">
                          <CardTitle className={cn(
                            "leading-tight group-hover:text-primary transition-colors duration-300 mb-2",
                            viewMode === 'list' ? "text-lg" : "text-xl"
                          )}>
                            {servico.title}
                          </CardTitle>
                          
                          <p className="text-sm text-primary font-medium mb-3">{servico.direcao}</p>
                          
                          <p className="text-muted-foreground mb-4 line-clamp-2">{servico.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <ClockIcon className="w-4 h-4" />
                              <span className="font-medium">Horário:</span> {servico.horario}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPinIcon className="w-4 h-4" />
                              <span className="font-medium">Local:</span> {servico.localizacao}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <EyeIcon className="w-4 h-4" />
                                {servico.views}
                              </div>
                              <div className="flex items-center gap-1">
                                <SendIcon className="w-4 h-4" />
                                {servico.requests} solicitações
                              </div>
                            </div>
                            {getPriorityBadge(servico.prioridade)}
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedService(servico);
                                updateServiceViews(servico.id);
                              }}
                              className="flex-1"
                            >
                              <InfoIcon className="w-4 h-4 mr-2" />
                              Ver Detalhes
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedService(servico);
                                setShowContactForm(true);
                              }}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700"
                            >
                              <PhoneIcon className="w-4 h-4 mr-2" />
                              Contactar
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </>
            )}
          </SectionContent>
        </Section>

        {/* Statistics Section */}
        <Section variant="muted" size="md">
          <SectionHeader
            subtitle="Estatísticas"
            title="Serviços por Direção"
            description="Distribuição dos serviços pelas diferentes direções municipais"
            centered={true}
          />
          
          <SectionContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {directionStats.filter(dept => dept.serviceCount > 0).map(dept => {
                const directionData = getDirectionData(dept.nome);
                const IconComponent = directionData.icon;
                
                return (
                  <Card 
                    key={dept.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedDirection(dept.nome)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4", directionData.color)}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 text-sm leading-tight">
                        {dept.nome}
                      </h3>
                      <div className="text-2xl font-bold text-primary mb-1">{dept.serviceCount}</div>
                      <p className="text-sm text-muted-foreground">
                        {dept.serviceCount === 1 ? 'serviço' : 'serviços'}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </SectionContent>
        </Section>

        {/* Service Details Modal */}
        <Dialog open={!!selectedService && !showContactForm} onOpenChange={() => setSelectedService(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedService && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-3 rounded-lg", getCategoryData(selectedService.categoria).color)}>
                        {(() => {
                          const IconComponent = getIconComponent(selectedService.icon);
                          return <IconComponent className="w-8 h-8 text-white" />;
                        })()}
                      </div>
                      <div>
                        <DialogTitle className="text-2xl">{selectedService.title}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2">
                          <Badge className={cn(getCategoryData(selectedService.categoria).color, "text-white")}>
                            {selectedService.categoria}
                          </Badge>
                          {getPriorityBadge(selectedService.prioridade)}
                          {selectedService.digital && (
                            <Badge className="bg-green-500">Serviço Digital</Badge>
                          )}
                        </DialogDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedService(null)}
                    >
                      <XIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Descrição</h3>
                    <p className="text-muted-foreground leading-relaxed">{selectedService.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Informações Gerais</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <ClockIcon className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <span className="font-medium">Horário:</span>
                            <p className="text-sm text-muted-foreground">{selectedService.horario}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPinIcon className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <span className="font-medium">Localização:</span>
                            <p className="text-sm text-muted-foreground">{selectedService.localizacao}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <ClockIcon className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <span className="font-medium">Prazo:</span>
                            <p className="text-sm text-muted-foreground">{selectedService.prazo}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSignIcon className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <span className="font-medium">Taxa:</span>
                            <span className="text-primary font-semibold ml-2">{selectedService.taxa}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Contactos</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <PhoneIcon className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <span className="font-medium">Telefone:</span>
                            <p className="text-sm text-muted-foreground">{selectedService.contacto}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MailIcon className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <span className="font-medium">Email:</span>
                            <p className="text-sm text-muted-foreground">{selectedService.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <BuildingIcon className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <span className="font-medium">Direção:</span>
                            <p className="text-sm text-muted-foreground">{selectedService.direcao}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Documentos Necessários</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Requisitos:</h4>
                        <ul className="space-y-1">
                          {selectedService.requisitos.map((req, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Documentos a preencher:</h4>
                        <ul className="space-y-1">
                          {selectedService.documentos.map((doc, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Estatísticas</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Visualizações:</span>
                          <span className="font-medium">{selectedService.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Solicitações:</span>
                          <span className="font-medium">{selectedService.requests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span className="font-medium">{selectedService.digital ? 'Digital' : 'Presencial'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedService(null)}
                      className="flex-1"
                    >
                      Fechar
                    </Button>
                    <Button 
                      onClick={() => setShowContactForm(true)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700"
                    >
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      Contactar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Contact Form Modal */}
        <Dialog open={showContactForm} onOpenChange={() => setShowContactForm(false)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Contactar Serviço</DialogTitle>
              <DialogDescription>
                {selectedService && `Envie sua solicitação sobre: ${selectedService.title}`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={contactForm.nome}
                    onChange={(e) => setContactForm({...contactForm, nome: e.target.value})}
                    placeholder="Digite seu nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    placeholder="seuemail@exemplo.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={contactForm.telefone}
                    onChange={(e) => setContactForm({...contactForm, telefone: e.target.value})}
                    placeholder="+244 900 000 000"
                  />
                </div>
                <div>
                  <Label htmlFor="assunto">Assunto *</Label>
                  <Input
                    id="assunto"
                    value={contactForm.assunto}
                    onChange={(e) => setContactForm({...contactForm, assunto: e.target.value})}
                    placeholder="Assunto da solicitação"
                  />
                </div>
              </div>

              <div>
                <Label>Mensagem *</Label>
                <Textarea
                  value={contactForm.mensagem}
                  onChange={(e) => setContactForm({...contactForm, mensagem: e.target.value})}
                  placeholder="Descreva sua solicitação ou dúvida em detalhes..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  onClick={() => setShowContactForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleContactSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700"
                >
                  <SendIcon className="w-4 h-4 mr-2" />
                  Enviar Solicitação
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
}