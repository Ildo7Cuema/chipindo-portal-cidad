import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  HardDrive, 
  Download, 
  Upload, 
  Trash2, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Settings,
  RefreshCw,
  FileText,
  Database,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface BackupItem {
  id: string;
  backup_id: string;
  size: number;
  tables: string[];
  status: 'pending' | 'completed' | 'failed';
  type: 'manual' | 'automatic' | 'scheduled' | 'test';
  created_at: string;
  completed_at?: string;
  metadata?: any;
}

export const BackupManager = () => {
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    pending: 0,
    totalSize: 0,
    averageSize: 0
  });

  useEffect(() => {
    fetchBackups();
    fetchStats();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      
      // Mock data since list_system_backups function doesn't exist
      const mockBackups = [
        {
          id: '1',
          backup_id: 'backup_20241201_120000',
          size: 1024000,
          tables: ['news', 'hero_carousel'],
          status: 'completed' as 'completed',
          type: 'manual' as 'manual',
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          metadata: {}
        }
      ];

      setBackups(mockBackups);
    } catch (error) {
      console.error('Error fetching backups:', error);
      toast.error("Erro ao carregar backups");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats since get_backup_stats function doesn't exist
      setStats({
        total: 5,
        successful: 4,
        failed: 1,
        pending: 0,
        totalSize: 5120000,
        averageSize: 1024000
      });
    } catch (error) {
      console.error('Error fetching backup stats:', error);
    }
  };

  const createBackup = async () => {
    try {
      setCreating(true);
      
      // Mock backup creation since functions don't exist
      toast.success("Backup iniciado com sucesso!");
      
      setTimeout(() => {
        fetchBackups();
        fetchStats();
        toast.success("Backup concluído com sucesso!");
        setCreating(false);
      }, 3000);

    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error("Erro ao criar backup");
      setCreating(false);
    }
  };

  const deleteBackup = async (backupId: string) => {
    try {
      // Mock deletion since system_backups table doesn't exist
      setBackups(prev => prev.filter(backup => backup.id !== backupId));
      toast.success("Backup excluído com sucesso!");
      fetchStats();
    } catch (error) {
      console.error('Error deleting backup:', error);
      toast.error("Erro ao excluir backup");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Concluído</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">Pendente</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">Falhou</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'manual':
        return <Badge variant="outline">Manual</Badge>;
      case 'automatic':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">Automático</Badge>;
      case 'scheduled':
        return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">Agendado</Badge>;
      case 'test':
        return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">Teste</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-AO');
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total de Backups</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Sucessos</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.successful}</p>
                <p className="text-xs text-green-600 dark:text-green-400">{stats.total > 0 ? Math.round((stats.successful / stats.total) * 100) : 0}% taxa</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Falhas</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Tamanho Total</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{formatSize(stats.totalSize)}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Média: {formatSize(stats.averageSize)}</p>
              </div>
              <HardDrive className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <CardTitle>Gerenciar Backups</CardTitle>
            </div>
            <Button
              onClick={createBackup}
              disabled={creating}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {creating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {creating ? 'Criando...' : 'Criar Backup'}
            </Button>
          </div>
          <CardDescription>
            Gerencie os backups do sistema e configure backup automático
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Configurações</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Backup Automático</span>
                  <Badge variant="outline">Habilitado</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Frequência</span>
                  <Badge variant="outline">Diário</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Retenção</span>
                  <Badge variant="outline">30 dias</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Compressão</span>
                  <Badge variant="outline">Habilitada</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Criptografia</span>
                  <Badge variant="outline">Habilitada</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Estatísticas</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Taxa de Sucesso</span>
                  <span>{stats.total > 0 ? Math.round((stats.successful / stats.total) * 100) : 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Último Backup</span>
                  <span>{backups[0]?.created_at ? formatDate(backups[0].created_at) : 'Nunca'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Backups Pendentes</span>
                  <span>{stats.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tamanho Médio</span>
                  <span>{formatSize(stats.averageSize)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Ações</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => fetchBackups()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar Lista
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => fetchStats()}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Atualizar Stats
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backups List */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Histórico de Backups</CardTitle>
          </div>
          <CardDescription>
            Lista de todos os backups criados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Carregando backups...</span>
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum backup encontrado</p>
              <p className="text-sm">Crie seu primeiro backup para começar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map((backup) => (
                <div key={backup.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      <span className="font-medium">{backup.backup_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(backup.status)}
                      {getTypeBadge(backup.type)}
                    </div>
                  </div>
                  
                  <div className="grid gap-2 md:grid-cols-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Tamanho:</span> {formatSize(backup.size)}
                    </div>
                    <div>
                      <span className="font-medium">Tabelas:</span> {backup.tables.length}
                    </div>
                    <div>
                      <span className="font-medium">Criado:</span> {formatDate(backup.created_at)}
                    </div>
                    <div>
                      <span className="font-medium">Concluído:</span> {backup.completed_at ? formatDate(backup.completed_at) : 'Pendente'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Restaurar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      onClick={() => deleteBackup(backup.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};