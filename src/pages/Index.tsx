import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { NewsSection } from "@/components/sections/NewsSection";
import { ConcursosSection } from "@/components/sections/ConcursosSection";
import { Footer } from "@/components/sections/Footer";
import { PopulationDetailsSection } from "@/components/sections/PopulationDetailsSection";
import { MunicipalityCharacterization } from "@/components/sections/MunicipalityCharacterization";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloatingElements } from "@/components/ui/floating-elements";
import { 
  ArrowRightIcon, 
  TrendingUpIcon, 
  UsersIcon, 
  BuildingIcon, 
  MapIcon,
  ShieldCheckIcon,
  ClockIcon,
  PhoneIcon,
  SparklesIcon,
  StarIcon,
  GlobeIcon,
  FileTextIcon,
  AwardIcon,
  BookOpenIcon,
  GraduationCapIcon,
  HeartIcon,
  SproutIcon,
  PickaxeIcon,
  PaletteIcon,
  CpuIcon,
  ZapIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useMunicipalStats } from "@/hooks/useMunicipalStats";
import { useDepartamentos } from "@/hooks/useDepartamentos";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import { usePopulationData } from "@/hooks/usePopulationData";
import { useSetoresEstrategicos } from "@/hooks/useSetoresEstrategicos";

const Index = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  // Real data hooks
  const { settings } = useSiteSettings();
  const { stats, loading: statsLoading } = useMunicipalStats();
  const { direcoes: direccoes, loading: direccoesLoading } = useDepartamentos();
  const { contacts: emergencyContacts, loading: emergencyLoading } = useEmergencyContacts();
  const { 
    currentPopulation, 
    growthRate, 
    growthDescription, 
    period, 
    loading: populationLoading, 
    error: populationError 
  } = usePopulationData();
  const { setores, loading: setoresLoading } = useSetoresEstrategicos();

  // Interactive mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    setIsVisible(true);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Transform departments into service cards
  const getServiceIcon = (codigo: string | null) => {
    switch (codigo) {
      case 'EDU': return '📚';
      case 'SAU': return '🏥';
      case 'OBR': return '🚧';
      case 'AGR': return '🌾';
      case 'FIN': return '💰';
      case 'SEG': return '🛡️';
      case 'CUL': return '🎭';
      case 'AGU': return '💧';
      default: return '🏛️';
    }
  };

  const getServiceGradient = (codigo: string | null) => {
    switch (codigo) {
      case 'EDU': return 'from-blue-500 to-cyan-500';
      case 'SAU': return 'from-emerald-500 to-green-500';
      case 'OBR': return 'from-orange-500 to-red-500';
      case 'AGR': return 'from-green-500 to-emerald-500';
      case 'FIN': return 'from-yellow-500 to-orange-500';
      case 'SEG': return 'from-gray-500 to-slate-500';
      case 'CUL': return 'from-purple-500 to-pink-500';
      case 'AGU': return 'from-blue-500 to-teal-500';
      default: return 'from-primary to-secondary';
    }
  };

  // Filter main service departments (limit to 6)
  const mainDirecoes = (direccoes || [])
    .filter(dept => ['EDU', 'SAU', 'OBR', 'AGR', 'FIN', 'CUL'].includes(dept.codigo || ''))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium Floating Elements */}
      <FloatingElements density="medium" color="gold" />

      <Header />
      
      <main>
        <Hero />
        
        {/* Municipality Statistics Section - Organized */}
        <Section variant="secondary" size="lg" className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-orange-500/10" />
          
          <SectionHeader
            subtitle="Chipindo em Números"
            title={
              <span>
                Nossa{' '}
                <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
                  Comunidade
                </span>
              </span>
            }
            description="Dados oficiais sobre população, infraestrutura e desenvolvimento do município de Chipindo"
            centered={true}
          />
          
          <SectionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard
                icon={UsersIcon}
                label="População"
                value={populationLoading ? '...' : (currentPopulation || 0).toLocaleString('pt-AO')}
                description={populationError ? 'Erro ao carregar dados' : 'Habitantes registados'}
                variant="elevated"
                size="lg"
                className="hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20"
                loading={populationLoading}
              />
              
              <StatCard
                icon={BuildingIcon}
                label="Direcções"
                value={statsLoading ? '...' : stats.totalDirecoes.toString()}
                description="Direcções ativas"
                variant="elevated"
                size="lg"
                className="hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20"
                loading={statsLoading}
              />
              
              <StatCard
                icon={FileTextIcon}
                label="Publicações"
                value={statsLoading ? '...' : stats.totalNews.toString()}
                description="Notícias publicadas"
                variant="elevated"
                size="lg"
                className="hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20"
                loading={statsLoading}
              />
              
              <StatCard
                icon={MapIcon}
                label="Área Total"
                value={settings?.area_total_count || '2.100'}
                description={settings?.area_total_description || 'Quilómetros quadrados'}
                variant="elevated"
                size="lg"
                className="hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/20"
              />
            </div>

            {/* Additional Statistics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <StatCard
                icon={AwardIcon}
                label="Concursos"
                value={statsLoading ? '...' : stats.totalConcursos.toString()}
                description="Oportunidades ativas"
                variant="glass"
                size="md"
                className="hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/20"
                loading={statsLoading}
              />

              <StatCard
                icon={TrendingUpIcon}
                label="Crescimento"
                value={populationLoading ? '...' : `${growthRate.toFixed(1)}%`}
                description={populationError ? 'Erro ao carregar dados' : `${growthDescription} (${period})`}
                variant="glass"
                size="md"
                className="hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20"
                trend={{ value: growthRate, isPositive: growthRate > 0 }}
                loading={populationLoading}
              />
            </div>
          </SectionContent>
        </Section>

        {/* Population Details Section */}
        <PopulationDetailsSection />

        {/* Municipality Characterization Section */}
        <MunicipalityCharacterization />

        {/* Services Section - Only show if we have directions */}
        {mainDirecoes.length > 0 && (
          <Section variant="default" size="lg" pattern="dots" className="relative">
            {/* Background gradient effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-red-500/5 transition-all duration-1000"
              style={{
                transform: `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px)`
              }}
            />
            
            <SectionHeader
              subtitle="Serviços Municipais"
              title={
                <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent font-bold">
                  Direcções Ativas
                </span>
              }
              description="Conheça as principais direcções da Administração Municipal que servem a comunidade de Chipindo"
              centered={true}
              className="relative z-10"
            />
            
            <SectionContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mainDirecoes.map((direccao) => (
                  <Card 
                    key={direccao.id} 
                    className={cn(
                      "group overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700",
                      "hover:scale-105 hover:-translate-y-2 cursor-pointer relative"
                    )}
                  >
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getServiceGradient(direccao.codigo)} opacity-0 group-hover:opacity-10 transition-all duration-500`} />
                    
                    <CardContent className="p-8 relative">
                      <div className="text-center space-y-6">
                        {/* Icon with animation */}
                        <div className="relative">
                          <div className="text-6xl group-hover:scale-125 transition-transform duration-500 mb-4">
                            {getServiceIcon(direccao.codigo)}
                          </div>
                          <Badge 
                            className={cn(
                              "absolute -top-2 -right-2 bg-gradient-to-r",
                              getServiceGradient(direccao.codigo),
                              "text-white border-0 shadow-lg font-bold"
                            )}
                          >
                            {direccao.codigo}
                          </Badge>
                        </div>
                        
                        {/* Content */}
                        <div>
                          <h3 className="text-xl font-bold text-foreground group-hover:bg-gradient-to-r group-hover:from-yellow-500 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                            {direccao.nome}
                          </h3>
                          {direccao.descricao && (
                            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                              {direccao.descricao}
                            </p>
                          )}
                        </div>
                        
                        {/* Action button */}
                        <Button 
                          size="sm" 
                          className={cn(
                            "w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600",
                            "text-white font-semibold border-0 shadow-lg hover:shadow-xl transition-all duration-500",
                            "hover:scale-105 group/btn"
                          )}
                          onClick={() => window.location.href = '/servicos'}
                        >
                          Ver Serviços
                          <ArrowRightIcon className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SectionContent>
          </Section>
        )}

        {/* Sectores Estratégicos Section */}
        <Section variant="default" size="lg" className="relative overflow-hidden">
          <SectionContent>
            <SectionHeader className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <BuildingIcon className="w-10 h-10 text-primary" />
                  <div className="absolute inset-0 w-10 h-10 bg-primary/20 rounded-full animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold">
                  <span className="text-foreground">Setores</span>{' '}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Estratégicos
                  </span>
                </h2>
              </div>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
                Explore os sectores estratégicos do município de Chipindo e descubra oportunidades, 
                programas e informações detalhadas sobre cada área
              </p>
            </SectionHeader>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {setoresLoading ? (
                // Loading state
                Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4" />
                      <div className="h-6 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded mb-4" />
                      <div className="h-8 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))
              ) : setores.length > 0 ? (
                // Dynamic data from database
                setores.map((setor, index) => {
                  // Map icon names to components
                  const getIconComponent = (iconName: string) => {
                    switch (iconName) {
                      case 'GraduationCap': return GraduationCapIcon;
                      case 'Heart': return HeartIcon;
                      case 'Sprout': return SproutIcon;
                      case 'Pickaxe': return PickaxeIcon;
                      case 'TrendingUp': return TrendingUpIcon;
                      case 'Palette': return PaletteIcon;
                      case 'Cpu': return CpuIcon;
                      case 'Zap': return ZapIcon;
                      default: return BuildingIcon;
                    }
                  };
                  
                  const IconComponent = getIconComponent(setor.icone);
                  
                  return (
                    <Card key={setor.id} className="group hover:shadow-elegant transition-all duration-300 cursor-pointer overflow-hidden">
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors"
                            style={{ backgroundColor: setor.cor_primaria + '20' }}
                          >
                            <IconComponent className="w-8 h-8" style={{ color: setor.cor_primaria }} />
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {setor.nome}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {setor.descricao.substring(0, 60)}...
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          onClick={() => window.location.href = `/${setor.slug}`}
                        >
                          Ver Detalhes
                          <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                // No data state
                <div className="col-span-full text-center py-12">
                  <BuildingIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum setor encontrado</h3>
                  <p className="text-muted-foreground">
                    Os sectores estratégicos serão carregados em breve.
                  </p>
                </div>
              )}
            </div>

            <div className="text-center mt-8">
              <Button 
                variant="institutional" 
                size="lg"
                onClick={() => window.location.href = '/services'}
                className="group"
              >
                Ver Todos os Serviços
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </SectionContent>
        </Section>

        <NewsSection />
        <ConcursosSection />

        {/* Emergency Contact Section - Organized */}
        {!emergencyLoading && emergencyContacts.length > 0 && (
          <Section variant="primary" size="md" className="relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, currentColor 2px, transparent 2px),
                                 radial-gradient(circle at 80% 50%, currentColor 3px, transparent 3px)`,
                backgroundSize: '100px 100px, 120px 120px',
                backgroundPosition: '0 0, 50px 50px'
              }} />
            </div>
            
            <SectionContent className="relative z-10">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="relative">
                      <ShieldCheckIcon className="w-10 h-10 text-primary-foreground" />
                      <div className="absolute inset-0 w-10 h-10 bg-white/20 rounded-full animate-ping" />
                    </div>
                    <h3 className="text-3xl font-bold">
                      <span className="text-primary-foreground">Contactos de</span>{' '}
                      <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                        Emergência
                      </span>
                    </h3>
                  </div>
                  <p className="text-primary-foreground/95 max-w-3xl mx-auto text-lg">
                    Em caso de emergência, contacte imediatamente os serviços de emergência oficiais do município
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {emergencyContacts
                    .sort((a, b) => a.priority - b.priority)
                    .slice(0, 3)
                    .map((contact) => (
                    <Card key={contact.id} className="bg-primary-foreground/20 backdrop-blur-xl border-primary-foreground/30 hover:bg-primary-foreground/30 transition-all duration-300 group">
                      <CardContent className="flex items-center gap-4 p-6">
                        <div className="relative">
                          <PhoneIcon className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        </div>
                        <div className="text-left">
                          <p className="text-primary-foreground font-bold text-lg">{contact.name}</p>
                          <p className="text-primary-foreground/90 text-sm">{contact.phone}</p>
                          {contact.description && (
                            <p className="text-primary-foreground/70 text-xs">{contact.description}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* General emergency info */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Card className="bg-primary-foreground/20 backdrop-blur-xl border-primary-foreground/30 hover:bg-primary-foreground/30 transition-all duration-300 group">
                    <CardContent className="flex items-center gap-4 p-6">
                      <ClockIcon className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-left">
                        <p className="text-primary-foreground font-bold text-lg">Disponível 24h</p>
                        <p className="text-primary-foreground/90 text-sm">Atendimento permanente</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary-foreground/20 backdrop-blur-xl border-primary-foreground/30 hover:bg-primary-foreground/30 transition-all duration-300 group">
                    <CardContent className="flex items-center gap-4 p-6">
                      <GlobeIcon className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-left">
                        <p className="text-primary-foreground font-bold text-lg">Cobertura Total</p>
                        <p className="text-primary-foreground/90 text-sm">Todo o município</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </SectionContent>
          </Section>
        )}

      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
