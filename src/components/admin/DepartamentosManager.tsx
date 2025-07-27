import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, SortAsc, SortDesc, Grid3X3, List, BarChart3, Users, Building2, Plus, Pencil, Trash2, Eye, EyeOff, Settings, ArrowUpDown, Calendar, UserCheck, AlertCircle, CheckCircle, Clock, Star, MapPin, Phone, Mail, Globe, Target, TrendingUp, Activity, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Direccao {
  id: string;
  nome: string;
  descricao: string | null;
  codigo: string | null;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
  responsavel?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  funcionarios?: number;
}

export function DepartamentosManager() {
  const [direcoes, setDirecoes] = useState<Direccao[]>([]);
  const [filteredDirecoes, setFilteredDirecoes] = useState<Direccao[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDirecao, setEditingDirecao] = useState<Direccao | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    codigo: '',
    ordem: 0,
    ativo: true,
    responsavel: '',
    telefone: '',
    email: '',
    endereco: '',
    funcionarios: 0
  });

  useEffect(() => {
    fetchDirecoes();
  }, []);

  useEffect(() => {
    filterAndSortDirecoes();
  }, [direcoes, searchTerm, sortBy, sortOrder, filterStatus]);

  const fetchDirecoes = async () => {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      setDirecoes(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const active = data?.filter(d => d.ativo).length || 0;
      const inactive = total - active;
      setStats({ total, active, inactive });
    } catch (error) {
      console.error('Error fetching direcoes:', error);
      toast.error('Erro ao carregar direcções');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortDirecoes = () => {
    let filtered = [...direcoes];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(direcao =>
        direcao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        direcao.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        direcao.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(direcao =>
        filterStatus === 'active' ? direcao.ativo : !direcao.ativo
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Direccao];
      let bValue = b[sortBy as keyof Direccao];

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredDirecoes(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingDirecao) {
        const { error } = await supabase
          .from('departamentos')
          .update(formData)
          .eq('id', editingDirecao.id);

        if (error) throw error;
        toast.success('Direcção atualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('departamentos')
          .insert([formData]);

        if (error) throw error;
        toast.success('Direcção adicionada com sucesso!');
      }

      setIsDialogOpen(false);
      setEditingDirecao(null);
      resetForm();
      fetchDirecoes();
    } catch (error) {
      console.error('Error saving direcção:', error);
      toast.error('Erro ao salvar direcção');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (direccao: Direccao) => {
    setEditingDirecao(direccao);
    setFormData({
      nome: direccao.nome,
      descricao: direccao.descricao || '',
      codigo: direccao.codigo || '',
      ordem: direccao.ordem,
      ativo: direccao.ativo,
      responsavel: direccao.responsavel || '',
      telefone: direccao.telefone || '',
      email: direccao.email || '',
      endereco: direccao.endereco || '',
      funcionarios: direccao.funcionarios || 0
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta direcção?')) return;

    try {
      const { error } = await supabase
        .from('departamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Direcção excluída com sucesso!');
      fetchDirecoes();
    } catch (error) {
      console.error('Error deleting direcção:', error);
      toast.error('Erro ao excluir direcção');
    }
  };

  const handleToggleStatus = async (direccao: Direccao) => {
    try {
      const { error } = await supabase
        .from('departamentos')
        .update({ ativo: !direccao.ativo })
        .eq('id', direccao.id);

      if (error) throw error;
      toast.success(`Direcção ${direccao.ativo ? 'desativada' : 'ativada'} com sucesso!`);
      fetchDirecoes();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Erro ao alterar status');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      codigo: '',
      ordem: 0,
      ativo: true,
      responsavel: '',
      telefone: '',
      email: '',
      endereco: '',
      funcionarios: 0
    });
  };

  const openDialog = () => {
    resetForm();
    setEditingDirecao(null);
    setIsDialogOpen(true);
  };

  if (loading && direcoes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando direcções...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Ativas</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Inativas</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.inactive}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Taxa Ativa</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Gestão de Direcções</h2>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openDialog} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Direcção
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {editingDirecao ? 'Editar Direcção' : 'Adicionar Nova Direcção'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                      <TabsTrigger value="contact">Contacto</TabsTrigger>
                      <TabsTrigger value="settings">Configurações</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome" className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Nome da Direcção *
                          </Label>
                          <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            placeholder="Ex: Administração Municipal"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="codigo" className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Código
                          </Label>
                          <Input
                            id="codigo"
                            value={formData.codigo}
                            onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                            placeholder="Ex: ADM, FIN, SAU"
                            maxLength={10}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="descricao" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Descrição
                        </Label>
                        <Textarea
                          id="descricao"
                          value={formData.descricao}
                          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                          rows={3}
                          placeholder="Descrição das atividades e responsabilidades da direcção"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="responsavel" className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Responsável
                          </Label>
                          <Input
                            id="responsavel"
                            value={formData.responsavel}
                            onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                            placeholder="Nome do responsável"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Telefone
                          </Label>
                          <Input
                            id="telefone"
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            placeholder="+244 XXX XXX XXX"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@municipio.ao"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="funcionarios" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Nº de Funcionários
                          </Label>
                          <Input
                            id="funcionarios"
                            type="number"
                            value={formData.funcionarios}
                            onChange={(e) => setFormData({ ...formData, funcionarios: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endereco" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Endereço
                        </Label>
                        <Input
                          id="endereco"
                          value={formData.endereco}
                          onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                          placeholder="Endereço da direcção"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ordem" className="flex items-center gap-2">
                            <ArrowUpDown className="h-4 w-4" />
                            Ordem de Exibição
                          </Label>
                          <Input
                            id="ordem"
                            type="number"
                            value={formData.ordem}
                            onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Status
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="ativo"
                              checked={formData.ativo}
                              onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                            />
                            <Label htmlFor="ativo" className="text-sm">
                              {formData.ativo ? 'Ativo' : 'Inativo'}
                            </Label>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-primary/80">
                      {loading ? 'Salvando...' : editingDirecao ? 'Atualizar' : 'Adicionar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar direcções..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'inactive') => setFilterStatus(value)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nome">Nome</SelectItem>
                  <SelectItem value="codigo">Código</SelectItem>
                  <SelectItem value="ordem">Ordem</SelectItem>
                  <SelectItem value="created_at">Data Criação</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {filteredDirecoes.length === 0 ? (
          <Card className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma direcção encontrada
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente ajustar os filtros de pesquisa.' : 'Comece adicionando a primeira direcção.'}
            </p>
            {!searchTerm && (
              <Button onClick={openDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Direcção
              </Button>
            )}
          </Card>
        ) : (
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {filteredDirecoes.map((direccao) => (
              <Card key={direccao.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg truncate">{direccao.nome}</CardTitle>
                        <Badge variant={direccao.ativo ? "default" : "secondary"} className="text-xs">
                          {direccao.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      {direccao.codigo && (
                        <Badge variant="outline" className="text-xs">
                          {direccao.codigo}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(direccao)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(direccao)}
                      >
                        {direccao.ativo ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(direccao.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {direccao.descricao && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {direccao.descricao}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ArrowUpDown className="h-3 w-3" />
                        <span>Ordem: {direccao.ordem}</span>
                      </div>
                      {direccao.funcionarios && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{direccao.funcionarios} funcionários</span>
                        </div>
                      )}
                    </div>

                    {(direccao.responsavel || direccao.telefone || direccao.email) && (
                      <div className="pt-2 border-t">
                        <div className="space-y-1 text-xs text-muted-foreground">
                          {direccao.responsavel && (
                            <div className="flex items-center gap-1">
                              <UserCheck className="h-3 w-3" />
                              <span className="truncate">{direccao.responsavel}</span>
                            </div>
                          )}
                          {direccao.telefone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span className="truncate">{direccao.telefone}</span>
                            </div>
                          )}
                          {direccao.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{direccao.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}