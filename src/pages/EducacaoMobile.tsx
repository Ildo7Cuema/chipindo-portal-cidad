import React, { useState, useEffect } from 'react';
import { useSetoresEstrategicos } from '@/hooks/useSetoresEstrategicos';
import { SetorCompleto } from '@/hooks/useSetoresEstrategicos';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { SetorBreadcrumb } from '@/components/ui/setor-breadcrumb';
import { SetorStats } from '@/components/ui/setor-stats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MobileLayout, MobileContainer, MobileSection } from '@/components/layout/MobileLayout';
import { MobileHero } from '@/components/ui/mobile-hero';
import { MobileCard, MobileCardHeader, MobileCardContent, MobileCardTitle, MobileCardDescription } from '@/components/ui/mobile-card';
import { MobileNavigation, MobileBottomNavigation } from '@/components/layout/MobileNavigation';
import { CandidaturaForm } from '@/components/ui/candidatura-form';
import { InscricaoProgramaForm } from '@/components/ui/inscricao-programa-form';
import { 
  GraduationCapIcon, 
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
import { cn } from '@/lib/utils';

const EducacaoMobile = () => {
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

  const colorScheme = {
    primary: 'from-blue-700 via-blue-800 to-indigo-900',
    secondary: 'from-blue-600 to-indigo-700',
    accent: 'from-blue-400 to-indigo-500',
    light: 'from-blue-100/80 to-blue-200/60',
    dark: 'from-blue-800 to-indigo-900'
  };

  const handleExplorePrograms = () => {
    const element = document.getElementById('programas');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleViewOpportunities = () => {
    const element = document.getElementById('oportunidades');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </MobileLayout>
    );
  }

  if (error || !setor) {
    return (
      <MobileLayout>
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
      </MobileLayout>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      {/* Mobile Hero Section */}
      <MobileHero
        title={setor.nome}
        subtitle="Sector de"
        description={setor.descricao}
        stats={setor.estatisticas}
        colorScheme={colorScheme}
        icon={<GraduationCapIcon className="w-full h-full" />}
        onExplorePrograms={handleExplorePrograms}
        onViewOpportunities={handleViewOpportunities}
      />

      {/* Mobile Navigation */}
      <MobileNavigation setor={setor} />

      {/* Main Content */}
      <MobileLayout maxWidth="none">
        <MobileContainer>
          
          {/* Breadcrumb */}
          <MobileSection spacing="sm" className="pt-6">
            <SetorBreadcrumb setor={setor} />
          </MobileSection>

          {/* Statistics */}
          <MobileSection spacing="md">
            <SetorStats setor={setor} />
          </MobileSection>

          {/* Content Tabs */}
          <MobileSection spacing="lg">
            <Tabs defaultValue="programas" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-14 sm:h-16">
                <TabsTrigger 
                  value="programas" 
                  className="text-xs sm:text-sm font-medium touch-target min-h-[56px] sm:min-h-[64px]"
                >
                  Programas
                </TabsTrigger>
                <TabsTrigger 
                  value="oportunidades" 
                  className="text-xs sm:text-sm font-medium touch-target min-h-[56px] sm:min-h-[64px]"
                >
                  Oportunidades
                </TabsTrigger>
                <TabsTrigger 
                  value="infraestruturas" 
                  className="text-xs sm:text-sm font-medium touch-target min-h-[56px] sm:min-h-[64px]"
                >
                  Infraestruturas
                </TabsTrigger>
                <TabsTrigger 
                  value="contactos" 
                  className="text-xs sm:text-sm font-medium touch-target min-h-[56px] sm:min-h-[64px]"
                >
                  Contactos
                </TabsTrigger>
              </TabsList>

              {/* Programas */}
              <TabsContent value="programas" className="mt-6">
                <div id="programas" className="space-y-4">
                  {setor.programas.map((programa, index) => (
                    <MobileCard
                      key={index}
                      variant="elevated"
                      hover
                      onClick={() => {
                        setProgramaSelecionado(programa.titulo);
                        setOpenInscricaoPrograma(true);
                      }}
                    >
                      <MobileCardHeader
                        icon={
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <HeartHandshakeIcon className="w-5 h-5 text-blue-600" />
                          </div>
                        }
                        badge={
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            Programa
                          </Badge>
                        }
                      >
                        <MobileCardTitle size="md">{programa.titulo}</MobileCardTitle>
                        <MobileCardDescription size="sm">
                          {programa.descricao}
                        </MobileCardDescription>
                      </MobileCardHeader>
                      
                      <MobileCardContent spacing="sm">
                        {programa.beneficios && programa.beneficios.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2 text-foreground">Benefícios:</h4>
                            <ul className="space-y-1">
                              {programa.beneficios.map((beneficio: string, idx: number) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <CheckCircleIcon className="w-3 h-3 text-green-500 flex-shrink-0" />
                                  <span className="text-xs sm:text-sm break-words">{beneficio}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {programa.requisitos && programa.requisitos.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2 text-foreground">Requisitos:</h4>
                            <ul className="space-y-1">
                              {programa.requisitos.map((requisito: string, idx: number) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                                  <span className="text-xs sm:text-sm break-words">{requisito}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </MobileCardContent>
                    </MobileCard>
                  ))}
                </div>
              </TabsContent>

              {/* Oportunidades */}
              <TabsContent value="oportunidades" className="mt-6">
                <div id="oportunidades" className="space-y-4">
                  {setor.oportunidades.map((oportunidade, index) => (
                    <MobileCard
                      key={index}
                      variant="elevated"
                      hover
                      onClick={() => {
                        setOportunidadeSelecionada(oportunidade.titulo);
                        setOpenCandidatura(true);
                      }}
                    >
                      <MobileCardHeader
                        icon={
                          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <LightbulbIcon className="w-5 h-5 text-green-600" />
                          </div>
                        }
                        badge={
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Oportunidade
                          </Badge>
                        }
                      >
                        <MobileCardTitle size="md">{oportunidade.titulo}</MobileCardTitle>
                        <MobileCardDescription size="sm">
                          {oportunidade.descricao}
                        </MobileCardDescription>
                      </MobileCardHeader>
                      
                      <MobileCardContent spacing="sm">
                        {oportunidade.requisitos && oportunidade.requisitos.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2 text-foreground">Requisitos:</h4>
                            <ul className="space-y-1">
                              {oportunidade.requisitos.map((requisito: string, idx: number) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <CheckCircleIcon className="w-3 h-3 text-green-500 flex-shrink-0" />
                                  <span className="text-xs sm:text-sm break-words">{requisito}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {oportunidade.beneficios && oportunidade.beneficios.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2 text-foreground">Benefícios:</h4>
                            <ul className="space-y-1">
                              {oportunidade.beneficios.map((beneficio: string, idx: number) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                                  <span className="text-xs sm:text-sm break-words">{beneficio}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </MobileCardContent>
                    </MobileCard>
                  ))}
                </div>
              </TabsContent>

              {/* Infraestruturas */}
              <TabsContent value="infraestruturas" className="mt-6">
                <div id="infraestruturas" className="space-y-4">
                  {setor.infraestruturas.map((infraestrutura, index) => (
                    <MobileCard
                      key={index}
                      variant="elevated"
                      hover
                      onClick={() => {
                        setDetalheInfra(infraestrutura);
                        setOpenDetalhes(true);
                      }}
                    >
                      <MobileCardHeader
                        icon={
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <BuildingIcon className="w-5 h-5 text-purple-600" />
                          </div>
                        }
                        badge={
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            Infraestrutura
                          </Badge>
                        }
                      >
                        <MobileCardTitle size="md">{infraestrutura.nome}</MobileCardTitle>
                        <MobileCardDescription size="sm">
                          {infraestrutura.descricao}
                        </MobileCardDescription>
                      </MobileCardHeader>
                      
                      <MobileCardContent spacing="sm">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-foreground text-xs sm:text-sm">Tipo:</span>
                            <p className="text-muted-foreground text-xs sm:text-sm break-words">{infraestrutura.tipo}</p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground text-xs sm:text-sm">Estado:</span>
                            <p className="text-muted-foreground text-xs sm:text-sm break-words">{infraestrutura.estado}</p>
                          </div>
                        </div>
                      </MobileCardContent>
                    </MobileCard>
                  ))}
                </div>
              </TabsContent>

              {/* Contactos */}
              <TabsContent value="contactos" className="mt-6">
                <div id="contactos" className="space-y-4">
                  {setor.contactos.map((contacto, index) => (
                    <MobileCard key={index} variant="outlined">
                      <MobileCardHeader
                        icon={
                          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            <PhoneIcon className="w-5 h-5 text-orange-600" />
                          </div>
                        }
                      >
                        <MobileCardTitle size="md">{contacto.nome}</MobileCardTitle>
                        <MobileCardDescription size="sm">
                          {contacto.cargo}
                        </MobileCardDescription>
                      </MobileCardHeader>
                      
                      <MobileCardContent spacing="sm">
                        <div className="space-y-3">
                          {contacto.telefone && (
                            <div className="flex items-center gap-3">
                              <PhoneIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm text-muted-foreground break-all">{contacto.telefone}</span>
                            </div>
                          )}
                          {contacto.email && (
                            <div className="flex items-center gap-3">
                              <MailIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm text-muted-foreground break-all">{contacto.email}</span>
                            </div>
                          )}
                          {contacto.endereco && (
                            <div className="flex items-center gap-3">
                              <MapPinIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm text-muted-foreground break-words">{contacto.endereco}</span>
                            </div>
                          )}
                        </div>
                      </MobileCardContent>
                    </MobileCard>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </MobileSection>
        </MobileContainer>
      </MobileLayout>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation setor={setor} />

      {/* Dialogs */}
      <Dialog open={openCandidatura} onOpenChange={setOpenCandidatura}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Candidatura para {oportunidadeSelecionada}</DialogTitle>
            <DialogDescription>
              Preencha o formulário para se candidatar a esta oportunidade.
            </DialogDescription>
          </DialogHeader>
          <CandidaturaForm 
            oportunidade={oportunidadeSelecionada}
            onSuccess={() => setOpenCandidatura(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openDetalhes} onOpenChange={setOpenDetalhes}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>{detalheInfra?.nome}</DialogTitle>
            <DialogDescription>
              Detalhes da infraestrutura
            </DialogDescription>
          </DialogHeader>
          {detalheInfra && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Descrição</h4>
                <p className="text-sm text-muted-foreground break-words">{detalheInfra.descricao}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Tipo</h4>
                  <p className="text-sm text-muted-foreground break-words">{detalheInfra.tipo}</p>
                </div>
                <div>
                  <h4 className="font-medium">Estado</h4>
                  <p className="text-sm text-muted-foreground break-words">{detalheInfra.estado}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openInscricaoPrograma} onOpenChange={setOpenInscricaoPrograma}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Inscrição no Programa {programaSelecionado}</DialogTitle>
            <DialogDescription>
              Preencha o formulário para se inscrever neste programa.
            </DialogDescription>
          </DialogHeader>
          <InscricaoProgramaForm 
            programa={programaSelecionado}
            onSuccess={() => setOpenInscricaoPrograma(false)}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default EducacaoMobile; 