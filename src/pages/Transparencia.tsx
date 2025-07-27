import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileTextIcon, 
  DollarSignIcon, 
  TrendingUpIcon, 
  UsersIcon, 
  CalendarIcon,
  DownloadIcon,
  EyeIcon,
  BarChartIcon,
  PieChartIcon,
  TargetIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  BuildingIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ExternalLinkIcon,
  FilterIcon,
  SearchIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArchiveIcon,
  AwardIcon,
  ShieldCheckIcon,
  ShieldIcon,
  ScaleIcon,
  GavelIcon,
  BookOpenIcon,
  FileIcon,
  DatabaseIcon,
  ChartBarIcon,
  TrendingDownIcon,
  CheckSquareIcon,
  AlertTriangleIcon,
  InfoIcon,
  ZapIcon,
  FlameIcon,
  XIcon,
  MaximizeIcon,
  GridIcon,
  ListIcon,
  SortDescIcon,
  SortAscIcon
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Estilos CSS personalizados para line-clamp
const lineClampStyles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

type TransparencyDocument = Tables<'transparency_documents'>;
type BudgetExecution = Tables<'budget_execution'>;
type TransparencyProject = Tables<'transparency_projects'>;

const Transparencia = () => {
  const { settings } = useSiteSettings();
  const [activeTab, setActiveTab] = useState("documentos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [documents, setDocuments] = useState<TransparencyDocument[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetExecution[]>([]);
  const [projects, setProjects] = useState<TransparencyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<TransparencyDocument | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'downloads' | 'views'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Carregar dados reais do banco de dados
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar documentos publicados
      const { data: docs, error: docsError } = await supabase
        .from('transparency_documents')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;
      setDocuments(docs || []);

      // Carregar dados orçamentários
      const { data: budget, error: budgetError } = await supabase
        .from('budget_execution')
        .select('*')
        .order('year', { ascending: false });

      if (budgetError) throw budgetError;
      setBudgetData(budget || []);

      // Carregar projetos
      const { data: projs, error: projsError } = await supabase
        .from('transparency_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projsError) throw projsError;
      setProjects(projs || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error("Erro ao carregar dados de transparência");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtrar documentos
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtrar dados orçamentários
  const filteredBudgetData = budgetData.filter(budget => {
    return selectedYear === "all" || budget.year === selectedYear;
  });

  // Calcular estatísticas
  const totalBudget = budgetData.reduce((sum, budget) => sum + budget.total_budget, 0);
  const totalExecuted = budgetData.reduce((sum, budget) => sum + budget.executed_budget, 0);
  const averageExecution = budgetData.length > 0 ? (totalExecuted / totalBudget) * 100 : 0;

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalBeneficiaries = projects.reduce((sum, p) => sum + p.beneficiaries, 0);

  const categories = [
    { value: "all", label: "Todos", icon: FileTextIcon },
    { value: "relatorios", label: "Relatórios", icon: FileTextIcon },
    { value: "orcamento", label: "Orçamento", icon: DollarSignIcon },
    { value: "contratos", label: "Contratos", icon: FileTextIcon },
    { value: "prestacao-contas", label: "Prestação de Contas", icon: FileTextIcon },
    { value: "planos", label: "Planos", icon: FileTextIcon },
    { value: "auditorias", label: "Auditorias", icon: FileTextIcon }
  ];

  const years = Array.from(new Set(budgetData.map(b => b.year))).sort((a, b) => b.localeCompare(a));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getBudgetStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'over_budget':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'under_budget':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const handleViewDocument = (document: TransparencyDocument) => {
    setSelectedDocument(document);
    setShowDocumentModal(true);
  };

  const handleDownloadDocument = async (documentItem: TransparencyDocument) => {
    try {
      // Incrementar contador de downloads
      await supabase
        .from('transparency_documents')
        .update({ downloads: documentItem.downloads + 1 })
        .eq('id', documentItem.id);

      // Simular download (em produção, seria o arquivo real)
      toast.success(`Download iniciado: ${documentItem.title}`);
      
      // Recarregar dados para atualizar contadores
      loadData();
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      toast.error("Erro ao fazer download do documento");
    }
  };

  const handleCloseModal = () => {
    setShowDocumentModal(false);
    setSelectedDocument(null);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileTextIcon className="w-6 h-6 text-red-600" />;
      case 'doc':
      case 'docx':
        return <FileTextIcon className="w-6 h-6 text-blue-600" />;
      case 'xls':
      case 'xlsx':
        return <FileTextIcon className="w-6 h-6 text-green-600" />;
      case 'ppt':
      case 'pptx':
        return <FileTextIcon className="w-6 h-6 text-orange-600" />;
      case 'zip':
      case 'rar':
        return <FileTextIcon className="w-6 h-6 text-purple-600" />;
      default:
        return <FileTextIcon className="w-6 h-6 text-blue-600" />;
    }
  };

  const getFileTypeColor = (fileName: string) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'from-red-50 to-red-100';
      case 'doc':
      case 'docx':
        return 'from-blue-50 to-blue-100';
      case 'xls':
      case 'xlsx':
        return 'from-green-50 to-green-100';
      case 'ppt':
      case 'pptx':
        return 'from-orange-50 to-orange-100';
      case 'zip':
      case 'rar':
        return 'from-purple-50 to-purple-100';
      default:
        return 'from-blue-50 to-blue-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Section>
          <SectionContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            </div>
          </SectionContent>
        </Section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <style dangerouslySetInnerHTML={{ __html: lineClampStyles }} />
      <Header />
      
      {/* Hero Section */}
      <Section variant="primary" size="lg">
        <SectionContent>
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/30">
                <ShieldCheckIcon className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                  Portal da
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Transparência
                  </span>
                </h1>
                <p className="text-primary-foreground/90 text-xl mt-2">
                  Administração Municipal de Chipindo
                </p>
              </div>
            </div>
            
            <p className="text-xl text-primary-foreground/95 max-w-4xl mx-auto leading-relaxed">
              Acesso público a informações, documentos e dados da Administração Municipal de Chipindo. 
              Promovemos a transparência e o acesso à informação como pilares da boa governação.
            </p>
            
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                <FileTextIcon className="w-5 h-5 text-white" />
                <span className="text-white font-medium">{documents.length} Documentos</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-green-500/20 rounded-full backdrop-blur-md border border-green-400/30">
                <DollarSignIcon className="w-5 h-5 text-green-100" />
                <span className="text-green-100 font-medium">{formatCurrency(totalBudget)} Orçamento</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-yellow-500/20 rounded-full backdrop-blur-md border border-yellow-400/30">
                <BuildingIcon className="w-5 h-5 text-yellow-100" />
                <span className="text-yellow-100 font-medium">{totalProjects} Projetos</span>
              </div>
            </div>
          </div>
        </SectionContent>
      </Section>

      {/* Estatísticas Rápidas */}
      <Section variant="secondary" size="lg">
        <SectionHeader
          subtitle="Visão Geral"
          title="Estatísticas de Transparência"
          description="Dados atualizados sobre documentos, orçamento e projetos da Administração Municipal"
          centered={true}
        />
        
        <SectionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Documentos Publicados</p>
                    <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
                  </div>
                  <FileTextIcon className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Orçamento Total 2024</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalBudget)}</p>
                  </div>
                  <DollarSignIcon className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Projetos Ativos</p>
                    <p className="text-2xl font-bold text-slate-900">{activeProjects}</p>
                  </div>
                  <TrendingUpIcon className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Cidadãos Beneficiados</p>
                    <p className="text-2xl font-bold text-slate-900">{totalBeneficiaries.toLocaleString()}+</p>
                  </div>
                  <UsersIcon className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Principais */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="documentos" className="flex items-center gap-2">
                <FileTextIcon className="w-4 h-4" />
                Documentos
              </TabsTrigger>
              <TabsTrigger value="orcamento" className="flex items-center gap-2">
                <DollarSignIcon className="w-4 h-4" />
                Orçamento
              </TabsTrigger>
              <TabsTrigger value="projetos" className="flex items-center gap-2">
                <BuildingIcon className="w-4 h-4" />
                Projetos
              </TabsTrigger>
              <TabsTrigger value="estatisticas" className="flex items-center gap-2">
                <BarChartIcon className="w-4 h-4" />
                Estatísticas
              </TabsTrigger>
            </TabsList>

            {/* Tab Documentos */}
            <TabsContent value="documentos" className="space-y-6">
              {/* Filtros e Busca */}
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Buscar documentos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <Select onValueChange={(value) => setSelectedCategory(value)} defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center gap-2">
                                <category.icon className="w-4 h-4" />
                                {category.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select onValueChange={(value) => setSortBy(value as any)} defaultValue="date">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Data</SelectItem>
                          <SelectItem value="title">Título</SelectItem>
                          <SelectItem value="downloads">Downloads</SelectItem>
                          <SelectItem value="views">Visualizações</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="px-3"
                      >
                        {sortOrder === "asc" ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                      </Button>
                      <div className="flex items-center gap-1 border rounded-lg p-1">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className="h-8 w-8 p-0"
                        >
                          <GridIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="h-8 w-8 p-0"
                        >
                          <ListIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Documentos */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden">
                    <CardContent className="p-0">
                      {/* Header do Card */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${getFileTypeColor(doc.file_size || '')} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                            {getFileIcon(doc.file_size || '')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {doc.title}
                            </h3>
                            <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                              {doc.description}
                            </p>
                          </div>
                        </div>

                        {/* Status e Tags */}
                        <div className="flex items-center gap-2 mb-4">
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status === 'published' ? 'Publicado' : 
                             doc.status === 'pending' ? 'Pendente' : 'Arquivado'}
                          </Badge>
                          {doc.tags && doc.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {doc.tags && doc.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{doc.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Informações do Arquivo */}
                      <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span className="truncate">{formatDate(doc.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ArchiveIcon className="w-3 h-3" />
                            <span className="truncate">{doc.file_size}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DownloadIcon className="w-3 h-3" />
                            <span className="truncate">{doc.downloads}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <EyeIcon className="w-3 h-3" />
                            <span className="truncate">{doc.views}</span>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="p-4 pt-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-9 text-xs"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <EyeIcon className="w-3 h-3 mr-1" />
                            Visualizar
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 h-9 text-xs bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleDownloadDocument(doc)}
                          >
                            <DownloadIcon className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab Orçamento */}
            <TabsContent value="orcamento" className="space-y-6">
              <div className="grid gap-6">
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSignIcon className="w-5 h-5 text-green-600" />
                      Execução Orçamental 2024
                    </CardTitle>
                    <CardDescription>
                      Acompanhe a execução do orçamento municipal por categoria
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredBudgetData.map((budget, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-slate-900">{budget.category}</h4>
                              <p className="text-sm text-slate-600">
                                {formatCurrency(budget.executed_budget)} de {formatCurrency(budget.total_budget)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-slate-900">{budget.percentage}%</p>
                              <Badge className={getBudgetStatusColor(budget.status)}>
                                {budget.status === 'on_track' ? 'No Prazo' : 
                                 budget.status === 'over_budget' ? 'Acima' : 'Abaixo'}
                              </Badge>
                            </div>
                          </div>
                          <Progress value={budget.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5 text-blue-600" />
                        Distribuição por Categoria
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {filteredBudgetData.map((budget, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">{budget.category}</span>
                            <span className="font-medium text-slate-900">{formatCurrency(budget.total_budget)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUpIcon className="w-5 h-5 text-orange-600" />
                        Resumo Executivo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-green-800">Orçamento Total</span>
                          <span className="font-bold text-green-900">{formatCurrency(totalBudget)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-blue-800">Executado</span>
                          <span className="font-bold text-blue-900">{formatCurrency(totalExecuted)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <span className="text-sm font-medium text-orange-800">Percentual</span>
                          <span className="font-bold text-orange-900">{averageExecution.toFixed(1)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Tab Projetos */}
            <TabsContent value="projetos" className="space-y-6">
              <div className="grid gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="bg-white shadow-lg border-0">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-slate-900 mb-2">{project.name}</h3>
                              <p className="text-slate-600 mb-3">{project.description}</p>
                            </div>
                            <Badge className={getProjectStatusColor(project.status)}>
                              {project.status === 'active' ? 'Ativo' : 
                               project.status === 'completed' ? 'Concluído' : 'Planeado'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <DollarSignIcon className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-xs text-slate-500">Orçamento</p>
                                <p className="font-medium text-slate-900">{formatCurrency(project.budget)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPinIcon className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="text-xs text-slate-500">Localização</p>
                                <p className="font-medium text-slate-900">{project.location}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <UsersIcon className="w-4 h-4 text-purple-600" />
                              <div>
                                <p className="text-xs text-slate-500">Beneficiários</p>
                                <p className="font-medium text-slate-900">{project.beneficiaries.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4 text-orange-600" />
                              <div>
                                <p className="text-xs text-slate-500">Prazo</p>
                                <p className="font-medium text-slate-900">{formatDate(project.end_date)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">Progresso</span>
                              <span className="text-sm font-medium text-slate-900">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-3" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab Estatísticas */}
            <TabsContent value="estatisticas" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChartIcon className="w-5 h-5 text-blue-600" />
                      Acesso aos Documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-blue-800">Total de Downloads</span>
                        <span className="font-bold text-blue-900">{documents.reduce((sum, doc) => sum + doc.downloads, 0)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-green-800">Total de Visualizações</span>
                        <span className="font-bold text-green-900">{documents.reduce((sum, doc) => sum + doc.views, 0)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium text-purple-800">Documentos Publicados</span>
                        <span className="font-bold text-purple-900">{documents.length}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium text-orange-800">Categorias</span>
                        <span className="font-bold text-orange-900">{categories.length - 1}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUpIcon className="w-5 h-5 text-green-600" />
                      Indicadores de Transparência
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Publicação Regular</span>
                        <Badge className="bg-green-100 text-green-800">100%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Acesso à Informação</span>
                        <Badge className="bg-green-100 text-green-800">100%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Prestação de Contas</span>
                        <Badge className="bg-green-100 text-green-800">100%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Participação Cidadã</span>
                        <Badge className="bg-blue-100 text-blue-800">85%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <EyeIcon className="w-5 h-5 text-purple-600" />
                    Compromisso com a Transparência
                  </CardTitle>
                  <CardDescription>
                    A Administração Municipal de Chipindo compromete-se com a transparência total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <ShieldCheckIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-slate-900 mb-2">Integridade</h4>
                      <p className="text-sm text-slate-600">
                        Garantimos a integridade e precisão de todas as informações publicadas
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <EyeIcon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-slate-900 mb-2">Acesso Livre</h4>
                      <p className="text-sm text-slate-600">
                        Todas as informações estão disponíveis gratuitamente para todos os cidadãos
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                      <ClockIcon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-slate-900 mb-2">Atualização Regular</h4>
                      <p className="text-sm text-slate-600">
                        Mantemos as informações atualizadas regularmente
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </SectionContent>
      </Section>

      {/* Modal de Visualização de Documento */}
      <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedDocument && getFileIcon(selectedDocument.file_size || '')}
                <div>
                  <DialogTitle className="text-xl font-semibold text-slate-900">
                    {selectedDocument?.title}
                  </DialogTitle>
                  <DialogDescription className="text-slate-600">
                    {selectedDocument?.description}
                  </DialogDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseModal}
                className="h-8 w-8 p-0"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6">
              {/* Informações do Documento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Categoria:</span>
                    <Badge variant="outline">{selectedDocument?.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Data de Publicação:</span>
                    <span className="text-sm text-slate-900">{selectedDocument && formatDate(selectedDocument.date)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Tamanho do Arquivo:</span>
                    <span className="text-sm text-slate-900">{selectedDocument?.file_size}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Downloads:</span>
                    <span className="text-sm text-slate-900">{selectedDocument?.downloads}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Visualizações:</span>
                    <span className="text-sm text-slate-900">{selectedDocument?.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Status:</span>
                    <Badge className={selectedDocument ? getStatusColor(selectedDocument.status) : ''}>
                      {selectedDocument?.status === 'published' ? 'Publicado' : 
                       selectedDocument?.status === 'pending' ? 'Pendente' : 'Arquivado'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {selectedDocument && selectedDocument.tags && selectedDocument.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-700">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Conteúdo Simulado do Documento */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-900">Conteúdo do Documento</h4>
                <div className="p-6 bg-white border border-slate-200 rounded-lg">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-slate-700 leading-relaxed">
                      Este é um documento de transparência da Administração Municipal de Chipindo. 
                      O conteúdo aqui apresentado demonstra o compromisso da administração com a 
                      transparência e o acesso público à informação.
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                      nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-4">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                      eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
                      in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Ações do Modal */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <EyeIcon className="w-4 h-4" />
              <span>Visualizando documento</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedDocument && handleDownloadDocument(selectedDocument)}
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Baixar
              </Button>
              <Button size="sm" onClick={handleCloseModal}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Transparencia; 