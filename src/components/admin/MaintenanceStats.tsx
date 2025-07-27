import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  HardDrive, 
  ShieldCheck, 
  RefreshCw,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Settings,
  Wrench,
  Archive,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MaintenanceStats {
  cacheClears: number;
  dbOptimizations: number;
  backupsCreated: number;
  integrityChecks: number;
  lastMaintenance: string;
  totalActions: number;
}

interface MaintenanceLog {
  id: string;
  action: string;
  status: 'success' | 'error' | 'warning';
  details: any;
  duration: number;
  timestamp: string;
}

export const MaintenanceStats = () => {
  const [stats, setStats] = useState<MaintenanceStats>({
    cacheClears: 0,
    dbOptimizations: 0,
    backupsCreated: 0,
    integrityChecks: 0,
    lastMaintenance: '',
    totalActions: 0
  });
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchLogs();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_maintenance_stats');

      if (error) {
        console.error('Error fetching maintenance stats:', error);
        return;
      }

      setStats({
        cacheClears: data.cache_clears || 0,
        dbOptimizations: data.db_optimizations || 0,
        backupsCreated: data.backups_created || 0,
        integrityChecks: data.integrity_checks || 0,
        lastMaintenance: data.last_maintenance || new Date().toISOString(),
        totalActions: data.total_actions || 0
      });
    } catch (error) {
      console.error('Error fetching maintenance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('system_stats')
        .select('*')
        .eq('metric_name', 'maintenance_action')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching maintenance logs:', error);
        return;
      }

      const processedLogs = data?.map(log => ({
        id: log.id,
        action: log.metric_value.action,
        status: log.metric_value.details?.success ? 'success' : 'error',
        details: log.metric_value.details,
        duration: log.metric_value.details?.duration || 0,
        timestamp: log.created_at
      })) || [];

      setLogs(processedLogs);
    } catch (error) {
      console.error('Error fetching maintenance logs:', error);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'clear_cache':
        return <RefreshCw className="h-4 w-4" />;
      case 'optimize_database':
        return <Database className="h-4 w-4" />;
      case 'create_manual_backup':
        return <HardDrive className="h-4 w-4" />;
      case 'check_integrity':
        return <ShieldCheck className="h-4 w-4" />;
      case 'vacuum_database':
        return <Database className="h-4 w-4" />;
      case 'reindex_database':
        return <Database className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getActionName = (action: string) => {
    switch (action) {
      case 'clear_cache':
        return 'Limpar Cache';
      case 'optimize_database':
        return 'Otimizar Base de Dados';
      case 'create_manual_backup':
        return 'Backup Manual';
      case 'check_integrity':
        return 'Verificar Integridade';
      case 'vacuum_database':
        return 'Vacuum Database';
      case 'reindex_database':
        return 'Reindex Database';
      default:
        return action;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    } else {
      return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-AO');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estatísticas de Manutenção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Activity className="h-6 w-6 animate-spin mr-2" />
            <span>Carregando estatísticas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Maintenance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Visão Geral da Manutenção
          </CardTitle>
          <CardDescription>
            Estatísticas das ações de manutenção realizadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Limpeza de Cache</span>
              </div>
              <div className="text-2xl font-bold">{stats.cacheClears}</div>
              <Progress value={stats.totalActions > 0 ? (stats.cacheClears / stats.totalActions) * 100 : 0} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Otimizações</span>
              </div>
              <div className="text-2xl font-bold">{stats.dbOptimizations}</div>
              <Progress value={stats.totalActions > 0 ? (stats.dbOptimizations / stats.totalActions) * 100 : 0} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Backups</span>
              </div>
              <div className="text-2xl font-bold">{stats.backupsCreated}</div>
              <Progress value={stats.totalActions > 0 ? (stats.backupsCreated / stats.totalActions) * 100 : 0} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Verificações</span>
              </div>
              <div className="text-2xl font-bold">{stats.integrityChecks}</div>
              <Progress value={stats.totalActions > 0 ? (stats.integrityChecks / stats.totalActions) * 100 : 0} className="h-2" />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Total de ações: {stats.totalActions}
            </div>
            <div className="text-sm text-muted-foreground">
              Última manutenção: {stats.lastMaintenance ? formatTimestamp(stats.lastMaintenance) : 'Nunca'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Maintenance Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Logs Recentes de Manutenção
          </CardTitle>
          <CardDescription>
            Histórico das últimas ações de manutenção
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getActionIcon(log.action)}
                    <div>
                      <p className="font-medium">{getActionName(log.action)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTimestamp(log.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <Badge variant={log.status === 'success' ? 'default' : log.status === 'error' ? 'destructive' : 'secondary'}>
                      {log.status === 'success' ? 'Sucesso' : log.status === 'error' ? 'Erro' : 'Aviso'}
                    </Badge>
                    {log.duration > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(log.duration)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Nenhum log de manutenção encontrado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Maintenance Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Dicas de Manutenção
          </CardTitle>
          <CardDescription>
            Recomendações para manter o sistema otimizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Cache</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Limpe o cache regularmente para liberar memória e melhorar a performance
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Otimização</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Execute otimizações semanais para manter a base de dados eficiente
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Backup</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Faça backups antes de grandes alterações no sistema
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Integridade</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Verifique a integridade mensalmente para detectar problemas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Acesse rapidamente as ferramentas de manutenção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Archive className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Backups</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Gerenciar backups do sistema
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Performance</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Monitorar performance do sistema
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Segurança</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Verificar configurações de segurança
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Ferramentas</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Acessar ferramentas avançadas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 