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

// Estilos CSS personalizados para line-clamp e scrollbar
const lineClampStyles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
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

      // Carregar projectos
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

      // Recarregar dados para actualizar contadores
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
            <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
              <div className="space-y-3 sm:space-y-4">
                <Skeleton className="h-8 w-48 sm:w-64 rounded-xl" />
                <Skeleton className="h-4 w-64 sm:w-96 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-24 sm:h-32 rounded-xl" />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-40 sm:h-48 rounded-xl" />
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
          <div className="text-center space-y-6 sm:space-y-8 py-4 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl sm:rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/30 transition-all duration-200">
                <ShieldCheckIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Portal da
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Transparência
                  </span>
                </h1>
                <p className="text-primary-foreground/90 text-base sm:text-lg md:text-xl mt-2">
                  Administração Municipal de Chipindo
                </p>
              </div>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/95 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              Acesso público a informações, documentos e dados da Administração Municipal de Chipindo.
              Promovemos a transparência e o acesso à informação como pilares da boa governação.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 flex-wrap px-4 sm:px-0">
              <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-200 active:scale-[0.98]">
                <FileTextIcon className="w-5 h-5 text-white" />
                <span className="text-white font-medium text-sm sm:text-base">{documents.length} Documentos</span>
              </div>
              <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-green-500/20 rounded-xl backdrop-blur-md border border-green-400/30 transition-all duration-200 active:scale-[0.98]">
                <DollarSignIcon className="w-5 h-5 text-green-100" />
                <span className="text-green-100 font-medium text-sm sm:text-base">{formatCurrency(totalBudget)} Orçamento</span>
              </div>
              <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-yellow-500/20 rounded-xl backdrop-blur-md border border-yellow-400/30 transition-all duration-200 active:scale-[0.98]">
                <BuildingIcon className="w-5 h-5 text-yellow-100" />
                <span className="text-yellow-100 font-medium text-sm sm:text-base">{totalProjects} Projectos</span>
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
          description="Dados actualizados sobre documentos, orçamento e projectos da Administração Municipal"
          centered={true}
        />

        <SectionContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-200 rounded-xl active:scale-[0.98]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Documentos Publicados</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">{documents.length}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileTextIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-200 rounded-xl active:scale-[0.98]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Orçamento 2024</p>
                    <p className="text-lg sm:text-2xl font-bold text-slate-900 truncate">{formatCurrency(totalBudget)}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <DollarSignIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-200 rounded-xl active:scale-[0.98]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Projectos Activos</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">{activeProjects}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-200 rounded-xl active:scale-[0.98]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Cidadãos Beneficiados</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">{totalBeneficiaries.toLocaleString()}+</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Principais */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-2 scrollbar-hide">
              <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-4 mb-6 sm:mb-8 gap-1 rounded-xl p-1">
                <TabsTrigger 
                  value="documentos" 
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 min-h-[44px] whitespace-nowrap transition-all duration-200 rounded-lg data-[state=active]:shadow-sm"
                >
                  <FileTextIcon className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Documentos</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="orcamento" 
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 min-h-[44px] whitespace-nowrap transition-all duration-200 rounded-lg data-[state=active]:shadow-sm"
                >
                  <DollarSignIcon className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Orçamento</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="projectos" 
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 min-h-[44px] whitespace-nowrap transition-all duration-200 rounded-lg data-[state=active]:shadow-sm"
                >
                  <BuildingIcon className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Projectos</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="estatisticas" 
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 min-h-[44px] whitespace-nowrap transition-all duration-200 rounded-lg data-[state=active]:shadow-sm"
                >
                  <BarChartIcon className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Estatísticas</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Documentos */}
            <TabsContent value="documentos" className="space-y-4 sm:space-y-6">
              {/* Filtros e Busca */}
              <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4">
                    {/* Busca - sempre no topo */}
                    <div className="relative w-full">
                      <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Buscar documentos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all duration-200"
                      />
                    </div>
                    
                    {/* Filtros em layout vertical no mobile */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Select onValueChange={(value) => setSelectedCategory(value)} defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-xl transition-all duration-200">
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value} className="py-3">
                              <div className="flex items-center gap-2">
                                <category.icon className="w-4 h-4" />
                                {category.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select onValueChange={(value) => setSortBy(value as any)} defaultValue="date">
                        <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-xl transition-all duration-200">
                          <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="date" className="py-3">Data</SelectItem>
                          <SelectItem value="title" className="py-3">Título</SelectItem>
                          <SelectItem value="downloads" className="py-3">Downloads</SelectItem>
                          <SelectItem value="views" className="py-3">Visualizações</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Ordenação e View Mode */}
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="h-11 w-11 p-0 rounded-xl transition-all duration-200 active:scale-[0.98]"
                      >
                        {sortOrder === "asc" ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                      </Button>
                      <div className="flex items-center gap-1 border rounded-xl p-1.5 bg-slate-50">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          onClick={() => setViewMode('grid')}
                          className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-lg transition-all duration-200 active:scale-[0.98]"
                        >
                          <GridIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          onClick={() => setViewMode('list')}
                          className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-lg transition-all duration-200 active:scale-[0.98]"
                        >
                          <ListIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Documentos */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' : 'space-y-3 sm:space-y-4'}>
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-200 sm:hover:scale-[1.02] group overflow-hidden rounded-xl">
                    <CardContent className="p-0">
                      {/* Header do Card */}
                      <div className="p-4 sm:p-6 pb-3 sm:pb-4">
                        <div className="flex items-start gap-3 mb-3 sm:mb-4">
                          <div className={`w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br ${getFileTypeColor(doc.file_size || '')} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                            {getFileIcon(doc.file_size || '')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {doc.title}
                            </h3>
                            <p className="text-slate-600 text-sm line-clamp-2 mb-2 sm:mb-3">
                              {doc.description}
                            </p>
                          </div>
                        </div>

                        {/* Status e Tags */}
                        <div className="flex items-center gap-2 flex-wrap mb-3 sm:mb-4">
                          <Badge className={cn(getStatusColor(doc.status), "text-xs")}>
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
                      <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-50/50 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span className="truncate">{formatDate(doc.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <ArchiveIcon className="w-3.5 h-3.5" />
                            <span className="truncate">{doc.file_size}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DownloadIcon className="w-3.5 h-3.5" />
                            <span className="truncate">{doc.downloads}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <EyeIcon className="w-3.5 h-3.5" />
                            <span className="truncate">{doc.views}</span>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="p-3 sm:p-4 pt-2.5 sm:pt-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Button
                            variant="outline"
                            className="flex-1 h-11 sm:h-10 text-sm rounded-xl transition-all duration-200 active:scale-[0.98]"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <EyeIcon className="w-4 h-4 mr-1.5" />
                            Visualizar
                          </Button>
                          <Button
                            className="flex-1 h-11 sm:h-10 text-sm bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 active:scale-[0.98]"
                            onClick={() => handleDownloadDocument(doc)}
                          >
                            <DownloadIcon className="w-4 h-4 mr-1.5" />
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
            <TabsContent value="orcamento" className="space-y-4 sm:space-y-6">
              <div className="grid gap-4 sm:gap-6">
                <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                  <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <DollarSignIcon className="w-5 h-5 text-green-600" />
                      Execução Orçamental 2024
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Acompanhe a execução do orçamento municipal por categoria
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                    <div className="space-y-4 sm:space-y-5">
                      {filteredBudgetData.map((budget, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-medium text-slate-900 text-sm sm:text-base">{budget.category}</h4>
                              <p className="text-xs sm:text-sm text-slate-600">
                                {formatCurrency(budget.executed_budget)} de {formatCurrency(budget.total_budget)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 sm:text-right">
                              <p className="font-semibold text-slate-900 text-sm sm:text-base">{budget.percentage}%</p>
                              <Badge className={cn(getBudgetStatusColor(budget.status), "text-xs")}>
                                {budget.status === 'on_track' ? 'No Prazo' :
                                  budget.status === 'over_budget' ? 'Acima' : 'Abaixo'}
                              </Badge>
                            </div>
                          </div>
                          <Progress value={budget.percentage} className="h-2 sm:h-2.5" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                    <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <PieChartIcon className="w-5 h-5 text-blue-600" />
                        Distribuição por Categoria
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                      <div className="space-y-3">
                        {filteredBudgetData.map((budget, index) => (
                          <div key={index} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                            <span className="text-sm text-slate-600 truncate mr-2">{budget.category}</span>
                            <span className="font-medium text-slate-900 text-sm whitespace-nowrap">{formatCurrency(budget.total_budget)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                    <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <TrendingUpIcon className="w-5 h-5 text-orange-600" />
                        Resumo Executivo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-xl">
                          <span className="text-sm font-medium text-green-800">Orçamento Total</span>
                          <span className="font-bold text-green-900 text-sm sm:text-base">{formatCurrency(totalBudget)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-xl">
                          <span className="text-sm font-medium text-blue-800">Executado</span>
                          <span className="font-bold text-blue-900 text-sm sm:text-base">{formatCurrency(totalExecuted)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-orange-50 rounded-xl">
                          <span className="text-sm font-medium text-orange-800">Percentual</span>
                          <span className="font-bold text-orange-900 text-sm sm:text-base">{averageExecution.toFixed(1)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Tab Projectos */}
            <TabsContent value="projectos" className="space-y-4 sm:space-y-6">
              <div className="grid gap-4 sm:gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col gap-4 sm:gap-6">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">{project.name}</h3>
                              <p className="text-slate-600 text-sm sm:text-base mb-3">{project.description}</p>
                            </div>
                            <Badge className={cn(getProjectStatusColor(project.status), "text-xs self-start flex-shrink-0")}>
                              {project.status === 'active' ? 'Activo' :
                                project.status === 'completed' ? 'Concluído' : 'Planeado'}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-xl">
                              <DollarSignIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs text-slate-500">Orçamento</p>
                                <p className="font-medium text-slate-900 text-sm truncate">{formatCurrency(project.budget)}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
                              <MapPinIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs text-slate-500">Localização</p>
                                <p className="font-medium text-slate-900 text-sm truncate">{project.location}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-xl">
                              <UsersIcon className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs text-slate-500">Beneficiários</p>
                                <p className="font-medium text-slate-900 text-sm">{project.beneficiaries.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-xl">
                              <CalendarIcon className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs text-slate-500">Prazo</p>
                                <p className="font-medium text-slate-900 text-sm">{formatDate(project.end_date)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">Progresso</span>
                              <span className="text-sm font-medium text-slate-900">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2.5 sm:h-3" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab Estatísticas */}
            <TabsContent value="estatisticas" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                  <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <BarChartIcon className="w-5 h-5 text-blue-600" />
                      Acesso aos Documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-xl">
                        <span className="text-sm font-medium text-blue-800">Total de Downloads</span>
                        <span className="font-bold text-blue-900">{documents.reduce((sum, doc) => sum + doc.downloads, 0)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-xl">
                        <span className="text-sm font-medium text-green-800">Total de Visualizações</span>
                        <span className="font-bold text-green-900">{documents.reduce((sum, doc) => sum + doc.views, 0)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-purple-50 rounded-xl">
                        <span className="text-sm font-medium text-purple-800">Documentos Publicados</span>
                        <span className="font-bold text-purple-900">{documents.length}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-orange-50 rounded-xl">
                        <span className="text-sm font-medium text-orange-800">Categorias</span>
                        <span className="font-bold text-orange-900">{categories.length - 1}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                  <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <TrendingUpIcon className="w-5 h-5 text-green-600" />
                      Indicadores de Transparência
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-600">Publicação Regular</span>
                        <Badge className="bg-green-100 text-green-800 text-xs">100%</Badge>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-600">Acesso à Informação</span>
                        <Badge className="bg-green-100 text-green-800 text-xs">100%</Badge>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-600">Prestação de Contas</span>
                        <Badge className="bg-green-100 text-green-800 text-xs">100%</Badge>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-slate-600">Participação Cidadã</span>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">85%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <EyeIcon className="w-5 h-5 text-purple-600" />
                    Compromisso com a Transparência
                  </CardTitle>
                  <CardDescription className="text-sm">
                    A Administração Municipal de Chipindo compromete-se com a transparência total
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="text-center p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl transition-all duration-200 active:scale-[0.98]">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/60 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <ShieldCheckIcon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">Integridade</h4>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Garantimos a integridade e precisão de todas as informações publicadas
                      </p>
                    </div>
                    <div className="text-center p-4 sm:p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl transition-all duration-200 active:scale-[0.98]">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/60 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <EyeIcon className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">Acesso Livre</h4>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Todas as informações estão disponíveis gratuitamente para todos os cidadãos
                      </p>
                    </div>
                    <div className="text-center p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl transition-all duration-200 active:scale-[0.98]">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/60 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <ClockIcon className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">Actualização Regular</h4>
                      <p className="text-xs sm:text-sm text-slate-600">
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
        <DialogContent className="w-full max-w-4xl h-[100dvh] sm:h-auto sm:max-h-[85vh] overflow-hidden p-0 sm:rounded-xl gap-0">
          <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-200 sticky top-0 bg-white z-10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center">
                  {selectedDocument && getFileIcon(selectedDocument.file_size || '')}
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-900 pr-8 line-clamp-2">
                    {selectedDocument?.title}
                  </DialogTitle>
                  <DialogDescription className="text-slate-600 text-sm mt-1 line-clamp-2">
                    {selectedDocument?.description}
                  </DialogDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={handleCloseModal}
                className="h-11 w-11 p-0 rounded-xl flex-shrink-0 transition-all duration-200 active:scale-[0.98] -mt-1 -mr-1"
              >
                <XIcon className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto scroll-smooth" style={{ maxHeight: 'calc(100dvh - 180px)' }}>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Informações do Documento */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm font-medium text-slate-600">Categoria:</span>
                    <Badge variant="outline" className="text-xs">{selectedDocument?.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm font-medium text-slate-600">Data de Publicação:</span>
                    <span className="text-sm text-slate-900">{selectedDocument && formatDate(selectedDocument.date)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm font-medium text-slate-600">Tamanho do Arquivo:</span>
                    <span className="text-sm text-slate-900">{selectedDocument?.file_size}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm font-medium text-slate-600">Downloads:</span>
                    <span className="text-sm text-slate-900">{selectedDocument?.downloads}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm font-medium text-slate-600">Visualizações:</span>
                    <span className="text-sm text-slate-900">{selectedDocument?.views}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm font-medium text-slate-600">Status:</span>
                    <Badge className={cn(selectedDocument ? getStatusColor(selectedDocument.status) : '', "text-xs")}>
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
                      <Badge key={index} variant="outline" className="text-xs py-1 px-2">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Conteúdo Simulado do Documento */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-base sm:text-lg font-semibold text-slate-900">Conteúdo do Documento</h4>
                <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-xl">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                      Este é um documento de transparência da Administração Municipal de Chipindo.
                      O conteúdo aqui apresentado demonstra o compromisso da administração com a
                      transparência e o acesso público à informação.
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-4 text-sm sm:text-base">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                      nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-4 text-sm sm:text-base">
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-6 pt-3 sm:pt-4 border-t border-slate-200 bg-white sticky bottom-0">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
              <EyeIcon className="w-4 h-4" />
              <span>Visualizando documento</span>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="h-12 sm:h-11 text-base sm:text-sm rounded-xl transition-all duration-200 active:scale-[0.98] order-2 sm:order-1"
                onClick={() => selectedDocument && handleDownloadDocument(selectedDocument)}
              >
                <DownloadIcon className="w-5 h-5 sm:w-4 sm:h-4 mr-2" />
                Baixar Documento
              </Button>
              <Button 
                className="h-12 sm:h-11 text-base sm:text-sm rounded-xl transition-all duration-200 active:scale-[0.98] order-1 sm:order-2"
                onClick={handleCloseModal}
              >
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