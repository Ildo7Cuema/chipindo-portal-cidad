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
    UsersIcon,
    BuildingIcon,
    BriefcaseIcon,
    GraduationCapIcon,
    CalendarIcon,
    MapPinIcon,
    PhoneIcon,
    MailIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    StarIcon,
    TrendingUpIcon,
    ShieldIcon,
    ClipboardListIcon,
    XIcon,
    AwardIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { CandidaturaForm } from "@/components/ui/candidatura-form";
import { InscricaoProgramaForm } from "@/components/ui/inscricao-programa-form";
import { useSetoresEstrategicos } from "@/hooks/useSetoresEstrategicos";
import { SetorCompleto } from "@/hooks/useSetoresEstrategicos";

const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

const RecursosHumanos = () => {
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

    const scrollToTabs = () => {
        const tabsElement = document.querySelector('[data-tabs-container]');
        if (tabsElement) tabsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleExplorarProgramas = () => { setActiveTab("programas"); scrollToTabs(); };
    const handleVerOportunidades = () => { setActiveTab("oportunidades"); scrollToTabs(); };

    useEffect(() => {
        let isMounted = true;
        const loadSetor = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getSetorBySlug('recursos-humanos');
                if (!isMounted) return;
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
                            O Gabinete de Recursos Humanos não está disponível no momento.
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <style>{scrollbarHideStyles}</style>
            <Header />

            <SectorHero
                setor={setor}
                onExplorarProgramas={handleExplorarProgramas}
                onVerOportunidades={handleVerOportunidades}
            />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
                <SetorBreadcrumb setor={setor} />
                <SetorNavigation />
                <SetorStats setor={setor} />

                <div data-tabs-container className="scroll-mt-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8 sm:mt-10 lg:mt-14">
                        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-hide pb-1">
                            <TabsList className="inline-flex sm:flex sm:flex-wrap w-max sm:w-full gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-muted/60 backdrop-blur-sm rounded-xl shadow-sm">
                                <TabsTrigger value="programas" className="min-h-[48px] sm:min-h-[44px] flex-shrink-0 sm:flex-1 min-w-[110px] sm:min-w-0 text-sm font-medium px-4 py-3 rounded-xl data-[state=active]:shadow-md transition-all duration-200 touch-manipulation">
                                    <GraduationCapIcon className="w-4 h-4 mr-2 sm:hidden" />
                                    <span className="truncate">Programas</span>
                                </TabsTrigger>
                                <TabsTrigger value="oportunidades" className="min-h-[48px] sm:min-h-[44px] flex-shrink-0 sm:flex-1 min-w-[130px] sm:min-w-0 text-sm font-medium px-4 py-3 rounded-xl data-[state=active]:shadow-md transition-all duration-200 touch-manipulation">
                                    <BriefcaseIcon className="w-4 h-4 mr-2 sm:hidden" />
                                    <span className="truncate">Oportunidades</span>
                                </TabsTrigger>
                                <TabsTrigger value="infraestruturas" className="min-h-[48px] sm:min-h-[44px] flex-shrink-0 sm:flex-1 min-w-[145px] sm:min-w-0 text-sm font-medium px-4 py-3 rounded-xl data-[state=active]:shadow-md transition-all duration-200 touch-manipulation">
                                    <BuildingIcon className="w-4 h-4 mr-2 sm:hidden" />
                                    <span className="truncate">Infraestruturas</span>
                                </TabsTrigger>
                                <TabsTrigger value="contactos" className="min-h-[48px] sm:min-h-[44px] flex-shrink-0 sm:flex-1 min-w-[110px] sm:min-w-0 text-sm font-medium px-4 py-3 rounded-xl data-[state=active]:shadow-md transition-all duration-200 touch-manipulation">
                                    <PhoneIcon className="w-4 h-4 mr-2 sm:hidden" />
                                    <span className="truncate">Contactos</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Programas */}
                        <TabsContent value="programas" className="mt-5 sm:mt-8 lg:mt-10 animate-in fade-in-50 duration-300">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                                {setor.programas.map((programa, index) => (
                                    <Card key={index} className="group relative flex flex-col hover:shadow-2xl hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/20 transition-all duration-300 hover:-translate-y-1 border-0 bg-white dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden rounded-xl">
                                        <div className="h-1.5 sm:h-1 bg-gradient-to-r from-indigo-500 to-purple-600 w-full" />
                                        <CardHeader className="p-4 sm:p-5 lg:p-6 pb-3 sm:pb-4">
                                            <CardTitle className="flex items-start gap-3 text-base sm:text-lg group-hover:text-indigo-600 transition-all duration-200">
                                                <div className="p-2.5 sm:p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shrink-0">
                                                    <GraduationCapIcon className="w-5 h-5" />
                                                </div>
                                                <span className="line-clamp-2 pt-1">{programa.titulo}</span>
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground leading-relaxed mt-3">{programa.descricao}</p>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col p-4 sm:p-5 lg:p-6 pt-0 space-y-4 sm:space-y-5">
                                            <div className="space-y-2.5">
                                                <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                                    <CheckCircleIcon className="w-4 h-4 text-green-500" />Benefícios
                                                </h4>
                                                <ul className="grid gap-2">
                                                    {programa.beneficios?.map((beneficio: string, idx: number) => (
                                                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2.5">
                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0" />
                                                            <span>{beneficio}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                                <Button
                                                    className="w-full min-h-[48px] sm:min-h-[44px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 active:scale-[0.98] touch-manipulation"
                                                    onClick={() => { setProgramaSelecionado(programa.titulo); setOpenInscricaoPrograma(true); }}
                                                >
                                                    <span>Inscrever-se Agora</span>
                                                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Oportunidades */}
                        <TabsContent value="oportunidades" className="mt-5 sm:mt-8 lg:mt-10 animate-in fade-in-50 duration-300">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                                {setor.oportunidades.map((oportunidade, index) => (
                                    <Card key={index} className="group relative flex flex-col hover:shadow-2xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1 border-0 bg-white dark:bg-gray-800/90 overflow-hidden rounded-xl">
                                        <div className="h-1.5 sm:h-1 bg-gradient-to-r from-blue-500 to-cyan-500 w-full" />
                                        <CardHeader className="p-4 sm:p-5 lg:p-6 pb-3 sm:pb-4">
                                            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                                                <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-2.5 py-1">
                                                    {oportunidade.vagas || 'Várias'} vagas
                                                </Badge>
                                                <Badge variant="outline" className="text-xs border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 px-2.5 py-1">
                                                    {oportunidade.prazo ? `Até ${new Date(oportunidade.prazo).toLocaleDateString('pt-AO')}` : 'Aberto'}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-base sm:text-lg group-hover:text-blue-600 transition-all duration-200 line-clamp-2">{oportunidade.titulo}</CardTitle>
                                            <p className="text-sm text-muted-foreground leading-relaxed mt-3">{oportunidade.descricao}</p>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col p-4 sm:p-5 lg:p-6 pt-0 space-y-4">
                                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                                <Button
                                                    className="w-full min-h-[48px] sm:min-h-[44px] bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl transition-all duration-200 active:scale-[0.98] touch-manipulation"
                                                    onClick={() => { setOportunidadeSelecionada(oportunidade.titulo); setOpenCandidatura(true); }}
                                                >
                                                    <span>Candidatar-se</span>
                                                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Infraestruturas */}
                        <TabsContent value="infraestruturas" className="mt-5 sm:mt-8 lg:mt-10 animate-in fade-in-50 duration-300">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                                {setor.infraestruturas.map((infraestrutura, index) => (
                                    <Card key={index} className="group relative flex flex-col hover:shadow-2xl hover:shadow-orange-100/50 dark:hover:shadow-orange-900/20 transition-all duration-300 hover:-translate-y-1 border-0 bg-white dark:bg-gray-800/90 overflow-hidden rounded-xl">
                                        <div className="h-1.5 sm:h-1 bg-gradient-to-r from-orange-500 to-amber-500 w-full" />
                                        <CardHeader className="p-4 sm:p-5 lg:p-6 pb-3 sm:pb-4">
                                            <div className="flex items-center justify-between mb-3 gap-2">
                                                <div className="p-2.5 sm:p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400 group-hover:bg-orange-600 group-hover:text-white transition-all duration-200 shrink-0">
                                                    <BuildingIcon className="w-5 h-5" />
                                                </div>
                                                <Badge variant="outline" className="border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-400 text-xs px-2.5 py-1">Instalação</Badge>
                                            </div>
                                            <CardTitle className="text-base sm:text-lg group-hover:text-orange-600 transition-all duration-200 line-clamp-2">{infraestrutura.nome}</CardTitle>
                                            <p className="text-sm text-muted-foreground leading-relaxed mt-3">{infraestrutura.descricao}</p>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col p-4 sm:p-5 lg:p-6 pt-0 space-y-4">
                                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                                <Button
                                                    variant="outline"
                                                    className="w-full min-h-[48px] sm:min-h-[44px] border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 font-medium rounded-xl transition-all duration-200 active:scale-[0.98] touch-manipulation"
                                                    onClick={() => { setDetalheInfra(infraestrutura); setOpenDetalhes(true); }}
                                                >
                                                    <span>Ver Detalhes</span>
                                                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Contactos */}
                        <TabsContent value="contactos" className="mt-5 sm:mt-8 lg:mt-10 animate-in fade-in-50 duration-300">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                                {setor.contactos.map((contacto, index) => (
                                    <Card key={index} className="group relative overflow-hidden hover:shadow-xl hover:shadow-purple-100/50 dark:hover:shadow-purple-900/20 transition-all duration-300 hover:-translate-y-0.5 border-0 bg-white dark:bg-gray-800/90 rounded-xl">
                                        <div className="h-1.5 sm:h-1 bg-gradient-to-r from-purple-500 to-violet-500 w-full" />
                                        <CardHeader className="p-4 sm:p-5 lg:p-6 pb-3 sm:pb-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2.5 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl shrink-0">
                                                    <PhoneIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs px-2.5 py-1 hover:bg-purple-100">Contacto</Badge>
                                            </div>
                                            <CardTitle className="text-base sm:text-lg line-clamp-2 group-hover:text-purple-600 transition-all duration-200">{contacto.responsavel}</CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">{contacto.horario}</p>
                                        </CardHeader>
                                        <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
                                            <div className="space-y-1">
                                                {contacto.telefone && (
                                                    <a href={`tel:${contacto.telefone}`} className="flex items-center gap-3 min-h-[48px] sm:min-h-[44px] py-2 px-3 -mx-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 touch-manipulation">
                                                        <PhoneIcon className="w-4 h-4 text-purple-500 shrink-0" />
                                                        <span className="text-sm hover:text-purple-600 transition-colors truncate">{contacto.telefone}</span>
                                                    </a>
                                                )}
                                                {contacto.email && (
                                                    <a href={`mailto:${contacto.email}`} className="flex items-center gap-3 min-h-[48px] sm:min-h-[44px] py-2 px-3 -mx-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 touch-manipulation">
                                                        <MailIcon className="w-4 h-4 text-purple-500 shrink-0" />
                                                        <span className="text-sm hover:text-purple-600 transition-colors truncate">{contacto.email}</span>
                                                    </a>
                                                )}
                                                {contacto.endereco && (
                                                    <div className="flex items-start gap-3 min-h-[48px] sm:min-h-[44px] py-2 px-3 -mx-3">
                                                        <MapPinIcon className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">{contacto.endereco}</span>
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

            <CandidaturaForm open={openCandidatura} onOpenChange={setOpenCandidatura} oportunidade={oportunidadeSelecionada} setor={setor.nome} />
            <InscricaoProgramaForm open={openInscricaoPrograma} onOpenChange={setOpenInscricaoPrograma} programa={programaSelecionado} setor={setor.nome} />

            <Dialog open={openDetalhes} onOpenChange={setOpenDetalhes}>
                <DialogContent className="w-full max-w-2xl h-[100dvh] sm:h-auto sm:max-h-[85vh] rounded-none sm:rounded-2xl p-0 overflow-hidden border-0 sm:border gap-0">
                    <div className="flex flex-col h-full">
                        <div className="h-1.5 sm:h-1 bg-gradient-to-r from-orange-500 to-amber-500 w-full shrink-0" />
                        <DialogHeader className="p-5 sm:p-6 pb-4 border-b border-gray-100 dark:border-gray-800 shrink-0 relative">
                            <button onClick={() => setOpenDetalhes(false)} className="sm:hidden absolute right-4 top-4 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-all duration-200 touch-manipulation" aria-label="Fechar">
                                <XIcon className="w-5 h-5 text-gray-500" />
                            </button>
                            <div className="flex items-start gap-3 pr-10 sm:pr-0">
                                <div className="p-2.5 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-600 shrink-0">
                                    <BuildingIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg sm:text-xl font-semibold">{detalheInfra?.nome}</DialogTitle>
                                    <DialogDescription className="text-sm mt-1">{detalheInfra?.descricao}</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        {detalheInfra && (
                            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                                {detalheInfra.localizacao && (
                                    <div>
                                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><MapPinIcon className="w-4 h-4 text-orange-500" />Localização</h4>
                                        <p className="text-sm text-muted-foreground py-2 px-3 -mx-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">{detalheInfra.localizacao}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter className="p-5 sm:p-6 pt-4 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
                            <Button variant="outline" onClick={() => setOpenDetalhes(false)} className="w-full sm:w-auto min-h-[48px] sm:min-h-[44px] font-medium rounded-xl transition-all duration-200 touch-manipulation">Fechar</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default RecursosHumanos;
