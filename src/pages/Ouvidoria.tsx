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
        {/* Hero Section */}
        <Section className="relative min-h-[500px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden" size="lg">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

          <SectionContent>
            <div className="text-center space-y-8 relative z-10">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl">
                  <MessageSquareIcon className="w-10 h-10 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow-sm">
                    Ouvidoria
                    <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                      Municipal
                    </span>
                  </h1>
                </div>
              </div>

              <p className="text-xl text-blue-50/90 max-w-4xl mx-auto leading-relaxed font-light">
                Canal direto de comunicação entre cidadãos e a Administração Municipal.
                Sua voz é importante para melhorarmos nossos serviços e atendimento.
              </p>

              <div className="flex items-center justify-center gap-6 flex-wrap pt-4">
                <div className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <MessageSquareIcon className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">{stats?.total_manifestacoes || 0} Manifestações</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-emerald-500/20 rounded-full backdrop-blur-md border border-emerald-400/30 hover:bg-emerald-500/30 transition-all duration-300">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-100" />
                  <span className="text-emerald-100 font-medium">{stats?.resolvidas || 0} Resolvidas</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-amber-500/20 rounded-full backdrop-blur-md border border-amber-400/30 hover:bg-amber-500/30 transition-all duration-300">
                  <ClockIcon className="w-5 h-5 text-amber-100" />
                  <span className="text-amber-100 font-medium">{stats?.tempo_medio_resposta || 0}h Média</span>
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

          <SectionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white shadow-lg border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total de Manifestações</p>
                      <p className="text-2xl font-bold text-slate-900">{stats?.total_manifestacoes || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <MessageSquareIcon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Pendentes</p>
                      <p className="text-2xl font-bold text-slate-900">{stats?.pendentes || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <AlertCircleIcon className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Resolvidas</p>
                      <p className="text-2xl font-bold text-slate-900">{stats?.resolvidas || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Satisfação Geral</p>
                      <p className="text-2xl font-bold text-slate-900">{(stats?.satisfacao_geral || 0).toFixed(2)}/5</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <StarIcon className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Principais */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-h-[70vh] overflow-y-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="manifestacoes" className="flex items-center gap-2">
                  <MessageSquareIcon className="w-4 h-4" />
                  Manifestações
                </TabsTrigger>
                <TabsTrigger value="nova-manifestacao" className="flex items-center gap-2">
                  <SendIcon className="w-4 h-4" />
                  Nova Manifestação
                </TabsTrigger>
                <TabsTrigger value="estatisticas" className="flex items-center gap-2">
                  <BarChartIcon className="w-4 h-4" />
                  Estatísticas
                </TabsTrigger>
              </TabsList>

              {/* Tab Manifestações */}
              <TabsContent value="manifestacoes" className="space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Filtros e Busca */}
                <Card className="bg-white shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                      <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative flex-1">
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Buscar manifestações..."
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
                            {categoriaOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => setSelectedStatus(value)} defaultValue="all">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os Status</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="em_analise">Em Análise</SelectItem>
                            <SelectItem value="respondido">Respondido</SelectItem>
                            <SelectItem value="resolvido">Resolvido</SelectItem>
                            <SelectItem value="arquivado">Arquivado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select onValueChange={(value) => setSortBy(value)} defaultValue="data_abertura">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Ordenar por" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="data_abertura">Data</SelectItem>
                            <SelectItem value="prioridade">Prioridade</SelectItem>
                            <SelectItem value="protocolo">Protocolo</SelectItem>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de Manifestações */}
                <div className="grid gap-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-slate-600 mt-2">Carregando manifestações...</p>
                    </div>
                  ) : !Array.isArray(manifestacoes) || manifestacoes.length === 0 ? (
                    <Card className="bg-white shadow-lg border-0">
                      <CardContent className="p-8 text-center">
                        <MessageSquareIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhuma manifestação encontrada</h3>
                        <p className="text-slate-600">Não há manifestações que correspondam aos filtros selecionados.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    manifestacoes.map((item) => {
                      const categoryData = getCategoryData(item.categoria);
                      return (
                        <Card key={item.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MessageSquareIcon className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{item.assunto}</h3>
                                    <p className="text-slate-600 text-sm mb-2">{item.descricao.substring(0, 100)}...</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                      <span className="flex items-center gap-1">
                                        <UserIcon className="w-3 h-3" />
                                        {item.nome}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <CalendarIcon className="w-3 h-3" />
                                        {formatDate(item.data_abertura)}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <FileTextIcon className="w-3 h-3" />
                                        {item.protocolo}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getStatusColor(item.status)}>
                                    {item.status === 'pendente' ? 'Pendente' :
                                      item.status === 'em_analise' ? 'Em Análise' :
                                        item.status === 'respondido' ? 'Respondido' :
                                          item.status === 'resolvido' ? 'Resolvido' : 'Arquivado'}
                                  </Badge>
                                  <Badge className={getPriorityColor(item.prioridade)}>
                                    {item.prioridade === 'urgente' ? 'Urgente' :
                                      item.prioridade === 'alta' ? 'Alta' :
                                        item.prioridade === 'media' ? 'Média' : 'Baixa'}
                                  </Badge>
                                  <Badge className={categoryData.bgColor}>
                                    {categoryData.name}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2"
                                  onClick={() => handleViewManifestacao(item)}
                                >
                                  <EyeIcon className="w-4 h-4" />
                                  Visualizar
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              {/* Tab Nova Manifestação */}
              <TabsContent value="nova-manifestacao" className="space-y-6 max-h-[60vh] overflow-y-auto">
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SendIcon className="w-5 h-5 text-blue-600" />
                      Nova Manifestação
                    </CardTitle>
                    <CardDescription>
                      Preencha o formulário abaixo para enviar sua manifestação à Ouvidoria Municipal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitManifestacao} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome Completo *</Label>
                          <Input
                            id="nome"
                            placeholder="Seu nome completo"
                            value={formData.nome}
                            onChange={(e) => handleFormChange('nome', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu.email@exemplo.com"
                            value={formData.email}
                            onChange={(e) => handleFormChange('email', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input
                            id="telefone"
                            placeholder="+244 912 345 678"
                            value={formData.telefone}
                            onChange={(e) => handleFormChange('telefone', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="categoria">Categoria *</Label>
                          <Select
                            value={formData.categoria}
                            onValueChange={(value) => handleFormChange('categoria', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories?.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
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

                      <div className="space-y-2">
                        <Label htmlFor="assunto">Assunto *</Label>
                        <Input
                          id="assunto"
                          placeholder="Título da sua manifestação"
                          value={formData.assunto}
                          onChange={(e) => handleFormChange('assunto', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="descricao">Descrição *</Label>
                        <Textarea
                          id="descricao"
                          placeholder="Descreva detalhadamente sua manifestação..."
                          rows={6}
                          value={formData.descricao}
                          onChange={(e) => handleFormChange('descricao', e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex items-center justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => setActiveTab("manifestacoes")}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="flex items-center gap-2" disabled={loading}>
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
              <TabsContent value="estatisticas" className="space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="grid gap-6">
                  <Card className="bg-white shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChartIcon className="w-5 h-5 text-blue-600" />
                        Estatísticas Gerais
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{stats?.total_manifestacoes || 0}</div>
                          <div className="text-sm text-blue-600">Total de Manifestações</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">{stats?.pendentes || 0}</div>
                          <div className="text-sm text-yellow-600">Pendentes</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{stats?.resolvidas || 0}</div>
                          <div className="text-sm text-green-600">Resolvidas</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{stats?.tempo_medio_resposta || 0}h</div>
                          <div className="text-sm text-purple-600">Tempo Médio</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUpIcon className="w-5 h-5 text-green-600" />
                        Satisfação dos Cidadãos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Satisfação Geral</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                  key={star}
                                  className={cn(
                                    "w-4 h-4",
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
                        <Progress value={(stats?.satisfacao_geral || 0) * 20} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </SectionContent>
        </Section>
      </main>

      {/* Modal de Visualização de Manifestação */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquareIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <DialogTitle className="text-xl font-semibold text-slate-900">
                    {selectedManifestacao?.assunto}
                  </DialogTitle>
                  <DialogDescription className="text-slate-600">
                    Protocolo: {selectedManifestacao?.protocolo}
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

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Informações da Manifestação */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Solicitante:</span>
                    <span className="text-sm text-slate-900">{selectedManifestacao?.nome}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Email:</span>
                    <span className="text-sm text-slate-900">{selectedManifestacao?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Telefone:</span>
                    <span className="text-sm text-slate-900">{selectedManifestacao?.telefone}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Data de Abertura:</span>
                    <span className="text-sm text-slate-900">{selectedManifestacao && formatDate(selectedManifestacao.data_abertura)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Status:</span>
                    <Badge className={selectedManifestacao ? getStatusColor(selectedManifestacao.status) : ''}>
                      {selectedManifestacao?.status === 'pendente' ? 'Pendente' :
                        selectedManifestacao?.status === 'em_analise' ? 'Em Análise' :
                          selectedManifestacao?.status === 'respondido' ? 'Respondido' :
                            selectedManifestacao?.status === 'resolvido' ? 'Resolvido' : 'Arquivado'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Prioridade:</span>
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
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-900">Descrição da Manifestação</h4>
                <div className="p-6 bg-white border border-slate-200 rounded-lg">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedManifestacao?.descricao}
                  </p>
                </div>
              </div>

              {/* Resposta (se houver) */}
              {selectedManifestacao?.resposta && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-900">Resposta da Administração</h4>
                  <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <ReplyIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Respondido em {selectedManifestacao.data_resposta && formatDate(selectedManifestacao.data_resposta)}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedManifestacao.resposta}
                    </p>
                  </div>
                </div>
              )}

              {/* Avaliação (se houver) */}
              {selectedManifestacao?.avaliacao && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-900">Avaliação do Cidadão</h4>
                  <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
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
                              "w-4 h-4",
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

          {/* Ações do Modal */}
          <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MessageSquareIcon className="w-4 h-4" />
              <span>Visualizando manifestação</span>
            </div>
            <div className="flex items-center gap-2">
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

export default Ouvidoria; 