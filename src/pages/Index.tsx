import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { AdministratorMessage } from "@/components/sections/AdministratorMessage";
import { NewsSection } from "@/components/sections/NewsSection";
import { ConcursosSection } from "@/components/sections/ConcursosSection";
import { Footer } from "@/components/sections/Footer";
import { MunicipalityCharacterization } from "@/components/sections/MunicipalityCharacterization";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingElements } from "@/components/ui/floating-elements";
import {
  ArrowRightIcon,
  UsersIcon,
  BuildingIcon,
  MapIcon,
  ShieldCheckIcon,
  ClockIcon,
  PhoneIcon,
  GlobeIcon,
  FileTextIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useMunicipalStats } from "@/hooks/useMunicipalStats";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import { usePopulationData } from "@/hooks/usePopulationData";

const Index = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Real data hooks
  const { settings } = useSiteSettings();
  const { stats, loading: statsLoading } = useMunicipalStats();
  const { contacts: emergencyContacts, loading: emergencyLoading } = useEmergencyContacts();
  const {
    currentPopulation,
    loading: populationLoading,
    error: populationError
  } = usePopulationData();

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

  // All sector pages (static list)
  const todosSetores = [
    { href: '/educacao', emoji: '📚', label: 'Educação', descricao: 'Ensino e formação académica', gradient: 'from-blue-500 to-cyan-500' },
    { href: '/saude', emoji: '🏥', label: 'Saúde', descricao: 'Serviços de saúde pública', gradient: 'from-emerald-500 to-green-500' },
    { href: '/agricultura', emoji: '🌾', label: 'Agricultura', descricao: 'Produção agrícola e pecuária', gradient: 'from-green-500 to-lime-500' },
    { href: '/setor-mineiro', emoji: '⛏️', label: 'Sector Mineiro', descricao: 'Recursos minerais e geologia', gradient: 'from-stone-500 to-zinc-500' },
    { href: '/desenvolvimento-economico', emoji: '📈', label: 'Desenvolvimento Económico', descricao: 'Crescimento e investimento local', gradient: 'from-yellow-500 to-orange-500' },
    { href: '/cultura', emoji: '🎭', label: 'Cultura', descricao: 'Artes, cultura e património', gradient: 'from-purple-500 to-pink-500' },
    { href: '/tecnologia', emoji: '💻', label: 'Tecnologia', descricao: 'Inovação e transformação digital', gradient: 'from-indigo-500 to-violet-500' },
    { href: '/energia-agua', emoji: '⚡', label: 'Energia e Água', descricao: 'Redes eléctricas e abastecimento', gradient: 'from-blue-500 to-teal-500' },
    { href: '/recursos-humanos', emoji: '👥', label: 'Recursos Humanos', descricao: 'Gestão de pessoal e emprego', gradient: 'from-indigo-500 to-purple-600' },
    { href: '/juridico', emoji: '⚖️', label: 'Jurídico', descricao: 'Assessoria legal e legislação', gradient: 'from-slate-500 to-gray-600' },
    { href: '/infraestrutura', emoji: '🏗️', label: 'Infraestrutura', descricao: 'Obras e construções municipais', gradient: 'from-orange-500 to-red-500' },
    { href: '/transporte', emoji: '🚌', label: 'Transporte', descricao: 'Mobilidade e transporte público', gradient: 'from-sky-500 to-blue-500' },
    { href: '/ambiente', emoji: '🌿', label: 'Ambiente', descricao: 'Protecção ambiental e recursos naturais', gradient: 'from-green-500 to-emerald-600' },
    { href: '/urbanismo', emoji: '🏙️', label: 'Urbanismo', descricao: 'Planeamento e ordenamento urbano', gradient: 'from-amber-500 to-yellow-500' },
    { href: '/fiscalizacao', emoji: '🔍', label: 'Fiscalização', descricao: 'Controlo, inspecção e regulação', gradient: 'from-red-500 to-rose-500' },
    { href: '/aniesa', emoji: '🛡️', label: 'ANIESA', descricao: 'Acção social e assistência à comunidade', gradient: 'from-teal-500 to-cyan-600' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium Floating Elements */}
      <FloatingElements density="medium" color="gold" />

      <Header />

      <main>
        <Hero />

        {/* Administrator Message Section */}
        <AdministratorMessage />

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
                variant="hero"
                size="lg"
                className="hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20"
                loading={populationLoading}
              />

              <StatCard
                icon={BuildingIcon}
                label="Direcções"
                value={statsLoading ? '...' : stats.totalDirecoes.toString()}
                description="Direcções activas"
                variant="hero"
                size="lg"
                className="hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20"
                loading={statsLoading}
              />

              <StatCard
                icon={FileTextIcon}
                label="Publicações"
                value={statsLoading ? '...' : stats.totalNews.toString()}
                description="Notícias publicadas"
                variant="hero"
                size="lg"
                className="hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20"
                loading={statsLoading}
              />

              <StatCard
                icon={MapIcon}
                label="Área Total"
                value={settings?.area_total_count || '2.100'}
                description={settings?.area_total_description || 'Quilómetros quadrados'}
                variant="hero"
                size="lg"
                className="hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/20"
              />
            </div>


          </SectionContent>
        </Section>

        {/* Municipality Characterization Section */}
        <MunicipalityCharacterization />



        {/* Services Section */}
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
                Direcções Activas
              </span>
            }
            description="Conheça as principais direcções da Administração Municipal que servem a comunidade de Chipindo"
            centered={true}
            className="relative z-10"
          />

          <SectionContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {todosSetores.map((setor) => (
                <Card
                  key={setor.href}
                  className={cn(
                    "group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500",
                    "hover:scale-105 hover:-translate-y-1 cursor-pointer relative"
                  )}
                  onClick={() => window.location.href = setor.href}
                >
                  {/* Top gradient bar */}
                  <div className={`h-1 bg-gradient-to-r ${setor.gradient} w-full`} />

                  <CardContent className="p-5 relative">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl group-hover:scale-125 transition-transform duration-300">
                        {setor.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                          {setor.label}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                          {setor.descricao}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Ver mais</span>
                      <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SectionContent>
        </Section>


        <NewsSection />
        <ConcursosSection />

        {/* Emergency Contact Section - Organized */}
        {
          !emergencyLoading && emergencyContacts.length > 0 && (
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
                      Em caso de emergência, contacte imediatamente os serviços de emergência oficiais do Município
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
                          <p className="text-primary-foreground/90 text-sm">Todo o Município</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </SectionContent>
            </Section>
          )
        }

      </main >

      <Footer />
    </div >
  );
};

export default Index;
