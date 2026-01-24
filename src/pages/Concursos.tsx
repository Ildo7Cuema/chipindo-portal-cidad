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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  FileTextIcon,
  MapPinIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  SearchIcon,
  FilterIcon,
  SortDescIcon,
  SortAscIcon,
  GridIcon,
  ListIcon,
  ArrowRightIcon,
  XIcon,
  StarIcon,
  TrendingUpIcon,
  FlameIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  EyeIcon,
  UploadIcon,
  IdCardIcon,
  Tag
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Concurso {
  id: string;
  title: string;
  description: string;
  created_at: string;
  deadline?: string;
  requirements?: string;
  contact_info?: string;
  published: boolean;
  category?: string;
  views?: number;
  applications?: number;
  categorias_disponiveis?: string[] | null; // Added for modal
}

const categoryMapping = [
  { id: 'administracao', name: 'Administração', color: 'bg-blue-500', icon: BriefcaseIcon },
  { id: 'educacao', name: 'Educação', color: 'bg-green-500', icon: GraduationCapIcon },
  { id: 'saude', name: 'Saúde', color: 'bg-red-500', icon: UserIcon },
  { id: 'obras', name: 'Obras Públicas', color: 'bg-orange-500', icon: MapPinIcon },
  { id: 'tecnico', name: 'Técnico', color: 'bg-purple-500', icon: FileTextIcon },
  { id: 'seguranca', name: 'Segurança', color: 'bg-gray-600', icon: AlertCircleIcon },
  { id: 'todos', name: 'Todas as Categorias', color: 'bg-slate-500', icon: BriefcaseIcon }
];

const categoriaOptions = [
  { value: 'administracao', label: 'Administração' },
  { value: 'educacao', label: 'Educação' },
  { value: 'saude', label: 'Saúde' },
  { value: 'obras', label: 'Obras Públicas' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'seguranca', label: 'Segurança' },
  { value: 'outros', label: 'Outros' }
];

export default function Concursos() {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [filteredConcursos, setFilteredConcursos] = useState<Concurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConcurso, setSelectedConcurso] = useState<Concurso | null>(null);
  const [showInscricaoForm, setShowInscricaoForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    bilheteIdentidade: "",
    dataNascimento: "",
    telefone: "",
    email: "",
    observacoes: "",
    categoria: "",
    arquivos: [] as File[],
    biFile: null as File | null,
    certificadoFile: null as File | null,
    declaracaoFile: null as File | null,
    cvFile: null as File | null
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchConcursos();
  }, []);

  useEffect(() => {
    filterAndSortConcursos();
  }, [concursos, searchTerm, selectedCategory, sortBy]);

  const fetchConcursos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('concursos')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const concursosWithCategories = data?.map((item, index) => ({
        ...item,
        category: getCategoryByIndex(index),
        views: Math.floor(Math.random() * 1000) + 50,
        applications: Math.floor(Math.random() * 200) + 10,
        categorias_disponiveis: parseCategoriasDisponiveis(item.categorias_disponiveis)
      })) || [];

      setConcursos(concursosWithCategories);
    } catch (error) {
      console.error('Error fetching concursos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar concursos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryByIndex = (index: number) => {
    const categories = ['administracao', 'educacao', 'saude', 'obras', 'tecnico', 'seguranca'];
    return categories[index % categories.length];
  };

  const parseCategoriasDisponiveis = (categorias: any): string[] => {
    if (!categorias) return [];
    if (Array.isArray(categorias)) return categorias;
    if (typeof categorias === 'string') {
      try {
        const parsed = JSON.parse(categorias);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const filterAndSortConcursos = () => {
    const filtered = concursos.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.requirements && item.requirements.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'deadline':
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredConcursos(filtered);
    setCurrentPage(1);
  };

  const isActive = (concurso: Concurso) => {
    if (!concurso.deadline) return true;
    return new Date(concurso.deadline) > new Date();
  };

  const concursosAtivos = filteredConcursos.filter(c => isActive(c));
  const concursosEncerrados = filteredConcursos.filter(c => !isActive(c));
  const paginatedAtivos = concursosAtivos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(concursosAtivos.length / itemsPerPage);

  const handleInscricao = (concurso: Concurso) => {
    setSelectedConcurso(concurso);
    setShowInscricaoForm(true);
  };

  const submitInscricao = async () => {
    if (!selectedConcurso) return;
    if (!formData.categoria) {
      toast({
        title: "Categoria obrigatória",
        description: "Selecione a categoria a que se candidata.",
        variant: "destructive"
      });
      return;
    }

    const requiredFiles = [formData.biFile, formData.cvFile];
    if (requiredFiles.some(file => !file)) {
      toast({
        title: "Erro na Inscrição",
        description: "Por favor, anexe todos os documentos obrigatórios (Bilhete de Identidade e Currículo Vitae).",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('inscricoes')
      .insert({
        concurso_id: selectedConcurso.id,
        nome_completo: formData.nomeCompleto,
        bilhete_identidade: formData.bilheteIdentidade,
        data_nascimento: formData.dataNascimento,
        telefone: formData.telefone,
        email: formData.email,
        observacoes: formData.observacoes,
        categoria: formData.categoria,
        arquivos: [
          ...(formData.biFile ? [{ name: formData.biFile.name, size: formData.biFile.size, type: formData.biFile.type, url: URL.createObjectURL(formData.biFile) }] : []),
          ...(formData.cvFile ? [{ name: formData.cvFile.name, size: formData.cvFile.size, type: formData.cvFile.type, url: URL.createObjectURL(formData.cvFile) }] : []),
          ...(formData.certificadoFile ? [{ name: formData.certificadoFile.name, size: formData.certificadoFile.size, type: formData.certificadoFile.type, url: URL.createObjectURL(formData.certificadoFile) }] : []),
          ...(formData.declaracaoFile ? [{ name: formData.declaracaoFile.name, size: formData.declaracaoFile.size, type: formData.declaracaoFile.type, url: URL.createObjectURL(formData.declaracaoFile) }] : [])
        ].map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: file.url
        }))
      });

    if (error) {
      toast({
        title: "Erro na Inscrição",
        description: `Erro ao enviar inscrição: ${error.message}`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso!",
        description: "Inscrição enviada com sucesso! Receberá confirmação por email.",
      });
      setShowInscricaoForm(false);
      setSelectedConcurso(null);
      setFormData({
        nomeCompleto: "",
        bilheteIdentidade: "",
        dataNascimento: "",
        telefone: "",
        email: "",
        observacoes: "",
        categoria: "",
        arquivos: [],
        biFile: null,
        certificadoFile: null,
        declaracaoFile: null,
        cvFile: null
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Há poucos minutos';
    if (diffInHours < 24) return `Há ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  };

  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    const close = new Date(deadline);
    const diffTime = close.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getCategoryData = (categoryId: string) => {
    return categoryMapping.find(cat => cat.id === categoryId) || categoryMapping[0];
  };

  const getStatusBadge = (concurso: Concurso) => {
    const isActiveStatus = isActive(concurso);
    const daysRemaining = getDaysRemaining(concurso.deadline);

    if (!isActiveStatus) {
      return <Badge variant="outline" className="text-red-600 border-red-600">Encerrado</Badge>;
    }

    if (daysRemaining && daysRemaining <= 7) {
      return <Badge className="bg-orange-500">Encerrando em breve</Badge>;
    }

    return <Badge className="bg-green-500">Aberto</Badge>;
  };

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
                  <BriefcaseIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Concursos Públicos
                  </h1>
                  <p className="text-primary-foreground/90 text-lg">
                    Administração Municipal de Chipindo
                  </p>
                </div>
              </div>

              <p className="text-xl text-primary-foreground/95 max-w-3xl mx-auto leading-relaxed">
                Oportunidades de carreira no serviço público municipal. Junte-se à nossa equipe
                e contribua para o desenvolvimento de Chipindo.
              </p>

              <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-in-up animation-delay-200">
                <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 px-6 py-2.5 text-sm font-medium shadow-lg hover:bg-white/20 transition-all duration-300">
                  <BriefcaseIcon className="w-4 h-4 mr-2" />
                  {concursosAtivos.length} Concursos Abertos
                </Badge>
                <Badge className="bg-emerald-500/20 backdrop-blur-md text-emerald-100 border-emerald-400/30 px-6 py-2.5 text-sm font-medium shadow-lg hover:bg-emerald-500/30 transition-all duration-300">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  {concursos.length} Total de Vagas
                </Badge>
                <Badge className="bg-amber-500/20 backdrop-blur-md text-amber-100 border-amber-400/30 px-6 py-2.5 text-sm font-medium shadow-lg hover:bg-amber-500/30 transition-all duration-300">
                  <StarIcon className="w-4 h-4 mr-2" />
                  Inscrições Online
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
                      placeholder="Pesquisar concursos por cargo, requisitos, descrição..."
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
                          <BriefcaseIcon className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryMapping.map(category => {
                            const IconComponent = category.icon;
                            return (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="w-4 h-4" />
                                  {category.name}
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
                          <SelectItem value="recent">
                            <div className="flex items-center gap-2">
                              <SortDescIcon className="w-4 h-4" />
                              Mais Recentes
                            </div>
                          </SelectItem>
                          <SelectItem value="deadline">
                            <div className="flex items-center gap-2">
                              <ClockIcon className="w-4 h-4" />
                              Prazo de Encerramento
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
                    <div className="border-t border-border/50 pt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-3">Filtrar por categoria:</p>
                      <div className="flex flex-wrap gap-2">
                        {categoryMapping.map(category => {
                          const IconComponent = category.icon;
                          return (
                            <Button
                              key={category.id}
                              variant={selectedCategory === category.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedCategory(category.id)}
                              className="flex items-center gap-2"
                            >
                              <IconComponent className="w-4 h-4" />
                              {category.name}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Results Summary */}
                  <div className="text-sm text-muted-foreground">
                    <span>
                      {concursosAtivos.length} concurso{concursosAtivos.length !== 1 ? 's' : ''} aberto{concursosAtivos.length !== 1 ? 's' : ''}
                      {searchTerm && ` para "${searchTerm}"`}
                      {selectedCategory !== 'todos' && ` em ${getCategoryData(selectedCategory).name}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>

        {/* Active Concursos Section */}
        <Section variant="default" size="lg">
          <SectionHeader
            subtitle="Oportunidades Disponíveis"
            title={
              <span>
                Concursos{' '}
                <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Abertos
                </span>
              </span>
            }
            description="Vagas disponíveis para ingressar na Administração Municipal de Chipindo"
            centered={true}
          />

          <SectionContent>
            {concursosAtivos.length === 0 ? (
              <div className="text-center py-16">
                <BriefcaseIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum concurso aberto</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedCategory !== 'todos'
                    ? "Tente ajustar seus filtros de busca."
                    : "Novos concursos serão publicados em breve. Volte em outro momento."
                  }
                </p>
                {(searchTerm || selectedCategory !== 'todos') && (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("todos");
                      setSortBy("recent");
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
                  {paginatedAtivos.map((concurso) => {
                    const categoryData = getCategoryData(concurso.category || 'administracao');
                    const IconComponent = categoryData.icon;
                    const daysRemaining = getDaysRemaining(concurso.deadline);

                    return (
                      <Card
                        key={concurso.id}
                        className={cn(
                          "group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                          viewMode === 'list' && "md:flex"
                        )}
                        onClick={() => setSelectedConcurso(concurso)}
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
                              <IconComponent className="w-3 h-3 mr-1" />
                              {categoryData.name}
                            </Badge>
                            <div className="absolute top-3 right-3">
                              {getStatusBadge(concurso)}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 p-6">
                          <CardTitle className={cn(
                            "leading-tight group-hover:text-primary transition-colors duration-300 mb-3",
                            viewMode === 'list' ? "text-lg" : "text-xl"
                          )}>
                            {concurso.title}
                          </CardTitle>

                          <p className="text-muted-foreground mb-4 line-clamp-2">{concurso.description}</p>

                          <div className="space-y-3 mb-4">
                            {concurso.deadline && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarIcon className="w-4 h-4" />
                                <span className="font-medium">Prazo:</span> {formatDate(concurso.deadline)}
                              </div>
                            )}

                            {daysRemaining && daysRemaining > 0 && (
                              <div className="flex items-center gap-2 text-sm text-orange-600">
                                <ClockIcon className="w-4 h-4" />
                                <span className="font-medium">
                                  {daysRemaining} dias restantes
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <EyeIcon className="w-4 h-4" />
                                {concurso.views}
                              </div>
                              <div className="flex items-center gap-1">
                                <UsersIcon className="w-4 h-4" />
                                {concurso.applications} inscritos
                              </div>
                            </div>
                            <span className="text-xs">
                              {getTimeAgo(concurso.created_at)}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedConcurso(concurso);
                              }}
                              className="flex-1"
                            >
                              <FileTextIcon className="w-4 h-4 mr-2" />
                              Ver Detalhes
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInscricao(concurso);
                              }}
                              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                            >
                              Inscrever-se
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

        {/* Closed Concursos Section */}
        {concursosEncerrados.length > 0 && (
          <Section variant="muted" size="md">
            <SectionHeader
              subtitle="Arquivo"
              title="Concursos Encerrados"
              description="Consulte os processos seletivos já finalizados"
              centered={true}
            />

            <SectionContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {concursosEncerrados.slice(0, 6).map(concurso => {
                  const categoryData = getCategoryData(concurso.category || 'administracao');
                  const IconComponent = categoryData.icon;

                  return (
                    <Card key={concurso.id} className="opacity-75 hover:opacity-90 transition-opacity">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className={cn(categoryData.color, "text-white")}>
                            <IconComponent className="w-3 h-3 mr-1" />
                            {categoryData.name}
                          </Badge>
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            Encerrado
                          </Badge>
                        </div>
                        <CardTitle className="text-muted-foreground">{concurso.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p className="line-clamp-2">{concurso.description}</p>
                          {concurso.deadline && (
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              Encerrado em {formatDate(concurso.deadline)}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </SectionContent>
          </Section>
        )}

        {/* Concurso Details Modal */}
        {selectedConcurso && !showInscricaoForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-10"
                  onClick={() => setSelectedConcurso(null)}
                >
                  <XIcon className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-4 mb-4">
                  <Badge className={cn(getCategoryData(selectedConcurso.category || 'administracao').color, "text-white")}>
                    {getCategoryData(selectedConcurso.category || 'administracao').name}
                  </Badge>
                  {getStatusBadge(selectedConcurso)}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="w-4 h-4" />
                    Publicado em {formatDate(selectedConcurso.created_at)}
                  </div>
                </div>

                <CardTitle className="text-3xl leading-tight">{selectedConcurso.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Descrição</h3>
                    <p className="text-muted-foreground leading-relaxed">{selectedConcurso.description}</p>
                  </div>

                  {selectedConcurso.requirements && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Requisitos</h3>
                      <p className="text-muted-foreground leading-relaxed">{selectedConcurso.requirements}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Informações Gerais</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Publicado:</span>
                          <span className="font-medium">{formatDate(selectedConcurso.created_at)}</span>
                        </div>
                        {selectedConcurso.deadline && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Encerramento:</span>
                            <span className="font-medium">{formatDate(selectedConcurso.deadline)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Visualizações:</span>
                          <span className="font-medium">{selectedConcurso.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Inscritos:</span>
                          <span className="font-medium">{selectedConcurso.applications}</span>
                        </div>
                      </div>
                    </div>

                    {selectedConcurso.contact_info && (
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Contacto</h3>
                        <p className="text-sm text-muted-foreground">{selectedConcurso.contact_info}</p>
                      </div>
                    )}
                  </div>

                  {isActive(selectedConcurso) && (
                    <div className="flex gap-2 pt-6 border-t border-border">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedConcurso(null)}
                        className="flex-1"
                      >
                        Fechar
                      </Button>
                      <Button
                        onClick={() => handleInscricao(selectedConcurso)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                      >
                        Inscrever-se
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Inscription Form Modal */}
        {showInscricaoForm && selectedConcurso && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <FileTextIcon className="w-6 h-6 text-blue-600" />
                      Inscrição no Concurso
                    </CardTitle>
                    <p className="text-muted-foreground mt-1 font-medium">{selectedConcurso.title}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInscricaoForm(false)}
                  >
                    <XIcon className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Requisitos do Concurso */}
                {selectedConcurso.requirements && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <div className="font-semibold text-blue-900 dark:text-blue-200 mb-1">Requisitos do Concurso</div>
                      <div className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-line">{selectedConcurso.requirements}</div>
                    </div>
                  </div>
                )}

                {/* Upload de Documentos Obrigatórios */}
                <div className="space-y-4">
                  {/* Bilhete de Identidade */}
                  <div>
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <IdCardIcon className="w-4 h-4" />
                      Bilhete de Identidade <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="biUpload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                      onChange={e => setFormData({ ...formData, biFile: e.target.files?.[0] || null })}
                      className="file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-muted-foreground">Anexe uma cópia legível do seu Bilhete de Identidade.</p>
                  </div>

                  {/* Certificado de Habilitação OU Declaração com Notas */}
                  <div>
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <FileTextIcon className="w-4 h-4" />
                      Certificado de Habilitação <span className="text-muted-foreground">ou</span> Declaração com Notas
                    </Label>
                    <div className="flex flex-col md:flex-row gap-2">
                      <Input
                        id="certificadoUpload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => setFormData({ ...formData, certificadoFile: e.target.files?.[0] || null })}
                        className="file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <span className="text-xs text-muted-foreground self-center">ou</span>
                      <Input
                        id="declaracaoUpload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => setFormData({ ...formData, declaracaoFile: e.target.files?.[0] || null })}
                        className="file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Anexe um dos documentos: Certificado de Habilitação <b>ou</b> Declaração com Notas.</p>
                  </div>

                  {/* Currículo Vitae */}
                  <div>
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <FileTextIcon className="w-4 h-4" />
                      Currículo Vitae <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="cvUpload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required
                      onChange={e => setFormData({ ...formData, cvFile: e.target.files?.[0] || null })}
                      className="file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-muted-foreground">Anexe seu currículo em PDF ou Word.</p>
                  </div>
                </div>

                {/* Campos do Formulário com Ícones */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="nomeCompleto"
                      value={formData.nomeCompleto}
                      onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                      placeholder="Nome Completo *"
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <IdCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="bilheteIdentidade"
                      value={formData.bilheteIdentidade}
                      onChange={(e) => setFormData({ ...formData, bilheteIdentidade: e.target.value })}
                      placeholder="Nº Bilhete de Identidade *"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      placeholder="Contacto Telefônico *"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email *"
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Select
                    value={formData.categoria}
                    onValueChange={value => setFormData({ ...formData, categoria: value })}
                    disabled={!selectedConcurso?.categorias_disponiveis || !Array.isArray(selectedConcurso.categorias_disponiveis) || selectedConcurso.categorias_disponiveis.length === 0}
                  >
                    <SelectTrigger className="pl-10 h-10">
                      <SelectValue placeholder={selectedConcurso?.categorias_disponiveis && Array.isArray(selectedConcurso.categorias_disponiveis) && selectedConcurso.categorias_disponiveis.length > 0 ? "Categoria a que se candidata *" : "Nenhuma categoria cadastrada para este concurso"} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedConcurso?.categorias_disponiveis && Array.isArray(selectedConcurso.categorias_disponiveis) && selectedConcurso.categorias_disponiveis.length > 0 ? (
                        selectedConcurso.categorias_disponiveis.map((cat: string) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))
                      ) : (
                        <div className="text-xs text-muted-foreground p-2">Nenhuma categoria cadastrada para este concurso.</div>
                      )}
                    </SelectContent>
                  </Select>
                  {(!selectedConcurso?.categorias_disponiveis || !Array.isArray(selectedConcurso.categorias_disponiveis) || selectedConcurso.categorias_disponiveis.length === 0) && (
                    <p className="text-xs text-muted-foreground mt-1">O administrador ainda não cadastrou categorias para este concurso.</p>
                  )}
                </div>
                <div className="relative">
                  <FileTextIcon className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                  <Textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    placeholder="Informações adicionais relevantes para o concurso..."
                    rows={4}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => setShowInscricaoForm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={submitInscricao}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  >
                    Confirmar Inscrição
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}