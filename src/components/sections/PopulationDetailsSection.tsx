import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";
import { usePopulationData } from "@/hooks/usePopulationData";
import { cn } from "@/lib/utils";

export function PopulationDetailsSection() {
  const { 
    currentPopulation, 
    previousPopulation, 
    growthRate, 
    growthDescription, 
    period, 
    latestYear, 
    previousYear, 
    totalChange, 
    percentageChange, 
    yearsOfData,
    loading, 
    error,
    refreshData 
  } = usePopulationData();

  const populationChange = currentPopulation - previousPopulation;
  const isPositiveGrowth = growthRate > 0;

  if (error) {
    return (
      <Section variant="default" size="lg" className="relative">
        <SectionHeader
          subtitle="Dados Populacionais"
          title="Informações Demográficas"
          description="Estatísticas detalhadas sobre a população de Chipindo"
          centered={true}
        />
        <SectionContent>
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-700 dark:text-red-300">
                    Erro ao carregar dados populacionais
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {error}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshData}
                    className="mt-3"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </SectionContent>
      </Section>
    );
  }

  return (
    <Section variant="default" size="lg" className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-green-50/50 dark:from-blue-950/20 dark:to-green-950/20" />
      
      <SectionHeader
        subtitle="Dados Populacionais"
        title="Informações Demográficas"
        description="Estatísticas detalhadas sobre a população de Chipindo"
        centered={true}
      />
      
      <SectionContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Population Overview */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                População Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {loading ? '...' : currentPopulation.toLocaleString('pt-AO')}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Habitantes em {latestYear}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Ano anterior ({previousYear}):</span>
                <span className="font-medium">
                  {previousPopulation.toLocaleString('pt-AO')}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Variação:</span>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-medium",
                    populationChange > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {populationChange > 0 ? '+' : ''}{populationChange.toLocaleString('pt-AO')}
                  </span>
                  <Badge variant={populationChange > 0 ? "default" : "destructive"} className="text-xs">
                    {populationChange > 0 ? '+' : ''}{((populationChange / previousPopulation) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Growth Rate Details */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Taxa de Crescimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={cn(
                  "text-4xl font-bold",
                  isPositiveGrowth ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {loading ? '...' : `${growthRate.toFixed(1)}%`}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {growthDescription}
                </p>
                <Badge variant="outline" className="mt-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  {period}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Período:</span>
                  <span className="font-medium">{previousYear} - {latestYear}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dados disponíveis:</span>
                  <span className="font-medium">{yearsOfData} anos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historical Overview */}
        {yearsOfData > 2 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Visão Geral Histórica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {totalChange > 0 ? '+' : ''}{totalChange.toLocaleString('pt-AO')}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Crescimento Total
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {percentageChange.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Percentagem Total
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {yearsOfData}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Anos de Dados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Quality Indicator */}
        <Card className="mt-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Dados Actualizados
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                  As informações populacionais são calculadas automaticamente com base em dados históricos oficiais.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                Actualizar
              </Button>
            </div>
          </CardContent>
        </Card>
      </SectionContent>
    </Section>
  );
} 