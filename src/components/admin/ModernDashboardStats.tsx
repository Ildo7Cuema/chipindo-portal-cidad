import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/ui/stat-card";
import { Progress } from "@/components/ui/progress";
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
  FileDown,
  TrendingDown,
  Award,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Bell,
  Settings,
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  Info,
  ExternalLink,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Archive,
  Copy,
  Share2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Printer,
  Camera,
  Video,
  Mic,
  Headphones,
  Keyboard,
  Mouse,
  Gamepad2,
  Watch,
  CreditCard,
  DollarSign,
  Euro,
  Bitcoin,
  Wallet,
  PiggyBank,
  Banknote,
  Coins,
  Receipt,
  Calculator,
  ChartBar,
  ChartLine,
  ChartPie,
  ChartArea
} from "lucide-react";
import { RecentActivity } from "./RecentActivity";
import { useRealTimeStats } from "@/hooks/useRealTimeStats";
import ExportUtils from "@/lib/export-utils";
import { cn } from "@/lib/utils";

// Componente para gráfico de barras simples
const SimpleBarChart = ({ data, height = 200 }: { data: { label: string; value: number; color: string }[]; height?: number }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between h-[200px] gap-2 p-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="text-xs text-muted-foreground mb-2">{item.value}</div>
          <div 
            className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80"
            style={{ 
              height: `${(item.value / maxValue) * 150}px`,
              backgroundColor: item.color,
              minHeight: '4px'
            }}
          />
          <div className="text-xs text-muted-foreground mt-2 text-center">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

// Componente para gráfico de progresso circular
const CircularProgress = ({ value, size = 80, strokeWidth = 8, color = "#3b82f6" }: { 
  value: number; 
  size?: number; 
  strokeWidth?: number; 
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold">{value}%</span>
      </div>
    </div>
  );
};

// Componente para métricas de performance
const PerformanceMetric = ({ 
  title, 
  value, 
  target, 
  unit = "%", 
  color = "blue",
  icon: Icon 
}: { 
  title: string; 
  value: number; 
  target: number; 
  unit?: string; 
  color?: string;
  icon: React.ComponentType<{ className?: string }>;
}) => {
  const percentage = Math.min((value / target) * 100, 100);
  const isOnTarget = percentage >= 100;
  const isClose = percentage >= 80;
  
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-950/20",
    green: "text-green-600 bg-green-50 dark:bg-green-950/20",
    yellow: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20",
    red: "text-red-600 bg-red-50 dark:bg-red-950/20",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-950/20"
  };

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2 rounded-lg", colorClasses[color as keyof typeof colorClasses])}>
            <Icon className="w-5 h-5" />
          </div>
          <Badge variant={isOnTarget ? "default" : isClose ? "secondary" : "destructive"} className="text-xs">
            {isOnTarget ? "Meta Atingida" : isClose ? "Próximo" : "Atenção"}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Meta: {target}{unit}</span>
            <span>{percentage.toFixed(1)}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export const ModernDashboardStats = () => {
  const { stats } = useRealTimeStats();
  const [activeView, setActiveView] = useState("overview");
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  // Calculate derived stats
  const publicationRate = stats.totalNews > 0 ? Math.round((stats.publishedNews / stats.totalNews) * 100) : 0;
  const transparencyRate = stats.totalAcervoItems > 0 ? Math.round((stats.publicAcervoItems / stats.totalAcervoItems) * 100) : 0;
  const activeRate = stats.totalConcursos > 0 ? Math.round((stats.activeConcursos / stats.totalConcursos) * 100) : 0;
  const systemHealth = 98; // Simulated system health
  const userSatisfaction = 4.8; // Simulated user satisfaction
  const responseTime = 0.8; // Simulated response time in seconds

  // Performance metrics data
  const performanceMetrics = [
    {
      title: "Taxa de Publicação",
      value: publicationRate,
      target: 90,
      unit: "%",
      color: "green",
      icon: FileText
    },
    {
      title: "Transparência",
      value: transparencyRate,
      target: 95,
      unit: "%",
      color: "blue",
      icon: Shield
    },
    {
      title: "Concursos Ativos",
      value: activeRate,
      target: 80,
      unit: "%",
      color: "purple",
      icon: Trophy
    },
    {
      title: "Satisfação do Usuário",
      value: userSatisfaction * 20, // Convert to percentage
      target: 90,
      unit: "%",
      color: "yellow",
      icon: Heart
    }
  ];

  // Chart data
  const chartData = [
    { label: "Jan", value: 65, color: "#3b82f6" },
    { label: "Fev", value: 78, color: "#3b82f6" },
    { label: "Mar", value: 82, color: "#3b82f6" },
    { label: "Abr", value: 75, color: "#3b82f6" },
    { label: "Mai", value: 88, color: "#3b82f6" },
    { label: "Jun", value: 92, color: "#3b82f6" }
  ];

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
    <div className="space-y-6">
      {/* Enhanced Dashboard Header - Responsive */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-border/50 shadow-lg">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))]" />
        
        <div className="relative p-4 sm:p-6 lg:p-8">
          {/* Mobile Layout */}
          <div className="block lg:hidden space-y-3">
            {/* Mobile Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                    Dashboard Executivo
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5 text-xs font-semibold">
                      Admin
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 text-xs">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                      Online
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Mobile Status */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">Operacional</span>
                </div>
                <div className="flex items-center gap-1">
                  <Server className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{responseTime}s</span>
                </div>
              </div>
            </div>
            
            {/* Mobile Description */}
            <p className="text-muted-foreground text-sm font-medium leading-normal">
              Painel de controle executivo com métricas em tempo real
            </p>
            
            {/* Mobile Export Buttons */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportToCSV}
                  disabled={exportLoading === 'csv'}
                  className="h-8 px-2.5 text-xs font-medium"
                >
                  {exportLoading === 'csv' ? (
                    <div className="w-3 h-3 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin mr-1.5" />
                  ) : (
                    <FileSpreadsheet className="w-3 h-3 mr-1.5" />
                  )}
                  CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportToExcel}
                  disabled={exportLoading === 'excel'}
                  className="h-8 px-2.5 text-xs font-medium"
                >
                  {exportLoading === 'excel' ? (
                    <div className="w-3 h-3 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin mr-1.5" />
                  ) : (
                    <FileDown className="w-3 h-3 mr-1.5" />
                  )}
                  Excel
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportToPDF}
                disabled={exportLoading === 'pdf'}
                className="h-8 px-2.5 text-xs font-medium"
              >
                {exportLoading === 'pdf' ? (
                  <div className="w-3 h-3 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin mr-1.5" />
                ) : (
                  <Download className="w-3 h-3 mr-1.5" />
                )}
                PDF
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:items-center lg:justify-between gap-6">
            <div className="flex-1 min-w-0 flex items-center gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
                <BarChart3 className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                    Dashboard Executivo
                  </h1>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1.5 font-semibold text-sm">
                      Admin
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-3 py-1.5 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                      Sistema Online
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground leading-normal text-base font-medium max-w-2xl">
                  Painel de controle executivo com métricas em tempo real, análise de performance e gestão estratégica do portal municipal
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-4 flex-shrink-0">
              {/* Desktop System Status */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">Sistema Operacional</span>
                </div>
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{responseTime}s</span>
                </div>
              </div>
              
              {/* Desktop Export Buttons */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportToCSV}
                  disabled={exportLoading === 'csv'}
                  className="h-10 px-4 hover:bg-muted/60 text-sm font-medium"
                >
                  {exportLoading === 'csv' ? (
                    <div className="w-4 h-4 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin mr-2" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                  )}
                  Exportar CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportToExcel}
                  disabled={exportLoading === 'excel'}
                  className="h-10 px-4 hover:bg-muted/60 text-sm font-medium"
                >
                  {exportLoading === 'excel' ? (
                    <div className="w-4 h-4 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin mr-2" />
                  ) : (
                    <FileDown className="w-4 h-4 mr-2" />
                  )}
                  Exportar Excel
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportToPDF}
                  disabled={exportLoading === 'pdf'}
                  className="h-10 px-4 hover:bg-muted/60 text-sm font-medium"
                >
                  {exportLoading === 'pdf' ? (
                    <div className="w-4 h-4 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Exportar PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Activity}
          label="Status Geral"
          value="Excelente"
          description="Sistema funcionando perfeitamente"
          variant="glass"
          trend={{ value: 12, isPositive: true }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300"
        />
        
        <StatCard
          icon={Users}
          label="Usuários Ativos"
          value={stats.totalUsers}
          description="Total de administradores"
          variant="glass"
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
        />
        
        <StatCard
          icon={Globe}
          label="Taxa de Transparência"
          value={`${transparencyRate}%`}
          description="Documentos públicos"
          variant="glass"
          trend={{ value: transparencyRate >= 80 ? 5 : -2, isPositive: transparencyRate >= 80 }}
          className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300"
        />
        
        <StatCard
          icon={Zap}
          label="Eficiência"
          value={`${publicationRate}%`}
          description="Taxa de publicação"
          variant="glass"
          trend={{ value: publicationRate >= 70 ? 8 : -3, isPositive: publicationRate >= 70 }}
          className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-xl transition-all duration-300"
        />
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <PerformanceMetric key={index} {...metric} />
        ))}
      </div>

      {/* Enhanced Main Stats Grid with Tabs - Responsive */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-5">
        {/* Mobile Tabs Layout */}
        <div className="block lg:hidden space-y-3">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="overview" className="flex items-center gap-1.5 text-xs font-medium">
              <PieChart className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Visão Geral</span>
              <span className="xs:hidden">Geral</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-1.5 text-xs font-medium">
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Conteúdo</span>
              <span className="xs:hidden">Cont.</span>
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center gap-1.5 text-xs font-medium">
              <Heart className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Engajamento</span>
              <span className="xs:hidden">Eng.</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Mobile Time Range Selector */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Período:</span>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-xs border border-border rounded-md px-2 py-1.5 bg-background font-medium"
              >
                <option value="1d">1 dia</option>
                <option value="7d">1 semana</option>
                <option value="30d">1 mês</option>
                <option value="90d">3 meses</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Tabs Layout */}
        <div className="hidden lg:flex lg:items-center lg:justify-between gap-6">
          <TabsList className="grid grid-cols-3 h-12">
            <TabsTrigger value="overview" className="flex items-center gap-3 text-sm font-medium px-6">
              <PieChart className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-3 text-sm font-medium px-6">
              <FileText className="w-4 h-4" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center gap-3 text-sm font-medium px-6">
              <Heart className="w-4 h-4" />
              Engajamento
            </TabsTrigger>
          </TabsList>
          
          {/* Desktop Time Range Selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-medium">Período de Análise:</span>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-border rounded-lg px-4 py-2 bg-background font-medium hover:border-primary/50 transition-colors"
            >
              <option value="1d">Último dia</option>
              <option value="7d">Última semana</option>
              <option value="30d">Último mês</option>
              <option value="90d">Último trimestre</option>
            </select>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-5">
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={FileText}
              label="Total de Notícias"
              value={stats.totalNews}
              description={`${stats.publishedNews} publicadas`}
              trend={{ value: 15, isPositive: true }}
              size="md"
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            />

            <StatCard
              icon={Trophy}
              label="Concursos"
              value={stats.totalConcursos}
              description={`${stats.activeConcursos} ativos`}
              trend={{ value: activeRate >= 50 ? 8 : -5, isPositive: activeRate >= 50 }}
              size="md"
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            />

            <StatCard
              icon={Building2}
              label="Direcções"
              value={stats.totalDirecoes}
              description="Áreas de atuação"
              size="md"
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            />

            <StatCard
              icon={Users}
              label="Organigrama"
              value={stats.totalOrganigramaMembers}
              description="Membros ativos"
              size="md"
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            />

            <StatCard
              icon={FolderOpen}
              label="Acervo Digital"
              value={stats.totalAcervoItems}
              description={`${stats.publicAcervoItems} públicos`}
              trend={{ value: 22, isPositive: true }}
              size="md"
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            />

            <StatCard
              icon={Eye}
              label="Taxa de Publicação"
              value={`${publicationRate}%`}
              description="Notícias publicadas"
              trend={{ value: publicationRate >= 80 ? 10 : -5, isPositive: publicationRate >= 80 }}
              size="md"
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            />

            <StatCard
              icon={Shield}
              label="Transparência"
              value={`${transparencyRate}%`}
              description="Documentos públicos"
              trend={{ value: transparencyRate >= 75 ? 7 : -3, isPositive: transparencyRate >= 75 }}
              size="md"
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            />

            <StatCard
              icon={Target}
              label="Objectivos"
              value="95%"
              description="Meta de transparência"
              trend={{ value: 4, isPositive: true }}
              size="md"
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            />
          </div>

          {/* Charts and Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Mensal
                </CardTitle>
                <CardDescription>
                  Evolução das métricas principais nos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={chartData} />
              </CardContent>
            </Card>

            {/* System Health Dashboard */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Saúde do Sistema
                </CardTitle>
                <CardDescription>
                  Status em tempo real dos serviços
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center">
                  <CircularProgress value={systemHealth} size={120} color="#10b981" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{responseTime}s</div>
                    <div className="text-xs text-muted-foreground">Tempo de Resposta</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">99.9%</div>
                    <div className="text-xs text-muted-foreground">Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Content Performance */}
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
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600">{stats.publishedNews}</div>
                    <div className="text-sm text-muted-foreground">Notícias Publicadas</div>
                    <div className="text-xs text-green-600 mt-1">+12% este mês</div>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalNews - stats.publishedNews}</div>
                    <div className="text-sm text-muted-foreground">Em Rascunho</div>
                    <div className="text-xs text-blue-600 mt-1">-5% este mês</div>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">{stats.activeConcursos}</div>
                    <div className="text-sm text-muted-foreground">Concursos Ativos</div>
                    <div className="text-xs text-purple-600 mt-1">+3 este mês</div>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-orange-600">{stats.publicAcervoItems}</div>
                    <div className="text-sm text-muted-foreground">Docs. Públicos</div>
                    <div className="text-xs text-orange-600 mt-1">+8 este mês</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Quick Actions */}
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

        <TabsContent value="engagement" className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={Heart}
              label="Satisfação"
              value="4.8/5"
              description="Avaliação dos usuários"
              trend={{ value: 12, isPositive: true }}
              size="lg"
              className="md:col-span-1 shadow-lg hover:shadow-xl transition-all duration-300"
            />
            
            <StatCard
              icon={Star}
              label="Qualidade"
              value="Excelente"
              description="Índice de qualidade do conteúdo"
              trend={{ value: 8, isPositive: true }}
              size="lg"
              className="md:col-span-1 shadow-lg hover:shadow-xl transition-all duration-300"
            />
            
            <StatCard
              icon={CheckCircle}
              label="Conformidade"
              value="98%"
              description="Conformidade regulamentar"
              trend={{ value: 5, isPositive: true }}
              size="lg"
              className="md:col-span-1 shadow-lg hover:shadow-xl transition-all duration-300"
            />
          </div>

          {/* User Engagement Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Engajamento de Usuários
                </CardTitle>
                <CardDescription>
                  Métricas de interação e participação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Usuários Ativos</span>
                    <span className="text-sm font-bold">{stats.totalUsers}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Taxa de Retenção</span>
                    <span className="text-sm font-bold">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tempo Médio de Sessão</span>
                    <span className="text-sm font-bold">12 min</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Feedback e Avaliações
                </CardTitle>
                <CardDescription>
                  Análise de satisfação e feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <CircularProgress value={userSatisfaction * 20} size={100} color="#f59e0b" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">92%</div>
                    <div className="text-xs text-muted-foreground">Positivo</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">8%</div>
                    <div className="text-xs text-muted-foreground">Negativo</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Enhanced Recent Activity - Responsive */}
      <div className="space-y-3">
        {/* Mobile Activity Header */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-base font-semibold">Atividade Recente</h3>
            </div>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
              <RotateCcw className="w-3 h-3 mr-1.5" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Desktop Activity Header */}
        <div className="hidden lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Atividade Recente</h3>
          </div>
          <Button variant="outline" size="sm" className="h-9 px-4 text-sm font-medium">
            <RotateCcw className="w-4 h-4 mr-2" />
            Actualizar Dados
          </Button>
        </div>
        
        <RecentActivity />
      </div>
    </div>
  );
}; 