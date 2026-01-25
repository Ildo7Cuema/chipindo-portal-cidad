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
  CpuIcon,
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

const Tecnologia = () => {
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
        const data = await getSetorBySlug('tecnologia');
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
              O sector de Tecnologia não está disponível no momento.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Cpu': CpuIcon,
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
    return iconMap[iconName] || CpuIcon;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <SectorHero
        setor={setor}
        onExplorarProgramas={handleExplorarProgramas}
        onVerOportunidades={handleVerOportunidades}
      />

      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <SetorBreadcrumb setor={setor} />

        {/* Navigation */}
        <SetorNavigation setor={setor} />

        {/* Statistics */}
        <SetorStats setor={setor} />

        {/* Content Tabs */}
        <div data-tabs-container>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-12">
            <TabsList className="flex flex-wrap w-full gap-2 p-2 bg-muted/50">
              <TabsTrigger value="programas" className="flex-1 min-w-0 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5">
                <span className="truncate">Programas</span>
              </TabsTrigger>
              <TabsTrigger value="oportunidades" className="flex-1 min-w-0 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5">
                <span className="truncate">Oportunidades</span>
              </TabsTrigger>
              <TabsTrigger value="infraestruturas" className="flex-1 min-w-0 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5">
                <span className="truncate">Infraestruturas</span>
              </TabsTrigger>
              <TabsTrigger value="contactos" className="flex-1 min-w-0 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5">
                <span className="truncate">Contactos</span>
              </TabsTrigger>
            </TabsList>

            {/* Programas */}
            <TabsContent value="programas" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {setor.programas.map((programa, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <HeartHandshakeIcon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <Badge className="bg-indigo-100 text-indigo-800">
                          Programa
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{programa.titulo}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {programa.descricao}
                      </p>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Benefícios:</h4>
                          <ul className="space-y-1">
                            {programa.beneficios?.map((beneficio: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <CheckCircleIcon className="w-3 h-3 text-green-500" />
                                {beneficio}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Requisitos:</h4>
                          <ul className="space-y-1">
                            {programa.requisitos?.map((requisito: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                {requisito}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {programa.contacto && (
                          <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground">
                              <strong>Contacto:</strong> {programa.contacto}
                            </p>
                          </div>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
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
            <TabsContent value="oportunidades" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {setor.oportunidades.map((oportunidade, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <LightbulbIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          Oportunidade
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{oportunidade.titulo}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {oportunidade.descricao}
                      </p>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Requisitos:</h4>
                          <ul className="space-y-1">
                            {oportunidade.requisitos?.map((requisito: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                {requisito}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {oportunidade.contacto && (
                          <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground">
                              <strong>Contacto:</strong> {oportunidade.contacto}
                            </p>
                          </div>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
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
            <TabsContent value="infraestruturas" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {setor.infraestruturas.map((infraestrutura, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <BuildingIcon className="w-5 h-5 text-orange-600" />
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">
                          Infraestrutura
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{infraestrutura.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {infraestrutura.descricao}
                      </p>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Características:</h4>
                          <ul className="space-y-1">
                            {infraestrutura.caracteristicas?.map((caracteristica: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <CheckCircleIcon className="w-3 h-3 text-orange-500" />
                                {caracteristica}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {infraestrutura.localizacao && (
                          <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground">
                              <strong>Localização:</strong> {infraestrutura.localizacao}
                            </p>
                          </div>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
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
            <TabsContent value="contactos" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {setor.contactos.map((contacto, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <PhoneIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">
                          Contacto
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{contacto.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {contacto.cargo}
                      </p>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {contacto.telefone && (
                          <div className="flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{contacto.telefone}</span>
                          </div>
                        )}

                        {contacto.email && (
                          <div className="flex items-center gap-2">
                            <MailIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{contacto.email}</span>
                          </div>
                        )}

                        {contacto.endereco && (
                          <div className="flex items-center gap-2">
                            <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{contacto.endereco}</span>
                          </div>
                        )}

                        {contacto.horario && (
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{detalheInfra?.nome}</DialogTitle>
            <DialogDescription>{detalheInfra?.descricao}</DialogDescription>
          </DialogHeader>

          {detalheInfra && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Características:</h4>
                <ul className="space-y-1">
                  {detalheInfra.caracteristicas?.map((caracteristica: string, idx: number) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <CheckCircleIcon className="w-3 h-3 text-green-500" />
                      {caracteristica}
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

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDetalhes(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Tecnologia;
