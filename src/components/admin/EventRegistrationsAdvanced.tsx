import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Bell,
  Send,
  Download,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Settings,
  Archive,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  Table as TableIcon,
  Mail,
  MessageSquare,
  CalendarDays,
  MapPin as LocationIcon,
  UserCheck,
  UserX,
  CheckCircle2,
  XCircle2,
  Clock2,
  FileText,
  MoreVertical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface EventRegistrationsAdvancedProps {
  registrations: any[];
  onBulkAction: (action: string, selectedIds: number[]) => void;
  onSendNotification: (message: string, selectedIds: number[]) => void;
}

const EventRegistrationsAdvanced: React.FC<EventRegistrationsAdvancedProps> = ({
  registrations,
  onBulkAction,
  onSendNotification
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [sendingNotification, setSendingNotification] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortBy, setSortBy] = useState('registration_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(registrations.map(reg => reg.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRegistration = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    try {
      await onBulkAction('status', selectedIds);
      setSelectedIds([]);
      setShowBulkActionsModal(false);
      
      toast({
        title: "Atualização em lote",
        description: `${selectedIds.length} inscrições atualizadas`,
      });
    } catch (error) {
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar as inscrições selecionadas.",
        variant: "destructive"
      });
    }
  };

  const handleSendNotification = async () => {
    try {
      setSendingNotification(true);
      await onSendNotification(notificationMessage, selectedIds);
      
      setShowNotificationModal(false);
      setNotificationMessage('');
      setSelectedIds([]);
      
      toast({
        title: "Notificação enviada",
        description: "A notificação foi enviada com sucesso para os participantes selecionados.",
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar a notificação.",
        variant: "destructive"
      });
    } finally {
      setSendingNotification(false);
    }
  };

  const stats = {
    total: registrations.length,
    confirmed: registrations.filter(r => r.status === 'confirmed').length,
    pending: registrations.filter(r => r.status === 'pending').length,
    cancelled: registrations.filter(r => r.status === 'cancelled').length,
    attended: registrations.filter(r => r.status === 'attended').length,
    confirmedPercentage: registrations.length > 0 ? (registrations.filter(r => r.status === 'confirmed').length / registrations.length) * 100 : 0,
    pendingPercentage: registrations.length > 0 ? (registrations.filter(r => r.status === 'pending').length / registrations.length) * 100 : 0,
    cancelledPercentage: registrations.length > 0 ? (registrations.filter(r => r.status === 'cancelled').length / registrations.length) * 100 : 0,
    attendedPercentage: registrations.length > 0 ? (registrations.filter(r => r.status === 'attended').length / registrations.length) * 100 : 0
  };

  return (
    <div className="space-y-6">
      {/* Advanced Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <TableIcon className="w-4 h-4" />
                  Tabela
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                >
                  <Grid className="w-4 h-4" />
                  Cards
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowBulkActionsModal(true)}
                disabled={selectedIds.length === 0}
              >
                <Settings className="w-4 h-4 mr-2" />
                Ações em Lote ({selectedIds.length})
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="actions">Ações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Confirmados</span>
                    <span className="font-semibold">{stats.confirmed} ({stats.confirmedPercentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={stats.confirmedPercentage} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span>Pendentes</span>
                    <span className="font-semibold">{stats.pending} ({stats.pendingPercentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={stats.pendingPercentage} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span>Cancelados</span>
                    <span className="font-semibold">{stats.cancelled} ({stats.cancelledPercentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={stats.cancelledPercentage} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span>Presentes</span>
                    <span className="font-semibold">{stats.attended} ({stats.attendedPercentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={stats.attendedPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inscrições por Evento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Festival Cultural</span>
                    <span className="font-semibold">2 inscrições</span>
                  </div>
                  <Progress value={66.7} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span>Workshop Empreendedorismo</span>
                    <span className="font-semibold">1 inscrição</span>
                  </div>
                  <Progress value={33.3} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-gray-600">Total de Inscrições</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.confirmed}</p>
                    <p className="text-xs text-gray-600">Taxa de Confirmação</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.attended}</p>
                    <p className="text-xs text-gray-600">Taxa de Presença</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notificações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    className="w-full" 
                    onClick={() => setShowNotificationModal(true)}
                    disabled={selectedIds.length === 0}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Notificação ({selectedIds.length} selecionados)
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enviar Lembrete Geral
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Ações em Lote
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    className="w-full" 
                    onClick={() => setShowBulkActionsModal(true)}
                    disabled={selectedIds.length === 0}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Confirmar Selecionados ({selectedIds.length})
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Archive className="w-4 h-4 mr-2" />
                    Exportar Selecionados
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bulk Actions Modal */}
      <Dialog open={showBulkActionsModal} onOpenChange={setShowBulkActionsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ações em Lote</DialogTitle>
            <DialogDescription>
              Aplicar ações a {selectedIds.length} inscrições selecionadas
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleBulkStatusUpdate('confirmed')}
                className="w-full"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirmar Todos
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkStatusUpdate('cancelled')}
                className="w-full"
              >
                <XCircle2 className="w-4 h-4 mr-2" />
                Cancelar Todos
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={() => {
                setShowBulkActionsModal(false);
                setShowNotificationModal(true);
              }}
              className="w-full"
            >
              <Bell className="w-4 h-4 mr-2" />
              Enviar Notificação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Modal */}
      <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Notificação</DialogTitle>
            <DialogDescription>
              Enviar mensagem para {selectedIds.length} participantes selecionados
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="notification-message">Mensagem</Label>
              <Textarea
                id="notification-message"
                placeholder="Digite sua mensagem..."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSendNotification}
                disabled={!notificationMessage.trim() || sendingNotification}
                className="flex-1"
              >
                {sendingNotification ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNotificationModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventRegistrationsAdvanced; 