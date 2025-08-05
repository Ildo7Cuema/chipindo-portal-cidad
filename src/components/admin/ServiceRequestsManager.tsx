import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  MapPin,
  Building,
  Eye,
  Edit,
  Trash2,
  Send,
  Filter,
  Search,
  RefreshCw,
  TrendingUp,
  Users,
  Activity,
  Star,
  Bell
} from 'lucide-react';
import { useServiceRequests, ServiceRequest } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAccessControl } from '@/hooks/useAccessControl';
import { SectorFilter } from '@/components/admin/SectorFilter';

export const ServiceRequestsManager = () => {
  const {
    requests,
    loading,
    stats,
    fetchRequests,
    updateRequestStatus,
    assignRequest,
    deleteRequest,
    getRequestsByStatus,
    getUrgentRequests,
    getTodayRequests
  } = useServiceRequests();

  const { toast } = useToast();
  
  // Controle de acesso
  const { isAdmin, getCurrentSector, getCurrentSectorName } = useAccessControl();
  
  // Estado para filtro de setor
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  
  // Carregar solicitações com filtro de setor (apenas uma vez)
  useEffect(() => {
    const currentSectorName = getCurrentSectorName();
    const filter = isAdmin ? 'all' : (currentSectorName || 'all');
    console.log('ServiceRequests - Setor atual:', currentSectorName, 'Filtro:', filter, 'isAdmin:', isAdmin);
    setSectorFilter(filter);
    fetchRequests(filter);
  }, [isAdmin]); // Removido getCurrentSectorName e fetchRequests das dependências
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [updateForm, setUpdateForm] = useState({
    status: '',
    adminNotes: ''
  });

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.requester_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pendente</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">Em Progresso</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Concluída</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getPriorityBadge = (priority: ServiceRequest['priority']) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-500">Urgente</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">Alta</Badge>;
      case 'normal':
        return <Badge className="bg-blue-500">Normal</Badge>;
      case 'low':
        return <Badge variant="outline">Baixa</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest || !updateForm.status) return;

    try {
      await updateRequestStatus(
        selectedRequest.id, 
        updateForm.status as ServiceRequest['status'],
        updateForm.adminNotes
      );
      
      setShowUpdateDialog(false);
      setUpdateForm({ status: '', adminNotes: '' });
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (confirm('Tem certeza que deseja remover esta solicitação?')) {
      try {
        await deleteRequest(requestId);
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sector Filter */}
      <SectorFilter />
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Urgentes</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hoje</p>
                <p className="text-2xl font-bold text-green-600">{stats.today}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Pesquisar solicitações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="completed">Concluídas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={fetchRequests} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitações de Serviços</CardTitle>
          <CardDescription>
            Gerencie todas as solicitações de serviços municipais
            {!isAdmin && getCurrentSectorName() && (
              <span className="ml-2 text-sm font-medium text-blue-600">
                • Setor: {getCurrentSectorName()}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma solicitação encontrada</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? "Tente ajustar seus filtros de busca."
                    : "Não há solicitações de serviços no momento."
                  }
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{request.service_name}</h3>
                          {getStatusBadge(request.status)}
                          {getPriorityBadge(request.priority)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{request.requester_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{request.requester_email}</span>
                          </div>
                          {request.requester_phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{request.requester_phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span>{request.service_direction}</span>
                          </div>
                        </div>

                        <div>
                          <p className="font-medium mb-1">{request.subject}</p>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {request.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(request.created_at)}
                          </div>
                          {request.assigned_to && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              Atribuída
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setUpdateForm({ status: request.status, adminNotes: request.admin_notes || '' });
                            setShowUpdateDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRequest(request.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Detalhes da Solicitação</DialogTitle>
                <DialogDescription>
                  Informações completas sobre a solicitação de serviço
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Informações do Serviço</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Serviço:</span>
                        <p className="text-sm text-muted-foreground">{selectedRequest.service_name}</p>
                      </div>
                      <div>
                        <span className="font-medium">Direcção:</span>
                        <p className="text-sm text-muted-foreground">{selectedRequest.service_direction}</p>
                      </div>
                      <div>
                        <span className="font-medium">Categoria:</span>
                        <p className="text-sm text-muted-foreground">{selectedRequest.service_category}</p>
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>
                        <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                      </div>
                      <div>
                        <span className="font-medium">Prioridade:</span>
                        <div className="mt-1">{getPriorityBadge(selectedRequest.priority)}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Informações do Requerente</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Nome:</span>
                        <p className="text-sm text-muted-foreground">{selectedRequest.requester_name}</p>
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>
                        <p className="text-sm text-muted-foreground">{selectedRequest.requester_email}</p>
                      </div>
                      {selectedRequest.requester_phone && (
                        <div>
                          <span className="font-medium">Telefone:</span>
                          <p className="text-sm text-muted-foreground">{selectedRequest.requester_phone}</p>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Data de Criação:</span>
                        <p className="text-sm text-muted-foreground">{formatDate(selectedRequest.created_at)}</p>
                      </div>
                      {selectedRequest.updated_at !== selectedRequest.created_at && (
                        <div>
                          <span className="font-medium">Última Atualização:</span>
                          <p className="text-sm text-muted-foreground">{formatDate(selectedRequest.updated_at)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Detalhes da Solicitação</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Assunto:</span>
                      <p className="text-sm text-muted-foreground mt-1">{selectedRequest.subject}</p>
                    </div>
                    <div>
                      <span className="font-medium">Mensagem:</span>
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{selectedRequest.message}</p>
                    </div>
                  </div>
                </div>

                {selectedRequest.admin_notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Notas Administrativas</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedRequest.admin_notes}</p>
                    </div>
                  </>
                )}

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDetailsDialog(false)}
                    className="flex-1"
                  >
                    Fechar
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowDetailsDialog(false);
                      setUpdateForm({ status: selectedRequest.status, adminNotes: selectedRequest.admin_notes || '' });
                      setShowUpdateDialog(true);
                    }}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Atualizar Status
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Atualizar Status da Solicitação</DialogTitle>
            <DialogDescription>
              Atualize o status e adicione notas administrativas
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={updateForm.status} onValueChange={(value) => setUpdateForm({...updateForm, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="adminNotes">Notas Administrativas</Label>
              <Textarea
                id="adminNotes"
                value={updateForm.adminNotes}
                onChange={(e) => setUpdateForm({...updateForm, adminNotes: e.target.value})}
                placeholder="Adicione notas ou observações sobre esta solicitação..."
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button 
                variant="outline" 
                onClick={() => setShowUpdateDialog(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdateStatus}
                className="flex-1"
                disabled={!updateForm.status}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 