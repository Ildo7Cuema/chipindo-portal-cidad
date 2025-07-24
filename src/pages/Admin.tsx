import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { User, Session } from '@supabase/supabase-js';
import { LogOut, Plus, Edit, Eye, Users } from "lucide-react";
import { NewsManager } from "@/components/admin/NewsManager";
import { ConcursosManager } from "@/components/admin/ConcursosManager";
import { UserManager } from "@/components/admin/UserManager";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { SiteContentManager } from "@/components/admin/SiteContentManager";
import { useUserRole } from "@/hooks/useUserRole";

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Get user role and permissions
  const { profile, loading: roleLoading, isAdmin, canManageContent, role } = useUserRole(user);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          setTimeout(() => {
            navigate("/auth");
          }, 100);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o logout.",
        variant: "destructive",
      });
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user || !canManageContent) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
            <p className="text-muted-foreground mb-6">
              Você não tem permissões para acessar esta área.
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              Voltar ao Início
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getRoleLabel = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return 'Administrador';
      case 'editor':
        return 'Editor';
      default:
        return 'Usuário';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">
              {profile?.full_name || user.email} - {getRoleLabel(role)}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-6' : 'grid-cols-4'}`}>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="news">Notícias</TabsTrigger>
            <TabsTrigger value="concursos">Concursos</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            {isAdmin && <TabsTrigger value="users">Usuários</TabsTrigger>}
            {isAdmin && <TabsTrigger value="settings">Configurações</TabsTrigger>}
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="news">
            <NewsManager />
          </TabsContent>

          <TabsContent value="concursos">
            <ConcursosManager />
          </TabsContent>

          <TabsContent value="content">
            <SiteContentManager />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users">
              <UserManager currentUserRole={role} />
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="settings">
              <SystemSettings />
            </TabsContent>
          )}
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;