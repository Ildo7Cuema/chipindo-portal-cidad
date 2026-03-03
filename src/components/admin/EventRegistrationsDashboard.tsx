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
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard de Inscrições</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {eventId ? 'Gestão de inscrições para evento específico' : 'Gestão completa de inscrições em eventos'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full shadow-sm text-xs h-8 px-3"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? (
              <>
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Modo Simples
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Modo Avançado
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="rounded-full shadow-sm text-xs h-8 px-3" onClick={handleExport}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-foreground">{stats.total}</p>
                <p className="text-xs font-medium text-muted-foreground mt-0.5 uppercase tracking-wider">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-foreground">{stats.confirmed}</p>
                <p className="text-xs font-medium text-muted-foreground mt-0.5 uppercase tracking-wider">Confirmados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl">
                <PendingIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-foreground">{stats.pending}</p>
                <p className="text-xs font-medium text-muted-foreground mt-0.5 uppercase tracking-wider">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-foreground">{stats.cancelled}</p>
                <p className="text-xs font-medium text-muted-foreground mt-0.5 uppercase tracking-wider">Cancelados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-foreground">{stats.attended}</p>
                <p className="text-xs font-medium text-muted-foreground mt-0.5 uppercase tracking-wider">Presentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex h-auto gap-2 bg-transparent p-0 min-w-max">
            <TabsTrigger value="overview" className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:bg-background transition-all">Visão Geral</TabsTrigger>
            <TabsTrigger value="registrations" className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:bg-background transition-all">Inscrições</TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:bg-background transition-all">Análises</TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:bg-background transition-all">Ações</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6 mt-0">
          {/* Recent Activity */}
          <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-3">
                {filteredRegistrations.slice(0, 5).map((registration) => (
                  <div key={registration.id} className="flex items-center justify-between p-3.5 bg-gray-50/50 hover:bg-gray-50 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-colors border border-border/40 rounded-xl">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm tracking-tight truncate">{registration.participant_name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-none">
                          Inscrito em {registration.event_title}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center items-end gap-2 shrink-0">
                      <Badge className={cn("text-[10px] uppercase font-bold tracking-wider py-0 rounded-full", getStatusColor(registration.status))} variant="secondary">
                        {getStatusLabel(registration.status)}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
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
            <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Tx de Confirmação
                    </p>
                    <p className="text-2xl font-bold tracking-tight text-foreground">
                      {stats.confirmedPercentage.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 rounded-xl">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Tx de Presença
                    </p>
                    <p className="text-2xl font-bold tracking-tight text-foreground">
                      {stats.attendedPercentage.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 rounded-xl">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Total Em Eventos
                    </p>
                    <p className="text-2xl font-bold tracking-tight text-foreground">
                      {events.length}
                    </p>
                  </div>
                  <div className="p-2 bg-purple-50 text-purple-600 dark:bg-purple-900/20 rounded-xl">
                    <TrendingUp className="w-4 h-4" />
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

        <TabsContent value="analytics" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-bold tracking-tight flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-muted-foreground" />
                  Distribuição por Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">Confirmados</span>
                      <span className="font-bold font-mono">{stats.confirmed} ({stats.confirmedPercentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={stats.confirmedPercentage} className="h-1.5 [&>div]:bg-emerald-500 bg-emerald-100 dark:bg-emerald-950" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-amber-600 dark:text-amber-400">Pendentes</span>
                      <span className="font-bold font-mono">{stats.pending} ({stats.pendingPercentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={stats.pendingPercentage} className="h-1.5 [&>div]:bg-amber-500 bg-amber-100 dark:bg-amber-950" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-rose-600 dark:text-rose-400">Cancelados</span>
                      <span className="font-bold font-mono">{stats.cancelled} ({stats.cancelledPercentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={stats.cancelledPercentage} className="h-1.5 [&>div]:bg-rose-500 bg-rose-100 dark:bg-rose-950" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">Presentes</span>
                      <span className="font-bold font-mono">{stats.attended} ({stats.attendedPercentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={stats.attendedPercentage} className="h-1.5 [&>div]:bg-indigo-500 bg-indigo-100 dark:bg-indigo-950" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-bold tracking-tight flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-muted-foreground" />
                  Inscrições por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  {Object.entries(categoryStats).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                      <span className="text-sm font-medium">{getCategoryLabel(category)}</span>
                      <Badge variant="secondary" className="px-2 py-0.5 rounded-md font-mono text-xs">{count} insc.</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Details */}
          <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-base font-bold tracking-tight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Detalhes por Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid gap-4 sm:grid-cols-2">
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
                    <div key={event.id} className="p-5 border border-border/60 rounded-xl bg-gray-50/30 dark:bg-slate-800/20 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-start justify-between mb-4 gap-4">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm tracking-tight truncate">{event.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{event.location}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-medium py-0 rounded-md shrink-0">
                          {getCategoryLabel(event.category)}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Tot:</span>
                          <span className="font-bold font-mono">{eventStats.total}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Conf:</span>
                          <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{eventStats.confirmed}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Pend:</span>
                          <span className="font-bold font-mono text-amber-600 dark:text-amber-400">{eventStats.pending}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Canc:</span>
                          <span className="font-bold font-mono text-rose-600 dark:text-rose-400">{eventStats.cancelled}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Pres:</span>
                          <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">{eventStats.attended}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-bold tracking-tight flex items-center gap-2">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  Gatilhos de Comunicação
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-3">
                  <Button className="w-full text-sm h-10 rounded-xl shadow-sm justify-start">
                    <Mail className="w-4 h-4 mr-3 text-white/70" />
                    Enviar Notificação Geral
                  </Button>

                  <Button variant="outline" className="w-full text-sm h-10 rounded-xl justify-start bg-gray-50/50 hover:bg-gray-100 dark:bg-slate-800/50 dark:hover:bg-slate-800">
                    <MessageSquare className="w-4 h-4 mr-3 text-muted-foreground" />
                    Disparar Lembrete SMS / Email
                  </Button>

                  <Button variant="outline" className="w-full text-sm h-10 rounded-xl justify-start bg-gray-50/50 hover:bg-gray-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border-dashed">
                    <RefreshCw className="w-4 h-4 mr-3 text-muted-foreground" />
                    Forçar Sincronização de Dados
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-bold tracking-tight flex items-center gap-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Utilitários Administrativos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-3">
                  <Button className="w-full text-sm h-10 rounded-xl shadow-sm justify-start bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                    <CheckCircle2 className="w-4 h-4 mr-3 text-white/70" />
                    Auto-Aprovar Inscrições Pendentes
                  </Button>

                  <Button variant="outline" className="w-full text-sm h-10 rounded-xl justify-start bg-gray-50/50 hover:bg-gray-100 dark:bg-slate-800/50 dark:hover:bg-slate-800">
                    <Archive className="w-4 h-4 mr-3 text-muted-foreground" />
                    Exportar Base de Dados Compl. (.csv)
                  </Button>

                  <Button variant="outline" className="w-full text-sm h-10 rounded-xl justify-start bg-gray-50/50 hover:bg-gray-100 dark:bg-slate-800/50 dark:hover:bg-slate-800">
                    <FileText className="w-4 h-4 mr-3 text-muted-foreground" />
                    Gerar Relatório Resumo em PDF
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