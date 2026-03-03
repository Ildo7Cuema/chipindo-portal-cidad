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
import { useUserRole } from "@/hooks/useUserRole";
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

  // Brutalist color mapping - solid backgrounds, intense contrast
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20",
    yellow: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20",
    red: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20"
  };

  return (
    <Card className="group overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-4 sm:p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("p-2 sm:p-2.5 rounded-xl flex-shrink-0 transition-colors", colorClasses[color as keyof typeof colorClasses])}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
          </div>
          <Badge
            className={cn(
              "px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full border whitespace-nowrap",
              isOnTarget ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400" :
                isClose ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400" :
                  "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400"
            )}
          >
            {isOnTarget ? "META ATINGIDA" : isClose ? "PRÓXIMO" : "ATENÇÃO"}
          </Badge>
        </div>

        <div className="space-y-3 mt-auto">
          <h3 className="font-semibold text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug" title={title}>
            {title}
          </h3>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight break-words leading-tight">
              {value}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex-shrink-0">{unit}</span>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              <span className="truncate mr-2">Meta: {target}{unit}</span>
              <span className="flex-shrink-0 text-slate-900 dark:text-white font-bold">{percentage.toFixed(1)}%</span>
            </div>
            {/* Premium Progress Bar - Soft edges, gentle backgrounds */}
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-1000 ease-out rounded-full",
                  isOnTarget ? "bg-emerald-500" : isClose ? "bg-amber-500" : "bg-rose-500"
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ModernDashboardStats = () => {
  const { role, setorId, isSectorUser, isAdmin } = useUserRole();
  const { stats } = useRealTimeStats(role, setorId);
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
      title: "Concursos Activos",
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
      {/* Premium Header Component */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/50 rounded-b-3xl -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 pt-8 pb-10">
        {/* Subtle radial gradient background for soft depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white dark:from-slate-800/20 dark:via-slate-900 dark:to-slate-900" />

        <div className="relative">
          {/* Mobile Layout */}
          <div className="block lg:hidden space-y-5">
            {/* Mobile Header */}
            <div className="flex items-start justify-between min-w-0 pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                  </div>
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 font-medium px-2 py-0 text-[10px] rounded-full">
                    ADMIN
                  </Badge>
                  <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-400 font-medium px-2 py-0 text-[10px] rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                    ONLINE
                  </Badge>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight break-words">
                  Dashboard Executivo
                </h1>
              </div>
            </div>

            {/* Mobile Description */}
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold max-w-sm line-clamp-2">
              Painel de controlo com métricas em tempo real e visão global do portal.
            </p>

            {/* Mobile Export Buttons */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={exportToCSV}
                  disabled={exportLoading === 'csv'}
                  className="h-10 w-10 rounded-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  title="Exportar como CSV"
                >
                  {exportLoading === 'csv' ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={exportToExcel}
                  disabled={exportLoading === 'excel'}
                  className="h-10 w-10 rounded-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  title="Exportar como Excel"
                >
                  {exportLoading === 'excel' ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FileDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  )}
                </Button>
              </div>
              <Button
                variant="default"
                size="icon"
                onClick={exportToPDF}
                disabled={exportLoading === 'pdf'}
                className="h-10 w-10 rounded-full shadow-sm"
                title="Exportar como PDF"
              >
                {exportLoading === 'pdf' ? (
                  <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:items-center lg:justify-between py-2">
            <div className="flex-1 min-w-0 flex items-center gap-5">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight whitespace-normal break-words">
                    Dashboard Executivo
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 font-medium px-2 py-0 text-[10px] rounded-full hidden xl:inline-flex">
                      ADMINISTRADOR
                    </Badge>
                    <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-400 font-medium px-2 py-0 text-[10px] rounded-full">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                      SISTEMA ONLINE
                    </Badge>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl leading-relaxed">
                  Visão global e controlo de performance do portal municipal em tempo real. Acompanhe os principais indicadores de actividade e tome decisões informadas.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 flex-shrink-0">
              {/* Desktop System Status */}
              <div className="flex items-center gap-4 px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-full shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                  <div className="relative">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Operacional</span>
                </div>
                <div className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
                <div className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{responseTime}s</span>
                </div>
              </div>

              {/* Desktop Export Buttons - Elegant style */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={exportToCSV}
                  disabled={exportLoading === 'csv'}
                  className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all shadow-sm"
                  title="Exportar CSV"
                >
                  {exportLoading === 'csv' ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                  )}
                  <span className="sr-only">Exportar CSV</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={exportToExcel}
                  disabled={exportLoading === 'excel'}
                  className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all shadow-sm"
                  title="Exportar Expressão"
                >
                  {exportLoading === 'excel' ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FileDown className="w-4 h-4 text-slate-500" />
                  )}
                  <span className="sr-only">Exportar Excel</span>
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  onClick={exportToPDF}
                  disabled={exportLoading === 'pdf'}
                  className="h-10 w-10 rounded-full shadow-md hover:shadow-lg transition-all"
                  title="Exportar PDF"
                >
                  {exportLoading === 'pdf' ? (
                    <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span className="sr-only">Exportar PDF</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Symmetrical Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-700">
        <StatCard
          icon={Activity}
          label="Status Geral"
          value="Excelente"
          description="Sistema operacional"
          variant="glass"
          trend={{ value: 12, isPositive: true }}
          className="bg-white/90 dark:bg-slate-900/90 shadow-sm"
        />

        <StatCard
          icon={Users}
          label="Usuários"
          value={stats.totalUsers}
          description="Administradores ativos"
          variant="glass"
          className="bg-white/90 dark:bg-slate-900/90 shadow-sm"
        />

        <StatCard
          icon={Globe}
          label="Taxa de Transparência"
          value={`${transparencyRate}%`}
          description="Documentos ao público"
          variant="glass"
          trend={{ value: transparencyRate >= 80 ? 5 : -2, isPositive: transparencyRate >= 80 }}
          className="bg-white/90 dark:bg-slate-900/90 shadow-sm"
        />

        <StatCard
          icon={Eye}
          label="Acessos Totais"
          value={stats.totalVisits}
          description="Visitas globais agrnadas."
          variant="elevated"
          trend={{ value: 10, isPositive: true }}
          className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30"
        />
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <PerformanceMetric key={index} {...metric} />
        ))}
      </div>

      {/* Enhanced Main Stats Grid with Tabs - Brutalist Approach */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        {/* Mobile Tabs Layout */}
        <div className="block lg:hidden space-y-4">
          <TabsList className="flex w-full overflow-x-auto snap-x snap-mandatory rounded-none bg-transparent h-14 p-0 space-x-2 hide-scrollbar">
            <TabsTrigger
              value="overview"
              className="snap-start shrink-0 flex items-center gap-2 text-sm font-bold uppercase rounded-sm border-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900 dark:data-[state=active]:border-white bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-3 transition-all"
            >
              <PieChart className="w-4 h-4" strokeWidth={2.5} />
              <span>Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="snap-start shrink-0 flex items-center gap-2 text-sm font-bold uppercase rounded-sm border-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900 dark:data-[state=active]:border-white bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-3 transition-all"
            >
              <FileText className="w-4 h-4" strokeWidth={2.5} />
              <span>Conteúdo</span>
            </TabsTrigger>
            <TabsTrigger
              value="engagement"
              className="snap-start shrink-0 flex items-center gap-2 text-sm font-bold uppercase rounded-sm border-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900 dark:data-[state=active]:border-white bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-3 transition-all"
            >
              <Heart className="w-4 h-4" strokeWidth={2.5} />
              <span>Engajamento</span>
            </TabsTrigger>
          </TabsList>

          {/* Mobile Time Range Selector */}
          <div className="flex items-center w-full">
            <div className="flex w-full flex-col gap-1.5">
              <span className="text-xs text-slate-900 dark:text-slate-50 font-bold uppercase tracking-wider">Período:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full text-sm border-2 border-slate-900 dark:border-slate-50 rounded-sm px-3 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transition-all"
              >
                <option value="1d">Último dia</option>
                <option value="7d">Última semana</option>
                <option value="30d">Último mês</option>
                <option value="90d">Último trimestre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Tabs Layout */}
        <div className="hidden lg:flex lg:items-center lg:justify-between gap-6 border-b-2 border-slate-900 dark:border-slate-50/20 pb-4">
          <TabsList className="flex bg-transparent rounded-none p-0 h-auto gap-2">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm border-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900 dark:data-[state=active]:border-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <PieChart className="w-3.5 h-3.5" strokeWidth={2.5} />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm border-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900 dark:data-[state=active]:border-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <FileText className="w-3.5 h-3.5" strokeWidth={2.5} />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger
              value="engagement"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm border-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900 dark:data-[state=active]:border-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <Heart className="w-3.5 h-3.5" strokeWidth={2.5} />
              Engajamento
            </TabsTrigger>
          </TabsList>

          {/* Desktop Time Range Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Período:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs border border-slate-200 dark:border-slate-700 rounded-sm px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold hover:-translate-y-0.5 outline-none focus:ring-0 transition-all cursor-pointer shadow-sm"
            >
              <option value="1d">Último dia</option>
              <option value="7d">Última semana</option>
              <option value="30d">Último mês</option>
              <option value="90d">Último trimestre</option>
            </select>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          {/* Elegant Overview Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 animate-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
            <StatCard
              icon={FileText}
              label="Notícias"
              value={stats.totalNews}
              description={`${stats.publishedNews} ativas`}
              trend={{ value: 15, isPositive: true }}
              size="sm"
            />

            <StatCard
              icon={Trophy}
              label="Concursos"
              value={stats.totalConcursos}
              description={`${stats.activeConcursos} visíveis`}
              trend={{ value: activeRate >= 50 ? 8 : -5, isPositive: activeRate >= 50 }}
              size="sm"
            />

            <StatCard
              icon={Building2}
              label="Direções"
              value={stats.totalDirecoes}
              description="Sectores"
              size="sm"
            />

            <StatCard
              icon={Users}
              label="Equipas"
              value={stats.totalOrganigramaMembers}
              description="Gabinete atv."
              size="sm"
            />

            <StatCard
              icon={FolderOpen}
              label="Biblioteca"
              value={stats.totalAcervoItems}
              description={`${stats.publicAcervoItems} doc.`}
              trend={{ value: 22, isPositive: true }}
              size="sm"
            />

            <StatCard
              icon={Eye}
              label="Leituras"
              value={`${publicationRate}%`}
              description="Artigos lidos"
              trend={{ value: publicationRate >= 80 ? 10 : -5, isPositive: publicationRate >= 80 }}
              size="sm"
            />

            <StatCard
              icon={Shield}
              label="Transp."
              value={`${transparencyRate}%`}
              description="Acesso livre"
              trend={{ value: transparencyRate >= 75 ? 7 : -3, isPositive: transparencyRate >= 75 }}
              size="sm"
            />

            <StatCard
              icon={Target}
              label="Eficácia"
              value="95%"
              description="Métrica ideal"
              trend={{ value: 4, isPositive: true }}
              size="sm"
            />
          </div>

          {/* Charts and Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            {/* Performance Chart */}
            <Card className="lg:col-span-2 border border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-500">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardTitle className="flex items-center gap-2 font-semibold text-lg text-slate-900 dark:text-white">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Performance
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">
                  Evolução das métricas mensais
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <SimpleBarChart data={chartData} />
              </CardContent>
            </Card>

            {/* System Health Dashboard */}
            <Card className="border border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-500">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardTitle className="flex items-center gap-2 font-semibold text-lg text-slate-900 dark:text-white">
                  <Cpu className="w-5 h-5 text-emerald-500" />
                  Sistema
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">
                  Saúde em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-center p-4">
                  <CircularProgress value={systemHealth} size={140} color="#10b981" strokeWidth={10} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{responseTime}s</div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-1">Ping</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">99.9%</div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-1">Uptime</div>
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
                    <span className="text-sm font-medium">Usuários Activos</span>
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