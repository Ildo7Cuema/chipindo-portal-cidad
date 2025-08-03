import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { SetorBreadcrumb } from "@/components/ui/setor-breadcrumb";
import { SetorNavigation } from "@/components/ui/setor-navigation";
import { SetorStats } from "@/components/ui/setor-stats";
import { SectorHero } from "@/components/ui/sector-hero";
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
      <div className="container mx-auto px-4 pt-6">
        <SetorBreadcrumb setor={setor} />
      </div>
      
      {/* Modern Hero Section */}
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
            <TabsList className="flex flex-wrap w-full gap-2 p-2 bg-muted/50">
              <TabsTrigger value="programas" className="flex-1 min-w-0 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5">
                <span className="truncate">Programas Educativos</span>
              </TabsTrigger>
              <TabsTrigger value="oportunidades" className="flex-1 min-w-0 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5">
                <span className="truncate">Oportunidades</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="programas" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(setor?.programas || []).map((programa, index) => (
                  <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCapIcon className="w-5 h-5 text-primary" />
                        {programa.titulo}
                      </CardTitle>
                      <p className="text-muted-foreground">{programa.descricao}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          Benefícios
                        </h4>
                        <ul className="space-y-1">
                          {(programa.beneficios || []).map((beneficio, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              {beneficio}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <StarIcon className="w-4 h-4 text-blue-600" />
                          Requisitos
                        </h4>
                        <ul className="space-y-1">
                          {(programa.requisitos || []).map((requisito, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              {requisito}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm">
                          <strong>Contacto:</strong> {programa.contacto}
                        </p>
                      </div>
                      <Button
                        variant="institutional"
                        className="w-full"
                        onClick={() => {
                          setProgramaSelecionado(programa.titulo);
                          setOpenInscricaoPrograma(true);
                        }}
                      >
                        Inscrever-se
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="oportunidades" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(setor?.oportunidades || []).map((oportunidade, index) => (
                  <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="mb-2">
                          {oportunidade.vagas} vagas
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Prazo: {oportunidade.prazo ? new Date(oportunidade.prazo).toLocaleDateString('pt-AO') : '-'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{oportunidade.titulo}</CardTitle>
                      <p className="text-muted-foreground text-sm">{oportunidade.descricao}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Requisitos:</h4>
                        <ul className="space-y-1">
                          {(oportunidade.requisitos || []).map((req, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Benefícios:</h4>
                        <ul className="space-y-1">
                          {(oportunidade.beneficios || []).map((ben, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full" />
                              {ben}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        variant="institutional"
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {setor?.infraestruturas && setor.infraestruturas.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Infraestruturas Educativas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {setor?.infraestruturas.map((infra, index) => (
                <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BuildingIcon className="w-5 h-5 text-primary" />
                      {infra.nome}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPinIcon className="w-4 h-4" />
                      {infra.localizacao}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Capacidade:</span>
                      <Badge variant="outline">{infra.capacidade}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Estado:</span>
                      <Badge className={infra.estado === "Operacional" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {infra.estado}
                      </Badge>
                    </div>
                    {infra.equipamentos && infra.equipamentos.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Equipamentos:</h4>
                        <div className="flex flex-wrap gap-1">
                          {infra.equipamentos.map((equip, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {equip}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => { setDetalheInfra(infra); setOpenDetalhes(true); }}
                    >
                      Ver Detalhes
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
                    {setor?.contactos && setor.contactos.length > 0 && (
          <section className="bg-muted/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-center mb-8">Informações de Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {setor?.contactos.map((contacto, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BuildingIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Endereço</h3>
                  <p className="text-sm text-muted-foreground">{contacto.endereco}</p>
                </div>
              ))}
              {setor?.contactos.map((contacto, index) => (
                <div key={`phone-${index}`} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <PhoneIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Telefone</h3>
                  <p className="text-sm text-muted-foreground">{contacto.telefone}</p>
                </div>
              ))}
              {setor?.contactos.map((contacto, index) => (
                <div key={`email-${index}`} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MailIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground">{contacto.email}</p>
                </div>
              ))}
              {setor?.contactos.map((contacto, index) => (
                <div key={`hours-${index}`} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Horário</h3>
                  <p className="text-sm text-muted-foreground">{contacto.horario}</p>
                </div>
              ))}
            </div>
            {setor?.contactos.map((contacto, index) => (
              <div key={`responsavel-${index}`} className="text-center mt-8 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Responsável:</strong> {contacto.responsavel}
                </p>
              </div>
            ))}
          </section>
        )}
      </main>
      {/* Navegação entre Sectores */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Infraestrutura</DialogTitle>
            <DialogDescription>
              {detalheInfra && (
                <div className="space-y-2 mt-2">
                  <div><b>Nome:</b> {detalheInfra.nome || detalheInfra.title}</div>
                  <div><b>Localização:</b> {detalheInfra.localizacao}</div>
                  <div><b>Capacidade:</b> {detalheInfra.capacidade}</div>
                  <div><b>Estado:</b> {detalheInfra.estado}</div>
                  <div><b>Equipamentos:</b> {detalheInfra.equipamentos?.join(', ')}</div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpenDetalhes(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Educacao; 