import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ExportUtils from "@/lib/export-utils";
import { seedSampleNotifications } from "@/lib/seed-notifications";
import { NotificationDetails } from "./NotificationDetails";
import { 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Mail, 
  User, 
  FileText, 
  Trophy, 
  Calendar,
  Download,
  FileSpreadsheet,
  FileDown,
  ChevronDown,
  Zap,
  Archive,
  RotateCcw,
  Send,
  MessageSquare,
  Star,
  TrendingUp,
  Shield,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  read: boolean;
  created_at: string;
  updated_at: string;
}

type NotificationType = 'interest_registration' | 'new_user' | 'news_published' | 'concurso_created' | 'system_update' | 'maintenance' | 'urgent' | 'info';

export const NotificationsManager = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<NotificationItem | null>(null);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    type: 'info' as NotificationType,
    title: "",
    message: "",
    data: {}
  });

  const notificationTypes = [
    { value: 'interest_registration', label: 'Registo de Interesse', icon: User, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
    { value: 'new_user', label: 'Novo Utilizador', icon: User, color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
    { value: 'news_published', label: 'Notícia Publicada', icon: FileText, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
    { value: 'concurso_created', label: 'Concurso Criado', icon: Trophy, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' },
    { value: 'system_update', label: 'Actualização do Sistema', icon: Zap, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' },
    { value: 'maintenance', label: 'Manutenção', icon: Clock, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' },
    { value: 'urgent', label: 'Urgente', icon: AlertTriangle, color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
    { value: 'info', label: 'Informação', icon: Info, color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400' }
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar notificações",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setNotifications(data || []);
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível carregar as notificações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const notificationData = {
        type: formData.type,
        title: formData.title,
        message: formData.message,
        data: formData.data,
        read: false
      };

      if (editingNotification) {
        const { error } = await supabase
          .from('admin_notifications')
          .update(notificationData)
          .eq('id', editingNotification.id);

        if (error) throw error;

        toast({
          title: "Notificação atualizada",
          description: "A notificação foi atualizada com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('admin_notifications')
          .insert([notificationData]);

        if (error) throw error;

        toast({
          title: "Notificação criada",
          description: "A notificação foi criada com sucesso.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchNotifications();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'info',
      title: "",
      message: "",
      data: {}
    });
    setEditingNotification(null);
  };

  const handleEdit = (notification: NotificationItem) => {
    setEditingNotification(notification);
    setFormData({
      type: notification.type as NotificationType,
      title: notification.title,
      message: notification.message,
      data: notification.data || {}
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro ao excluir",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Notificação excluída",
          description: "A notificação foi excluída com sucesso.",
        });
        fetchNotifications();
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível excluir a notificação.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (id: string, read: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ read })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: read ? "Marcada como lida" : "Marcada como não lida",
        description: `Notificação ${read ? 'lida' : 'não lida'} com sucesso.`,
      });
      fetchNotifications();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (action: 'read' | 'unread' | 'delete') => {
    if (selectedIds.length === 0) {
      toast({
        title: "Nenhuma notificação selecionada",
        description: "Selecione pelo menos uma notificação.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('admin_notifications')
          .delete()
          .in('id', selectedIds);
        
        if (error) throw error;
        
        toast({
          title: "Notificações excluídas",
          description: `${selectedIds.length} notificações foram excluídas.`,
        });
      } else {
        const { error } = await supabase
          .from('admin_notifications')
          .update({ read: action === 'read' })
          .in('id', selectedIds);
        
        if (error) throw error;
        
        toast({
          title: `Notificações marcadas como ${action === 'read' ? 'lidas' : 'não lidas'}`,
          description: `${selectedIds.length} notificações foram atualizadas.`,
        });
      }

      setSelectedIds([]);
      fetchNotifications();
    } catch (error: any) {
      toast({
        title: "Erro na operação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Export functions
  const exportNotificationsToCSV = async () => {
    setExportLoading('csv');
    try {
      const exportData = {
        title: 'Relatório de Notificações',
        subtitle: 'Portal Municipal de Chipindo',
        headers: ['Tipo', 'Título', 'Mensagem', 'Status', 'Data de Criação'],
        rows: filteredNotifications.map(item => [
          getNotificationTypeLabel(item.type),
          item.title,
          item.message.length > 100 ? item.message.substring(0, 100) + '...' : item.message,
          item.read ? 'Lida' : 'Não lida',
          new Date(item.created_at).toLocaleString('pt-AO')
        ]),
        metadata: {
          'Total de Notificações': notifications.length,
          'Não Lidas': notifications.filter(n => !n.read).length,
          'Lidas': notifications.filter(n => n.read).length
        }
      };

      ExportUtils.exportToCSV(exportData, { 
        filename: 'notificacoes-chipindo',
        includeTimestamp: true 
      });
      
      toast({
        title: "Notificações exportadas",
        description: "O relatório foi baixado em formato CSV.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar as notificações.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(null);
    }
  };

  const exportNotificationsToExcel = async () => {
    setExportLoading('excel');
    try {
      const exportData = {
        title: 'Relatório de Notificações',
        subtitle: 'Portal Municipal de Chipindo',
        headers: ['Tipo', 'Título', 'Mensagem', 'Status', 'Data de Criação'],
        rows: filteredNotifications.map(item => [
          getNotificationTypeLabel(item.type),
          item.title,
          item.message,
          item.read ? 'Lida' : 'Não lida',
          new Date(item.created_at).toLocaleString('pt-AO')
        ]),
        metadata: {
          'Total de Notificações': notifications.length,
          'Não Lidas': notifications.filter(n => !n.read).length,
          'Lidas': notifications.filter(n => n.read).length
        }
      };

      ExportUtils.exportToExcel(exportData, { 
        filename: 'notificacoes-chipindo',
        sheetName: 'Notificações',
        author: 'Administração Municipal',
        company: 'Município de Chipindo'
      });
      
      toast({
        title: "Relatório Excel gerado",
        description: "O relatório foi gerado em formato Excel.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o relatório Excel.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(null);
    }
  };

  const exportNotificationsToPDF = async () => {
    setExportLoading('pdf');
    try {
      const exportData = {
        title: 'Relatório de Notificações',
        subtitle: 'Portal Municipal de Chipindo',
        headers: ['Tipo', 'Título', 'Status', 'Data'],
        rows: filteredNotifications.map(item => [
          getNotificationTypeLabel(item.type),
          item.title,
          item.read ? 'Lida' : 'Não lida',
          new Date(item.created_at).toLocaleDateString('pt-AO')
        ]),
        metadata: {
          'Total de Notificações': notifications.length,
          'Não Lidas': notifications.filter(n => !n.read).length,
          'Lidas': notifications.filter(n => n.read).length
        }
      };

      ExportUtils.exportToPDF(exportData, { 
        filename: 'notificacoes-chipindo',
        author: 'Administração Municipal',
        company: 'Município de Chipindo - Província da Huíla'
      });
      
      toast({
        title: "Relatório PDF gerado",
        description: "O relatório foi gerado em formato PDF.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o relatório PDF.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(null);
    }
  };

  const getNotificationTypeLabel = (type: string): string => {
    const typeObj = notificationTypes.find(t => t.value === type);
    return typeObj?.label || type;
  };

  const getNotificationIcon = (type: string) => {
    const typeObj = notificationTypes.find(t => t.value === type);
    const Icon = typeObj?.icon || Info;
    return <Icon className="w-4 h-4" />;
  };

  const getNotificationColor = (type: string): string => {
    const typeObj = notificationTypes.find(t => t.value === type);
    return typeObj?.color || 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'unread' && !notification.read) ||
      (activeTab === 'read' && notification.read);
    
    return matchesSearch && matchesType && matchesTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;



  const handleSeedSampleNotifications = async () => {
    setLoading(true);
    try {
      const success = await seedSampleNotifications();
      if (success) {
        toast({
          title: "Notificações de exemplo criadas",
          description: "9 notificações de exemplo foram adicionadas ao sistema.",
        });
        fetchNotifications();
      } else {
        toast({
          title: "Erro ao criar notificações",
          description: "Não foi possível criar as notificações de exemplo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao criar as notificações de exemplo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-16" />
                </div>
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Notificações</h2>
          <p className="text-muted-foreground">
            Gerencie notificações do sistema e comunicações administrativas
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={exportLoading !== null}
                className="shadow-sm hover:shadow-md transition-all duration-200"
              >
                {exportLoading ? (
                  <div className="w-4 h-4 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Exportar
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span>Exportar Notificações</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={exportNotificationsToCSV} 
                disabled={exportLoading === 'csv'}
                className="py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium">Formato CSV</div>
                    <div className="text-xs text-muted-foreground">Para análise de dados</div>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={exportNotificationsToExcel} 
                disabled={exportLoading === 'excel'}
                className="py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <FileDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">Formato Excel</div>
                    <div className="text-xs text-muted-foreground">Relatório completo</div>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={exportNotificationsToPDF} 
                disabled={exportLoading === 'pdf'}
                className="py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <Download className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="font-medium">Formato PDF</div>
                    <div className="text-xs text-muted-foreground">Documento oficial</div>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="shadow-sm hover:shadow-md transition-all duration-200 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                >
                  <MoreVertical className="w-4 h-4 mr-2" />
                  Ações ({selectedIds.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span>Ações em Lote</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleBulkAction('read')}
                  className="py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium">Marcar como Lidas</div>
                      <div className="text-xs text-muted-foreground">{selectedIds.length} selecionadas</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleBulkAction('unread')}
                  className="py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium">Marcar como Não Lidas</div>
                      <div className="text-xs text-muted-foreground">{selectedIds.length} selecionadas</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive py-3"
                  onClick={() => handleBulkAction('delete')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="font-medium">Excluir Selecionadas</div>
                      <div className="text-xs text-muted-foreground">{selectedIds.length} selecionadas</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Sample Notifications Button */}
          {notifications.length === 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSeedSampleNotifications}
              disabled={loading}
              className="shadow-sm hover:shadow-md transition-all duration-200 bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/20"
            >
              <Star className="w-4 h-4 mr-2" />
              Criar Exemplos
            </Button>
          )}

          {/* New Notification Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Nova Notificação
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
              <DialogHeader className="pb-4 border-b border-border/50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-semibold">
                      {editingNotification ? "Editar Notificação" : "Nova Notificação"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {editingNotification 
                        ? "Edite os detalhes da notificação existente" 
                        : "Crie uma nova notificação para comunicar com os utilizadores"
                      }
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <ScrollArea className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                  {/* Tipo de Notificação Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <Shield className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-base font-semibold">Tipo de Notificação</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type" className="text-sm font-medium">Categoria</Label>
                        <Select 
                          value={formData.type} 
                          onValueChange={(value) => setFormData({ ...formData, type: value as NotificationType })}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Selecione o tipo de notificação" />
                          </SelectTrigger>
                          <SelectContent>
                            {notificationTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value} className="py-2">
                                <div className="flex items-center gap-2">
                                  <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", type.color)}>
                                    <type.icon className="w-3 h-3" />
                                  </div>
                                  <div className="font-medium text-sm">{type.label}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Pré-visualização</Label>
                        <div className="h-10 flex items-center">
                          <div className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-sm border",
                            getNotificationColor(formData.type)
                          )}>
                            <div className="w-4 h-4 rounded bg-white/20 flex items-center justify-center">
                              {getNotificationIcon(formData.type)}
                            </div>
                            {getNotificationTypeLabel(formData.type)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />
                  
                  {/* Conteúdo Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <FileText className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-base font-semibold">Conteúdo da Notificação</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                          <Building2 className="w-3 h-3" />
                          Título da Notificação
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Ex: Nova actualização do sistema disponível"
                          className="h-10"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Título claro e descritivo que aparecerá em destaque
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
                          <MessageSquare className="w-3 h-3" />
                          Mensagem
                        </Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Descreva os detalhes da notificação. Seja claro e conciso para facilitar a compreensão dos utilizadores."
                          rows={4}
                          className="resize-none"
                          required
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            Conteúdo detalhado da notificação
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formData.message.length} caracteres
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Preview Section */}
                  {(formData.title || formData.message) && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                          <Eye className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-base font-semibold">Pré-visualização</h3>
                      </div>
                      
                      <Card className="border-dashed border-2 border-muted-foreground/20">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                              getNotificationColor(formData.type)
                            )}>
                              {getNotificationIcon(formData.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-foreground text-sm">
                                  {formData.title || "Título da notificação"}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {getNotificationTypeLabel(formData.type)}
                                </Badge>
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {formData.message || "Mensagem da notificação aparecerá aqui"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </form>
              </ScrollArea>
              
              <div className="pt-4 border-t border-border/50 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    {editingNotification ? "Modificando notificação existente" : "Criando nova notificação"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="min-w-[80px] h-9"
                      size="sm"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={loading || !formData.title || !formData.message}
                      className="min-w-[100px] h-9 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                      onClick={handleSubmit}
                      size="sm"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Salvando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {editingNotification ? <Edit className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          {editingNotification ? "Actualizar" : "Criar"}
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">Não Lidas</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{unreadCount}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Lidas</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{notifications.length - unreadCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Hoje</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {notifications.filter(n => new Date(n.created_at).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Pesquisar notificações..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {notificationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Notifications List */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Todas ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Não Lidas ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="read" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Lidas ({notifications.length - unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 bg-muted/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">
                  {searchQuery || typeFilter !== 'all' ? 'Nenhuma notificação encontrada' : 'Nenhuma notificação disponível'}
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  {searchQuery || typeFilter !== 'all' ? 'Tente ajustar os filtros de pesquisa' : 'As notificações aparecerão aqui conforme forem criadas'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card key={notification.id} className={cn(
                  "border-0 shadow-sm hover:shadow-md transition-all duration-200",
                  !notification.read && "bg-blue-50/50 dark:bg-blue-950/10"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Selection Checkbox */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(notification.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds([...selectedIds, notification.id]);
                            } else {
                              setSelectedIds(selectedIds.filter(id => id !== notification.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </div>

                      {/* Notification Icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        getNotificationColor(notification.type)
                      )}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h4 className={cn(
                              "font-semibold truncate",
                              !notification.read && "text-foreground font-bold"
                            )}>
                              {notification.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {getNotificationTypeLabel(notification.type)}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(notification.created_at)}
                            </span>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id, !notification.read)}>
                                  {notification.read ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                  {notification.read ? 'Marcar como não lida' : 'Marcar como lida'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(notification)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem 
                                      onSelect={(e) => e.preventDefault()}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="max-w-md">
                                    <AlertDialogHeader className="pb-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center">
                                          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div>
                                          <AlertDialogTitle className="text-lg font-semibold">Confirmar Exclusão</AlertDialogTitle>
                                          <AlertDialogDescription className="text-muted-foreground mt-1">
                                            Esta ação não pode ser desfeita
                                          </AlertDialogDescription>
                                        </div>
                                      </div>
                                    </AlertDialogHeader>
                                    
                                    <div className="py-4 space-y-3">
                                      <p className="text-sm text-muted-foreground">
                                        Tem certeza que deseja excluir esta notificação?
                                      </p>
                                      
                                      <div className="p-3 rounded-lg bg-muted/50 border border-dashed">
                                        <div className="flex items-center gap-2 mb-1">
                                          <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", getNotificationColor(notification.type))}>
                                            {getNotificationIcon(notification.type)}
                                          </div>
                                          <span className="font-medium text-sm">{notification.title}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          {notification.message.length > 60 
                                            ? notification.message.substring(0, 60) + '...' 
                                            : notification.message
                                          }
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <AlertDialogFooter className="pt-4 border-t border-border/50">
                                      <AlertDialogCancel className="min-w-[100px]">
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDelete(notification.id)}
                                        className="min-w-[100px] bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
                                      >
                                        <div className="flex items-center gap-2">
                                          <Trash2 className="w-4 h-4" />
                                          Excluir
                                        </div>
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <p className={cn(
                          "text-sm text-muted-foreground leading-relaxed",
                          !notification.read && "text-foreground/80"
                        )}>
                          {notification.message}
                        </p>

                        {notification.data && Object.keys(notification.data).length > 0 && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Detalhes:</p>
                            <NotificationDetails type={notification.type} data={notification.data} />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};