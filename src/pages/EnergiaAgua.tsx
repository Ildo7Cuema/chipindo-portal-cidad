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
  ZapIcon,
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
  TrendingUpIcon,
  SparklesIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { CandidaturaForm } from "@/components/ui/candidatura-form";
import { InscricaoProgramaForm } from "@/components/ui/inscricao-programa-form";
import { useSetoresEstrategicos } from "@/hooks/useSetoresEstrategicos";
import { SetorCompleto } from "@/hooks/useSetoresEstrategicos";
import { cn } from "@/lib/utils";

const EnergiaAgua = () => {
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
        const data = await getSetorBySlug('energia-agua');
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !setor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-muted-foreground mb-4">
              {error || 'Sector não encontrado'}
            </h1>
            <p className="text-muted-foreground">
              O sector de EnergiaAgua não está disponível no momento.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Zap': ZapIcon,
      'Users': UsersIcon,
      'Building': BuildingIcon,
      'HeartHandshake': HeartHandshakeIcon,
      'Lightbulb': LightbulbIcon,
      'Target': TargetIcon,
      'Calendar': CalendarIcon,
      'MapPin': MapPinIcon,
      'Phone': PhoneIcon,
      'Mail': MailIcon,
      'ArrowRight': ArrowRightIcon,
      'CheckCircle': CheckCircleIcon,
      'Star': StarIcon,
      'TrendingUp': TrendingUpIcon
    };
    return iconMap[iconName] || ZapIcon;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <SectorHero
        setor={setor}
        onExplorarProgramas={handleExplorarProgramas}
        onVerOportunidades={handleVerOportunidades}
      />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <SetorBreadcrumb setor={setor} />

        {/* Navigation */}
        <SetorNavigation setor={setor} />

        {/* Statistics */}
        <SetorStats setor={setor} />

        {/* Content Tabs */}
        <div data-tabs-container>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8 md:mt-12">
            <TabsList className="flex w-full gap-1 md:gap-2 p-1.5 md:p-2 bg-muted/50 rounded-xl overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-2">
              <TabsTrigger 
                value="programas" 
                className="flex-shrink-0 min-h-[44px] min-w-[44px] text-xs sm:text-sm px-3 md:px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                <span className="truncate">Programas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="oportunidades" 
                className="flex-shrink-0 min-h-[44px] min-w-[44px] text-xs sm:text-sm px-3 md:px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                <span className="truncate">Oportunidades</span>
              </TabsTrigger>
              <TabsTrigger 
                value="infraestruturas" 
                className="flex-shrink-0 min-h-[44px] min-w-[44px] text-xs sm:text-sm px-3 md:px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                <span className="truncate">Infraestruturas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="contactos" 
                className="flex-shrink-0 min-h-[44px] min-w-[44px] text-xs sm:text-sm px-3 md:px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                <span className="truncate">Contactos</span>
              </TabsTrigger>
            </TabsList>

            {/* Programas */}
            <TabsContent value="programas" className="mt-6 md:mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {setor.programas.map((programa, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden rounded-xl hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                  >
                    <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 md:p-2 bg-cyan-100 rounded-xl">
                          <HeartHandshakeIcon className="w-5 h-5 text-cyan-600" />
                        </div>
                        <Badge className="bg-cyan-100 text-cyan-800 rounded-lg">
                          Programa
                        </Badge>
                      </div>
                      <CardTitle className="text-base md:text-lg">{programa.titulo}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {programa.descricao}
                      </p>
                    </CardHeader>

                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Benefícios:</h4>
                          <ul className="space-y-1.5">
                            {programa.beneficios?.map((beneficio: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{beneficio}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Requisitos:</h4>
                          <ul className="space-y-1.5">
                            {programa.requisitos?.map((requisito: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full flex-shrink-0 mt-1.5" />
                                <span>{requisito}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {programa.contacto && (
                          <div className="pt-3 border-t">
                            <p className="text-sm text-muted-foreground">
                              <strong>Contacto:</strong> {programa.contacto}
                            </p>
                          </div>
                        )}

                        <Button
                          variant="outline"
                          className="w-full min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
                          onClick={() => {
                            setProgramaSelecionado(programa.titulo);
                            setOpenInscricaoPrograma(true);
                          }}
                        >
                          Inscrever-se
                          <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Oportunidades */}
            <TabsContent value="oportunidades" className="mt-6 md:mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {setor.oportunidades.map((oportunidade, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden rounded-xl hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                  >
                    <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 md:p-2 bg-blue-100 rounded-xl">
                          <LightbulbIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 rounded-lg">
                          Oportunidade
                        </Badge>
                      </div>
                      <CardTitle className="text-base md:text-lg">{oportunidade.titulo}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {oportunidade.descricao}
                      </p>
                    </CardHeader>

                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Requisitos:</h4>
                          <ul className="space-y-1.5">
                            {oportunidade.requisitos?.map((requisito: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                                <span>{requisito}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {oportunidade.contacto && (
                          <div className="pt-3 border-t">
                            <p className="text-sm text-muted-foreground">
                              <strong>Contacto:</strong> {oportunidade.contacto}
                            </p>
                          </div>
                        )}

                        <Button
                          variant="outline"
                          className="w-full min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
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

            {/* Infraestruturas */}
            <TabsContent value="infraestruturas" className="mt-6 md:mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {setor.infraestruturas.map((infraestrutura, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden rounded-xl hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                  >
                    <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 md:p-2 bg-orange-100 rounded-xl">
                          <BuildingIcon className="w-5 h-5 text-orange-600" />
                        </div>
                        <Badge className="bg-orange-100 text-orange-800 rounded-lg">
                          Infraestrutura
                        </Badge>
                      </div>
                      <CardTitle className="text-base md:text-lg">{infraestrutura.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {infraestrutura.descricao}
                      </p>
                    </CardHeader>

                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Características:</h4>
                          <ul className="space-y-1.5">
                            {infraestrutura.caracteristicas?.map((caracteristica: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircleIcon className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                <span>{caracteristica}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {infraestrutura.localizacao && (
                          <div className="pt-3 border-t">
                            <p className="text-sm text-muted-foreground">
                              <strong>Localização:</strong> {infraestrutura.localizacao}
                            </p>
                          </div>
                        )}

                        <Button
                          variant="outline"
                          className="w-full min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
                          onClick={() => {
                            setDetalheInfra(infraestrutura);
                            setOpenDetalhes(true);
                          }}
                        >
                          Ver Detalhes
                          <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Contactos */}
            <TabsContent value="contactos" className="mt-6 md:mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {setor.contactos.map((contacto, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden rounded-xl hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                  >
                    <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 md:p-2 bg-purple-100 rounded-xl">
                          <PhoneIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <Badge className="bg-purple-100 text-purple-800 rounded-lg">
                          Contacto
                        </Badge>
                      </div>
                      <CardTitle className="text-base md:text-lg">{contacto.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {contacto.cargo}
                      </p>
                    </CardHeader>

                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="space-y-3">
                        {contacto.telefone && (
                          <a 
                            href={`tel:${contacto.telefone}`}
                            className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-all duration-200 active:scale-[0.98] min-h-[44px]"
                          >
                            <PhoneIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm">{contacto.telefone}</span>
                          </a>
                        )}

                        {contacto.email && (
                          <a 
                            href={`mailto:${contacto.email}`}
                            className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-all duration-200 active:scale-[0.98] min-h-[44px]"
                          >
                            <MailIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm break-all">{contacto.email}</span>
                          </a>
                        )}

                        {contacto.endereco && (
                          <div className="flex items-start gap-3 p-2 -mx-2 min-h-[44px]">
                            <MapPinIcon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{contacto.endereco}</span>
                          </div>
                        )}

                        {contacto.horario && (
                          <div className="flex items-start gap-3 p-2 -mx-2 min-h-[44px]">
                            <CalendarIcon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{contacto.horario}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Modals */}
      <CandidaturaForm
        open={openCandidatura}
        onOpenChange={setOpenCandidatura}
        oportunidade={oportunidadeSelecionada}
        setor={setor.nome}
      />

      <InscricaoProgramaForm
        open={openInscricaoPrograma}
        onOpenChange={setOpenInscricaoPrograma}
        programa={programaSelecionado}
        setor={setor.nome}
      />

      <Dialog open={openDetalhes} onOpenChange={setOpenDetalhes}>
        <DialogContent className="w-full h-full max-h-[100dvh] md:h-auto md:max-h-[85vh] md:max-w-2xl rounded-none md:rounded-xl p-0 overflow-hidden">
          <div className="flex flex-col h-full max-h-[100dvh] md:max-h-[85vh]">
            <DialogHeader className="p-4 md:p-6 border-b flex-shrink-0">
              <DialogTitle className="text-lg md:text-xl">{detalheInfra?.nome}</DialogTitle>
              <DialogDescription className="text-sm">{detalheInfra?.descricao}</DialogDescription>
            </DialogHeader>

            {detalheInfra && (
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-6 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Características:</h4>
                  <ul className="space-y-2">
                    {detalheInfra.caracteristicas?.map((caracteristica: string, idx: number) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{caracteristica}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {detalheInfra.localizacao && (
                  <div>
                    <h4 className="font-medium mb-2">Localização:</h4>
                    <p className="text-sm text-muted-foreground">{detalheInfra.localizacao}</p>
                  </div>
                )}

                {detalheInfra.observacoes && (
                  <div>
                    <h4 className="font-medium mb-2">Observações:</h4>
                    <p className="text-sm text-muted-foreground">{detalheInfra.observacoes}</p>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="p-4 md:p-6 border-t flex-shrink-0">
              <Button 
                variant="outline" 
                onClick={() => setOpenDetalhes(false)}
                className="w-full md:w-auto min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                Fechar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default EnergiaAgua;
