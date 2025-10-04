import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock as PendingIcon,
  User,
  Building,
  AlertTriangle,
  CheckCircle2,
  XCircle2,
  Clock2,
  FileText,
  Send,
  Bell,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  TrendingUp,
  Mail as EmailIcon,
  MessageSquare,
  CalendarDays,
  MapPin as LocationIcon,
  UserCheck,
  UserX,
  RefreshCw,
  Settings,
  Archive,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  Grid,
  Table as TableIcon,
  Activity,
  Target,
  Award,
  Zap,
  PieChart,
  BarChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEventRegistrationsAdmin, type EventRegistration, type RegistrationStats } from "@/hooks/useEventRegistrationsAdmin";
import EventRegistrationsManager from "./EventRegistrationsManager";
import EventRegistrationsAdvanced from "./EventRegistrationsAdvanced";

interface EventRegistrationsDashboardProps {
  eventId?: number;
}

const EventRegistrationsDashboard: React.FC<EventRegistrationsDashboardProps> = ({ eventId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  const {
    registrations,
    filteredRegistrations,
    events,
    loading,
    error,
    stats,
    fetchRegistrations,
    filterRegistrations,
    updateRegistrationStatus,
    bulkUpdateStatus,
    sendNotification,
    exportRegistrations,
    getEventStats,
    getCategoryStats
  } = useEventRegistrationsAdmin();

  useEffect(() => {
    fetchRegistrations({ eventId });
  }, [eventId]);

  const handleBulkAction = async (action: string, selectedIds: number[]) => {
    if (action === 'status') {
      await bulkUpdateStatus(selectedIds, 'confirmed');
    }
  };

  const handleSendNotification = async (message: string, selectedIds: number[]) => {
    await sendNotification(message, selectedIds);
  };

  const handleExport = async () => {
    await exportRegistrations();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'attended': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      case 'attended': return 'Presente';
      default: return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cultural': return 'Cultural';
      case 'business': return 'Negócios';
      case 'sports': return 'Desporto';
      case 'educational': return 'Educacional';
      case 'community': return 'Comunitário';
      default: return category;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-AO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const categoryStats = getCategoryStats();

  if (loading && registrations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard de Inscrições</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {eventId ? 'Gestão de inscrições para evento específico' : 'Gestão completa de inscrições em eventos'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Modo Simples
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Modo Avançado
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
                <p className="text-xs text-gray-600">Confirmados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <PendingIcon className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.cancelled}</p>
                <p className="text-xs text-gray-600">Cancelados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.attended}</p>
                <p className="text-xs text-gray-600">Presentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="registrations">Inscrições</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="actions">Ações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredRegistrations.slice(0, 5).map((registration) => (
                  <div key={registration.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{registration.participant_name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Inscrito em {registration.event_title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(registration.status)}>
                        {getStatusLabel(registration.status)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(registration.registration_date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.confirmedPercentage.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">Taxa de Confirmação</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.attendedPercentage.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">Taxa de Presença</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{events.length}</p>
                    <p className="text-xs text-gray-600">Total de Eventos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="registrations" className="space-y-6">
          {showAdvanced ? (
            <EventRegistrationsAdvanced
              registrations={filteredRegistrations}
              onBulkAction={handleBulkAction}
              onSendNotification={handleSendNotification}
            />
          ) : (
            <EventRegistrationsManager eventId={eventId} />
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Distribuição por Status
                </CardTitle>
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
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Inscrições por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(categoryStats).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span>{getCategoryLabel(category)}</span>
                      <span className="font-semibold">{count} inscrições</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Detalhes por Evento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => {
                  const eventRegistrations = registrations.filter(reg => reg.event_id === event.id);
                  const eventStats = {
                    total: eventRegistrations.length,
                    confirmed: eventRegistrations.filter(r => r.status === 'confirmed').length,
                    pending: eventRegistrations.filter(r => r.status === 'pending').length,
                    cancelled: eventRegistrations.filter(r => r.status === 'cancelled').length,
                    attended: eventRegistrations.filter(r => r.status === 'attended').length
                  };

                  return (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.location}</p>
                        </div>
                        <Badge variant="outline">
                          {getCategoryLabel(event.category)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="font-semibold ml-1">{eventStats.total}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Confirmados:</span>
                          <span className="font-semibold ml-1 text-green-600">{eventStats.confirmed}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Pendentes:</span>
                          <span className="font-semibold ml-1 text-yellow-600">{eventStats.pending}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Cancelados:</span>
                          <span className="font-semibold ml-1 text-red-600">{eventStats.cancelled}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Presentes:</span>
                          <span className="font-semibold ml-1 text-blue-600">{eventStats.attended}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
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
                  <Button className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Notificação Geral
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enviar Lembrete
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar Dados
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
                  <Button className="w-full">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Confirmar Todos Pendentes
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Archive className="w-4 h-4 mr-2" />
                    Exportar Relatório
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventRegistrationsDashboard; 