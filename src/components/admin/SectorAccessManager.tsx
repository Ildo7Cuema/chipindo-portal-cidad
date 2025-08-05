import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { UserRole, isSectorRole, getSectorName, getSectorSlug } from "@/hooks/useUserRole";

interface SectorAccessManagerProps {
  currentUserRole: UserRole;
  currentUserSetorId?: string | null;
}

interface SectorData {
  id: string;
  nome: string;
  slug: string;
  inscricoes: number;
  candidaturas: number;
  notificacoes: number;
}

interface SectorUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  setor_id: string;
  created_at: string;
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

// Dados mockados para demonstração
const mockSectorData: SectorData[] = [
  { id: '1', nome: 'Educação', slug: 'educacao', inscricoes: 45, candidaturas: 12, notificacoes: 8 },
  { id: '2', nome: 'Saúde', slug: 'saude', inscricoes: 32, candidaturas: 8, notificacoes: 5 },
  { id: '3', nome: 'Agricultura', slug: 'agricultura', inscricoes: 28, candidaturas: 15, notificacoes: 3 },
  { id: '4', nome: 'Setor Mineiro', slug: 'sector-mineiro', inscricoes: 18, candidaturas: 6, notificacoes: 2 },
  { id: '5', nome: 'Desenvolvimento Económico', slug: 'desenvolvimento-economico', inscricoes: 22, candidaturas: 9, notificacoes: 4 },
  { id: '6', nome: 'Cultura', slug: 'cultura', inscricoes: 15, candidaturas: 4, notificacoes: 1 },
  { id: '7', nome: 'Tecnologia', slug: 'tecnologia', inscricoes: 12, candidaturas: 7, notificacoes: 3 },
  { id: '8', nome: 'Energia e Água', slug: 'energia-agua', inscricoes: 20, candidaturas: 5, notificacoes: 2 }
];

const mockSectorUsers: SectorUser[] = [
  { id: '1', full_name: 'João Silva', email: 'joao.silva@chipindo.gov.ao', role: 'educacao', setor_id: '1', created_at: '2024-01-15' },
  { id: '2', full_name: 'Maria Santos', email: 'maria.santos@chipindo.gov.ao', role: 'saude', setor_id: '2', created_at: '2024-01-20' },
  { id: '3', full_name: 'Carlos Ferreira', email: 'carlos.ferreira@chipindo.gov.ao', role: 'agricultura', setor_id: '3', created_at: '2024-01-25' }
];

export function SectorAccessManager({ currentUserRole, currentUserSetorId }: SectorAccessManagerProps) {
  const [sectorData, setSectorData] = useState<SectorData[]>([]);
  const [sectorUsers, setSectorUsers] = useState<SectorUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Verificar se o utilizador atual tem acesso a este componente
  const canAccess = currentUserRole === 'admin' || currentUserRole === 'editor' || isSectorRole(currentUserRole);

  // Se for utilizador de setor específico, mostrar apenas o seu setor
  const userSectorSlug = isSectorRole(currentUserRole) ? getSectorSlug(currentUserRole) : null;

  useEffect(() => {
    if (canAccess) {
      fetchSectorData();
      fetchSectorUsers();
    }
  }, [canAccess, selectedSector]);

  const fetchSectorData = async () => {
    try {
      setLoading(true);
      
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Se for utilizador de setor específico, filtrar apenas o seu setor
      const filteredSetores = userSectorSlug 
        ? mockSectorData.filter(s => s.slug === userSectorSlug)
        : mockSectorData;

      setSectorData(filteredSetores);
      
      // Se for utilizador de setor específico, selecionar automaticamente o seu setor
      if (userSectorSlug && filteredSetores.length > 0) {
        setSelectedSector(filteredSetores[0].id);
      }
    } catch (error) {
      console.error('Error fetching sector data:', error);
      toast.error('Erro ao carregar dados dos setores');
    } finally {
      setLoading(false);
    }
  };

  const fetchSectorUsers = async () => {
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredUsers = mockSectorUsers;

      // Se for utilizador de setor específico, filtrar apenas utilizadores do seu setor
      if (userSectorSlug) {
        const sector = mockSectorData.find(s => s.slug === userSectorSlug);
        if (sector) {
          filteredUsers = mockSectorUsers.filter(user => user.setor_id === sector.id);
        }
      } else if (selectedSector && selectedSector !== 'all') {
        filteredUsers = mockSectorUsers.filter(user => user.setor_id === selectedSector);
      }

      setSectorUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching sector users:', error);
    }
  };

  const handleExportData = async (sectorId: string, dataType: 'inscricoes' | 'candidaturas') => {
    try {
      const sector = sectorData.find(s => s.id === sectorId);
      if (!sector) return;

      // Simular exportação de dados
      toast.success(`Dados de ${dataType} do setor ${sector.nome} exportados com sucesso!`);
      
      console.log(`Exporting ${dataType} for sector: ${sector.nome}`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Erro ao exportar dados');
    }
  };

  const handleSendNotification = async (sectorId: string) => {
    try {
      const sector = sectorData.find(s => s.id === sectorId);
      if (!sector) return;

      // Simular envio de notificação
      toast.success(`Notificação enviada para o setor ${sector.nome}!`);
      
      console.log(`Sending notification to sector: ${sector.nome}`);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Erro ao enviar notificação');
    }
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
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            {isSectorRole(currentUserRole) 
              ? `Gestão da ${getSectorName(currentUserRole)}`
              : 'Gestão de Acesso por Setor'
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isSectorRole(currentUserRole)
              ? `Gerencie as informações, inscrições e candidaturas da ${getSectorName(currentUserRole)}.`
              : 'Gerencie o acesso e as informações de cada setor estratégico do município.'
            }
          </p>
        </CardContent>
      </Card>

      {/* Filtros */}
      {!isSectorRole(currentUserRole) && (
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

      {/* Estatísticas dos Setores */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSectorData.map((sector) => {
          const SectorIcon = sectorIcons[sector.slug as keyof typeof sectorIcons] || Building2;
          
          return (
            <Card key={sector.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SectorIcon className="h-6 w-6 text-primary" />
                    <h3 className="font-semibold">{sector.nome}</h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {sector.slug}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Estatísticas */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="text-lg font-bold text-blue-600">{sector.inscricoes}</div>
                      <div className="text-xs text-blue-600">Inscrições</div>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <div className="text-lg font-bold text-green-600">{sector.candidaturas}</div>
                      <div className="text-xs text-green-600">Candidaturas</div>
                    </div>
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                      <div className="text-lg font-bold text-orange-600">{sector.notificacoes}</div>
                      <div className="text-xs text-orange-600">Notificações</div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportData(sector.id, 'inscricoes')}
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Inscrições
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportData(sector.id, 'candidaturas')}
                      className="flex-1"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Candidaturas
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendNotification(sector.id)}
                    >
                      <Bell className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lista de Utilizadores do Setor */}
      {(selectedSector !== 'all' || isSectorRole(currentUserRole)) ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Utilizadores do Setor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSectorUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum utilizador encontrado para este setor.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSectorUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getSectorName(user.role as UserRole)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
} 