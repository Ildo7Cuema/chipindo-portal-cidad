import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Phone,
  Building2,
  Calendar,
  Clock,
  Briefcase,
  X,
  Save,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

interface UserManagerProps {
  currentUserRole: UserRole;
}

interface FormData {
  email: string;
  full_name: string;
  role: UserRole;
}

const userRoles = [
  { value: 'user', label: 'Usuário', icon: Users, color: 'gray', description: 'Acesso básico ao sistema' },
  { value: 'editor', label: 'Editor', icon: Edit, color: 'blue', description: 'Pode editar conteúdo' },
  { value: 'admin', label: 'Administrador', icon: Crown, color: 'red', description: 'Acesso total ao sistema' }
];

export function UserManager({ currentUserRole }: UserManagerProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
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

  // Fetch real users from Supabase
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

      setUsers(profiles || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar utilizadores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    return userRoles.find(r => r.value === role)?.label || role;
  };

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'destructive' as const;
      case 'editor':
        return 'default' as const;
      default:
        return 'secondary' as const;
    }
  };

  const handleAddUser = async () => {
    try {
      setSaving(true);

      // First create the user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: 'tempPassword123!', // Temporary password
        email_confirm: true,
        user_metadata: {
          full_name: formData.full_name,
          role: formData.role
        }
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        toast.error('Erro ao criar utilizador');
        return;
      }

      // Then create the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast.error('Erro ao criar perfil do utilizador');
        return;
      }

      toast.success('Utilizador criado com sucesso!');
      setShowAddDialog(false);
      setFormData({
        email: '',
        full_name: '',
        role: 'user'
      });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Erro ao adicionar utilizador');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Since we can't use 'inactive' due to constraint, we'll use null for inactive users
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
      fetchUsers(); // Refresh the list
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
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Erro ao excluir utilizador');
        return;
      }

      toast.success('Utilizador excluído com sucesso!');
      fetchUsers(); // Refresh the list
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
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Ativos</p>
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
                                  {role.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
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
                            {user.role !== null ? 'Ativo' : 'Inativo'}
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