import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUpIcon,
  RefreshCwIcon,
  UsersIcon,
  BuildingIcon,
  HeartHandshakeIcon,
  LightbulbIcon,
  TargetIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  StarIcon
} from "lucide-react";
import { SetorCompleto } from "@/hooks/useSetoresEstrategicos";
import { cn } from "@/lib/utils";

interface SetorStatsProps {
  setor: SetorCompleto | null;
  className?: string;
}

export const SetorStats = ({ setor, className }: SetorStatsProps) => {
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Users': UsersIcon,
      'Building': BuildingIcon,
      'HeartHandshake': HeartHandshakeIcon,
      'Lightbulb': LightbulbIcon,
      'Target': TargetIcon,
      'Calendar': CalendarIcon,
      'MapPin': MapPinIcon,
      'Phone': PhoneIcon,
      'Mail': MailIcon,
      'Star': StarIcon,
      'TrendingUp': TrendingUpIcon
    };
    return iconMap[iconName] || TrendingUpIcon;
  };

  if (!setor || !setor.estatisticas || setor.estatisticas.length === 0) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
              <TrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              Estatísticas do Sector
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              <RefreshCwIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
              {!setor ? 'Carregando...' : 'Sem dados'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="text-center py-4 sm:py-8">
            <p className="text-muted-foreground text-xs sm:text-sm">
              {!setor ? 'Carregando estatísticas...' : 'Nenhuma estatística disponível para este sector.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-dashed", className)}>
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
            <TrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            Estatísticas do Sector
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            <RefreshCwIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
            Dados Atuais
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {setor.estatisticas.map((estatistica, index) => {
            const IconComponent = getIconComponent(estatistica.icone || 'TrendingUp');
            return (
              <div key={index} className="text-center space-y-1 sm:space-y-2 p-2 sm:p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                    {estatistica.valor}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                  {estatistica.nome}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Última actualização: {new Date().toLocaleTimeString('pt-AO')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 