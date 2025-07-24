import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { User, Session } from '@supabase/supabase-js';

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [allowRegistration, setAllowRegistration] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth page mounted, justRegistered:', justRegistered);
    
    // Check if registration should be allowed (no existing users)
    const checkExistingUsers = async () => {
      try {
        console.log('Checking existing users...');
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error('Error checking existing users:', error);
          console.log('Setting allowRegistration to true due to error');
          setAllowRegistration(true); // Allow registration even on error for now
        } else {
          console.log('Existing users data:', data);
          const shouldAllowRegistration = !data || data.length === 0;
          console.log('Should allow registration:', shouldAllowRegistration);
          setAllowRegistration(shouldAllowRegistration);
        }
      } catch (error) {
        console.error('Error checking existing users:', error);
        console.log('Setting allowRegistration to true due to catch error');
        setAllowRegistration(true); // Allow registration even on error for now
      }
    };

    checkExistingUsers();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change - event:', event, 'session:', !!session, 'justRegistered:', justRegistered);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only redirect if user didn't just register and is signing in
        if (session?.user && !justRegistered) {
          console.log('Redirecting to admin...');
          setTimeout(() => {
            navigate("/admin");
          }, 100);
        } else if (session?.user && justRegistered) {
          console.log('User just registered, not redirecting');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', !!session, 'justRegistered:', justRegistered);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && !justRegistered) {
        console.log('Existing session found, but checking if user still exists in profiles...');
        // Check if the user profile still exists before redirecting
        supabase
          .from('profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle()
          .then(({ data, error }) => {
            if (error || !data) {
              console.log('User profile not found, signing out...');
              supabase.auth.signOut();
              setSession(null);
              setUser(null);
            } else {
              console.log('User profile exists, redirecting to admin...');
              navigate("/admin");
            }
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, justRegistered]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo à área administrativa!",
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Starting sign up process...');

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Sign up successful, setting justRegistered to true');
        setJustRegistered(true);
        console.log('Signing out user...');
        // Sign out immediately after registration to prevent auto-login
        await supabase.auth.signOut();
        console.log('User signed out successfully');
        toast({
          title: "Conta criada com sucesso",
          description: "Agora você pode fazer login com suas credenciais.",
        });
        // Clear the form and reset to login tab
        setEmail("");
        setPassword("");
        setFullName("");
        console.log('Form cleared, setting timeout to reset justRegistered');
        setTimeout(() => {
          console.log('Resetting justRegistered to false');
          setJustRegistered(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o registro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Área Administrativa</CardTitle>
              <CardDescription>
                Acesse o painel de administração do Portal de Chipindo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allowRegistration ? (
                <Tabs defaultValue="signin" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Entrar</TabsTrigger>
                    <TabsTrigger value="signup">Registrar</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Sua senha"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nome Completo</Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Seu nome completo"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Escolha uma senha segura"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Criando conta..." : "Criar Conta"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Sistema restrito - Apenas login
                    </p>
                  </div>
                  
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;