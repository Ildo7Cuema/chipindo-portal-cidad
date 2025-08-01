import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { SetorBreadcrumb } from "@/components/ui/setor-breadcrumb";
import { SetorNavigation } from "@/components/ui/setor-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveSection,
  ResponsiveText
} from "@/components/layout/ResponsiveLayout";
import { 
  PickaxeIcon, 
  DiamondIcon, 
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
  ShieldIcon,
  TruckIcon,
  HardHatIcon
} from "lucide-react";
import React from "react";
import { CandidaturaForm } from "@/components/ui/candidatura-form";
import { InscricaoProgramaForm } from "@/components/ui/inscricao-programa-form";

const SectorMineiro = () => {
  const mineiroInfo = {
    title: "Sector Mineiro",
    subtitle: "Explorando o potencial mineral de Chipindo de forma sustentável",
    description: "O sector mineiro de Chipindo está comprometido em desenvolver a exploração mineral de forma responsável, sustentável e benéfica para a comunidade local.",
    vision: "Ser referência em mineração sustentável, contribuindo para o desenvolvimento económico local.",
    mission: "Promover a exploração mineral responsável, criando oportunidades de emprego e desenvolvimento económico."
  };

  const estatisticas = [
    { label: "Minas Ativas", value: "8", icon: PickaxeIcon },
    { label: "Empregos Diretos", value: "450", icon: UsersIcon },
    { label: "Produção Anual", value: "25.000 ton", icon: DiamondIcon },
    { label: "Investimento", value: "15M USD", icon: TrendingUpIcon },
    { label: "Projectos", value: "12", icon: BuildingIcon },
    { label: "Exportações", value: "8.5M USD", icon: TruckIcon }
  ];

  const recursosMinerais = [
    {
      nome: "Ouro",
      localizacao: "Zona Norte",
      reservas: "2.5M onças",
      producao: "15.000 onças/ano",
      estado: "Ativo"
    },
    {
      nome: "Diamantes",
      localizacao: "Zona Leste",
      reservas: "500.000 quilates",
      producao: "25.000 quilates/ano",
      estado: "Ativo"
    },
    {
      nome: "Cobre",
      localizacao: "Zona Oeste",
      reservas: "50M ton",
      producao: "2.500 ton/ano",
      estado: "Exploração"
    },
    {
      nome: "Manganês",
      localizacao: "Zona Sul",
      reservas: "10M ton",
      producao: "1.200 ton/ano",
      estado: "Ativo"
    }
  ];

  const programasMinerais = [
    {
      title: "Programa de Formação Mineira",
      description: "Formação profissional para trabalhadores do sector mineiro",
      beneficios: [
        "Formação gratuita",
        "Certificação reconhecida",
        "Apoio na inserção laboral",
        "Formação contínua"
      ],
      requisitos: ["Idade mínima 18 anos", "Ensino básico completo", "Disponibilidade para formação"],
      contact: "Centro de Formação Mineira"
    },
    {
      title: "Programa de Segurança Mineira",
      description: "Iniciativas para garantir segurança nas operações mineiras",
      beneficios: [
        "Equipamentos de segurança",
        "Formação em segurança",
        "Inspeções regulares",
        "Protocolos de emergência"
      ],
      requisitos: ["Trabalhar no sector mineiro", "Participar em formações", "Cumprir protocolos"],
      contact: "Departamento de Segurança Mineira"
    },
    {
      title: "Programa de Desenvolvimento Comunitário",
      description: "Projectos sociais financiados pelo sector mineiro",
      beneficios: [
        "Infraestruturas comunitárias",
        "Programas educativos",
        "Apoio à saúde",
        "Desenvolvimento económico local"
      ],
      requisitos: ["Comunidades afetadas pela mineração", "Projectos aprovados", "Participação comunitária"],
      contact: "Gabinete de Relações Comunitárias"
    }
  ];

  const oportunidades = [
    {
      title: "Engenheiro de Minas",
      description: "Vaga para engenheiro de minas com experiência",
      requisitos: [
        "Licenciatura em Engenharia de Minas",
        "Experiência mínima de 5 anos",
        "Conhecimentos em gestão de projectos"
      ],
      beneficios: [
        "Salário competitivo",
        "Plano de carreira",
        "Formação contínua",
        "Apoio habitacional"
      ],
      prazo: "25 de Março de 2025",
      vagas: "2"
    },
    {
      title: "Técnico de Segurança",
      description: "Vaga para técnico de segurança mineira",
      requisitos: [
        "Formação em segurança mineira",
        "Experiência de 3 anos",
        "Certificação em segurança"
      ],
      beneficios: [
        "Salário atrativo",
        "Equipamentos fornecidos",
        "Formação especializada",
        "Plano de saúde"
      ],
      prazo: "30 de Março de 2025",
      vagas: "4"
    },
    {
      title: "Operador de Máquinas",
      description: "Vagas para operadores de equipamentos mineiros",
      requisitos: [
        "Licença de condução pesada",
        "Experiência em equipamentos mineiros",
        "Disponibilidade para turnos"
      ],
      beneficios: [
        "Salário base + prémios",
        "Formação em equipamentos",
        "Equipamentos de proteção",
        "Plano de carreira"
      ],
      prazo: "5 de Abril de 2025",
      vagas: "8"
    }
  ];

  const infraestruturas = [
    {
      nome: "Centro de Formação Mineira",
      localizacao: "Zona Industrial",
      capacidade: "100 formandos",
      equipamentos: ["Sala de Formação", "Simuladores", "Laboratório", "Oficinas"],
      estado: "Excelente"
    },
    {
      nome: "Laboratório de Análise Mineral",
      localizacao: "Centro Científico",
      capacidade: "50 análises/dia",
      equipamentos: ["Espectrómetros", "Microscópios", "Equipamentos de Teste", "Sala Limpa"],
      estado: "Excelente"
    },
    {
      nome: "Centro de Segurança",
      localizacao: "Zona Mineira",
      capacidade: "200 trabalhadores",
      equipamentos: ["Sala de Emergência", "Equipamentos de Resgate", "Centro de Controlo", "Hospital de Campanha"],
      estado: "Bom"
    }
  ];

  const contactInfo = {
    endereco: "Rua da Mineração, Zona Industrial, Chipindo",
    telefone: "+244 XXX XXX XXX",
    email: "mineracao@chipindo.gov.ao",
    horario: "Segunda a Sexta: 08:00 - 16:00",
    responsavel: "Eng. Manuel Santos - Diretor Municipal de Mineração"
  };

  const [openCandidatura, setOpenCandidatura] = React.useState(false);
  const [openDetalhes, setOpenDetalhes] = React.useState(false);
  const [detalheInfra, setDetalheInfra] = React.useState(null);
  const [oportunidadeSelecionada, setOportunidadeSelecionada] = React.useState<string>("");
  const [openInscricaoPrograma, setOpenInscricaoPrograma] = React.useState(false);
  const [programaSelecionado, setProgramaSelecionado] = React.useState<string>("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <ResponsiveContainer className="pt-6">
        <SetorBreadcrumb setorName="Sector Mineiro" setorSlug="sector-mineiro" />
      </ResponsiveContainer>
      
      <ResponsiveSection background="gradient" spacing="lg">
        <ResponsiveContainer>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary-foreground/20 rounded-full">
                <PickaxeIcon className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <ResponsiveText variant="h1" align="center" className="text-primary-foreground mb-6">
              {mineiroInfo.title}
            </ResponsiveText>
            <ResponsiveText variant="lead" align="center" className="text-primary-foreground/90 max-w-3xl mx-auto mb-8">
              {mineiroInfo.subtitle}
            </ResponsiveText>
            <ResponsiveText variant="body" align="center" className="text-primary-foreground/80 max-w-4xl mx-auto">
              {mineiroInfo.description}
            </ResponsiveText>
          </div>
        </ResponsiveContainer>
      </ResponsiveSection>

      <ResponsiveContainer spacing="lg">
        <ResponsiveGrid cols={{ sm: 1, md: 2 }} gap="lg" className="mb-16">
          <ResponsiveCard className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center gap-3 mb-3">
              <TargetIcon className="w-6 h-6 text-yellow-600" />
              <ResponsiveText variant="h4" className="text-yellow-900">Nossa Visão</ResponsiveText>
            </div>
            <ResponsiveText variant="body" className="text-yellow-800">{mineiroInfo.vision}</ResponsiveText>
          </ResponsiveCard>
          
          <ResponsiveCard className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <LightbulbIcon className="w-6 h-6 text-gray-600" />
              <ResponsiveText variant="h4" className="text-gray-900">Nossa Missão</ResponsiveText>
            </div>
            <ResponsiveText variant="body" className="text-gray-800">{mineiroInfo.mission}</ResponsiveText>
          </ResponsiveCard>
        </ResponsiveGrid>

        <ResponsiveSection spacing="lg">
          <ResponsiveText variant="h2" align="center" className="mb-12">Estatísticas do Sector</ResponsiveText>
          <ResponsiveGrid cols={{ sm: 2, md: 3, lg: 6 }} gap="md">
            {estatisticas.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <ResponsiveCard key={index} interactive elevated className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <ResponsiveText variant="h3" className="text-primary mb-2">{stat.value}</ResponsiveText>
                  <ResponsiveText variant="small" className="text-muted-foreground">{stat.label}</ResponsiveText>
                </ResponsiveCard>
              );
            })}
          </ResponsiveGrid>
        </ResponsiveSection>

        <ResponsiveSection spacing="lg">
          <ResponsiveText variant="h2" align="center" className="mb-12">Recursos Minerais</ResponsiveText>
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap="md">
            {recursosMinerais.map((recurso, index) => (
              <ResponsiveCard key={index} interactive elevated>
                <div className="flex items-center gap-2 mb-3">
                  <DiamondIcon className="w-5 h-5 text-primary" />
                  <ResponsiveText variant="h4">{recurso.nome}</ResponsiveText>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                  <ResponsiveText variant="small" className="text-muted-foreground">{recurso.localizacao}</ResponsiveText>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <ResponsiveText variant="small" className="font-medium">Reservas:</ResponsiveText>
                    <Badge variant="outline">{recurso.reservas}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <ResponsiveText variant="small" className="font-medium">Produção:</ResponsiveText>
                    <Badge variant="secondary">{recurso.producao}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <ResponsiveText variant="small" className="font-medium">Estado:</ResponsiveText>
                    <Badge className={recurso.estado === "Ativo" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                      {recurso.estado}
                    </Badge>
                  </div>
                </div>
              </ResponsiveCard>
            ))}
          </ResponsiveGrid>
        </ResponsiveSection>

        <ResponsiveSection spacing="lg">
          <Tabs defaultValue="programas" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="programas">Programas Mineiros</TabsTrigger>
              <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
            </TabsList>
            
            <TabsContent value="programas" className="mt-8">
              <ResponsiveGrid cols={{ sm: 1, md: 2 }} gap="lg">
                {programasMinerais.map((programa, index) => (
                  <ResponsiveCard key={index} interactive elevated>
                    <div className="flex items-center gap-2 mb-3">
                      <PickaxeIcon className="w-5 h-5 text-primary" />
                      <ResponsiveText variant="h4">{programa.title}</ResponsiveText>
                    </div>
                    <ResponsiveText variant="body" className="text-muted-foreground mb-4">{programa.description}</ResponsiveText>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          <ResponsiveText variant="h5">Benefícios</ResponsiveText>
                        </div>
                        <ul className="space-y-1">
                          {programa.beneficios.map((beneficio, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              <ResponsiveText variant="small" className="text-muted-foreground">{beneficio}</ResponsiveText>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <StarIcon className="w-4 h-4 text-blue-600" />
                          <ResponsiveText variant="h5">Requisitos</ResponsiveText>
                        </div>
                        <ul className="space-y-1">
                          {programa.requisitos.map((requisito, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              <ResponsiveText variant="small" className="text-muted-foreground">{requisito}</ResponsiveText>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <ResponsiveText variant="small">
                          <strong>Contacto:</strong> {programa.contact}
                        </ResponsiveText>
                      </div>
                      
                      <Button 
                        variant="institutional" 
                        className="w-full"
                        onClick={() => {
                          setProgramaSelecionado(programa.title);
                          setOpenInscricaoPrograma(true);
                        }}
                      >
                        Inscrever-se
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </ResponsiveCard>
                ))}
              </ResponsiveGrid>
            </TabsContent>
            
            <TabsContent value="oportunidades" className="mt-8">
              <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
                {oportunidades.map((oportunidade, index) => (
                  <ResponsiveCard key={index} interactive elevated>
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary" className="mb-2">
                        {oportunidade.vagas} vagas
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Prazo: {oportunidade.prazo}
                      </Badge>
                    </div>
                    <ResponsiveText variant="h4" className="mb-2">{oportunidade.title}</ResponsiveText>
                    <ResponsiveText variant="body" className="text-muted-foreground mb-4">{oportunidade.description}</ResponsiveText>
                    
                    <div className="space-y-4">
                      <div>
                        <ResponsiveText variant="h5" className="mb-2">Requisitos:</ResponsiveText>
                        <ul className="space-y-1">
                          {oportunidade.requisitos.map((req, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full" />
                              <ResponsiveText variant="small" className="text-muted-foreground">{req}</ResponsiveText>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <ResponsiveText variant="h5" className="mb-2">Benefícios:</ResponsiveText>
                        <ul className="space-y-1">
                          {oportunidade.beneficios.map((ben, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full" />
                              <ResponsiveText variant="small" className="text-muted-foreground">{ben}</ResponsiveText>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        variant="institutional" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setOportunidadeSelecionada(oportunidade.title);
                          setOpenCandidatura(true);
                        }}
                      >
                        Candidatar-se
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </ResponsiveCard>
                ))}
              </ResponsiveGrid>
            </TabsContent>
          </Tabs>
        </ResponsiveSection>

        <ResponsiveSection spacing="lg">
          <ResponsiveText variant="h2" align="center" className="mb-12">Infraestruturas Mineiras</ResponsiveText>
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
            {infraestruturas.map((infra, index) => (
              <ResponsiveCard key={index} interactive elevated>
                <div className="flex items-center gap-2 mb-3">
                  <BuildingIcon className="w-5 h-5 text-primary" />
                  <ResponsiveText variant="h4">{infra.nome}</ResponsiveText>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                  <ResponsiveText variant="small" className="text-muted-foreground">{infra.localizacao}</ResponsiveText>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <ResponsiveText variant="small" className="font-medium">Capacidade:</ResponsiveText>
                    <Badge variant="outline">{infra.capacidade}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <ResponsiveText variant="small" className="font-medium">Estado:</ResponsiveText>
                    <Badge className={infra.estado === "Excelente" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                      {infra.estado}
                    </Badge>
                  </div>
                  <div>
                    <ResponsiveText variant="h5" className="mb-2">Equipamentos:</ResponsiveText>
                    <div className="flex flex-wrap gap-1">
                      {infra.equipamentos.map((equip, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {equip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { setDetalheInfra(infra); setOpenDetalhes(true); }}>
                    Ver Detalhes
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </ResponsiveCard>
            ))}
          </ResponsiveGrid>
        </ResponsiveSection>

        <ResponsiveSection background="muted" spacing="lg">
          <ResponsiveText variant="h2" align="center" className="mb-8">Informações de Contacto</ResponsiveText>
          
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap="md">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BuildingIcon className="w-6 h-6 text-primary" />
              </div>
              <ResponsiveText variant="h5" className="mb-2">Endereço</ResponsiveText>
              <ResponsiveText variant="small" className="text-muted-foreground">{contactInfo.endereco}</ResponsiveText>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <PhoneIcon className="w-6 h-6 text-primary" />
              </div>
              <ResponsiveText variant="h5" className="mb-2">Telefone</ResponsiveText>
              <ResponsiveText variant="small" className="text-muted-foreground">{contactInfo.telefone}</ResponsiveText>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MailIcon className="w-6 h-6 text-primary" />
              </div>
              <ResponsiveText variant="h5" className="mb-2">Email</ResponsiveText>
              <ResponsiveText variant="small" className="text-muted-foreground">{contactInfo.email}</ResponsiveText>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CalendarIcon className="w-6 h-6 text-primary" />
              </div>
              <ResponsiveText variant="h5" className="mb-2">Horário</ResponsiveText>
              <ResponsiveText variant="small" className="text-muted-foreground">{contactInfo.horario}</ResponsiveText>
            </div>
          </ResponsiveGrid>
          
          <div className="text-center mt-8 pt-6 border-t">
            <ResponsiveText variant="small" className="text-muted-foreground">
              <strong>Responsável:</strong> {contactInfo.responsavel}
            </ResponsiveText>
          </div>
        </ResponsiveSection>
      </ResponsiveContainer>
      
      <Footer />

      {/* Modais */}
      <CandidaturaForm
        open={openCandidatura}
        onOpenChange={setOpenCandidatura}
        setor="Sector Mineiro"
        oportunidade={oportunidadeSelecionada}
        onSuccess={() => {
          setOportunidadeSelecionada("");
        }}
      />
      <Dialog open={openDetalhes} onOpenChange={setOpenDetalhes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Infraestrutura</DialogTitle>
            <DialogDescription>
              {detalheInfra && (
                <div className="space-y-2 mt-2">
                  <div><b>Nome:</b> {detalheInfra.nome}</div>
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
      <InscricaoProgramaForm
        open={openInscricaoPrograma}
        onOpenChange={setOpenInscricaoPrograma}
        setor="Sector Mineiro"
        programa={programaSelecionado}
        onSuccess={() => {
          setProgramaSelecionado("");
        }}
      />
    </div>
  );
};

export default SectorMineiro; 