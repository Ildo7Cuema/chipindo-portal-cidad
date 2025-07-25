import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { cn } from "@/lib/utils";
import { 
  ShieldCheckIcon, 
  KeyIcon, 
  UserPlusIcon, 
  LogInIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  BuildingIcon,
  ShieldIcon,
  StarIcon
} from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [checkingUsers, setCheckingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState("signin");
  const navigate = useNavigate();

  // Função para calcular força da senha
  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 10;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthLabel = (strength: number) => {
    if (strength < 25) return { label: "Muito Fraca", color: "bg-red-500" };
    if (strength < 50) return { label: "Fraca", color: "bg-orange-500" };
    if (strength < 75) return { label: "Média", color: "bg-yellow-500" };
    return { label: "Forte", color: "bg-green-500" };
  };

  useEffect(() => {
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  }, [password]);

  // Debug effect to monitor allowRegistration changes
  useEffect(() => {
    console.log('allowRegistration state changed to:', allowRegistration);
  }, [allowRegistration]);

      useEffect(() => {
    console.log('Auth page mounted, justRegistered:', justRegistered);
    
    // Check if registration should be allowed (only if no admin exists)
    const checkAdminExists = async () => {
      setCheckingUsers(true);
      try {
        console.log('Checking if admin user exists...');
        
        // Primeira tentativa: RPC function
        console.log('Trying RPC check_admin_exists...');
        const { data: adminExists, error: rpcError } = await supabase
          .rpc('check_admin_exists');
        
        if (rpcError) {
          console.log('RPC failed:', rpcError.message);
          
          // Segunda tentativa: Query direta simples
          console.log('Trying simple direct query...');
          const { data: profiles, error: queryError } = await supabase
            .from('profiles')
            .select('role')
            .eq('role', 'admin')
            .limit(1);
          
          if (queryError) {
            console.log('Direct query failed:', queryError.message);
            
            // Terceira tentativa: Query mais genérica
            console.log('Trying generic query...');
            const { data: allProfiles, error: genericError } = await supabase
              .from('profiles')
              .select('role');
            
            if (genericError) {
              console.error('All queries failed:', genericError.message);
              console.log('Defaulting to allow registration');
              setAllowRegistration(true);
            } else {
              console.log('Generic query successful, profiles:', allProfiles);
                             const hasAdmin = allProfiles?.some(p => 
                 p.role === 'admin' || 
                 String(p.role).toLowerCase() === 'admin'
               );
              console.log('Admin found via generic query:', hasAdmin);
              setAllowRegistration(!hasAdmin);
            }
          } else {
            console.log('Direct query successful:', profiles);
            const hasAdmin = profiles && profiles.length > 0;
            console.log('Admin found via direct query:', hasAdmin);
            setAllowRegistration(!hasAdmin);
          }
        } else {
          console.log('RPC successful! Admin exists:', adminExists);
          setAllowRegistration(!adminExists);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        console.log('Allowing registration due to error');
        setAllowRegistration(true);
      } finally {
        setCheckingUsers(false);
      }
    };

    checkAdminExists();
    
    // Debug: Log current state
    console.log('Initial state - allowRegistration:', allowRegistration);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change - event:', event, 'session:', !!session, 'justRegistered:', justRegistered);
        setSession(session);
        setUser(session?.user ?? null);
        
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
        supabase
          .from('profiles')
          .select('id, role')
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
        await supabase.auth.signOut();
        console.log('User signed out successfully');
        toast({
          title: "Conta criada com sucesso",
          description: "Agora você pode fazer login com suas credenciais.",
        });
        setEmail("");
        setPassword("");
        setFullName("");
        setActiveTab("signin");
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

  const securityFeatures = [
    {
      icon: ShieldCheckIcon,
      title: "Autenticação Segura",
      description: "Proteção avançada com criptografia de ponta"
    },
    {
      icon: LockIcon,
      title: "Dados Protegidos",
      description: "Informações municipais mantidas em segurança"
    },
    {
      icon: ShieldIcon,
      title: "Acesso Controlado",
      description: "Apenas pessoal autorizado pode acessar"
    }
  ];

  if (checkingUsers) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Section variant="primary" size="lg">
            <SectionContent>
              <div className="text-center space-y-6">
                <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
                <Skeleton className="h-12 w-96 mx-auto" />
                <Skeleton className="h-6 w-64 mx-auto" />
                <div className="flex justify-center gap-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </SectionContent>
          </Section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Section variant="primary" size="lg">
          <SectionContent>
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Área Administrativa
                  </h1>
                  <p className="text-primary-foreground/90 text-lg">
                    Portal de Chipindo
                  </p>
                </div>
              </div>
              
              <p className="text-xl text-primary-foreground/95 max-w-3xl mx-auto leading-relaxed">
                Acesso seguro ao sistema de gestão municipal. 
                Plataforma restrita para administradores e editores autorizados.
              </p>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <LockIcon className="w-4 h-4 mr-2" />
                  Sistema Seguro
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-4 py-2">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Acesso Controlado
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 px-4 py-2">
                  <StarIcon className="w-4 h-4 mr-2" />
                  Administração Municipal
                </Badge>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Authentication Section */}
        <Section variant="muted" size="md">
          <SectionContent>
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Auth Form */}
                <div className="order-2 lg:order-1">
                  <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                    <CardHeader className="text-center space-y-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                        <KeyIcon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">
                        {allowRegistration ? "Autenticação" : "Login Administrativo"}
                      </CardTitle>
                                             <CardDescription className="text-base">
                         {allowRegistration 
                           ? "Configure o primeiro administrador do sistema ou entre com uma conta existente"
                           : "Acesse o painel de administração do Portal de Chipindo"
                         }
                      </CardDescription>
                    </CardHeader>
                    
                                         <CardContent className="space-y-6">
                       {/* Debug info */}
                       {process.env.NODE_ENV === 'development' && (
                         <div className="text-xs text-muted-foreground p-2 bg-muted/20 rounded mb-4">
                           <strong>Debug Info:</strong><br/>
                           • allowRegistration: {allowRegistration.toString()}<br/>
                           • checkingUsers: {checkingUsers.toString()}<br/>
                           • Status: {checkingUsers ? 'Verificando...' : allowRegistration ? 'Sem admin - Registro permitido' : 'Admin existe - Só login'}
                         </div>
                       )}
                       
                       {allowRegistration ? (
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                          <TabsList className="grid w-full grid-cols-2 h-12">
                            <TabsTrigger value="signin" className="flex items-center gap-2">
                              <LogInIcon className="w-4 h-4" />
                              Entrar
                            </TabsTrigger>
                            <TabsTrigger value="signup" className="flex items-center gap-2">
                              <UserPlusIcon className="w-4 h-4" />
                              Registrar
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="signin" className="space-y-6">
                            <form onSubmit={handleSignIn} className="space-y-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="signin-email">Email Administrativo</Label>
                                  <div className="relative">
                                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                      id="signin-email"
                                      type="email"
                                      placeholder="admin@chipindo.gov.ao"
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      className="pl-10"
                                      required
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="signin-password">Senha</Label>
                                  <div className="relative">
                                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                      id="signin-password"
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Digite sua senha"
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      className="pl-10 pr-10"
                                      required
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                      onClick={() => setShowPassword(!showPassword)}
                                    >
                                      {showPassword ? (
                                        <EyeOffIcon className="w-4 h-4" />
                                      ) : (
                                        <EyeIcon className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              
                              <Button 
                                type="submit" 
                                className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-lg font-medium" 
                                disabled={loading}
                              >
                                {loading ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Entrando...
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <LogInIcon className="w-5 h-5" />
                                    Entrar no Sistema
                                  </div>
                                )}
                              </Button>
                            </form>
                          </TabsContent>

                          <TabsContent value="signup" className="space-y-6">
                                                         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                               <div className="flex items-center gap-2 mb-2">
                                 <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />
                                 <p className="font-medium text-yellow-800">Primeira Configuração</p>
                               </div>
                               <p className="text-sm text-yellow-700">
                                 Nenhum administrador foi encontrado no sistema. 
                                 Crie a conta principal do administrador para gerir o portal.
                               </p>
                             </div>
                            
                            <form onSubmit={handleSignUp} className="space-y-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="signup-name">Nome Completo do Administrador</Label>
                                  <div className="relative">
                                    <BuildingIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                      id="signup-name"
                                      type="text"
                                      placeholder="Nome do responsável pela administração"
                                      value={fullName}
                                      onChange={(e) => setFullName(e.target.value)}
                                      className="pl-10"
                                      required
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="signup-email">Email Institucional</Label>
                                  <div className="relative">
                                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                      id="signup-email"
                                      type="email"
                                      placeholder="admin@chipindo.gov.ao"
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      className="pl-10"
                                      required
                                    />
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Use um email institucional para maior segurança
                                  </p>
                                </div>
                                
                                <div className="space-y-3">
                                  <Label htmlFor="signup-password">Senha Segura</Label>
                                  <div className="relative">
                                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                      id="signup-password"
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Crie uma senha forte"
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      className="pl-10 pr-10"
                                      required
                                      minLength={8}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                      onClick={() => setShowPassword(!showPassword)}
                                    >
                                      {showPassword ? (
                                        <EyeOffIcon className="w-4 h-4" />
                                      ) : (
                                        <EyeIcon className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </div>
                                  
                                  {password && (
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Força da senha:</span>
                                        <span className={cn(
                                          "font-medium",
                                          passwordStrength < 50 ? "text-red-600" : 
                                          passwordStrength < 75 ? "text-yellow-600" : "text-green-600"
                                        )}>
                                          {getPasswordStrengthLabel(passwordStrength).label}
                                        </span>
                                      </div>
                                      <Progress 
                                        value={passwordStrength} 
                                        className={cn(
                                          "h-2",
                                          passwordStrength < 50 ? "[&>div]:bg-red-500" : 
                                          passwordStrength < 75 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-green-500"
                                        )}
                                      />
                                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                          {password.length >= 8 ? (
                                            <CheckCircleIcon className="w-3 h-3 text-green-600" />
                                          ) : (
                                            <XCircleIcon className="w-3 h-3 text-red-600" />
                                          )}
                                          8+ caracteres
                                        </div>
                                        <div className="flex items-center gap-1">
                                          {/[A-Z]/.test(password) ? (
                                            <CheckCircleIcon className="w-3 h-3 text-green-600" />
                                          ) : (
                                            <XCircleIcon className="w-3 h-3 text-red-600" />
                                          )}
                                          Maiúscula
                                        </div>
                                        <div className="flex items-center gap-1">
                                          {/[0-9]/.test(password) ? (
                                            <CheckCircleIcon className="w-3 h-3 text-green-600" />
                                          ) : (
                                            <XCircleIcon className="w-3 h-3 text-red-600" />
                                          )}
                                          Número
                                        </div>
                                        <div className="flex items-center gap-1">
                                          {/[^a-zA-Z0-9]/.test(password) ? (
                                            <CheckCircleIcon className="w-3 h-3 text-green-600" />
                                          ) : (
                                            <XCircleIcon className="w-3 h-3 text-red-600" />
                                          )}
                                          Símbolo
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <Button 
                                type="submit" 
                                className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-lg font-medium" 
                                disabled={loading || passwordStrength < 50}
                              >
                                {loading ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Criando conta...
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <UserPlusIcon className="w-5 h-5" />
                                    Criar Conta Administrativa
                                  </div>
                                )}
                              </Button>
                            </form>
                          </TabsContent>
                        </Tabs>
                      ) : (
                        <div className="space-y-6">
                                                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                             <div className="flex items-center gap-2 mb-2">
                               <InfoIcon className="w-5 h-5 text-blue-600" />
                               <p className="font-medium text-blue-800">Sistema Configurado</p>
                             </div>
                             <p className="text-sm text-blue-700">
                               O sistema já possui um administrador configurado. Apenas usuários autorizados podem fazer login.
                             </p>
                           </div>
                          
                          <form onSubmit={handleSignIn} className="space-y-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                  <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                  <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                  <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    required
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? (
                                      <EyeOffIcon className="w-4 h-4" />
                                    ) : (
                                      <EyeIcon className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-lg font-medium" 
                              disabled={loading}
                            >
                              {loading ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                  Entrando...
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <LogInIcon className="w-5 h-5" />
                                  Entrar
                                </div>
                              )}
                            </Button>
                          </form>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Security Features */}
                <div className="order-1 lg:order-2 space-y-8">
                  <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      Sistema Seguro e Confiável
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Tecnologia avançada protegendo as informações municipais de Chipindo
                    </p>
                  </div>

                  <div className="space-y-6">
                    {securityFeatures.map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <IconComponent className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10">
                    <h3 className="font-semibold text-foreground mb-4">Recursos do Sistema</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">99.9%</div>
                        <div className="text-xs text-muted-foreground">Uptime</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">256-bit</div>
                        <div className="text-xs text-muted-foreground">Encriptação</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                        <div className="text-xs text-muted-foreground">Monitorização</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">ISO</div>
                        <div className="text-xs text-muted-foreground">Certificado</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionContent>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;