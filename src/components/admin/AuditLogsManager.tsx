import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, User, Shield, Eye, Download, Filter, Search, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AuditLog {
  id: string;
  user_name: string | null;
  user_email: string | null;
  action: string;
  admin_name: string | null;
  admin_email: string | null;
  changed_fields: string[] | null;
  created_at: string;
  ip_address: string | null;
  old_values: any;
  new_values: any;
}

interface AuditStatistics {
  total_actions: number;
  create_count: number;
  update_count: number;
  delete_count: number;
  block_count: number;
  unblock_count: number;
  role_change_count: number;
  last_activity: string | null;
}

interface AuditLogsManagerProps {
  currentUserRole: string;
}

export function AuditLogsManager({ currentUserRole }: AuditLogsManagerProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [statistics, setStatistics] = useState<AuditStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showLogDetails, setShowLogDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('7days');
  const { toast } = useToast();

  // Carregar logs de auditoria
  const fetchAuditLogs = async () => {
    try {
      setLoading(true);

      // Calcular período baseado no filtro
      const now = new Date();
      let startDate = new Date();
      
      switch (dateFilter) {
        case '24hours':
          startDate.setHours(now.getHours() - 24);
          break;
        case '7days':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(now.getDate() - 90);
          break;
        default:
          startDate.setDate(now.getDate() - 7);
      }

      const { data, error } = await supabase
        .rpc('get_audit_logs_by_period', {
          p_start_date: startDate.toISOString(),
          p_end_date: now.toISOString()
        });

      if (error) {
        console.error('Error fetching audit logs:', error);
        toast.error('Erro ao carregar logs de auditoria');
        return;
      }

      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Erro ao carregar logs de auditoria');
    } finally {
      setLoading(false);
    }
  };

  // Carregar estatísticas
  const fetchStatistics = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_audit_statistics');

      if (error) {
        console.error('Error fetching statistics:', error);
        return;
      }

      setStatistics(data?.[0] || null);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    if (currentUserRole === 'admin') {
      fetchAuditLogs();
      fetchStatistics();
    }
  }, [currentUserRole, dateFilter]);

  // Filtrar logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin_email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  // Obter cor do badge baseado na ação
  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'default';
      case 'UPDATE':
        return 'secondary';
      case 'DELETE':
        return 'destructive';
      case 'BLOCK':
        return 'destructive';
      case 'UNBLOCK':
        return 'default';
      case 'ROLE_CHANGE':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  // Obter ícone baseado na ação
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <User className="h-4 w-4" />;
      case 'UPDATE':
        return <Shield className="h-4 w-4" />;
      case 'DELETE':
        return <User className="h-4 w-4" />;
      case 'BLOCK':
        return <Shield className="h-4 w-4" />;
      case 'UNBLOCK':
        return <Shield className="h-4 w-4" />;
      case 'ROLE_CHANGE':
        return <Shield className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  // Exportar logs para CSV
  const exportToCSV = () => {
    const headers = [
      'Data/Hora',
      'Ação',
      'Utilizador',
      'Email do Utilizador',
      'Administrador',
      'Email do Administrador',
      'Campos Alterados',
      'IP'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }),
        log.action,
        log.user_name || 'N/A',
        log.user_email || 'N/A',
        log.admin_name || 'N/A',
        log.admin_email || 'N/A',
        log.changed_fields?.join('; ') || 'N/A',
        log.ip_address || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (currentUserRole !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Acesso Restrito
            </h3>
            <p className="text-muted-foreground">
              Apenas administradores podem visualizar logs de auditoria.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Ações</p>
                  <p className="text-2xl font-bold">{statistics.total_actions}</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Criações</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.create_count}</p>
                </div>
                <User className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bloqueios</p>
                  <p className="text-2xl font-bold text-red-600">{statistics.block_count}</p>
                </div>
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alterações de Role</p>
                  <p className="text-2xl font-bold text-blue-600">{statistics.role_change_count}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Logs de Auditoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Pesquisar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full sm:w-48">
              <Label htmlFor="action-filter">Ação</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Ações</SelectItem>
                  <SelectItem value="CREATE">Criação</SelectItem>
                  <SelectItem value="UPDATE">Atualização</SelectItem>
                  <SelectItem value="DELETE">Exclusão</SelectItem>
                  <SelectItem value="BLOCK">Bloqueio</SelectItem>
                  <SelectItem value="UNBLOCK">Desbloqueio</SelectItem>
                  <SelectItem value="ROLE_CHANGE">Alteração de Role</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-48">
              <Label htmlFor="date-filter">Período</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hours">Últimas 24h</SelectItem>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="90days">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={exportToCSV} variant="outline" className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>

          {/* Lista de Logs */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Carregando logs...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum log encontrado</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <Card key={log.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getActionIcon(log.action)}
                          <Badge variant={getActionBadgeVariant(log.action)}>
                            {log.action}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Utilizador:</span>{' '}
                            {log.user_name || 'N/A'} ({log.user_email || 'N/A'})
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Administrador:</span>{' '}
                            {log.admin_name || 'N/A'} ({log.admin_email || 'N/A'})
                          </p>
                          {log.changed_fields && log.changed_fields.length > 0 && (
                            <p className="text-sm">
                              <span className="font-medium">Campos alterados:</span>{' '}
                              {log.changed_fields.join(', ')}
                            </p>
                          )}
                          {log.ip_address && (
                            <p className="text-sm">
                              <span className="font-medium">IP:</span> {log.ip_address}
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedLog(log);
                          setShowLogDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={showLogDetails} onOpenChange={setShowLogDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Log de Auditoria</DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Ação</Label>
                  <p className="text-sm">{selectedLog.action}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Data/Hora</Label>
                  <p className="text-sm">
                    {format(new Date(selectedLog.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Utilizador Afetado</Label>
                <p className="text-sm">{selectedLog.user_name || 'N/A'} ({selectedLog.user_email || 'N/A'})</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Administrador Responsável</Label>
                <p className="text-sm">{selectedLog.admin_name || 'N/A'} ({selectedLog.admin_email || 'N/A'})</p>
              </div>

              {selectedLog.changed_fields && selectedLog.changed_fields.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Campos Alterados</Label>
                  <p className="text-sm">{selectedLog.changed_fields.join(', ')}</p>
                </div>
              )}

              {selectedLog.ip_address && (
                <div>
                  <Label className="text-sm font-medium">Endereço IP</Label>
                  <p className="text-sm">{selectedLog.ip_address}</p>
                </div>
              )}

              {(selectedLog.old_values || selectedLog.new_values) && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Valores</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedLog.old_values && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Valores Anteriores</Label>
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                          {JSON.stringify(selectedLog.old_values, null, 2)}
                        </pre>
                      </div>
                    )}
                    {selectedLog.new_values && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Valores Novos</Label>
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                          {JSON.stringify(selectedLog.new_values, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 