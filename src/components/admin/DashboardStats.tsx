import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Users, Trophy, Eye, TrendingUp, Calendar } from "lucide-react";
import { RecentActivity } from "./RecentActivity";

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
  const [data, setData] = useState<DashboardData>({
    totalNews: 0,
    publishedNews: 0,
    totalConcursos: 0,
    activeConcursos: 0,
    totalUsers: 0,
    recentActivity: {
      news: 0,
      concursos: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch news statistics
      const { data: newsData } = await supabase
        .from('news')
        .select('id, published, created_at');

      // Fetch concursos statistics
      const { data: concursosData } = await supabase
        .from('concursos')
        .select('id, published, deadline, created_at');

      // Fetch users count
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, created_at');

      // Calculate statistics
      const totalNews = newsData?.length || 0;
      const publishedNews = newsData?.filter(n => n.published).length || 0;
      
      const totalConcursos = concursosData?.length || 0;
      const activeConcursos = concursosData?.filter(c => 
        c.published && (!c.deadline || new Date(c.deadline) > new Date())
      ).length || 0;

      const totalUsers = usersData?.length || 0;

      // Recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentNews = newsData?.filter(n => 
        new Date(n.created_at) > sevenDaysAgo
      ).length || 0;

      const recentConcursos = concursosData?.filter(c => 
        new Date(c.created_at) > sevenDaysAgo
      ).length || 0;

      setData({
        totalNews,
        publishedNews,
        totalConcursos,
        activeConcursos,
        totalUsers,
        recentActivity: {
          news: recentNews,
          concursos: recentConcursos,
        },
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Notícias</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalNews}</div>
            <p className="text-xs text-muted-foreground">
              {data.publishedNews} publicadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concursos</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalConcursos}</div>
            <p className="text-xs text-muted-foreground">
              {data.activeConcursos} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Total cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notícias Recentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.recentActivity.news}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concursos Recentes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.recentActivity.concursos}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Publicação</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalNews > 0 ? Math.round((data.publishedNews / data.totalNews) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Notícias publicadas
            </p>
          </CardContent>
        </Card>
      </div>
      
      <RecentActivity />
    </div>
  );
};