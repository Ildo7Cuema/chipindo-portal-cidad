import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { SetorBreadcrumb } from "@/components/ui/setor-breadcrumb";
import { SetorNavigation } from "@/components/ui/setor-navigation";
import { SetorStats } from "@/components/ui/setor-stats";
import { SectorHero } from "@/components/ui/setor-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCapIcon,
  BookOpenIcon,
  UsersIcon,
  BuildingIcon,
  HeartHandshakeIcon,
  LightbulbIcon,
  TargetIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  TrendingUpIcon
} from "lucide-react";
import { useSetoresEstrategicos } from "@/hooks/useSetoresEstrategicos";
import { SetorCompleto } from "@/hooks/useSetoresEstrategicos";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CandidaturaForm } from "@/components/ui/candidatura-form";
import { InscricaoProgramaForm } from "@/components/ui/inscricao-programa-form";

const Educacao = () => {
  const { getSetorBySlug } = useSetoresEstrategicos();
  const [setor, setSetor] = useState<SetorCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCandidatura, setOpenCandidatura] = useState(false);
  const [openDetalhes, setOpenDetalhes] = useState(false);
  const [detalheInfra, setDetalheInfra] = useState<any>(null);
  const [oportunidadeSelecionada, setOportunidadeSelecionada] = useState<string>("");
  const [openInscricaoPrograma, setOpenInscricaoPrograma] = useState(false);
  const [programaSelecionado, setProgramaSelecionado] = useState<string>("");
  const [activeTab, setActiveTab] = useState("programas");

  // Função para scroll suave para as abas
  const scrollToTabs = () => {
    const tabsElement = document.querySelector('[data-tabs-container]');
    if (tabsElement) {
      tabsElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Função para explorar programas
  const handleExplorarProgramas = () => {
    setActiveTab("programas");
    scrollToTabs();
  };

  // Função para ver oportunidades
  const handleVerOportunidades = () => {
    setActiveTab("oportunidades");
    scrollToTabs();
  };

  useEffect(() => {
    let isMounted = true;
    const loadSetor = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSetorBySlug('educacao');
        if (!isMounted) return;
        // Garantir que arrays são arrays (parse se vierem como string)
        if (data) {
          data.estatisticas = Array.isArray(data.estatisticas) ? data.estatisticas : [];
          data.programas = Array.isArray(data.programas) ? data.programas : [];
          data.oportunidades = Array.isArray(data.oportunidades) ? data.oportunidades : [];
          data.infraestruturas = Array.isArray(data.infraestruturas) ? data.infraestruturas : [];
          data.contactos = Array.isArray(data.contactos) ? data.contactos : [];
        }
        setSetor(data);
      } catch (err) {
        setError('Erro ao carregar dados do sector.');
        setSetor(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadSetor();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !setor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-bold text-muted-foreground mb-4">
              {error || 'Sector não encontrado'}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              O sector de Educação não está disponível no momento.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Função para obter o ícone pelo nome
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      GraduationCap: GraduationCapIcon,
      BookOpen: BookOpenIcon,
      Users: UsersIcon,
      Building: BuildingIcon,
      HeartHandshake: HeartHandshakeIcon,
      TrendingUp: TrendingUpIcon,
      Calendar: CalendarIcon,
      MapPin: MapPinIcon,
      Phone: PhoneIcon,
      Mail: MailIcon,
      CheckCircle: CheckCircleIcon,
      Star: StarIcon
    };
    return iconMap[iconName] || BuildingIcon;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-3 sm:px-4 pt-4 md:pt-6">
        <SetorBreadcrumb setor={setor} />
      </div>

      {/* Modern Hero Section */}
      <SectorHero
        setor={setor}
        onExplorarProgramas={handleExplorarProgramas}
        onVerOportunidades={handleVerOportunidades}
      />

      <main className="container mx-auto px-3 sm:px-4 py-6 md:py-12">
        {/* Breadcrumb */}
        <SetorBreadcrumb setor={setor} />

        {/* Navigation */}
        <SetorNavigation setor={setor} />

        {/* Statistics */}
        <SetorStats setor={setor} />

        {/* Content Tabs */}
        <div data-tabs-container>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8 md:mb-16">
            <div className="overflow-x-auto -mx-3 sm:-mx-4 px-3 sm:px-4 scrollbar-hide scroll-smooth overscroll-x-contain">
              <TabsList className="inline-flex w-full min-w-max gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-muted/50 rounded-xl backdrop-blur-sm">
                <TabsTrigger 
                  value="programas" 
                  className="flex-1 min-w-[140px] text-xs sm:text-sm px-4 sm:px-5 py-3 sm:py-3 min-h-[48px] sm:min-h-[44px] rounded-xl font-medium transition-all duration-200 active:scale-[0.98] touch-manipulation data-[state=active]:shadow-md"
                >
                  <GraduationCapIcon className="w-4 h-4 mr-2 shrink-0" />
                  <span className="truncate">Programas Educativos</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="oportunidades" 
                  className="flex-1 min-w-[130px] text-xs sm:text-sm px-4 sm:px-5 py-3 sm:py-3 min-h-[48px] sm:min-h-[44px] rounded-xl font-medium transition-all duration-200 active:scale-[0.98] touch-manipulation data-[state=active]:shadow-md"
                >
                  <TargetIcon className="w-4 h-4 mr-2 shrink-0" />
                  <span className="truncate">Oportunidades</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="programas" className="mt-5 sm:mt-6 md:mt-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {(setor?.programas || []).map((programa, index) => (
                  <Card 
                    key={index} 
                    className="hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-1 border-0 bg-white dark:bg-gray-800 overflow-hidden group rounded-xl shadow-sm"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="h-1.5 sm:h-1 bg-gradient-to-r from-blue-500 to-indigo-600 w-full" />
                    <CardHeader className="p-4 sm:p-5 md:p-6 pb-3 sm:pb-4">
                      <CardTitle className="flex items-center gap-3 group-hover:text-blue-600 transition-colors duration-200 text-base sm:text-lg md:text-xl">
                        <div className="p-2.5 sm:p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shrink-0">
                          <GraduationCapIcon className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </div>
                        <span className="line-clamp-2">{programa.titulo}</span>
                      </CardTitle>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-2">{programa.descricao}</p>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-5 p-4 sm:p-5 md:p-6 pt-0">
                      <div className="space-y-2.5 sm:space-y-3">
                        <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 sm:w-4 sm:h-4 text-green-500" />
                          Benefícios
                        </h4>
                        <ul className="grid gap-2 sm:gap-2.5">
                          {(programa.beneficios || []).map((beneficio, idx) => (
                            <li key={idx} className="text-sm sm:text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2.5 leading-relaxed">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0" />
                              {beneficio}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2.5 sm:space-y-3">
                        <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <StarIcon className="w-4 h-4 sm:w-4 sm:h-4 text-blue-500" />
                          Requisitos
                        </h4>
                        <ul className="grid gap-2 sm:gap-2.5">
                          {(programa.requisitos || []).map((requisito, idx) => (
                            <li key={idx} className="text-sm sm:text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2.5 leading-relaxed">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                              {requisito}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 sm:pt-5 border-t border-gray-100 dark:border-gray-700 mt-auto">
                        <p className="text-sm text-gray-500 mb-4 flex items-center gap-2.5">
                          <PhoneIcon className="w-4 h-4 shrink-0" />
                          <strong>Contacto:</strong> <span className="truncate">{programa.contacto}</span>
                        </p>
                        <Button
                          className="w-full h-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30 rounded-xl transition-all duration-200 active:scale-[0.98] touch-manipulation text-sm sm:text-base font-medium"
                          onClick={() => {
                            setProgramaSelecionado(programa.titulo);
                            setOpenInscricaoPrograma(true);
                          }}
                        >
                          Inscrever-se Agora
                          <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="oportunidades" className="mt-5 sm:mt-6 md:mt-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {(setor?.oportunidades || []).map((oportunidade, index) => (
                  <Card 
                    key={index} 
                    className="hover:shadow-xl transition-all duration-300 ease-out rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:-translate-y-0.5 group"
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    <CardHeader className="p-4 sm:p-5 md:p-6 pb-3 sm:pb-4">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs sm:text-sm px-2.5 sm:px-3 py-1 min-h-[28px] flex items-center">
                          {oportunidade.vagas} vagas
                        </Badge>
                        <Badge variant="outline" className="text-[11px] sm:text-xs px-2.5 py-1 min-h-[28px] flex items-center">
                          Prazo: {oportunidade.prazo ? new Date(oportunidade.prazo).toLocaleDateString('pt-AO') : '-'}
                        </Badge>
                      </div>
                      <CardTitle className="text-base sm:text-lg md:text-xl leading-tight">{oportunidade.titulo}</CardTitle>
                      <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{oportunidade.descricao}</p>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4 sm:p-5 md:p-6 pt-0">
                      <div>
                        <h4 className="font-semibold mb-2 text-xs sm:text-sm uppercase tracking-wide text-gray-500">Requisitos:</h4>
                        <ul className="space-y-1.5 sm:space-y-2">
                          {(oportunidade.requisitos || []).map((req, idx) => (
                            <li key={idx} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2.5 leading-relaxed">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-xs sm:text-sm uppercase tracking-wide text-gray-500">Benefícios:</h4>
                        <ul className="space-y-1.5 sm:space-y-2">
                          {(oportunidade.beneficios || []).map((ben, idx) => (
                            <li key={idx} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2.5 leading-relaxed">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                              {ben}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-3 sm:pt-4">
                        <Button
                          variant="institutional"
                          className="w-full h-12 rounded-xl transition-all duration-200 active:scale-[0.98] touch-manipulation text-sm sm:text-base font-medium shadow-sm hover:shadow-md"
                          onClick={() => {
                            setOportunidadeSelecionada(oportunidade.titulo);
                            setOpenCandidatura(true);
                          }}
                        >
                          Candidatar-se
                          <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {setor?.infraestruturas && setor.infraestruturas.length > 0 && (
          <section className="mb-8 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-10">
              Infraestruturas Educativas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {setor?.infraestruturas.map((infra, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-xl transition-all duration-300 ease-out rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:-translate-y-0.5 group"
                >
                  <CardHeader className="p-4 sm:p-5 md:p-6 pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
                      <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 shrink-0">
                        <BuildingIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <span className="line-clamp-2">{infra.nome}</span>
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <MapPinIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{infra.localizacao}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-5 md:p-6 pt-0">
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <span className="text-sm font-medium">Capacidade:</span>
                      <Badge variant="outline" className="text-xs sm:text-sm min-h-[26px]">{infra.capacidade}</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <span className="text-sm font-medium">Estado:</span>
                      <Badge className={cn(
                        "text-xs sm:text-sm min-h-[26px]",
                        infra.estado === "Operacional" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      )}>
                        {infra.estado}
                      </Badge>
                    </div>
                    {infra.equipamentos && infra.equipamentos.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 text-xs sm:text-sm uppercase tracking-wide text-gray-500">Equipamentos:</h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {infra.equipamentos.map((equip, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[11px] sm:text-xs px-2.5 py-1 min-h-[24px]">
                              {equip}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-xl transition-all duration-200 active:scale-[0.98] touch-manipulation text-sm sm:text-base font-medium border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                        onClick={() => { setDetalheInfra(infra); setOpenDetalhes(true); }}
                      >
                        Ver Detalhes
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
        {setor?.contactos && setor.contactos.length > 0 && (
          <section className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-6 sm:mb-8 md:mb-10">
              Informações de Contacto
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {setor?.contactos.map((contacto, index) => (
                <div key={index} className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/80">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BuildingIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Endereço</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{contacto.endereco}</p>
                </div>
              ))}
              {setor?.contactos.map((contacto, index) => (
                <div key={`phone-${index}`} className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/80">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Telefone</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{contacto.telefone}</p>
                </div>
              ))}
              {setor?.contactos.map((contacto, index) => (
                <div key={`email-${index}`} className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/80">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <MailIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Email</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground break-all">{contacto.email}</p>
                </div>
              ))}
              {setor?.contactos.map((contacto, index) => (
                <div key={`hours-${index}`} className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/80">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Horário</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{contacto.horario}</p>
                </div>
              ))}
            </div>
            {setor?.contactos.map((contacto, index) => (
              <div key={`responsavel-${index}`} className="text-center mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm sm:text-base text-muted-foreground">
                  <strong>Responsável:</strong> {contacto.responsavel}
                </p>
              </div>
            ))}
          </section>
        )}
      </main>
      {/* Navegação entre Sectores */}
      <section className="bg-gradient-to-b from-muted/30 to-muted/10 py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <SetorNavigation />
        </div>
      </section>
      <Footer />
      {/* Modais */}
      <CandidaturaForm
        open={openCandidatura}
        onOpenChange={setOpenCandidatura}
        setor="Educação"
        oportunidade={oportunidadeSelecionada}
        onSuccess={() => {
          setOportunidadeSelecionada("");
        }}
      />
      <InscricaoProgramaForm
        open={openInscricaoPrograma}
        onOpenChange={setOpenInscricaoPrograma}
        setor="Educação"
        programa={programaSelecionado}
        onSuccess={() => {
          setProgramaSelecionado("");
        }}
      />
      <Dialog open={openDetalhes} onOpenChange={setOpenDetalhes}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-[95vw] max-w-lg md:max-w-xl mx-auto rounded-2xl max-h-[90vh] sm:max-h-[90vh] overflow-y-auto overscroll-contain scroll-smooth p-5 sm:p-6 md:p-8">
          <DialogHeader className="pb-4 sm:pb-5">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold">Detalhes da Infraestrutura</DialogTitle>
            <DialogDescription asChild>
              {detalheInfra && (
                <div className="space-y-4 mt-4 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-500">Nome:</span>
                    <span className="text-base">{detalheInfra.nome || detalheInfra.title}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-500">Localização:</span>
                    <span className="text-base">{detalheInfra.localizacao}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-500">Capacidade:</span>
                    <span className="text-base">{detalheInfra.capacidade}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-500">Estado:</span>
                    <Badge className={cn(
                      "w-fit text-sm",
                      detalheInfra.estado === "Operacional" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    )}>
                      {detalheInfra.estado}
                    </Badge>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-500 block mb-2">Equipamentos:</span>
                    <div className="flex flex-wrap gap-2">
                      {detalheInfra.equipamentos?.map((equip: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs sm:text-sm px-3 py-1">
                          {equip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 sm:pt-5 mt-auto sticky bottom-0 bg-background pb-safe">
            <Button 
              onClick={() => setOpenDetalhes(false)}
              className="w-full h-12 sm:h-12 rounded-xl transition-all duration-200 active:scale-[0.98] touch-manipulation text-base font-medium"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Educacao; 