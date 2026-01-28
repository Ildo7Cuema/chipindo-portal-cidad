import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquareIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  SearchIcon,
  FilterIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  ReplyIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XIcon,
  SendIcon,
  FileTextIcon,
  ShieldIcon,
  BuildingIcon,
  UsersIcon,
  TrendingUpIcon,
  CalendarIcon,
  StarIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  ZapIcon,
  FlameIcon,
  InfoIcon,
  ExternalLinkIcon,
  DownloadIcon,
  ArchiveIcon,
  FlagIcon,
  AlertTriangleIcon,
  CheckSquareIcon,
  ClockIcon as ClockIcon2,
  BarChartIcon
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useOuvidoria, type OuvidoriaItem, type ManifestacaoFormData } from "@/hooks/useOuvidoria";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const Ouvidoria = () => {
  const { settings } = useSiteSettings();
  const {
    manifestacoes,
    stats,
    categories,
    loading,
    error,
    fetchManifestacoes,
    submitManifestacao,
    updateManifestacaoStatus,
    rateManifestacao
  } = useOuvidoria();

  const [activeTab, setActiveTab] = useState("manifestacoes");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("data_abertura");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedManifestacao, setSelectedManifestacao] = useState<OuvidoriaItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Formulário de nova manifestação
  const [formData, setFormData] = useState<ManifestacaoFormData>({
    nome: "",
    email: "",
    telefone: "",
    categoria: "",
    assunto: "",
    descricao: ""
  });

  // Buscar manifestações quando filtros mudarem
  useEffect(() => {
    fetchManifestacoes();
  }, []);

  // Função para obter dados da categoria
  const getCategoryData = (categoryId: string) => {
    const category = categories?.find(cat => cat.id === categoryId);
    if (category) {
      return {
        name: category.nome,
        color: category.cor,
        bgColor: category.bg_color
      };
    }
    return {
      name: 'Outros',
      color: 'text-slate-600',
      bgColor: 'bg-slate-100 text-slate-700'
    };
  };

  // Opções de filtro baseadas nas categorias reais
  const categoriaOptions = [
    { value: 'all', label: 'Todas as Categorias' },
    ...(categories?.map(cat => ({
      value: cat.id,
      label: cat.nome
    })) || [])
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em_analise': return 'bg-blue-100 text-blue-800';
      case 'respondido': return 'bg-green-100 text-green-800';
      case 'resolvido': return 'bg-green-100 text-green-800';
      case 'arquivado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewManifestacao = (manifestacao: OuvidoriaItem) => {
    setSelectedManifestacao(manifestacao);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedManifestacao(null);
  };

  const handleSubmitManifestacao = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.categoria || !formData.assunto || !formData.descricao) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const result = await submitManifestacao(formData);

    if (result.success) {
      // Limpar formulário
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        categoria: "",
        assunto: "",
        descricao: ""
      });

      // Fechar modal se estiver aberto
      setIsFormModalOpen(false);
    }
  };

  const handleFormChange = (field: keyof ManifestacaoFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section - Responsivo Mobile-First */}
        <Section className="relative min-h-[380px] md:min-h-[450px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden" size="lg">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

          <SectionContent className="px-4 md:px-6 py-8 md:py-12">
            <div className="text-center space-y-6 md:space-y-8 relative z-10">
              {/* Ícone e título adaptativo */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-4 md:mb-8">
                <div className="w-14 h-14 md:w-20 md:h-20 bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-200">
                  <MessageSquareIcon className="w-7 h-7 md:w-10 md:h-10 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-sm">
                    Ouvidoria
                    <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                      Municipal
                    </span>
                  </h1>
                </div>
              </div>

              <p className="text-base md:text-xl text-blue-50/90 max-w-4xl mx-auto leading-relaxed font-light px-2">
                Canal direto de comunicação entre cidadãos e a Administração Municipal.
                Sua voz é importante para melhorarmos nossos serviços e atendimento.
              </p>

              {/* Stats badges responsivos */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 flex-wrap pt-2 md:pt-4">
                <div className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-white/10 rounded-full backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200 active:scale-[0.98] min-h-[44px]">
                  <MessageSquareIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  <span className="text-white font-medium text-sm md:text-base">{stats?.total_manifestacoes || 0} Manifestações</span>
                </div>
                <div className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-emerald-500/20 rounded-full backdrop-blur-md border border-emerald-400/30 hover:bg-emerald-500/30 transition-all duration-200 active:scale-[0.98] min-h-[44px]">
                  <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5 text-emerald-100" />
                  <span className="text-emerald-100 font-medium text-sm md:text-base">{stats?.resolvidas || 0} Resolvidas</span>
                </div>
                <div className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-amber-500/20 rounded-full backdrop-blur-md border border-amber-400/30 hover:bg-amber-500/30 transition-all duration-200 active:scale-[0.98] min-h-[44px]">
                  <ClockIcon className="w-4 h-4 md:w-5 md:h-5 text-amber-100" />
                  <span className="text-amber-100 font-medium text-sm md:text-base">{stats?.tempo_medio_resposta || 0}h Média</span>
                </div>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Estatísticas Rápidas */}
        <Section variant="muted" size="lg">
          <SectionHeader
            subtitle="Visão Geral"
            title="Estatísticas da Ouvidoria"
            description="Dados actualizados sobre manifestações, tempo de resposta e satisfação dos cidadãos"
            centered={true}
          />

          <SectionContent className="px-4 md:px-6">
            {/* Stats Cards Grid - Responsivo */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
              <Card className="bg-white shadow-lg border-0 hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 rounded-xl">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-slate-600">Total de Manifestações</p>
                      <p className="text-xl md:text-2xl font-bold text-slate-900">{stats?.total_manifestacoes || 0}</p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <MessageSquareIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0 hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 rounded-xl">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-slate-600">Pendentes</p>
                      <p className="text-xl md:text-2xl font-bold text-slate-900">{stats?.pendentes || 0}</p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <AlertCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0 hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 rounded-xl">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-slate-600">Resolvidas</p>
                      <p className="text-xl md:text-2xl font-bold text-slate-900">{stats?.resolvidas || 0}</p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0 hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 rounded-xl">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-slate-600">Satisfação Geral</p>
                      <p className="text-xl md:text-2xl font-bold text-slate-900">{(stats?.satisfacao_geral || 0).toFixed(2)}/5</p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <StarIcon className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Principais - Responsivo */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* TabsList com scroll horizontal no mobile */}
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6 md:mb-8">
                <TabsList className="inline-flex w-full md:grid md:grid-cols-3 gap-1 min-w-max md:min-w-0 p-1 bg-slate-100 rounded-xl">
                  <TabsTrigger 
                    value="manifestacoes" 
                    className="flex items-center gap-2 min-h-[44px] px-4 md:px-6 text-sm md:text-base whitespace-nowrap transition-all duration-200 active:scale-[0.98] rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <MessageSquareIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Manifestações</span>
                    <span className="sm:hidden">Manif.</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="nova-manifestacao" 
                    className="flex items-center gap-2 min-h-[44px] px-4 md:px-6 text-sm md:text-base whitespace-nowrap transition-all duration-200 active:scale-[0.98] rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <SendIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Nova Manifestação</span>
                    <span className="sm:hidden">Nova</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="estatisticas" 
                    className="flex items-center gap-2 min-h-[44px] px-4 md:px-6 text-sm md:text-base whitespace-nowrap transition-all duration-200 active:scale-[0.98] rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <BarChartIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Estatísticas</span>
                    <span className="sm:hidden">Stats</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Manifestações */}
              <TabsContent value="manifestacoes" className="space-y-4 md:space-y-6">
                {/* Filtros e Busca - Layout vertical no mobile */}
                <Card className="bg-white shadow-lg border-0 rounded-xl">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col gap-4">
                      {/* Busca - Full width no mobile */}
                      <div className="relative w-full">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Buscar manifestações..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 h-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                        />
                      </div>

                      {/* Filtros em grid responsivo */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Select onValueChange={(value) => setSelectedCategory(value)} defaultValue="all">
                          <SelectTrigger className="h-12 rounded-xl text-base">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoriaOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="min-h-[44px]">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => setSelectedStatus(value)} defaultValue="all">
                          <SelectTrigger className="h-12 rounded-xl text-base">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all" className="min-h-[44px]">Todos os Status</SelectItem>
                            <SelectItem value="pendente" className="min-h-[44px]">Pendente</SelectItem>
                            <SelectItem value="em_analise" className="min-h-[44px]">Em Análise</SelectItem>
                            <SelectItem value="respondido" className="min-h-[44px]">Respondido</SelectItem>
                            <SelectItem value="resolvido" className="min-h-[44px]">Resolvido</SelectItem>
                            <SelectItem value="arquivado" className="min-h-[44px]">Arquivado</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => setSortBy(value)} defaultValue="data_abertura">
                          <SelectTrigger className="h-12 rounded-xl text-base">
                            <SelectValue placeholder="Ordenar por" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="data_abertura" className="min-h-[44px]">Data</SelectItem>
                            <SelectItem value="prioridade" className="min-h-[44px]">Prioridade</SelectItem>
                            <SelectItem value="protocolo" className="min-h-[44px]">Protocolo</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="outline"
                          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                          className="h-12 rounded-xl min-h-[44px] transition-all duration-200 active:scale-[0.98]"
                        >
                          {sortOrder === "asc" ? (
                            <span className="flex items-center gap-2">
                              <ChevronUpIcon className="w-4 h-4" />
                              <span className="sm:hidden">Crescente</span>
                              <span className="hidden sm:inline">Ordem Crescente</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <ChevronDownIcon className="w-4 h-4" />
                              <span className="sm:hidden">Decrescente</span>
                              <span className="hidden sm:inline">Ordem Decrescente</span>
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de Manifestações - Cards no mobile */}
                <div className="grid gap-4 md:gap-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-slate-600 mt-2">Carregando manifestações...</p>
                    </div>
                  ) : !Array.isArray(manifestacoes) || manifestacoes.length === 0 ? (
                    <Card className="bg-white shadow-lg border-0 rounded-xl">
                      <CardContent className="p-6 md:p-8 text-center">
                        <MessageSquareIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhuma manifestação encontrada</h3>
                        <p className="text-slate-600">Não há manifestações que correspondam aos filtros selecionados.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    manifestacoes.map((item) => {
                      const categoryData = getCategoryData(item.categoria);
                      return (
                        <Card key={item.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-200 rounded-xl">
                          <CardContent className="p-4 md:p-6">
                            <div className="flex flex-col gap-4">
                              {/* Header do Card */}
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <MessageSquareIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-1 line-clamp-2">{item.assunto}</h3>
                                  <p className="text-slate-600 text-sm mb-2 line-clamp-2">{item.descricao.substring(0, 100)}...</p>
                                </div>
                              </div>

                              {/* Meta info - Grid no mobile */}
                              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <UserIcon className="w-3 h-3" />
                                  <span className="truncate">{item.nome}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="w-3 h-3" />
                                  {formatDate(item.data_abertura)}
                                </span>
                                <span className="flex items-center gap-1 col-span-2 sm:col-span-1">
                                  <FileTextIcon className="w-3 h-3" />
                                  {item.protocolo}
                                </span>
                              </div>

                              {/* Badges - Scroll horizontal no mobile */}
                              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1">
                                <Badge className={cn(getStatusColor(item.status), "whitespace-nowrap flex-shrink-0")}>
                                  {item.status === 'pendente' ? 'Pendente' :
                                    item.status === 'em_analise' ? 'Em Análise' :
                                      item.status === 'respondido' ? 'Respondido' :
                                        item.status === 'resolvido' ? 'Resolvido' : 'Arquivado'}
                                </Badge>
                                <Badge className={cn(getPriorityColor(item.prioridade), "whitespace-nowrap flex-shrink-0")}>
                                  {item.prioridade === 'urgente' ? 'Urgente' :
                                    item.prioridade === 'alta' ? 'Alta' :
                                      item.prioridade === 'media' ? 'Média' : 'Baixa'}
                                </Badge>
                                <Badge className={cn(categoryData.bgColor, "whitespace-nowrap flex-shrink-0")}>
                                  {categoryData.name}
                                </Badge>
                              </div>

                              {/* Botão de ação */}
                              <Button
                                variant="outline"
                                className="w-full sm:w-auto sm:self-end flex items-center justify-center gap-2 min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
                                onClick={() => handleViewManifestacao(item)}
                              >
                                <EyeIcon className="w-4 h-4" />
                                Visualizar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              {/* Tab Nova Manifestação */}
              <TabsContent value="nova-manifestacao" className="space-y-4 md:space-y-6">
                <Card className="bg-white shadow-lg border-0 rounded-xl">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <SendIcon className="w-5 h-5 text-blue-600" />
                      Nova Manifestação
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      Preencha o formulário abaixo para enviar sua manifestação à Ouvidoria Municipal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <form onSubmit={handleSubmitManifestacao} className="space-y-4 md:space-y-6">
                      {/* Nome e Email - Stack no mobile */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome" className="text-sm md:text-base font-medium">Nome Completo *</Label>
                          <Input
                            id="nome"
                            placeholder="Seu nome completo"
                            value={formData.nome}
                            onChange={(e) => handleFormChange('nome', e.target.value)}
                            required
                            className="h-12 rounded-xl text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm md:text-base font-medium">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu.email@exemplo.com"
                            value={formData.email}
                            onChange={(e) => handleFormChange('email', e.target.value)}
                            required
                            className="h-12 rounded-xl text-base"
                          />
                        </div>
                      </div>

                      {/* Telefone e Categoria */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="telefone" className="text-sm md:text-base font-medium">Telefone</Label>
                          <Input
                            id="telefone"
                            placeholder="+244 912 345 678"
                            value={formData.telefone}
                            onChange={(e) => handleFormChange('telefone', e.target.value)}
                            className="h-12 rounded-xl text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="categoria" className="text-sm md:text-base font-medium">Categoria *</Label>
                          <Select
                            value={formData.categoria}
                            onValueChange={(value) => handleFormChange('categoria', value)}
                          >
                            <SelectTrigger className="h-12 rounded-xl text-base">
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories?.map((category) => (
                                <SelectItem key={category.id} value={category.id} className="min-h-[44px]">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: category.cor }}></div>
                                    {category.nome}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Assunto */}
                      <div className="space-y-2">
                        <Label htmlFor="assunto" className="text-sm md:text-base font-medium">Assunto *</Label>
                        <Input
                          id="assunto"
                          placeholder="Título da sua manifestação"
                          value={formData.assunto}
                          onChange={(e) => handleFormChange('assunto', e.target.value)}
                          required
                          className="h-12 rounded-xl text-base"
                        />
                      </div>

                      {/* Descrição */}
                      <div className="space-y-2">
                        <Label htmlFor="descricao" className="text-sm md:text-base font-medium">Descrição *</Label>
                        <Textarea
                          id="descricao"
                          placeholder="Descreva detalhadamente sua manifestação..."
                          rows={6}
                          value={formData.descricao}
                          onChange={(e) => handleFormChange('descricao', e.target.value)}
                          required
                          className="rounded-xl text-base min-h-[150px] resize-none"
                        />
                      </div>

                      {/* Botões de ação */}
                      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setActiveTab("manifestacoes")}
                          className="min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex items-center justify-center gap-2 min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]" 
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <SendIcon className="w-4 h-4" />
                              Enviar Manifestação
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Estatísticas */}
              <TabsContent value="estatisticas" className="space-y-4 md:space-y-6">
                <div className="grid gap-4 md:gap-6">
                  <Card className="bg-white shadow-lg border-0 rounded-xl">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <BarChartIcon className="w-5 h-5 text-blue-600" />
                        Estatísticas Gerais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        <div className="text-center p-3 md:p-4 bg-blue-50 rounded-xl">
                          <div className="text-xl md:text-2xl font-bold text-blue-600">{stats?.total_manifestacoes || 0}</div>
                          <div className="text-xs md:text-sm text-blue-600">Total</div>
                        </div>
                        <div className="text-center p-3 md:p-4 bg-yellow-50 rounded-xl">
                          <div className="text-xl md:text-2xl font-bold text-yellow-600">{stats?.pendentes || 0}</div>
                          <div className="text-xs md:text-sm text-yellow-600">Pendentes</div>
                        </div>
                        <div className="text-center p-3 md:p-4 bg-green-50 rounded-xl">
                          <div className="text-xl md:text-2xl font-bold text-green-600">{stats?.resolvidas || 0}</div>
                          <div className="text-xs md:text-sm text-green-600">Resolvidas</div>
                        </div>
                        <div className="text-center p-3 md:p-4 bg-purple-50 rounded-xl">
                          <div className="text-xl md:text-2xl font-bold text-purple-600">{stats?.tempo_medio_resposta || 0}h</div>
                          <div className="text-xs md:text-sm text-purple-600">Tempo Médio</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-lg border-0 rounded-xl">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <TrendingUpIcon className="w-5 h-5 text-green-600" />
                        Satisfação dos Cidadãos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="text-sm text-slate-600">Satisfação Geral</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                  key={star}
                                  className={cn(
                                    "w-5 h-5 md:w-4 md:h-4",
                                    star <= (stats?.satisfacao_geral || 0)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                              {(stats?.satisfacao_geral || 0).toFixed(2)}/5
                            </span>
                          </div>
                        </div>
                        <Progress value={(stats?.satisfacao_geral || 0) * 20} className="h-2 md:h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </SectionContent>
        </Section>
      </main>

      {/* Modal de Visualização de Manifestação - Fullscreen no mobile */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="w-full max-w-4xl h-[100dvh] md:h-[90vh] md:max-h-[90vh] overflow-hidden p-0 rounded-none md:rounded-xl">
          <DialogHeader className="p-4 md:p-6 pb-3 md:pb-4 border-b border-slate-200 sticky top-0 bg-white z-10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquareIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-base md:text-xl font-semibold text-slate-900 line-clamp-2">
                    {selectedManifestacao?.assunto}
                  </DialogTitle>
                  <DialogDescription className="text-slate-600 text-sm">
                    Protocolo: {selectedManifestacao?.protocolo}
                  </DialogDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseModal}
                className="h-10 w-10 p-0 min-h-[44px] min-w-[44px] rounded-xl flex-shrink-0 transition-all duration-200 active:scale-[0.98]"
              >
                <XIcon className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 overscroll-contain">
            <div className="space-y-4 md:space-y-6">
              {/* Informações da Manifestação - Stack no mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">Solicitante:</span>
                    <span className="text-slate-900 text-right">{selectedManifestacao?.nome}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">Email:</span>
                    <span className="text-slate-900 text-right truncate max-w-[180px]">{selectedManifestacao?.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">Telefone:</span>
                    <span className="text-slate-900">{selectedManifestacao?.telefone || '-'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">Data de Abertura:</span>
                    <span className="text-slate-900">{selectedManifestacao && formatDate(selectedManifestacao.data_abertura)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">Status:</span>
                    <Badge className={selectedManifestacao ? getStatusColor(selectedManifestacao.status) : ''}>
                      {selectedManifestacao?.status === 'pendente' ? 'Pendente' :
                        selectedManifestacao?.status === 'em_analise' ? 'Em Análise' :
                          selectedManifestacao?.status === 'respondido' ? 'Respondido' :
                            selectedManifestacao?.status === 'resolvido' ? 'Resolvido' : 'Arquivado'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">Prioridade:</span>
                    <Badge className={selectedManifestacao ? getPriorityColor(selectedManifestacao.prioridade) : ''}>
                      {selectedManifestacao?.prioridade === 'urgente' ? 'Urgente' :
                        selectedManifestacao?.prioridade === 'alta' ? 'Alta' :
                          selectedManifestacao?.prioridade === 'media' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700">Categoria:</h4>
                {selectedManifestacao && (
                  <Badge className={getCategoryData(selectedManifestacao.categoria).bgColor}>
                    {getCategoryData(selectedManifestacao.categoria).name}
                  </Badge>
                )}
              </div>

              {/* Descrição */}
              <div className="space-y-3 md:space-y-4">
                <h4 className="text-base md:text-lg font-semibold text-slate-900">Descrição da Manifestação</h4>
                <div className="p-4 md:p-6 bg-white border border-slate-200 rounded-xl">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                    {selectedManifestacao?.descricao}
                  </p>
                </div>
              </div>

              {/* Resposta (se houver) */}
              {selectedManifestacao?.resposta && (
                <div className="space-y-3 md:space-y-4">
                  <h4 className="text-base md:text-lg font-semibold text-slate-900">Resposta da Administração</h4>
                  <div className="p-4 md:p-6 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <ReplyIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Respondido em {selectedManifestacao.data_resposta && formatDate(selectedManifestacao.data_resposta)}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                      {selectedManifestacao.resposta}
                    </p>
                  </div>
                </div>
              )}

              {/* Avaliação (se houver) */}
              {selectedManifestacao?.avaliacao && (
                <div className="space-y-3 md:space-y-4">
                  <h4 className="text-base md:text-lg font-semibold text-slate-900">Avaliação do Cidadão</h4>
                  <div className="p-4 md:p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <StarIcon className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Avaliação</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={cn(
                              "w-5 h-5",
                              star <= (selectedManifestacao?.avaliacao || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {selectedManifestacao.avaliacao}/5
                      </span>
                    </div>
                    {selectedManifestacao.comentario_avaliacao && (
                      <p className="text-slate-700 text-sm italic">
                        "{selectedManifestacao.comentario_avaliacao}"
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ações do Modal - Sticky no bottom */}
          <div className="flex items-center justify-between p-4 md:p-6 border-t border-slate-200 bg-white sticky bottom-0">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
              <MessageSquareIcon className="w-4 h-4" />
              <span>Visualizando manifestação</span>
            </div>
            <Button 
              className="w-full sm:w-auto min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]" 
              onClick={handleCloseModal}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Ouvidoria;
