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
  SproutIcon,
  WheatIcon,
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
  LeafIcon,
  SparklesIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { CandidaturaForm } from "@/components/ui/candidatura-form";
import { InscricaoProgramaForm } from "@/components/ui/inscricao-programa-form";
import { useSetoresEstrategicos } from "@/hooks/useSetoresEstrategicos";
import { SetorCompleto, InfraestruturaSetor } from "@/hooks/useSetoresEstrategicos";
import { cn } from "@/lib/utils";

const Agricultura = () => {
  const { getSetorBySlug } = useSetoresEstrategicos();
  const [setor, setSetor] = useState<SetorCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCandidatura, setOpenCandidatura] = useState(false);
  const [openDetalhes, setOpenDetalhes] = useState(false);
  const [detalheInfra, setDetalheInfra] = useState<InfraestruturaSetor | null>(null);
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
        const data = await getSetorBySlug('agricultura');
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
              O sector de Agricultura não está disponível no momento.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Sprout': SproutIcon,
      'Wheat': WheatIcon,
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
      'TrendingUp': TrendingUpIcon,
      'Leaf': LeafIcon
    };
    return iconMap[iconName] || SproutIcon;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <SectorHero
        setor={setor}
        onExplorarProgramas={handleExplorarProgramas}
        onVerOportunidades={handleVerOportunidades}
      />

      <main className="container mx-auto px-4 py-6 md:py-12">
        {/* Breadcrumb */}
        <SetorBreadcrumb setor={setor} />

        {/* Navigation */}
        <SetorNavigation />

        {/* Statistics */}
        <SetorStats setor={setor} />

        {/* Content Tabs */}
        <div data-tabs-container>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8 md:mt-12">
            <TabsList className="flex w-full gap-1 md:gap-2 p-1.5 md:p-2 bg-muted/50 rounded-xl overflow-x-auto scrollbar-hide -mx-1 px-1 md:mx-0 md:px-2">
              <TabsTrigger 
                value="programas" 
                className="flex-shrink-0 min-w-[100px] md:flex-1 min-h-[44px] text-xs sm:text-sm px-3 md:px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                <span className="truncate">Programas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="oportunidades" 
                className="flex-shrink-0 min-w-[110px] md:flex-1 min-h-[44px] text-xs sm:text-sm px-3 md:px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                <span className="truncate">Oportunidades</span>
              </TabsTrigger>
              <TabsTrigger 
                value="infraestruturas" 
                className="flex-shrink-0 min-w-[120px] md:flex-1 min-h-[44px] text-xs sm:text-sm px-3 md:px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                <span className="truncate">Infraestruturas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="contactos" 
                className="flex-shrink-0 min-w-[100px] md:flex-1 min-h-[44px] text-xs sm:text-sm px-3 md:px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                <span className="truncate">Contactos</span>
              </TabsTrigger>
            </TabsList>

            {/* Programas */}
            <TabsContent value="programas" className="mt-6 md:mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {setor.programas.map((programa, index) => (
                  <Card key={index} className="hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 active:scale-[0.98] border-0 bg-white dark:bg-gray-800 overflow-hidden group rounded-xl">
                    <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-600 w-full" />
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 group-hover:text-green-600 transition-colors text-base md:text-lg">
                        <div className="p-2 rounded-xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-200">
                          <HeartHandshakeIcon className="w-5 h-5" />
                        </div>
                        {programa.titulo}
                      </CardTitle>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{programa.descricao}</p>
                    </CardHeader>
                    <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0 md:pt-0">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          Benefícios
                        </h4>
                        <ul className="grid gap-2">
                          {programa.beneficios?.map((beneficio: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                              {beneficio}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <StarIcon className="w-4 h-4 text-green-500" />
                          Requisitos
                        </h4>
                        <ul className="grid gap-2">
                          {programa.requisitos?.map((requisito: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                              {requisito}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                        {programa.contacto && (
                          <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4" />
                            <strong>Contacto:</strong> {programa.contacto}
                          </p>
                        )}
                        <Button
                          className="w-full min-h-[44px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-200 rounded-xl transition-all duration-200 active:scale-[0.98]"
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

            {/* Oportunidades */}
            <TabsContent value="oportunidades" className="mt-6 md:mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {setor.oportunidades.map((oportunidade, index) => (
                  <Card key={index} className="hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 active:scale-[0.98] border-0 bg-white dark:bg-gray-800 overflow-hidden group rounded-xl">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 w-full" />
                    <CardHeader className="p-4 md:p-6">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                          {oportunidade.vagas || 'Várias'} vagas
                        </Badge>
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                          {oportunidade.prazo ? `Até ${new Date(oportunidade.prazo).toLocaleDateString('pt-AO')}` : 'Aberto'}
                        </Badge>
                      </div>
                      <CardTitle className="text-base md:text-lg group-hover:text-blue-600 transition-colors">{oportunidade.titulo}</CardTitle>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {oportunidade.descricao}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0 md:pt-0">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <StarIcon className="w-4 h-4 text-blue-500" />
                          Requisitos
                        </h4>
                        <ul className="grid gap-2">
                          {oportunidade.requisitos?.map((requisito: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                              {requisito}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                        {oportunidade.contacto && (
                          <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4" />
                            <span className="truncate">{oportunidade.contacto}</span>
                          </p>
                        )}

                        <Button
                          className="w-full min-h-[44px] bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 active:scale-[0.98]"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {setor.infraestruturas.map((infraestrutura, index) => (
                  <Card key={index} className="hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 active:scale-[0.98] border-0 bg-white dark:bg-gray-800 overflow-hidden group rounded-xl">
                    <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500 w-full" />
                    <CardHeader className="p-4 md:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-orange-50 rounded-xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-200">
                          <BuildingIcon className="w-5 h-5" />
                        </div>
                        <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                          Infraestrutura
                        </Badge>
                      </div>
                      <CardTitle className="text-base md:text-lg group-hover:text-orange-600 transition-colors">{infraestrutura.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {infraestrutura.descricao}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0 md:pt-0">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-orange-500" />
                          Características
                        </h4>
                        <ul className="grid gap-2">
                          {infraestrutura.equipamentos?.map((equipamento: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0" />
                              {equipamento}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                        {infraestrutura.localizacao && (
                          <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                            <MapPinIcon className="w-4 h-4 shrink-0" />
                            <span className="truncate">{infraestrutura.localizacao}</span>
                          </p>
                        )}

                        <Button
                          variant="outline"
                          className="w-full min-h-[44px] border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 rounded-xl transition-all duration-200 active:scale-[0.98]"
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
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-200 active:scale-[0.98] rounded-xl">
                    <CardHeader className="pb-4 p-4 md:p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 rounded-xl">
                          <PhoneIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">
                          Contacto
                        </Badge>
                      </div>
                      <CardTitle className="text-base md:text-lg">{contacto.responsavel}</CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                      <div className="space-y-3">
                        {contacto.telefone && (
                          <div className="flex items-center gap-2 min-h-[44px] py-2">
                            <PhoneIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                            <a href={`tel:${contacto.telefone}`} className="text-sm hover:text-purple-600 transition-colors">
                              {contacto.telefone}
                            </a>
                          </div>
                        )}

                        {contacto.email && (
                          <div className="flex items-center gap-2 min-h-[44px] py-2">
                            <MailIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                            <a href={`mailto:${contacto.email}`} className="text-sm hover:text-purple-600 transition-colors truncate">
                              {contacto.email}
                            </a>
                          </div>
                        )}

                        {contacto.endereco && (
                          <div className="flex items-start gap-2 py-2">
                            <MapPinIcon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                            <span className="text-sm">{contacto.endereco}</span>
                          </div>
                        )}

                        {contacto.horario && (
                          <div className="flex items-center gap-2 py-2">
                            <CalendarIcon className="w-4 h-4 text-muted-foreground shrink-0" />
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
        <DialogContent className="w-full h-full max-w-full max-h-full md:max-w-2xl md:h-auto md:max-h-[90vh] rounded-none md:rounded-xl overflow-y-auto overscroll-contain">
          <DialogHeader className="p-4 md:p-6 pb-0">
            <DialogTitle className="text-lg md:text-xl">{detalheInfra?.nome}</DialogTitle>
            <DialogDescription className="text-sm md:text-base">{detalheInfra?.descricao}</DialogDescription>
          </DialogHeader>

          {detalheInfra && (
            <div className="space-y-4 md:space-y-6 p-4 md:p-6 pt-4">
              <div>
                <h4 className="font-medium mb-3">Características:</h4>
                <ul className="space-y-2">
                  {detalheInfra.equipamentos?.map((equipamento: string, idx: number) => (
                    <li key={idx} className="text-sm flex items-center gap-2 py-1">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                      {equipamento}
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

          <DialogFooter className="p-4 md:p-6 pt-0">
            <Button 
              variant="outline" 
              onClick={() => setOpenDetalhes(false)}
              className="w-full md:w-auto min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Agricultura; 