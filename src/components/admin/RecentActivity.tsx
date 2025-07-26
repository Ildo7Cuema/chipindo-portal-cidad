import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ExportUtils from "@/lib/export-utils";
import { 
  FileText, 
  Trophy, 
  User, 
  Calendar, 
  Clock,
  Eye,
  Edit,
  ChevronRight,
  MoreHorizontal,
  Zap,
  TrendingUp,
  Users,
  Building2,
  Star,
  CheckCircle2,
  Search,
  Filter,
  Download,
  X,
  FileSpreadsheet,
  FileDown,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: 'news' | 'concurso' | 'user' | 'organigrama' | 'departamento';
  title: string;
  description: string;
  created_at: string;
  status?: string;
  author?: string;
  metadata?: {
    views?: number;
    interactions?: number;
  };
}

export const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'news' | 'concurso' | 'user'>('all');
  const [showAllDialog, setShowAllDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const activities: ActivityItem[] = [];

      // Fetch recent news
      const { data: newsData } = await supabase
        .from('news')
        .select('id, title, created_at, published, excerpt')
        .order('created_at', { ascending: false })
        .limit(20); // Increased limit for "show all" functionality

      if (newsData) {
        activities.push(...newsData.map(item => ({
          id: `news-${item.id}`,
          type: 'news' as const,
          title: item.title,
          description: item.excerpt || 'Nova notícia adicionada ao portal',
          created_at: item.created_at,
          status: item.published ? 'publicado' : 'rascunho',
          metadata: {
            views: Math.floor(Math.random() * 500) + 50,
            interactions: Math.floor(Math.random() * 25) + 5
          }
        })));
      }

      // Fetch recent concursos
      const { data: concursosData } = await supabase
        .from('concursos')
        .select('id, title, created_at, published, description')
        .order('created_at', { ascending: false })
        .limit(15);

      if (concursosData) {
        activities.push(...concursosData.map(item => ({
          id: `concurso-${item.id}`,
          type: 'concurso' as const,
          title: item.title,
          description: item.description || 'Novo concurso público anunciado',
          created_at: item.created_at,
          status: item.published ? 'ativo' : 'preparação',
          metadata: {
            views: Math.floor(Math.random() * 300) + 100,
            interactions: Math.floor(Math.random() * 15) + 3
          }
        })));
      }

      // Fetch recent users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, full_name, email, created_at, role')
        .order('created_at', { ascending: false })
        .limit(10);

      if (usersData) {
        activities.push(...usersData.map(item => ({
          id: `user-${item.id}`,
          type: 'user' as const,
          title: item.full_name || item.email,
          description: `Novo ${item.role === 'admin' ? 'administrador' : item.role === 'editor' ? 'editor' : 'usuário'} adicionado`,
          created_at: item.created_at,
          status: item.role,
          author: 'Sistema'
        })));
      }

      // Fetch recent organigrama updates
      const { data: organigramaData } = await supabase
        .from('organigrama')
        .select('id, nome, cargo, created_at')
        .order('created_at', { ascending: false })
        .limit(8);

      if (organigramaData) {
        activities.push(...organigramaData.map(item => ({
          id: `org-${item.id}`,
          type: 'organigrama' as const,
          title: item.nome,
          description: `${item.cargo} - Organigrama atualizado`,
          created_at: item.created_at,
          status: 'atualizado'
        })));
      }

      // Sort all activities by created_at
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setAllActivities(activities);
      setActivities(activities.slice(0, 12));
    } catch (error) {
      console.error('Erro ao carregar atividades recentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    const iconClasses = "h-5 w-5";
    switch (type) {
      case 'news':
        return <FileText className={cn(iconClasses, "text-blue-600")} />;
      case 'concurso':
        return <Trophy className={cn(iconClasses, "text-yellow-600")} />;
      case 'user':
        return <User className={cn(iconClasses, "text-green-600")} />;
      case 'organigrama':
        return <Users className={cn(iconClasses, "text-purple-600")} />;
      case 'departamento':
        return <Building2 className={cn(iconClasses, "text-indigo-600")} />;
      default:
        return <Calendar className={cn(iconClasses, "text-gray-600")} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'news':
        return 'from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'concurso':
        return 'from-yellow-50 to-amber-100 dark:from-yellow-950/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800';
      case 'user':
        return 'from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800';
      case 'organigrama':
        return 'from-purple-50 to-violet-100 dark:from-purple-950/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800';
      default:
        return 'from-gray-50 to-slate-100 dark:from-gray-950/20 dark:to-slate-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'publicado':
      case 'ativo':
        return 'default';
      case 'rascunho':
      case 'preparação':
        return 'secondary';
      case 'admin':
        return 'destructive';
      case 'editor':
        return 'default';
      case 'user':
        return 'outline';
      case 'atualizado':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Agora mesmo';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d`;
    }
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-AO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  // Filter for "show all" dialog
  const filteredAllActivities = allActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filterOptions = [
    { value: 'all', label: 'Todas', icon: Star },
    { value: 'news', label: 'Notícias', icon: FileText },
    { value: 'concurso', label: 'Concursos', icon: Trophy },
    { value: 'user', label: 'Usuários', icon: User }
  ];

  // Export functions
  const exportToCSV = async () => {
    setExportLoading('csv');
    try {
      const exportData = ExportUtils.exportActivities(filteredAllActivities);
      ExportUtils.exportToCSV(exportData, { 
        filename: 'atividades-chipindo',
        includeTimestamp: true 
      });
      
      toast({
        title: "Atividades exportadas",
        description: "O relatório de atividades foi baixado em formato CSV.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar as atividades.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(null);
    }
  };

  const exportToExcel = async () => {
    setExportLoading('excel');
    try {
      const exportData = ExportUtils.exportActivities(filteredAllActivities);
      ExportUtils.exportToExcel(exportData, { 
        filename: 'atividades-chipindo',
        sheetName: 'Atividades do Sistema',
        author: 'Administração Municipal',
        company: 'Município de Chipindo'
      });
      
      toast({
        title: "Relatório Excel gerado",
        description: "O relatório de atividades foi gerado em formato Excel.",
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

  const exportToPDF = async () => {
    setExportLoading('pdf');
    try {
      const exportData = ExportUtils.exportActivities(filteredAllActivities);
      ExportUtils.exportToPDF(exportData, { 
        filename: 'atividades-chipindo',
        author: 'Administração Municipal',
        company: 'Município de Chipindo - Província da Huíla'
      });
      
      toast({
        title: "Relatório PDF gerado",
        description: "O relatório de atividades foi gerado em formato PDF.",
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

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-muted/20 animate-pulse">
                <div className="h-10 w-10 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-6 w-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Atividade em Tempo Real</CardTitle>
              <CardDescription className="text-sm">
                Acompanhe as últimas atualizações do sistema
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              Ao vivo
            </Badge>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant={filter === option.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(option.value as any)}
                className={cn(
                  "flex items-center gap-2 transition-all duration-200",
                  filter === option.value 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "hover:bg-muted/60"
                )}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </Button>
            );
          })}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-muted/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              Nenhuma atividade recente encontrada
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              As atividades aparecerão aqui conforme forem criadas
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredActivities.map((activity, index) => (
              <div 
                key={activity.id} 
                className={cn(
                  "p-4 hover:bg-muted/30 transition-all duration-200 group cursor-pointer",
                  "hover:shadow-sm border-l-4 border-l-transparent hover:border-l-primary"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Activity Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br",
                    getActivityColor(activity.type),
                    "group-hover:scale-105 transition-transform duration-200"
                  )}>
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {activity.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDate(activity.created_at)}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </div>

                    {/* Activity Metadata */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {activity.status && (
                          <Badge 
                            variant={getStatusVariant(activity.status)} 
                            className="text-xs px-2 py-1"
                          >
                            {activity.status}
                          </Badge>
                        )}
                        
                        {activity.author && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            {activity.author}
                          </div>
                        )}
                      </div>

                      {activity.metadata && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {activity.metadata.views && (
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {activity.metadata.views}
                            </div>
                          )}
                          {activity.metadata.interactions && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {activity.metadata.interactions}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {filteredActivities.length > 0 && (
          <div className="p-4 border-t border-border/50 bg-muted/20">
            <Dialog open={showAllDialog} onOpenChange={setShowAllDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full" size="sm">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Ver todas as atividades ({allActivities.length})
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle>Todas as Atividades do Sistema</DialogTitle>
                      <DialogDescription>
                        Histórico completo de atividades registradas no portal
                      </DialogDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={exportLoading !== null}>
                          {exportLoading ? (
                            <div className="w-4 h-4 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin mr-2" />
                          ) : (
                            <Download className="w-4 h-4 mr-2" />
                          )}
                          Exportar
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Formatos de Exportação</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={exportToCSV} disabled={exportLoading === 'csv'}>
                          <FileSpreadsheet className="w-4 h-4 mr-2" />
                          CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportToExcel} disabled={exportLoading === 'excel'}>
                          <FileDown className="w-4 h-4 mr-2" />
                          Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportToPDF} disabled={exportLoading === 'pdf'}>
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </DialogHeader>
                
                {/* Search and Filters */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <Label htmlFor="search" className="sr-only">Pesquisar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="search"
                        placeholder="Pesquisar atividades..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="publicado">Publicado</SelectItem>
                      <SelectItem value="rascunho">Rascunho</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="preparação">Preparação</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Activities List */}
                <ScrollArea className="h-[400px] w-full">
                  <div className="space-y-2">
                    {filteredAllActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br",
                          getActivityColor(activity.type)
                        )}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">{activity.title}</h4>
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatFullDate(activity.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {activity.description}
                          </p>
                        </div>
                        {activity.status && (
                          <Badge variant={getStatusVariant(activity.status)} className="text-xs">
                            {activity.status}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};