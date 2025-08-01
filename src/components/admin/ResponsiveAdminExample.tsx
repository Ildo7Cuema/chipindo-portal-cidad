import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveSection,
  ResponsiveText
} from '@/components/layout/ResponsiveLayout';
import { 
  Users, 
  FileText, 
  Bell, 
  TrendingUp, 
  Activity, 
  BarChart3,
  Calendar,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download
} from 'lucide-react';

export const ResponsiveAdminExample = () => {
  const stats = [
    {
      title: "Utilizadores Ativos",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Notícias Publicadas",
      value: "567",
      change: "+8%",
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Notificações",
      value: "89",
      change: "+23%",
      icon: Bell,
      color: "text-orange-600"
    },
    {
      title: "Crescimento",
      value: "34%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Nova notícia publicada",
      user: "João Silva",
      time: "2 minutos atrás",
      type: "news"
    },
    {
      id: 2,
      action: "Utilizador registado",
      user: "Maria Santos",
      time: "5 minutos atrás",
      type: "user"
    },
    {
      id: 3,
      action: "Concurso atualizado",
      user: "Pedro Costa",
      time: "10 minutos atrás",
      type: "contest"
    },
    {
      id: 4,
      action: "Notificação enviada",
      user: "Ana Oliveira",
      time: "15 minutos atrás",
      type: "notification"
    }
  ];

  const quickActions = [
    {
      title: "Nova Notícia",
      description: "Criar uma nova notícia",
      icon: Plus,
      action: () => console.log("Nova notícia")
    },
    {
      title: "Gerir Utilizadores",
      description: "Ver e editar utilizadores",
      icon: Users,
      action: () => console.log("Gerir utilizadores")
    },
    {
      title: "Configurações",
      description: "Ajustar configurações do sistema",
      icon: Settings,
      action: () => console.log("Configurações")
    },
    {
      title: "Relatórios",
      description: "Gerar relatórios",
      icon: BarChart3,
      action: () => console.log("Relatórios")
    }
  ];

  return (
    <ResponsiveContainer spacing="lg">
      {/* Header Section */}
      <ResponsiveSection spacing="md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <ResponsiveText variant="h1" className="mb-2">
              Dashboard Executivo
            </ResponsiveText>
            <ResponsiveText variant="body" className="text-muted-foreground">
              Painel de controle e estatísticas em tempo real
            </ResponsiveText>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Nova Notícia
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Exportar Dados
            </Button>
          </div>
        </div>
      </ResponsiveSection>

      {/* Stats Grid */}
      <ResponsiveSection spacing="md">
        <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap="md">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ResponsiveCard key={index} interactive elevated>
                <div className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <ResponsiveText variant="small" className="text-muted-foreground mb-1">
                      {stat.title}
                    </ResponsiveText>
                    <ResponsiveText variant="h3" className="font-bold mb-1">
                      {stat.value}
                    </ResponsiveText>
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </ResponsiveCard>
            );
          })}
        </ResponsiveGrid>
      </ResponsiveSection>

      {/* Main Content Grid */}
      <ResponsiveSection spacing="lg">
        <ResponsiveGrid cols={{ sm: 1, lg: 2 }} gap="lg">
          {/* Recent Activities */}
          <ResponsiveCard elevated>
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <ResponsiveText variant="h3" className="font-semibold">
                  Atividades Recentes
                </ResponsiveText>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <ResponsiveText variant="body" className="font-medium">
                      {activity.action}
                    </ResponsiveText>
                    <ResponsiveText variant="small" className="text-muted-foreground">
                      por {activity.user} • {activity.time}
                    </ResponsiveText>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-border/50">
              <Button variant="outline" size="sm" className="w-full">
                Ver Todas as Atividades
              </Button>
            </div>
          </ResponsiveCard>

          {/* Quick Actions */}
          <ResponsiveCard elevated>
            <div className="p-4 border-b border-border/50">
              <ResponsiveText variant="h3" className="font-semibold">
                Ações Rápidas
              </ResponsiveText>
            </div>
            
            <div className="p-4">
              <ResponsiveGrid cols={{ sm: 1, md: 2 }} gap="md">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <ResponsiveText variant="body" className="font-medium">
                          {action.title}
                        </ResponsiveText>
                        <ResponsiveText variant="small" className="text-muted-foreground">
                          {action.description}
                        </ResponsiveText>
                      </div>
                    </button>
                  );
                })}
              </ResponsiveGrid>
            </div>
          </ResponsiveCard>
        </ResponsiveGrid>
      </ResponsiveSection>

      {/* Data Table Example */}
      <ResponsiveSection spacing="md">
        <ResponsiveCard elevated>
          <div className="p-4 border-b border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <ResponsiveText variant="h3" className="font-semibold">
                Últimas Notícias
              </ResponsiveText>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Título</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Autor</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Data</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Status</th>
                  <th className="text-right p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <ResponsiveText variant="body" className="font-medium">
                          Notícia de Exemplo {item}
                        </ResponsiveText>
                        <ResponsiveText variant="small" className="text-muted-foreground md:hidden">
                          Autor • 2 dias atrás
                        </ResponsiveText>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <ResponsiveText variant="body">João Silva</ResponsiveText>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <ResponsiveText variant="body">2 dias atrás</ResponsiveText>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <Badge variant="default">Publicado</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <ResponsiveText variant="small" className="text-muted-foreground">
                Mostrando 1-5 de 25 resultados
              </ResponsiveText>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Anterior</Button>
                <Button variant="outline" size="sm">Próximo</Button>
              </div>
            </div>
          </div>
        </ResponsiveCard>
      </ResponsiveSection>

      {/* Mobile-Specific Features */}
      <ResponsiveSection spacing="md" className="lg:hidden">
        <ResponsiveCard elevated>
          <div className="p-4">
            <ResponsiveText variant="h3" className="font-semibold mb-4">
              Funcionalidades Mobile
            </ResponsiveText>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <ResponsiveText variant="body" className="font-medium">
                    Navegação Otimizada
                  </ResponsiveText>
                  <ResponsiveText variant="small" className="text-muted-foreground">
                    Menu lateral e navegação inferior
                  </ResponsiveText>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <ResponsiveText variant="body" className="font-medium">
                    Layout Responsivo
                  </ResponsiveText>
                  <ResponsiveText variant="small" className="text-muted-foreground">
                    Adapta-se a todos os tamanhos de ecrã
                  </ResponsiveText>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/5">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <ResponsiveText variant="body" className="font-medium">
                    Ações Rápidas
                  </ResponsiveText>
                  <ResponsiveText variant="small" className="text-muted-foreground">
                    Acesso rápido às funcionalidades principais
                  </ResponsiveText>
                </div>
              </div>
            </div>
          </div>
        </ResponsiveCard>
      </ResponsiveSection>
    </ResponsiveContainer>
  );
}; 