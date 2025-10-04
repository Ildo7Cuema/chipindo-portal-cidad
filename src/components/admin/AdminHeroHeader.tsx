import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileSpreadsheet, 
  FileDown,
  Server,
  BarChart3,
  Bell,
  FileText,
  Users,
  Building2,
  MessageSquare,
  Settings,
  Activity,
  Shield,
  Heart,
  Trophy,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Target,
  TrendingUp,
  Zap,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  Archive,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  MoreVertical,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminHeroHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ComponentType<{ className?: string }>;
  badges?: Array<{
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    color?: string;
    icon?: React.ComponentType<{ className?: string }>;
    pulse?: boolean;
  }>;
  actions?: Array<{
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
  }>;
  exportActions?: Array<{
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
  }>;
  systemStatus?: {
    online?: boolean;
    responseTime?: number;
    statusText?: string;
  };
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3,
  Bell,
  FileText,
  Users,
  Building2,
  MessageSquare,
  Settings,
  Activity,
  Shield,
  Heart,
  Trophy,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Target,
  TrendingUp,
  Zap,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  Archive,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  MoreVertical,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileDown,
  Server
};

export const AdminHeroHeader: React.FC<AdminHeroHeaderProps> = ({
  title,
  subtitle,
  icon: IconComponent = BarChart3,
  badges = [],
  actions = [],
  exportActions = [],
  systemStatus = { online: true, responseTime: 0.8, statusText: "Sistema Operacional" },
  className
}) => {
  const Icon = iconMap[IconComponent.name] || IconComponent;

  return (
    <div className={cn(
      "relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-border/50 shadow-lg",
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))]" />
      
      <div className="relative p-4 sm:p-6 lg:p-8">
        {/* Mobile Layout - Estrutura em 3 linhas */}
        <div className="block lg:hidden space-y-4">
          {/* Linha 1: Título Principal */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
              {title}
            </h1>
            
            {/* Status do Sistema */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  systemStatus.online ? "bg-green-500 animate-pulse" : "bg-red-500"
                )} />
                <span className="text-xs font-medium text-green-700 dark:text-green-400">
                  {systemStatus.statusText || "Operacional"}
                </span>
              </div>
              {systemStatus.responseTime && (
                <div className="flex items-center gap-1">
                  <Server className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{systemStatus.responseTime}s</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Linha 2: Ícone + Subtítulo + Badges */}
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg flex-shrink-0">
              <Icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <p className="block w-full text-muted-foreground text-sm font-medium leading-normal break-words">
                {subtitle}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {badges.map((badge, index) => {
                  const BadgeIcon = badge.icon ? iconMap[badge.icon.name] || badge.icon : null;
                  return (
                    <Badge 
                      key={index}
                      variant={badge.variant || "outline"}
                      className={cn(
                        "px-2 py-0.5 text-xs font-semibold",
                        badge.color,
                        badge.pulse && "animate-pulse"
                      )}
                    >
                      {badge.pulse && (
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full mr-1.5",
                          badge.color?.includes("green") ? "bg-green-500" : "bg-primary"
                        )} />
                      )}
                      {BadgeIcon && <BadgeIcon className="w-3 h-3 mr-1" />}
                      {badge.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Linha 3: Botões de Ação - Sempre abaixo do subtítulo */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {exportActions.slice(0, 2).map((action, index) => {
              const ActionIcon = action.icon ? iconMap[action.icon.name] || action.icon : Download;
              return (
                <Button 
                  key={index}
                  variant="outline" 
                  size="sm" 
                  onClick={action.onClick}
                  disabled={action.disabled || action.loading}
                  className="h-8 px-2.5 text-xs font-medium border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
                >
                  {action.loading ? (
                    <div className="w-3 h-3 border-2 border-slate-400/20 border-t-slate-600 rounded-full animate-spin mr-1.5" />
                  ) : (
                    <ActionIcon className="w-3 h-3 mr-1.5 text-slate-600 dark:text-slate-300" />
                  )}
                  <span className="font-medium">{action.label}</span>
                </Button>
              );
            })}
            {actions.length > 0 && (
              <Button 
                variant={actions[0].variant || "outline"}
                size="sm" 
                onClick={actions[0].onClick}
                disabled={actions[0].disabled || actions[0].loading}
                className={cn(
                  "h-8 px-2.5 text-xs font-medium transition-all duration-200",
                  actions[0].className,
                  // Garante contraste perfeito para botões principais
                  actions[0].variant === "default" &&
                    "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white hover:text-white focus:text-white border-0 shadow-md hover:shadow-lg"
                )}
              >
                {actions[0].loading ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                ) : actions[0].icon ? (
                  React.createElement(iconMap[actions[0].icon.name] || actions[0].icon, { className: "w-3 h-3 mr-1.5 text-white" })
                ) : null}
                <span className="font-semibold text-white">{actions[0].label}</span>
              </Button>
            )}
            {actions.length === 0 && exportActions.length > 2 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportActions[2].onClick}
                disabled={exportActions[2].disabled || exportActions[2].loading}
                className="h-8 px-2.5 text-xs font-medium border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
              >
                {exportActions[2].loading ? (
                  <div className="w-3 h-3 border-2 border-slate-400/20 border-t-slate-600 rounded-full animate-spin mr-1.5" />
                ) : (
                  React.createElement(iconMap[exportActions[2].icon?.name || "Download"], { className: "w-3 h-3 mr-1.5 text-slate-600 dark:text-slate-300" })
                )}
                <span className="font-medium">{exportActions[2].label}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Layout - Estrutura horizontal otimizada */}
        <div className="hidden lg:flex lg:items-start lg:justify-between gap-6">
          <div className="flex-1 min-w-0 flex items-start gap-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg flex-shrink-0">
              <Icon className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              {/* Linha 1: Título + Badges */}
              <div className="flex items-center gap-4">
                <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                  {title}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  {badges.map((badge, index) => {
                    const BadgeIcon = badge.icon ? iconMap[badge.icon.name] || badge.icon : null;
                    return (
                      <Badge 
                        key={index}
                        variant={badge.variant || "outline"}
                        className={cn(
                          "px-3 py-1.5 font-semibold text-sm",
                          badge.color,
                          badge.pulse && "animate-pulse"
                        )}
                      >
                        {badge.pulse && (
                          <div className={cn(
                            "w-2 h-2 rounded-full mr-2",
                            badge.color?.includes("green") ? "bg-green-500" : "bg-primary"
                          )} />
                        )}
                        {BadgeIcon && <BadgeIcon className="w-4 h-4 mr-2" />}
                        {badge.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              
              {/* Linha 2: Subtítulo - Ocupando toda a largura disponível */}
              <p className="block w-full text-muted-foreground leading-normal text-base font-medium break-words">
                {subtitle}
              </p>
              {/* Linha 3: Botões de Ação - Sempre abaixo do subtítulo */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {exportActions.map((action, index) => {
                  const ActionIcon = action.icon ? iconMap[action.icon.name] || action.icon : Download;
                  return (
                    <Button 
                      key={index}
                      variant="outline" 
                      size="sm" 
                      onClick={action.onClick}
                      disabled={action.disabled || action.loading}
                      className="h-10 px-4 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {action.loading ? (
                        <div className="w-4 h-4 border-2 border-slate-400/20 border-t-slate-600 rounded-full animate-spin mr-2" />
                      ) : (
                        <ActionIcon className="w-4 h-4 mr-2 text-slate-600 dark:text-slate-300" />
                      )}
                      <span className="font-medium">{action.label}</span>
                    </Button>
                  );
                })}
                {actions.map((action, index) => {
                  const ActionIcon = action.icon ? iconMap[action.icon.name] || action.icon : null;
                  return (
                    <Button 
                      key={index}
                      variant={action.variant || "outline"}
                      size="sm" 
                      onClick={action.onClick}
                      disabled={action.disabled || action.loading}
                      className={cn(
                        "h-10 px-4 text-sm font-medium transition-all duration-200",
                        action.className,
                        // Garante contraste perfeito para botões principais
                        action.variant === "default" &&
                          "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white hover:text-white focus:text-white border-0 shadow-md hover:shadow-lg"
                      )}
                    >
                      {action.loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      ) : ActionIcon ? (
                        <ActionIcon className="w-4 h-4 mr-2 text-white" />
                      ) : null}
                      <span className="font-semibold text-white">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4 flex-shrink-0">
            {/* Status do Sistema */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  systemStatus.online ? "bg-green-500 animate-pulse" : "bg-red-500"
                )} />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  {systemStatus.statusText || "Sistema Operacional"}
                </span>
              </div>
              {systemStatus.responseTime && (
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{systemStatus.responseTime}s</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 