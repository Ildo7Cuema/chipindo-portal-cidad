import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  EyeIcon, 
  ClockIcon, 
  HeartIcon, 
  TrendingUpIcon,
  RefreshCwIcon
} from "lucide-react";
import { useSetorStats } from "@/hooks/useSetorStats";
import { cn } from "@/lib/utils";

interface SetorStatsProps {
  setorSlug: string;
  className?: string;
}

export const SetorStats = ({ setorSlug, className }: SetorStatsProps) => {
  const { stats, loading } = useSetorStats({ setorSlug });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-AO').format(num);
  };

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSatisfactionColor = (satisfacao: number) => {
    if (satisfacao >= 90) return "text-green-600";
    if (satisfacao >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getSatisfactionIcon = (satisfacao: number) => {
    if (satisfacao >= 90) return "😊";
    if (satisfacao >= 80) return "🙂";
    return "😐";
  };

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-32 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded w-16 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-dashed", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUpIcon className="w-4 h-4" />
            Estatísticas em Tempo Real
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            <RefreshCwIcon className="w-3 h-3 mr-1" />
            Atualizado agora
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Visitas */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <EyeIcon className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {formatNumber(stats.visitas)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Visitas Hoje</p>
          </div>

          {/* Tempo Médio */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <ClockIcon className="w-5 h-5 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">
                {formatTime(stats.tempoMedio)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Tempo Médio</p>
          </div>

          {/* Satisfação */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <HeartIcon className="w-5 h-5 text-red-600" />
              <span className={cn("text-2xl font-bold", getSatisfactionColor(stats.satisfacao))}>
                {stats.satisfacao}%
              </span>
              <span className="text-lg">{getSatisfactionIcon(stats.satisfacao)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Satisfação</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Última actualização: {stats.ultimaAtualizacao.toLocaleTimeString('pt-AO')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 