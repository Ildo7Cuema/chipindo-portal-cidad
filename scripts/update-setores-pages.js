import fs from 'fs';
import path from 'path';

// Template para páginas de sectores
const sectorPageTemplate = (sectorName, sectorSlug, iconName, primaryColor, secondaryColor) => `import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { SetorBreadcrumb } from "@/components/ui/setor-breadcrumb";
import { SetorNavigation } from "@/components/ui/setor-navigation";
import { SetorStats } from "@/components/ui/setor-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ${iconName}Icon,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { CandidaturaForm } from "@/components/ui/candidatura-form";
import { InscricaoProgramaForm } from "@/components/ui/inscricao-programa-form";
import { useSetoresEstrategicos } from "@/hooks/useSetoresEstrategicos";
import { SetorCompleto } from "@/hooks/useSetoresEstrategicos";
import { cn } from "@/lib/utils";

const ${sectorName} = () => {
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
        const data = await getSetorBySlug('${sectorSlug}');
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
              O sector de ${sectorName} não está disponível no momento.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      '${iconName}': ${iconName}Icon,
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
    return iconMap[iconName] || ${iconName}Icon;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-${primaryColor}-500 to-${secondaryColor}-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <${iconName}Icon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {setor.nome}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            {setor.descricao}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <TargetIcon className="w-4 h-4 mr-2" />
              Visão: {setor.visao}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <HeartHandshakeIcon className="w-4 h-4 mr-2" />
              Missão: {setor.missao}
            </Badge>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <SetorBreadcrumb setor={setor} />

        {/* Navigation */}
        <SetorNavigation setor={setor} />

        {/* Statistics */}
        <SetorStats setor={setor} />

        {/* Content Tabs */}
        <Tabs defaultValue="programas" className="mt-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="programas">Programas</TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
            <TabsTrigger value="infraestruturas">Infraestruturas</TabsTrigger>
            <TabsTrigger value="contactos">Contactos</TabsTrigger>
          </TabsList>

          {/* Programas */}
          <TabsContent value="programas" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {setor.programas.map((programa, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-${primaryColor}-100 rounded-lg">
                        <HeartHandshakeIcon className="w-5 h-5 text-${primaryColor}-600" />
                      </div>
                      <Badge className="bg-${primaryColor}-100 text-${primaryColor}-800">
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
                              <div className="w-1.5 h-1.5 bg-${primaryColor}-500 rounded-full" />
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

export default ${sectorName};
`;

// Configuração dos sectores
const sectors = [
  {
    name: 'SectorMineiro',
    slug: 'sector-mineiro',
    icon: 'Pickaxe',
    primaryColor: 'yellow',
    secondaryColor: 'amber'
  },
  {
    name: 'Cultura',
    slug: 'cultura',
    icon: 'Palette',
    primaryColor: 'purple',
    secondaryColor: 'violet'
  },
  {
    name: 'Tecnologia',
    slug: 'tecnologia',
    icon: 'Cpu',
    primaryColor: 'indigo',
    secondaryColor: 'blue'
  },
  {
    name: 'EnergiaAgua',
    slug: 'energia-agua',
    icon: 'Zap',
    primaryColor: 'cyan',
    secondaryColor: 'blue'
  }
];

// Função para atualizar as páginas
async function updateSectorPages() {
  console.log('🔄 Atualizando páginas dos sectores...\n');

  for (const sector of sectors) {
    const filePath = path.join(process.cwd(), 'src', 'pages', `${sector.name}.tsx`);
    
    try {
      const content = sectorPageTemplate(
        sector.name,
        sector.slug,
        sector.icon,
        sector.primaryColor,
        sector.secondaryColor
      );
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ ${sector.name}.tsx atualizada`);
    } catch (error) {
      console.error(`❌ Erro ao atualizar ${sector.name}.tsx:`, error);
    }
  }

  console.log('\n🎉 Todas as páginas foram atualizadas!');
  console.log('\n📝 Próximos passos:');
  console.log('   1. Verifique se as páginas estão funcionando corretamente');
  console.log('   2. Teste a navegação entre os sectores');
  console.log('   3. Verifique se os dados estão sendo carregados do banco');
}

updateSectorPages(); 