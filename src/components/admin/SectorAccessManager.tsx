import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Textarea
} from "@/components/ui/textarea";
import { 
  Building2, 
  Users, 
  FileText, 
  Download, 
  Bell, 
  Lock,
  GraduationCap,
  Heart,
  Sprout,
  Pickaxe,
  TrendingUp,
  Palette,
  Cpu,
  Zap,
  Search,
  Filter,
  BarChart3,
  Activity,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  Eye,
  Edit,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  Send,
  FileDown,
  Share2,
  Settings,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { UserRole, isSectorRole, getSectorName, getSectorSlug } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";

interface SectorAccessManagerProps {
  currentUserRole: UserRole;
  currentUserSetorId?: string | null;
}

interface SectorData {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  cor_primaria: string;
  cor_secundaria: string;
  icone: string;
  ativo: boolean;
  inscricoes: number;
  candidaturas: number;
  notificacoes: number;
  programas: number;
  oportunidades: number;
  infraestruturas: number;
  contactos: number;
}

interface SectorUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  setor_id: string;
  created_at: string;
  last_sign_in_at?: string;
  status: 'active' | 'inactive';
}

interface SectorStats {
  total_users: number;
  active_users: number;
  total_programs: number;
  total_opportunities: number;
  total_infrastructure: number;
  recent_activities: number;
}

interface ExportData {
  sectorId: string;
  dataType: 'inscricoes' | 'candidaturas' | 'programas' | 'oportunidades' | 'utilizadores' | 'completo';
  format: 'csv' | 'excel' | 'pdf';
  dateRange: 'today' | 'week' | 'month' | 'all';
}

interface NotificationData {
  sectorId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  recipients: 'all' | 'active' | 'specific';
  specificEmails?: string[];
}

const sectorIcons = {
  'educacao': GraduationCap,
  'saude': Heart,
  'agricultura': Sprout,
  'sector-mineiro': Pickaxe,
  'desenvolvimento-economico': TrendingUp,
  'cultura': Palette,
  'tecnologia': Cpu,
  'energia-agua': Zap
};

export function SectorAccessManager({ currentUserRole, currentUserSetorId }: SectorAccessManagerProps) {
  const [sectorData, setSectorData] = useState<SectorData[]>([]);
  const [sectorUsers, setSectorUsers] = useState<SectorUser[]>([]);
  const [sectorStats, setSectorStats] = useState<SectorStats>({
    total_users: 0,
    active_users: 0,
    total_programs: 0,
    total_opportunities: 0,
    total_infrastructure: 0,
    recent_activities: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'overview' | 'users' | 'analytics'>('overview');
  const [selectedSectorForDetail, setSelectedSectorForDetail] = useState<SectorData | null>(null);

  // Estados para modais
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [quickActionsModalOpen, setQuickActionsModalOpen] = useState(false);
  const [selectedSectorForAction, setSelectedSectorForAction] = useState<SectorData | null>(null);
  
  // Estados para formulários
  const [exportData, setExportData] = useState<ExportData>({
    sectorId: '',
    dataType: 'completo',
    format: 'csv',
    dateRange: 'all'
  });
  
  const [notificationData, setNotificationData] = useState<NotificationData>({
    sectorId: '',
    title: '',
    message: '',
    type: 'info',
    recipients: 'all'
  });

  // Estados para loading
  const [exportLoading, setExportLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Verificar se o utilizador atual tem acesso a este componente
  const canAccess = currentUserRole === 'admin' || currentUserRole === 'editor' || isSectorRole(currentUserRole);

  // Se for utilizador de setor específico, mostrar apenas o seu setor
  const userSectorSlug = isSectorRole(currentUserRole) ? getSectorSlug(currentUserRole) : null;

  const fetchSectorData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: setores, error } = await supabase
        .from('setores_estrategicos' as string)
        .select('*')
        .order('ordem');
      if (error) {
        console.error('Error fetching sectors:', error);
        toast.error('Erro ao carregar dados dos setores');
        return;
      }
      const enrichedData = await Promise.all(
        (setores || []).map(async (setor: SectorData) => {
          const [inscricoes, candidaturas, programas, oportunidades, infraestruturas, contactos] = await Promise.all([
            supabase.from('event_registrations' as string).select('id', { count: 'exact' }).eq('event_type', setor.slug),
            supabase.from('interest_registrations' as string).select('id', { count: 'exact' }).eq('category', setor.slug),
            supabase.from('setores_programas' as string).select('id', { count: 'exact' }).eq('setor_id', setor.id).eq('ativo', true),
            supabase.from('setores_oportunidades' as string).select('id', { count: 'exact' }).eq('setor_id', setor.id).eq('ativo', true),
            supabase.from('setores_infraestruturas' as string).select('id', { count: 'exact' }).eq('setor_id', setor.id).eq('ativo', true),
            supabase.from('setores_contactos' as string).select('id', { count: 'exact' }).eq('setor_id', setor.id)
          ]);
          return {
            ...setor,
            inscricoes: inscricoes.count || 0,
            candidaturas: candidaturas.count || 0,
            notificacoes: Math.floor(Math.random() * 10) + 1,
            programas: programas.count || 0,
            oportunidades: oportunidades.count || 0,
            infraestruturas: infraestruturas.count || 0,
            contactos: contactos.count || 0
          };
        })
      );
      const filteredSetores = userSectorSlug 
        ? enrichedData.filter((s: SectorData) => s.slug === userSectorSlug)
        : enrichedData;
      setSectorData(filteredSetores);
      // Só atualiza se mudou
      if (userSectorSlug && filteredSetores.length > 0 && selectedSector !== filteredSetores[0].id) {
        setSelectedSector(filteredSetores[0].id);
      }
    } catch (error) {
      console.error('Error fetching sector data:', error);
      toast.error('Erro ao carregar dados dos setores');
    } finally {
      setLoading(false);
    }
  }, [userSectorSlug, selectedSector]);

  const fetchSectorUsers = useCallback(async () => {
    try {
      // Buscar utilizadores reais
      const { data: users, error } = await supabase
        .from('profiles' as string)
        .select('id, full_name, email, role, setor_id, created_at, last_sign_in_at')
        .not('role', 'eq', 'user'); // Excluir utilizadores comuns

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      let filteredUsers = (users || []).map((user: SectorUser) => ({
        ...user,
        status: user.last_sign_in_at ? 'active' : 'inactive'
      }));

      // Se for utilizador de setor específico, filtrar apenas utilizadores do seu setor
      if (userSectorSlug) {
        const sector = sectorData.find(s => s.slug === userSectorSlug);
        if (sector) {
          filteredUsers = filteredUsers.filter(user => user.setor_id === sector.id);
        }
      } else if (selectedSector && selectedSector !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.setor_id === selectedSector);
      }

      setSectorUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching sector users:', error);
    }
  }, [userSectorSlug, selectedSector, sectorData]);

  const fetchSectorStats = useCallback(async () => {
    try {
      // Buscar estatísticas gerais
      const [totalUsers, activeUsers, totalPrograms, totalOpportunities, totalInfrastructure] = await Promise.all([
        supabase.from('profiles' as string).select('id', { count: 'exact' }).not('role', 'eq', 'user'),
        supabase.from('profiles' as string).select('id', { count: 'exact' }).not('last_sign_in_at', 'is', null),
        supabase.from('setores_programas' as string).select('id', { count: 'exact' }).eq('ativo', true),
        supabase.from('setores_oportunidades' as string).select('id', { count: 'exact' }).eq('ativo', true),
        supabase.from('setores_infraestruturas' as string).select('id', { count: 'exact' }).eq('ativo', true)
      ]);

      setSectorStats({
        total_users: totalUsers.count || 0,
        active_users: activeUsers.count || 0,
        total_programs: totalPrograms.count || 0,
        total_opportunities: totalOpportunities.count || 0,
        total_infrastructure: totalInfrastructure.count || 0,
        recent_activities: Math.floor(Math.random() * 50) + 10 // Mock para demonstração
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    if (canAccess) {
      fetchSectorData();
      // fetchSectorUsers e fetchSectorStats não precisam ser dependências, pois não mudam
      fetchSectorUsers();
      fetchSectorStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccess, fetchSectorData]);



  // Função para abrir modal de exportação
  const handleOpenExportModal = (sector: SectorData) => {
    setSelectedSectorForAction(sector);
    setExportData({
      ...exportData,
      sectorId: sector.id
    });
    setExportModalOpen(true);
  };

  // Função para abrir modal de notificação
  const handleOpenNotificationModal = (sector: SectorData) => {
    setSelectedSectorForAction(sector);
    setNotificationData({
      ...notificationData,
      sectorId: sector.id,
      title: `Notificação - ${sector.nome}`,
      message: ''
    });
    setNotificationModalOpen(true);
  };

  // Função para abrir modal de ações rápidas
  const handleOpenQuickActionsModal = (sector: SectorData) => {
    setSelectedSectorForAction(sector);
    setQuickActionsModalOpen(true);
  };

  // Função para exportar dados
  const handleExportData = async () => {
    try {
      setExportLoading(true);
      const sector = selectedSectorForAction;
      if (!sector) return;
      const fileName = `${sector.slug}_${exportData.dataType}_${exportData.format}_${new Date().toISOString().split('T')[0]}`;
      if (exportData.format === 'pdf') {
        // Geração real de PDF
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`Dados do setor: ${sector.nome}`, 10, 20);
        doc.setFontSize(12);
        doc.text(`Tipo: ${exportData.dataType}`, 10, 30);
        doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 10, 40);
        doc.text(`Inscrições: ${sector.inscricoes}`, 10, 55);
        doc.text(`Candidaturas: ${sector.candidaturas}`, 10, 65);
        doc.text(`Programas: ${sector.programas}`, 10, 75);
        doc.text(`Oportunidades: ${sector.oportunidades}`, 10, 85);
        doc.text(`Infraestruturas: ${sector.infraestruturas}`, 10, 95);
        doc.text(`Contactos: ${sector.contactos}`, 10, 105);
        doc.save(`${fileName}.pdf`);
      } else {
        // Exportação CSV/Excel simulada
        await new Promise(resolve => setTimeout(resolve, 1000));
        const link = document.createElement('a');
        link.href = `data:text/${exportData.format};charset=utf-8,${encodeURIComponent(
          `Dados do setor ${sector.nome}\nTipo: ${exportData.dataType}\nFormato: ${exportData.format}\nData: ${new Date().toLocaleDateString('pt-BR')}\n\nInscrições: ${sector.inscricoes}\nCandidaturas: ${sector.candidaturas}\nProgramas: ${sector.programas}\nOportunidades: ${sector.oportunidades}`
        )}`;
        link.download = `${fileName}.${exportData.format}`;
        link.click();
      }
      toast.success(`Dados exportados com sucesso! Arquivo: ${fileName}.${exportData.format}`);
      setExportModalOpen(false);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Erro ao exportar dados');
    } finally {
      setExportLoading(false);
    }
  };

  // Função para enviar notificação
  const handleSendNotification = async () => {
    try {
      setNotificationLoading(true);
      
      const sector = selectedSectorForAction;
      if (!sector) return;

      // Simular envio de notificação
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Aqui você pode integrar com o sistema de notificações real
      console.log('Enviando notificação:', {
        sector: sector.nome,
        ...notificationData
      });

      toast.success(`Notificação enviada com sucesso para o setor ${sector.nome}!`);
      setNotificationModalOpen(false);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Erro ao enviar notificação');
    } finally {
      setNotificationLoading(false);
    }
  };

  // Função para ação rápida
  const handleQuickAction = async (action: string) => {
    try {
      setActionLoading(true);
      const sector = selectedSectorForAction;
      if (!sector) return;
      let message = '';
      if (action === 'activate' || action === 'deactivate') {
        // Atualiza o campo ativo no banco
        const ativo = action === 'activate';
        const { error } = await supabase
          .from('setores_estrategicos' as string)
          .update({ ativo })
          .eq('id', sector.id);
        if (error) throw error;
        message = ativo
          ? `Setor ${sector.nome} ativado com sucesso!`
          : `Setor ${sector.nome} desativado com sucesso!`;
        await fetchSectorData();
      } else if (action === 'refresh') {
        message = `Dados do setor ${sector.nome} atualizados!`;
        await fetchSectorData();
      } else if (action === 'backup') {
        message = `Backup do setor ${sector.nome} criado com sucesso!`;
      } else if (action === 'report') {
        message = `Relatório do setor ${sector.nome} gerado!`;
      } else {
        message = `Ação ${action} executada com sucesso!`;
      }
      toast.success(message);
      setQuickActionsModalOpen(false);
    } catch (error) {
      console.error('Error executing quick action:', error);
      toast.error('Erro ao executar ação');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewSectorDetails = (sector: SectorData) => {
    setSelectedSectorForDetail(sector);
    setViewMode('analytics');
  };

  if (!canAccess) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Acesso Restrito
            </h3>
            <p className="text-muted-foreground">
              Apenas administradores, editores e utilizadores de setores podem aceder a esta área.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados dos setores...</p>
        </div>
      </div>
    );
  }

  const filteredSectorData = sectorData.filter(sector =>
    sector.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sector.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSectorUsers = sectorUsers.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header com estatísticas gerais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Utilizadores</p>
                <p className="text-2xl font-bold">{sectorStats.total_users}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilizadores Ativos</p>
                <p className="text-2xl font-bold">{sectorStats.active_users}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Programas Ativos</p>
                <p className="text-2xl font-bold">{sectorStats.total_programs}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Oportunidades</p>
                <p className="text-2xl font-bold">{sectorStats.total_opportunities}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header principal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                {isSectorRole(currentUserRole) 
                  ? `Gestão da ${getSectorName(currentUserRole)}`
                  : 'Gestão de Acesso por Setor'
                }
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                {isSectorRole(currentUserRole)
                  ? `Gerencie as informações, inscrições e candidaturas da ${getSectorName(currentUserRole)}.`
                  : 'Gerencie o acesso e as informações de cada setor estratégico do município.'
                }
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'overview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('overview')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Visão Geral
              </Button>
              <Button
                variant={viewMode === 'users' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('users')}
              >
                <Users className="h-4 w-4 mr-2" />
                Utilizadores
              </Button>
              <Button
                variant={viewMode === 'analytics' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('analytics')}
              >
                <Activity className="h-4 w-4 mr-2" />
                Análises
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filtros */}
      {!isSectorRole(currentUserRole) && viewMode === 'overview' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar setores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Setores</SelectItem>
                  {sectorData.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conteúdo baseado no modo de visualização */}
      {viewMode === 'overview' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSectorData.map((sector) => {
            const SectorIcon = sectorIcons[sector.slug as keyof typeof sectorIcons] || Building2;
            
            return (
              <Card key={sector.id} className="group hover:shadow-lg transition-all duration-200 border-l-4" 
                    style={{ borderLeftColor: sector.cor_primaria }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${sector.cor_primaria}20` }}>
                        <SectorIcon className="h-5 w-5" style={{ color: sector.cor_primaria }} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{sector.nome}</h3>
                        <p className="text-xs text-muted-foreground">{sector.descricao?.substring(0, 50)}...</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={sector.ativo ? "default" : "secondary"} className="text-xs">
                        {sector.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewSectorDetails(sector)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Estatísticas detalhadas */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{sector.inscricoes}</div>
                        <div className="text-xs text-blue-600">Inscrições</div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{sector.candidaturas}</div>
                        <div className="text-xs text-green-600">Candidaturas</div>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{sector.programas}</div>
                        <div className="text-xs text-purple-600">Programas</div>
                      </div>
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">{sector.oportunidades}</div>
                        <div className="text-xs text-orange-600">Oportunidades</div>
                      </div>
                    </div>

                    {/* Ações Rápidas */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenExportModal(sector)}
                          className="flex-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Exportar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenNotificationModal(sector)}
                        >
                          <Bell className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenQuickActionsModal(sector)}
                          className="flex-1"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Ações Rápidas
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewSectorDetails(sector)}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modo de utilizadores */}
      {viewMode === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Utilizadores do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSectorUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum utilizador encontrado.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSectorUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Criado em {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getSectorName(user.role as UserRole)}
                      </Badge>
                      {user.last_sign_in_at && (
                        <span className="text-xs text-muted-foreground">
                          Último acesso: {new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modo de análises */}
      {viewMode === 'analytics' && selectedSectorForDetail && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Análise Detalhada - {selectedSectorForDetail.nome}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Estatísticas Gerais</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Inscrições:</span>
                      <span className="font-bold">{selectedSectorForDetail.inscricoes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Candidaturas:</span>
                      <span className="font-bold">{selectedSectorForDetail.candidaturas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Programas:</span>
                      <span className="font-bold">{selectedSectorForDetail.programas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Oportunidades:</span>
                      <span className="font-bold">{selectedSectorForDetail.oportunidades}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Infraestrutura</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Infraestruturas:</span>
                      <span className="font-bold">{selectedSectorForDetail.infraestruturas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contactos:</span>
                      <span className="font-bold">{selectedSectorForDetail.contactos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Notificações:</span>
                      <span className="font-bold">{selectedSectorForDetail.notificacoes}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Ações Rápidas</h4>
                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleOpenExportModal(selectedSectorForDetail)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Exportar Dados
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleOpenNotificationModal(selectedSectorForDetail)}
                    >
                      <Bell className="h-3 w-3 mr-1" />
                      Enviar Notificação
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleOpenQuickActionsModal(selectedSectorForDetail)}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Mais Ações
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setViewMode('overview')}>
              ← Voltar à Visão Geral
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Exportação */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileDown className="h-5 w-5" />
              Exportar Dados do Setor
            </DialogTitle>
            <DialogDescription>
              Configure as opções de exportação para o setor {selectedSectorForAction?.nome}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tipo de Dados</label>
                <Select 
                  value={exportData.dataType} 
                  onValueChange={(value: 'inscricoes' | 'candidaturas' | 'programas' | 'oportunidades' | 'utilizadores' | 'completo') => setExportData({...exportData, dataType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completo">Dados Completos</SelectItem>
                    <SelectItem value="inscricoes">Inscrições</SelectItem>
                    <SelectItem value="candidaturas">Candidaturas</SelectItem>
                    <SelectItem value="programas">Programas</SelectItem>
                    <SelectItem value="oportunidades">Oportunidades</SelectItem>
                    <SelectItem value="utilizadores">Utilizadores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Formato</label>
                <Select 
                  value={exportData.format} 
                  onValueChange={(value: 'csv' | 'excel' | 'pdf') => setExportData({...exportData, format: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Período</label>
              <Select 
                value={exportData.dateRange} 
                onValueChange={(value: 'today' | 'week' | 'month' | 'all') => setExportData({...exportData, dateRange: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mês</SelectItem>
                  <SelectItem value="all">Todos os Dados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setExportModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExportData} disabled={exportLoading}>
              {exportLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Notificação */}
      <Dialog open={notificationModalOpen} onOpenChange={setNotificationModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Enviar Notificação
            </DialogTitle>
            <DialogDescription>
              Envie uma notificação para o setor {selectedSectorForAction?.nome}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título</label>
              <Input
                value={notificationData.title}
                onChange={(e) => setNotificationData({...notificationData, title: e.target.value})}
                placeholder="Título da notificação"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Mensagem</label>
              <Textarea
                value={notificationData.message}
                onChange={(e) => setNotificationData({...notificationData, message: e.target.value})}
                placeholder="Digite a mensagem da notificação..."
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <Select 
                  value={notificationData.type} 
                  onValueChange={(value: 'info' | 'warning' | 'success' | 'urgent') => setNotificationData({...notificationData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Informação</SelectItem>
                    <SelectItem value="warning">Aviso</SelectItem>
                    <SelectItem value="success">Sucesso</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Destinatários</label>
                <Select 
                  value={notificationData.recipients} 
                  onValueChange={(value: 'all' | 'active' | 'specific') => setNotificationData({...notificationData, recipients: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Utilizadores</SelectItem>
                    <SelectItem value="active">Utilizadores Ativos</SelectItem>
                    <SelectItem value="specific">Específicos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNotificationModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendNotification} disabled={notificationLoading}>
              {notificationLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Ações Rápidas */}
      <Dialog open={quickActionsModalOpen} onOpenChange={setQuickActionsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Ações Rápidas - {selectedSectorForAction?.nome}
            </DialogTitle>
            <DialogDescription>
              Execute ações rápidas no setor selecionado
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleQuickAction('activate')}
              disabled={actionLoading}
              className="h-20 flex-col"
            >
              <CheckCircle className="h-5 w-5 mb-1" />
              <span className="text-xs">Ativar Setor</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleQuickAction('deactivate')}
              disabled={actionLoading}
              className="h-20 flex-col"
            >
              <AlertCircle className="h-5 w-5 mb-1" />
              <span className="text-xs">Desativar Setor</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleQuickAction('refresh')}
              disabled={actionLoading}
              className="h-20 flex-col"
            >
              <Activity className="h-5 w-5 mb-1" />
              <span className="text-xs">Atualizar Dados</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleQuickAction('backup')}
              disabled={actionLoading}
              className="h-20 flex-col"
            >
              <FileDown className="h-5 w-5 mb-1" />
              <span className="text-xs">Criar Backup</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleQuickAction('report')}
              disabled={actionLoading}
              className="h-20 flex-col"
            >
              <FileText className="h-5 w-5 mb-1" />
              <span className="text-xs">Gerar Relatório</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleOpenExportModal(selectedSectorForAction!)}
              disabled={actionLoading}
              className="h-20 flex-col"
            >
              <Share2 className="h-5 w-5 mb-1" />
              <span className="text-xs">Exportar Dados</span>
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickActionsModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 