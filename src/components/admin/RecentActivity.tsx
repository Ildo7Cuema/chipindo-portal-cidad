import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Trophy, User, Calendar } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'news' | 'concurso' | 'user';
  title: string;
  description: string;
  created_at: string;
  status?: string;
}

export const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const activities: ActivityItem[] = [];

      // Fetch recent news
      const { data: newsData } = await supabase
        .from('news')
        .select('id, title, created_at, published')
        .order('created_at', { ascending: false })
        .limit(5);

      if (newsData) {
        activities.push(...newsData.map(item => ({
          id: `news-${item.id}`,
          type: 'news' as const,
          title: item.title,
          description: 'Nova notícia criada',
          created_at: item.created_at,
          status: item.published ? 'publicado' : 'rascunho'
        })));
      }

      // Fetch recent concursos
      const { data: concursosData } = await supabase
        .from('concursos')
        .select('id, title, created_at, published')
        .order('created_at', { ascending: false })
        .limit(5);

      if (concursosData) {
        activities.push(...concursosData.map(item => ({
          id: `concurso-${item.id}`,
          type: 'concurso' as const,
          title: item.title,
          description: 'Novo concurso criado',
          created_at: item.created_at,
          status: item.published ? 'publicado' : 'rascunho'
        })));
      }

      // Fetch recent users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, full_name, email, created_at, role')
        .order('created_at', { ascending: false })
        .limit(5);

      if (usersData) {
        activities.push(...usersData.map(item => ({
          id: `user-${item.id}`,
          type: 'user' as const,
          title: item.full_name || item.email,
          description: 'Novo usuário registrado',
          created_at: item.created_at,
          status: item.role
        })));
      }

      // Sort all activities by created_at
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setActivities(activities.slice(0, 10));
    } catch (error) {
      console.error('Erro ao carregar atividades recentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'news':
        return <FileText className="h-4 w-4" />;
      case 'concurso':
        return <Trophy className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'publicado':
        return 'default';
      case 'rascunho':
        return 'secondary';
      case 'admin':
        return 'destructive';
      case 'editor':
        return 'default';
      case 'user':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Há alguns minutos';
    } else if (diffInHours < 24) {
      return `Há ${diffInHours} horas`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Há ${diffInDays} dias`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="h-8 w-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>
          Últimas atividades do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Nenhuma atividade recente
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(activity.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    {activity.status && (
                      <Badge variant={getStatusVariant(activity.status)} className="text-xs">
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};