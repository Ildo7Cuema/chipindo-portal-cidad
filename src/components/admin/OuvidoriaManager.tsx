import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOuvidoria, type OuvidoriaItem } from "@/hooks/useOuvidoria";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Reply, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  TrendingUp,
  Users,
  FileText,
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  Archive,
  RefreshCw,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  ClockIcon,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Target,
  Activity,
  SendIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OuvidoriaStats {
  total_manifestacoes: number;
  pendentes: number;
  respondidas: number;
  resolvidas: number;
  tempo_medio_resposta: number;
  satisfacao_geral: number;
  categorias_mais_comuns: string[];
}

interface OuvidoriaCategoria {
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
}

export const OuvidoriaManager = () => {
  const { 
    manifestacoes, 
    stats, 
    categorias, 
    loading, 
    submitting,
    fetchManifestacoes,
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
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  // Buscar manifestações quando filtros mudarem
  useEffect(() => {
    fetchManifestacoes(searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder);
  }, [searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  // Função para obter dados da categoria
  const getCategoryData = (categoryId: string) => {
    const category = categorias.find(cat => cat.id === categoryId);
    if (category) {
      return {
        name: category.name,
        color: category.color,
        bgColor: category.bgColor
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
    ...categorias.map(cat => ({
      value: cat.id,
      label: cat.name
    }))
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return <Clock className="w-4 h-4" />;
      case 'em_analise': return <AlertTriangle className="w-4 h-4" />;
      case 'respondido': return <Reply className="w-4 h-4" />;
      case 'resolvido': return <CheckCircle className="w-4 h-4" />;
      case 'arquivado': return <Archive className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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

  const handleRespondManifestacao = (manifestacao: OuvidoriaItem) => {
    setSelectedManifestacao(manifestacao);
    setResponseText(manifestacao.resposta || "");
    setIsResponseModalOpen(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedManifestacao || !responseText.trim()) {
      toast.error("Por favor, insira uma resposta.");
      return;
    }

    try {
      const result = await updateManifestacaoStatus(
        selectedManifestacao.id,
        'respondido',
        responseText
      );

      if (result) {
        toast.success("Resposta enviada com sucesso!");
        setIsResponseModalOpen(false);
        setSelectedManifestacao(null);
        setResponseText("");
        fetchManifestacoes(searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder);
      }
          } catch (error) {
        toast.error("Erro ao enviar resposta. Tente novamente.");
      }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const result = await updateManifestacaoStatus(id, status);
      if (result) {
        toast.success("Status actualizado com sucesso!");
        fetchManifestacoes(searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder);
      }
    } catch (error) {
      toast.error("Erro ao actualizar status. Tente novamente.");
    }
  };

  const handleBulkAction = async (action: 'respond' | 'archive' | 'delete') => {
    if (selectedIds.length === 0) {
      toast.error("Selecione pelo menos uma manifestação.");
      return;
    }

    try {
      for (const id of selectedIds) {
        switch (action) {
          case 'respond':
            await updateManifestacaoStatus(id, 'respondido');
            break;
          case 'archive':
            await updateManifestacaoStatus(id, 'arquivado');
            break;
          case 'delete':
            // Implementar exclusão se necessário
            break;
        }
      }

      toast.success(`Ação ${action} realizada em ${selectedIds.length} manifestação(ões)!`);
      setSelectedIds([]);
      fetchManifestacoes(searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder);
    } catch (error) {
      toast.error("Erro ao executar ação em lote. Tente novamente.");
    }
  };

  const exportManifestacoes = async (format: 'csv' | 'excel' | 'pdf') => {
    setExportLoading(format);
    try {
      // Implementar exportação
      toast.success(`Exportação ${format.toUpperCase()} iniciada!`);
    } catch (error) {
      toast.error("Erro ao exportar dados. Tente novamente.");
    } finally {
      setExportLoading(null);
    }
  };

  const filteredManifestacoes = manifestacoes.filter(manifestacao => {
    const matchesSearch = manifestacao.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifestacao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifestacao.protocolo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || manifestacao.categoria === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || manifestacao.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const statsData = stats || {
    total_manifestacoes: 0,
    pendentes: 0,
    respondidas: 0,
    resolvidas: 0,
    tempo_medio_resposta: 0,
    satisfacao_geral: 0,
    categorias_mais_comuns: []
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão da Ouvidoria</h1>
          <p className="text-muted-foreground">
            Gerir manifestações e respostas da ouvidoria municipal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => fetchManifestacoes()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportManifestacoes('csv')}>
                <FileText className="w-4 h-4 mr-2" />
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportManifestacoes('excel')}>
                <FileText className="w-4 h-4 mr-2" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportManifestacoes('pdf')}>
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Manifestações</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.total_manifestacoes}</div>
            <p className="text-xs text-muted-foreground">
              Todas as manifestações recebidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statsData.pendentes}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando resposta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respondidas</CardTitle>
            <Reply className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statsData.respondidas}</div>
            <p className="text-xs text-muted-foreground">
              Com resposta enviada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.satisfacao_geral.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              Avaliação média
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="manifestacoes">Manifestações</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="manifestacoes" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Protocolo, assunto, nome..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriaOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
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

                <div className="space-y-2">
                  <Label htmlFor="sort">Ordenar por</Label>
                  <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                    const [field, order] = value.split('-');
                    setSortBy(field);
                    setSortOrder(order as "asc" | "desc");
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="data_abertura-desc">Data (Mais Recente)</SelectItem>
                      <SelectItem value="data_abertura-asc">Data (Mais Antiga)</SelectItem>
                      <SelectItem value="prioridade-desc">Prioridade (Alta)</SelectItem>
                      <SelectItem value="prioridade-asc">Prioridade (Baixa)</SelectItem>
                      <SelectItem value="protocolo-asc">Protocolo (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedIds.length} manifestação(ões) selecionada(s)
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('respond')}
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      Responder
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('archive')}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Arquivar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedIds([])}
                    >
                      Limpar Seleção
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manifestações List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Carregando manifestações...</p>
              </div>
            ) : filteredManifestacoes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma manifestação encontrada</p>
                </CardContent>
              </Card>
            ) : (
              filteredManifestacoes.map((manifestacao) => {
                const categoryData = getCategoryData(manifestacao.categoria);
                return (
                  <Card key={manifestacao.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={cn("text-xs", categoryData.bgColor)}>
                              {categoryData.name}
                            </Badge>
                            <Badge variant="outline" className={cn("text-xs", getStatusColor(manifestacao.status))}>
                              {getStatusIcon(manifestacao.status)}
                              <span className="ml-1 capitalize">{manifestacao.status.replace('_', ' ')}</span>
                            </Badge>
                            <Badge variant="outline" className={cn("text-xs", getPriorityColor(manifestacao.prioridade))}>
                              <span className="capitalize">{manifestacao.prioridade}</span>
                            </Badge>
                          </div>

                          <div>
                            <h3 className="font-semibold text-lg">{manifestacao.assunto}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Protocolo: {manifestacao.protocolo} • {formatDate(manifestacao.data_abertura)}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span>{manifestacao.nome}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span>{manifestacao.email}</span>
                            </div>
                            {manifestacao.telefone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{manifestacao.telefone}</span>
                              </div>
                            )}
                          </div>

                          <div className="text-sm text-muted-foreground">
                            <p className="line-clamp-2">{manifestacao.descricao}</p>
                          </div>

                          {manifestacao.resposta && (
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <p className="text-sm font-medium mb-1">Resposta:</p>
                              <p className="text-sm">{manifestacao.resposta}</p>
                              {manifestacao.data_resposta && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Respondido em: {formatDate(manifestacao.data_resposta)}
                                </p>
                              )}
                            </div>
                          )}

                          {manifestacao.avaliacao && (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={cn(
                                      "w-4 h-4",
                                      star <= manifestacao.avaliacao!
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {manifestacao.avaliacao}/5
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(manifestacao.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds([...selectedIds, manifestacao.id]);
                              } else {
                                setSelectedIds(selectedIds.filter(id => id !== manifestacao.id));
                              }
                            }}
                            className="rounded"
                          />
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewManifestacao(manifestacao)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRespondManifestacao(manifestacao)}>
                                <Reply className="w-4 h-4 mr-2" />
                                Responder
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleUpdateStatus(manifestacao.id, 'em_analise')}>
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Marcar como Em Análise
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(manifestacao.id, 'resolvido')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Marcar como Resolvido
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(manifestacao.id, 'arquivado')}>
                                <Archive className="w-4 h-4 mr-2" />
                                Arquivar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="estatisticas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tempo Médio de Resposta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Tempo Médio de Resposta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statsData.tempo_medio_resposta.toFixed(1)}h</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Tempo médio para responder manifestações
                </p>
                <Progress value={Math.min((statsData.tempo_medio_resposta / 24) * 100, 100)} className="mt-4" />
              </CardContent>
            </Card>

            {/* Satisfação Geral */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Satisfação Geral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statsData.satisfacao_geral.toFixed(1)}/5</div>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-5 h-5",
                        star <= statsData.satisfacao_geral
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Avaliação média dos cidadãos
                </p>
              </CardContent>
            </Card>

            {/* Distribuição por Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Distribuição por Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pendentes</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${(statsData.pendentes / statsData.total_manifestacoes) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{statsData.pendentes}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Respondidas</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(statsData.respondidas / statsData.total_manifestacoes) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{statsData.respondidas}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resolvidas</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(statsData.resolvidas / statsData.total_manifestacoes) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{statsData.resolvidas}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categorias Mais Comuns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Categorias Mais Comuns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {statsData.categorias_mais_comuns.slice(0, 5).map((categoria, index) => {
                    const categoryData = getCategoryData(categoria);
                    return (
                      <div key={categoria} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-3 h-3 rounded-full", categoryData.color)} />
                          <span className="text-sm capitalize">{categoryData.name}</span>
                        </div>
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Manifestação Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Manifestação</DialogTitle>
          </DialogHeader>
          {selectedManifestacao && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Protocolo</Label>
                  <p className="text-sm text-muted-foreground">{selectedManifestacao.protocolo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Data de Abertura</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedManifestacao.data_abertura)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nome</Label>
                  <p className="text-sm text-muted-foreground">{selectedManifestacao.nome}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedManifestacao.email}</p>
                </div>
                {selectedManifestacao.telefone && (
                  <div>
                    <Label className="text-sm font-medium">Telefone</Label>
                    <p className="text-sm text-muted-foreground">{selectedManifestacao.telefone}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Categoria</Label>
                  <Badge variant="outline" className={cn("mt-1", getCategoryData(selectedManifestacao.categoria).bgColor)}>
                    {getCategoryData(selectedManifestacao.categoria).name}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant="outline" className={cn("mt-1", getStatusColor(selectedManifestacao.status))}>
                    {selectedManifestacao.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Prioridade</Label>
                  <Badge variant="outline" className={cn("mt-1", getPriorityColor(selectedManifestacao.prioridade))}>
                    {selectedManifestacao.prioridade}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Assunto</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedManifestacao.assunto}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Descrição</Label>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{selectedManifestacao.descricao}</p>
              </div>

              {selectedManifestacao.resposta && (
                <div>
                  <Label className="text-sm font-medium">Resposta</Label>
                  <div className="bg-muted/50 p-4 rounded-lg mt-1">
                    <p className="text-sm whitespace-pre-wrap">{selectedManifestacao.resposta}</p>
                    {selectedManifestacao.data_resposta && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Respondido em: {formatDate(selectedManifestacao.data_resposta)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {selectedManifestacao.avaliacao && (
                <div>
                  <Label className="text-sm font-medium">Avaliação</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-5 h-5",
                            star <= selectedManifestacao.avaliacao!
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {selectedManifestacao.avaliacao}/5
                    </span>
                  </div>
                  {selectedManifestacao.comentario_avaliacao && (
                    <p className="text-sm text-muted-foreground mt-2">
                      "{selectedManifestacao.comentario_avaliacao}"
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 pt-4">
                <Button onClick={() => handleRespondManifestacao(selectedManifestacao)}>
                  <Reply className="w-4 h-4 mr-2" />
                  Responder
                </Button>
                <Button variant="outline" onClick={handleCloseModal}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Response Modal */}
      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Responder Manifestação</DialogTitle>
            <DialogDescription>
              Escreva uma resposta para a manifestação do cidadão.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="response">Resposta</Label>
              <Textarea
                id="response"
                placeholder="Digite sua resposta aqui..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={6}
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <Button onClick={handleSubmitResponse} disabled={submitting}>
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <SendIcon className="w-4 h-4 mr-2" />
                    Enviar Resposta
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsResponseModalOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 