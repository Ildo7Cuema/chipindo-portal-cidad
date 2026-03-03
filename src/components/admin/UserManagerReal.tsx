import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { supabase } from "@/integrations/supabase/client";

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
  { value: 'editor', label: 'Editor', icon: Edit, color: 'teal', description: 'Gestão de Notícias e Acervo Digital' },
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
      const { data: setoresData, error } = await supabase
        .from('setores_estrategicos')
        .select('id, nome, slug')
        .eq('ativo', true)
        .order('ordem, nome');

      if (error) {
        console.error('Error fetching setores:', error);
        toast.error('Erro ao carregar setores');
        return;
      }

      setSetores(setoresData || []);
    } catch (error) {
      console.error('Error fetching setores:', error);
      toast.error('Erro ao carregar setores');
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Erro ao carregar utilizadores');
        return;
      }

      const validUsers = profiles?.filter(user =>
        user.email && user.full_name
      ) || [];

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
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existingProfile) {
        toast.error('Já existe um utilizador com este email');
        return;
      }

      // Gerar uma senha temporária
      const tempPassword = Math.random().toString(36).slice(-8) + '!1A';

      // 1. Criar utilizador no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: tempPassword,
        options: {
          data: {
            full_name: formData.full_name,
            role: formData.role
          }
        }
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        toast.error(`Erro ao criar utilizador: ${authError.message}`);
        return;
      }

      if (!authData.user) {
        toast.error('Erro: Utilizador não foi criado no sistema de autenticação');
        return;
      }

      // 2. Criar/actualizar perfil na tabela profiles
      // Usa upsert porque o trigger handle_new_user já cria o perfil automaticamente
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: authData.user.id,
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          setor_id: setorId,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast.error(`Erro ao criar perfil: ${profileError.message}`);
        return;
      }

      toast.success('Utilizador criado com sucesso!');
      toast.info(`Senha temporária: ${tempPassword}`, {
        duration: 10000,
        description: 'O utilizador deve alterar esta senha no primeiro login'
      });

      setShowAddDialog(false);
      setFormData({
        email: '',
        full_name: '',
        role: 'user'
      });

      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Erro ao adicionar utilizador');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const newRole = currentStatus ? null : 'user';

      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user status:', error);
        toast.error(`Erro ao actualizar status do utilizador: ${error.message}`);
        return;
      }

      toast.success(`Utilizador ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Erro ao alterar status do utilizador');
    }
  };

  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    const userId = userToDelete;
    // Reset state immediately or wait until after? 
    // Usually better to wait or keep dialog open with loading state if needed.
    // For now we'll match existing behavior but use the separate execution function.

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('id', userId)
        .single();

      if (!profile) {
        toast.error('Perfil não encontrado');
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        toast.error(`Erro ao excluir perfil: ${profileError.message}`);
        return;
      }

      toast.success('Utilizador excluído com sucesso!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir utilizador');
    } finally {
      setShowDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  // Deprecated direct delete handler
  const handleDeleteUser = async (userId: string) => {
    // This is kept for reference but the UI now uses handleDeleteClick
    handleDeleteClick(userId);
  };

  if (currentUserRole !== 'admin') {
    return (
      <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900 border-dashed border-2 border-slate-200 dark:border-slate-800">
        <CardContent className="p-12 text-center">
          <Lock className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">
            Acesso Restrito
          </h3>
          <p className="text-sm font-medium text-muted-foreground">
            Apenas administradores podem gerir utilizadores do sistema.
          </p>
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
        <Card className="border-0 shadow-sm rounded-2xl bg-blue-50/50 dark:bg-blue-900/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600/80 dark:text-blue-400/80 uppercase tracking-wider mb-1">Total de Utilizadores</p>
                <p className="text-2xl font-bold tracking-tight text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <div className="p-2.5 bg-blue-100/50 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider mb-1">Activos</p>
                <p className="text-2xl font-bold tracking-tight text-emerald-900 dark:text-emerald-100">{stats.active}</p>
              </div>
              <div className="p-2.5 bg-emerald-100/50 dark:bg-emerald-800/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <UserCheck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-amber-50/50 dark:bg-amber-900/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-600/80 dark:text-amber-400/80 uppercase tracking-wider mb-1">Inactivos</p>
                <p className="text-2xl font-bold tracking-tight text-amber-900 dark:text-amber-100">{stats.inactive}</p>
              </div>
              <div className="p-2.5 bg-amber-100/50 dark:bg-amber-800/30 text-amber-600 dark:text-amber-400 rounded-xl">
                <UserX className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-purple-50/50 dark:bg-purple-900/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600/80 dark:text-purple-400/80 uppercase tracking-wider mb-1">Administradores</p>
                <p className="text-2xl font-bold tracking-tight text-purple-900 dark:text-purple-100">
                  {stats.byRole.admin || 0}
                </p>
              </div>
              <div className="p-2.5 bg-purple-100/50 dark:bg-purple-800/30 text-purple-600 dark:text-purple-400 rounded-xl">
                <Crown className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Gestão de Utilizadores</h2>
            </div>

            <div className="flex items-center gap-2">
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="rounded-full shadow-sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Utilizador
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-2xl border-0 shadow-xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                      <UserPlus className="h-5 w-5 text-muted-foreground" />
                      Adicionar Novo Utilizador
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 pt-4">
                    <div className="space-y-5">
                      <h3 className="text-sm font-bold tracking-tight uppercase text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" />
                        Informações Básicas
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="utilizador@chipindo.gov.ao"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="h-10 px-3 rounded-lg border-muted bg-background"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="full_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome Completo *</Label>
                          <Input
                            id="full_name"
                            placeholder="Nome completo do utilizador"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            required
                            className="h-10 px-3 rounded-lg border-muted bg-background"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Função *</Label>
                        <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                          <SelectTrigger className="h-10 px-3 rounded-lg border-muted bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent position="popper" className="max-h-[300px] overflow-y-auto rounded-xl">
                            {userRoles.map((role) => (
                              <SelectItem key={role.value} value={role.value} className="py-2">
                                <div className="flex items-center gap-2">
                                  <role.icon className="h-4 w-4 text-muted-foreground" />
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">{role.label}</span>
                                    <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">{role.description}</span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.role === 'editor' && (
                        <div className="p-4 bg-teal-50/50 dark:bg-teal-900/10 rounded-xl border border-teal-100 dark:border-teal-800/30">
                          <div className="flex items-center gap-2 mb-2">
                            <Edit className="h-4 w-4 text-teal-600" />
                            <span className="font-semibold tracking-tight text-sm text-teal-900 dark:text-teal-100">
                              Permissões do Editor
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-teal-700 dark:text-teal-300">
                            Este utilizador terá acesso exclusivo às secções de <strong>Notícias</strong> e <strong>Acervo Digital</strong>.
                            Poderá criar, editar e publicar notícias, bem como gerir documentos e ficheiros do acervo digital do município.
                          </p>
                        </div>
                      )}

                      {isSectorRole(formData.role) && (
                        <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold tracking-tight text-sm text-blue-900 dark:text-blue-100">
                              Acesso à {getSectorName(formData.role)}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-blue-700 dark:text-blue-300">
                            Este utilizador terá acesso exclusivo às informações e funcionalidades da {getSectorName(formData.role)}.
                            Poderá visualizar inscrições, candidaturas e receber notificações relacionadas com esta área.
                          </p>
                        </div>
                      )}

                      <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-amber-600" />
                          <span className="font-semibold tracking-tight text-sm text-amber-900 dark:text-amber-100">
                            Senha Temporária
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300">
                          Uma senha temporária será gerada automaticamente e exibida após a criação do utilizador.
                          O utilizador deve alterar esta senha no primeiro login.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full shadow-sm"
                      onClick={() => setShowAddDialog(false)}
                      disabled={saving}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-full shadow-sm"
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
                className="pl-10 h-9 rounded-full border-muted text-sm shadow-none focus-visible:ring-1 focus-visible:ring-primary/40 bg-gray-50/50 dark:bg-slate-800/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[150px] h-9 rounded-full border-muted bg-gray-50/50 dark:bg-slate-800/50 shadow-none text-xs font-medium">
                  <Shield className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">Todos os Papéis</SelectItem>
                  {userRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value} className="text-xs">
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'inactive') => setFilterStatus(value)}>
                <SelectTrigger className="w-[120px] h-9 rounded-full border-muted bg-gray-50/50 dark:bg-slate-800/50 shadow-none text-xs font-medium">
                  <UserCheck className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">Todos</SelectItem>
                  <SelectItem value="active" className="text-xs">Activos</SelectItem>
                  <SelectItem value="inactive" className="text-xs">Inactivos</SelectItem>
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
                  "border-0 shadow-sm rounded-2xl group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
                  user.role === null ? "opacity-60 bg-muted/40" : "bg-white dark:bg-slate-900"
                )}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h3 className="font-bold text-sm tracking-tight truncate">{user.full_name || user.email}</h3>
                          <Badge variant={roleBadgeVariant} className="text-[10px] uppercase font-bold tracking-wider py-0 rounded-full shrink-0">
                            {getRoleLabel(user.role)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate" title={user.email}>{user.email}</p>
                        {isSectorUser && user.setor_id && (
                          <p className="text-[10px] uppercase font-semibold text-primary/80 mt-1.5 truncate bg-primary/10 w-max px-2 py-0.5 rounded-full">
                            {getSetorName(user.setor_id)}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0 bg-muted/30 rounded-full p-1 border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 rounded-full"
                          title={user.role !== null ? "Desativar" : "Ativar"}
                          onClick={() => handleToggleStatus(user.id, user.role !== null)}
                        >
                          {user.role !== null ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Excluir"
                          onClick={() => handleDeleteClick(user.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        <Calendar className="h-3 w-3" />
                        <span className="truncate">
                          Desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <Badge variant={user.role !== null ? "default" : "secondary"} className="text-[10px] font-medium py-0 rounded-md">
                        {user.role !== null ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o utilizador
              e removerá seus dados de nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir Utilizador
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 