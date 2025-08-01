import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/ui/stat-card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  Users, 
  Trophy, 
  Eye, 
  TrendingUp, 
  Calendar, 
  Building2, 
  FolderOpen,
  Activity,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  PieChart,
  Newspaper,
  UserCheck,
  Globe,
  Zap,
  Target,
  Shield,
  Heart,
  Star,
  Download,
  FileSpreadsheet,
  FileDown
} from "lucide-react";
import { RecentActivity } from "./RecentActivity";
import { useRealTimeStats } from "@/hooks/useRealTimeStats";
import ExportUtils from "@/lib/export-utils";
import { cn } from "@/lib/utils";

interface DashboardData {
  totalNews: number;
  publishedNews: number;
  totalConcursos: number;
  activeConcursos: number;
  totalUsers: number;
  recentActivity: {
    news: number;
    concursos: number;
  };
}

export const DashboardStats = () => {
  const { stats } = useRealTimeStats();
  const [activeView, setActiveView] = useState("overview");
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  // Calculate derived stats
  const publicationRate = stats.totalNews > 0 ? Math.round((stats.publishedNews / stats.totalNews) * 100) : 0;
  const transparencyRate = stats.totalAcervoItems > 0 ? Math.round((stats.publicAcervoItems / stats.totalAcervoItems) * 100) : 0;
  const activeRate = stats.totalConcursos > 0 ? Math.round((stats.activeConcursos / stats.totalConcursos) * 100) : 0;

  // Export functionality
  const exportToCSV = async () => {
    setExportLoading('csv');
    try {
      const exportData = ExportUtils.exportDashboardStats(stats);
      ExportUtils.exportToCSV(exportData, { 
        filename: 'dashboard-chipindo',
        includeTimestamp: true 
      });
      
      toast({
        title: "Relatório CSV exportado",
        description: "O relatório foi baixado com sucesso em formato CSV.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o relatório CSV.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(null);
    }
  };

  const exportToPDF = async () => {
    setExportLoading('pdf');
    try {
      const exportData = ExportUtils.exportDashboardStats(stats);
      ExportUtils.exportToPDF(exportData, { 
        filename: 'dashboard-chipindo',
        author: 'Administração Municipal',
        company: 'Município de Chipindo - Província da Huíla'
      });
      
      toast({
        title: "Relatório PDF gerado",
        description: "O relatório foi gerado e baixado com sucesso em formato PDF.",
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

  const exportToExcel = async () => {
    setExportLoading('excel');
    try {
      const exportData = ExportUtils.exportDashboardStats(stats);
      ExportUtils.exportToExcel(exportData, { 
        filename: 'dashboard-chipindo',
        sheetName: 'Dashboard Executivo',
        author: 'Administração Municipal',
        company: 'Município de Chipindo'
      });
      
      toast({
        title: "Relatório Excel gerado",
        description: "O relatório foi gerado e baixado com sucesso em formato Excel.",
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

  // Quick actions functionality
  const navigateToNews = () => {
    // This would trigger tab change in parent component
    window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: 'news' } }));
    toast({
      title: "Navegando",
      description: "Redirecionando para a seção de notícias...",
    });
  };

  const navigateToConcursos = () => {
    window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: 'concursos' } }));
    toast({
      title: "Navegando",
      description: "Redirecionando para a seção de concursos...",
    });
  };

  const navigateToAcervo = () => {
    window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: 'acervo' } }));
    toast({
      title: "Navegando",
      description: "Redirecionando para o acervo digital...",
    });
  };

  const navigateToUsers = () => {
    window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: 'users' } }));
    toast({
      title: "Navegando",
      description: "Redirecionando para gestão de usuários...",
    });
  };

  if (stats.loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-6 border rounded-xl">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 w-5 bg-muted rounded" />
                  <div className="h-4 w-12 bg-muted rounded" />
                </div>
                <div className="h-8 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard Executivo
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do desempenho e atividade do portal municipal
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Sistema Online
          </Badge>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToCSV}
              disabled={exportLoading === 'csv'}
            >
              {exportLoading === 'csv' ? (
                <div className="w-4 h-4 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin mr-2" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 mr-2" />
              )}
              CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToExcel}
              disabled={exportLoading === 'excel'}
            >
              {exportLoading === 'excel' ? (
                <div className="w-4 h-4 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin mr-2" />
              ) : (
                <FileDown className="w-4 h-4 mr-2" />
              )}
              Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToPDF}
              disabled={exportLoading === 'pdf'}
            >
              {exportLoading === 'pdf' ? (
                <div className="w-4 h-4 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={Activity}
          label="Status Geral"
          value="Excelente"
          description="Sistema funcionando perfeitamente"
          variant="glass"
          trend={{ value: 12, isPositive: true }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800"
        />
        
        <StatCard
          icon={Users}
          label="Usuários Ativos"
          value={stats.totalUsers}
          description="Total de administradores"
          variant="glass"
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800"
        />
        
        <StatCard
          icon={Globe}
          label="Taxa de Transparência"
          value={`${transparencyRate}%`}
          description="Documentos públicos"
          variant="glass"
          trend={{ value: transparencyRate >= 80 ? 5 : -2, isPositive: transparencyRate >= 80 }}
          className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800"
        />
        
        <StatCard
          icon={Zap}
          label="Eficiência"
          value={`${publicationRate}%`}
          description="Taxa de publicação"
          variant="glass"
          trend={{ value: publicationRate >= 70 ? 8 : -3, isPositive: publicationRate >= 70 }}
          className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 border-orange-200 dark:border-orange-800"
        />
      </div>

      {/* Main Stats Grid */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Conteúdo
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Engajamento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={FileText}
              label="Total de Notícias"
              value={stats.totalNews}
              description={`${stats.publishedNews} publicadas`}
              trend={{ value: 15, isPositive: true }}
              size="md"
            />

            <StatCard
              icon={Trophy}
              label="Concursos"
              value={stats.totalConcursos}
              description={`${stats.activeConcursos} ativos`}
              trend={{ value: activeRate >= 50 ? 8 : -5, isPositive: activeRate >= 50 }}
              size="md"
            />

            <StatCard
              icon={Building2}
              label="Direcções"
              value={stats.totalDirecoes}
              description="Áreas de atuação"
              size="md"
            />

            <StatCard
              icon={Users}
              label="Organigrama"
              value={stats.totalOrganigramaMembers}
              description="Membros ativos"
              size="md"
            />

            <StatCard
              icon={FolderOpen}
              label="Acervo Digital"
              value={stats.totalAcervoItems}
              description={`${stats.publicAcervoItems} públicos`}
              trend={{ value: 22, isPositive: true }}
              size="md"
            />

            <StatCard
              icon={Eye}
              label="Taxa de Publicação"
              value={`${publicationRate}%`}
              description="Notícias publicadas"
              trend={{ value: publicationRate >= 80 ? 10 : -5, isPositive: publicationRate >= 80 }}
              size="md"
            />

            <StatCard
              icon={Shield}
              label="Transparência"
              value={`${transparencyRate}%`}
              description="Documentos públicos"
              trend={{ value: transparencyRate >= 75 ? 7 : -3, isPositive: transparencyRate >= 75 }}
              size="md"
            />

            <StatCard
              icon={Target}
              label="Objectivos"
              value="95%"
              description="Meta de transparência"
              trend={{ value: 4, isPositive: true }}
              size="md"
            />
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Performance */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5" />
                  Performance de Conteúdo
                </CardTitle>
                <CardDescription>
                  Estatísticas detalhadas do conteúdo publicado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.publishedNews}</div>
                    <div className="text-sm text-muted-foreground">Notícias Publicadas</div>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalNews - stats.publishedNews}</div>
                    <div className="text-sm text-muted-foreground">Em Rascunho</div>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.activeConcursos}</div>
                    <div className="text-sm text-muted-foreground">Concursos Ativos</div>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{stats.publicAcervoItems}</div>
                    <div className="text-sm text-muted-foreground">Docs. Públicos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Ações Rápidas
                </CardTitle>
                <CardDescription>
                  Acesso rápido às principais funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={navigateToNews}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Nova Notícia
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={navigateToConcursos}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Novo Concurso
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={navigateToAcervo}
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Upload Documento
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={navigateToUsers}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Gerir Usuários
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={Heart}
              label="Satisfação"
              value="4.8/5"
              description="Avaliação dos usuários"
              trend={{ value: 12, isPositive: true }}
              size="lg"
              className="md:col-span-1"
            />
            
            <StatCard
              icon={Star}
              label="Qualidade"
              value="Excelente"
              description="Índice de qualidade do conteúdo"
              trend={{ value: 8, isPositive: true }}
              size="lg"
              className="md:col-span-1"
            />
            
            <StatCard
              icon={CheckCircle}
              label="Conformidade"
              value="98%"
              description="Conformidade regulamentar"
              trend={{ value: 5, isPositive: true }}
              size="lg"
              className="md:col-span-1"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Atividade Recente</h3>
        </div>
        <RecentActivity />
      </div>
    </div>
  );
};