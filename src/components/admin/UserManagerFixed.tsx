import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Edit, 
  Trash2, 
  Search, 
  Shield, 
  Crown, 
  Lock,
  Mail,
  Building2,
  Calendar,
  X,
  Save,
  Loader2,
  GraduationCap,
  Heart,
  Sprout,
  Pickaxe,
  TrendingUp,
  Palette,
  Cpu,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { UserRole, isSectorRole, getSectorName } from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  setor_id: string | null;
  created_at: string;
  updated_at: string;
}

interface SetorEstrategico {
  id: string;
  nome: string;
  slug: string;
}

interface UserManagerProps {
  currentUserRole: UserRole;
}

interface FormData {
  email: string;
  full_name: string;
  role: UserRole;
  setor_id?: string;
}

const userRoles = [
  { value: 'user', label: 'Usuário', icon: Users, color: 'gray', description: 'Acesso básico ao sistema' },
  { value: 'editor', label: 'Editor', icon: Edit, color: 'blue', description: 'Pode editar conteúdo' },
  { value: 'admin', label: 'Administrador', icon: Crown, color: 'red', description: 'Acesso total ao sistema' },
  { value: 'educacao', label: 'Direção de Educação', icon: GraduationCap, color: 'blue', description: 'Acesso à área de Educação' },
  { value: 'saude', label: 'Direção de Saúde', icon: Heart, color: 'red', description: 'Acesso à área de Saúde' },
  { value: 'agricultura', label: 'Direção de Agricultura', icon: Sprout, color: 'green', description: 'Acesso à área de Agricultura' },
  { value: 'sector-mineiro', label: 'Direção do Setor Mineiro', icon: Pickaxe, color: 'yellow', description: 'Acesso ao Setor Mineiro' },
  { value: 'desenvolvimento-economico', label: 'Direção de Desenvolvimento Económico', icon: TrendingUp, color: 'emerald', description: 'Acesso ao Desenvolvimento Económico' },
  { value: 'cultura', label: 'Direção de Cultura', icon: Palette, color: 'purple', description: 'Acesso à área de Cultura' },
  { value: 'tecnologia', label: 'Direção de Tecnologia', icon: Cpu, color: 'indigo', description: 'Acesso à área de Tecnologia' },
  { value: 'energia-agua', label: 'Direção de Energia e Água', icon: Zap, color: 'cyan', description: 'Acesso à área de Energia e Água' }
];

// Dados mockados para demonstração
const mockSetores: SetorEstrategico[] = [
  { id: '1', nome: 'Educação', slug: 'educacao' },
  { id: '2', nome: 'Saúde', slug: 'saude' },
  { id: '3', nome: 'Agricultura', slug: 'agricultura' },
  { id: '4', nome: 'Setor Mineiro', slug: 'sector-mineiro' },
  { id: '5', nome: 'Desenvolvimento Económico', slug: 'desenvolvimento-economico' },
  { id: '6', nome: 'Cultura', slug: 'cultura' },
  { id: '7', nome: 'Tecnologia', slug: 'tecnologia' },
  { id: '8', nome: 'Energia e Água', slug: 'energia-agua' }
];

const mockUsers: UserProfile[] = [
  { id: '1', user_id: 'auth-1', email: 'admin@chipindo.gov.ao', full_name: 'Administrador', role: 'admin', setor_id: null, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '2', user_id: 'auth-2', email: 'joao.silva@chipindo.gov.ao', full_name: 'João Silva', role: 'educacao', setor_id: '1', created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '3', user_id: 'auth-3', email: 'maria.santos@chipindo.gov.ao', full_name: 'Maria Santos', role: 'saude', setor_id: '2', created_at: '2024-01-20', updated_at: '2024-01-20' },
  { id: '4', user_id: 'auth-4', email: 'carlos.ferreira@chipindo.gov.ao', full_name: 'Carlos Ferreira', role: 'agricultura', setor_id: '3', created_at: '2024-01-25', updated_at: '2024-01-25' },
  { id: '5', user_id: 'auth-5', email: 'editor@chipindo.gov.ao', full_name: 'Editor', role: 'editor', setor_id: null, created_at: '2024-01-10', updated_at: '2024-01-10' }
];

export function UserManager({ currentUserRole }: UserManagerProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [setores, setSetores] = useState<SetorEstrategico[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: {} as Record<string, number>
  });

  const [formData, setFormData] = useState<FormData>({
    email: '',
    full_name: '',
    role: 'user'
  });

  // Fetch setores estratégicos
  const fetchSetores = async () => {
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 300));
      setSetores(mockSetores);
    } catch (error) {
      console.error('Error fetching setores:', error);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtrar apenas utilizadores válidos
      const validUsers = mockUsers.filter(user => 
        user.email && user.full_name
      );

      setUsers(validUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar utilizadores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSetores();
    fetchUsers();
  }, []);

  useEffect(() => {
    // Calculate stats
    const total = users.length;
    const active = users.filter(user => user.role !== null).length;
    const inactive = total - active;
    
    const byRole = users.reduce((acc, user) => {
      const role = user.role || 'user';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    setStats({ total, active, inactive, byRole });
  }, [users]);

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && user.role !== null) ||
                          (filterStatus === 'inactive' && user.role === null);
      
      return matchesSearch && matchesRole && matchesStatus;
    });

  const getRoleLabel = (role: string | null) => {
    if (!role) return 'Usuário';
    const roleConfig = userRoles.find(r => r.value === role);
    return roleConfig?.label || role;
  };

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'destructive' as const;
      case 'editor':
        return 'default' as const;
      default:
        if (isSectorRole(role as UserRole)) {
          return 'outline' as const;
        }
        return 'secondary' as const;
    }
  };

  const getSetorName = (setorId: string | null) => {
    if (!setorId) return '';
    const setor = setores.find(s => s.id === setorId);
    return setor?.nome || '';
  };

  const handleAddUser = async () => {
    try {
      setSaving(true);

      // Determinar o setor_id baseado no role selecionado
      let setorId = null;
      if (isSectorRole(formData.role)) {
        const setor = setores.find(s => s.slug === formData.role);
        setorId = setor?.id || null;
      }

      // Verificar se o email já existe
      const existingUser = users.find(user => user.email === formData.email);
      if (existingUser) {
        toast.error('Já existe um utilizador com este email');
        return;
      }

      // Simular criação de utilizador
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Criar novo utilizador
      const newUser: UserProfile = {
        id: crypto.randomUUID(),
        user_id: crypto.randomUUID(),
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role,
        setor_id: setorId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUsers(prev => [newUser, ...prev]);

      toast.success('Utilizador criado com sucesso!');
      setShowAddDialog(false);
      setFormData({
        email: '',
        full_name: '',
        role: 'user'
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Erro ao adicionar utilizador');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Simular atualização
      await new Promise(resolve => setTimeout(resolve, 500));

      const newRole = currentStatus ? null : 'user';
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, role: newRole, updated_at: new Date().toISOString() }
          : user
      ));

      toast.success(`Utilizador ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Erro ao alterar status do utilizador');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este utilizador?')) {
      return;
    }

    try {
      // Simular exclusão
      await new Promise(resolve => setTimeout(resolve, 500));

      setUsers(prev => prev.filter(user => user.id !== userId));

      toast.success('Utilizador excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir utilizador');
    }
  };

  if (currentUserRole !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Acesso Restrito
            </h3>
            <p className="text-muted-foreground">
              Apenas administradores podem gerir utilizadores do sistema.
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
          <p className="text-muted-foreground">Carregando utilizadores...</p>
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
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total de Utilizadores</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Activos</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Inativos</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.inactive}</p>
              </div>
              <UserX className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Administradores</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {stats.byRole.admin || 0}
                </p>
              </div>
              <Crown className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Gestão de Utilizadores</h2>
            </div>

            <div className="flex items-center gap-2">
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Utilizador
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Adicionar Novo Utilizador
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Informações Básicas
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="utilizador@chipindo.gov.ao"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Nome Completo *</Label>
                          <Input
                            id="full_name"
                            placeholder="Nome completo do utilizador"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Função *</Label>
                        <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {userRoles.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                <div className="flex items-center gap-2">
                                  <role.icon className="h-4 w-4" />
                                  <div className="flex flex-col">
                                    <span>{role.label}</span>
                                    <span className="text-xs text-muted-foreground">{role.description}</span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Mostrar informações sobre o setor selecionado */}
                      {isSectorRole(formData.role) && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-900 dark:text-blue-100">
                              Acesso à {getSectorName(formData.role)}
                            </span>
                          </div>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Este utilizador terá acesso exclusivo às informações e funcionalidades da {getSectorName(formData.role)}. 
                            Poderá visualizar inscrições, candidaturas e receber notificações relacionadas com esta área.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddDialog(false)}
                      disabled={saving}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddUser}
                      disabled={saving || !formData.email || !formData.full_name}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {saving ? 'A Guardar...' : 'Guardar Utilizador'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar utilizadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[140px]">
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Papéis</SelectItem>
                  {userRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'inactive') => setFilterStatus(value)}>
                <SelectTrigger className="w-[140px]">
                  <UserCheck className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <Card className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum utilizador encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente ajustar os filtros de pesquisa.' : 'Comece adicionando o primeiro utilizador.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Utilizador
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => {
              const roleBadgeVariant = getRoleBadgeVariant(user.role);
              const isSectorUser = isSectorRole(user.role as UserRole);
              
              return (
                <Card key={user.id} className={cn(
                  "group hover:shadow-lg transition-all duration-200 hover:-translate-y-1",
                  user.role === null && "opacity-60"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{user.full_name || user.email}</h3>
                          <Badge variant={roleBadgeVariant} className="text-xs">
                            {getRoleLabel(user.role)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        {isSectorUser && user.setor_id && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            {getSetorName(user.setor_id)}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleStatus(user.id, user.role !== null)}
                        >
                          {user.role !== null ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="truncate">
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-gray-600" />
                            <span className="text-xs text-muted-foreground">
                              {getRoleLabel(user.role)}
                            </span>
                          </div>
                          <Badge variant={user.role !== null ? "default" : "secondary"} className="text-xs">
                            {user.role !== null ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 