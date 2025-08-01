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
      
      <div className="container mx-auto px-4 pt-6">
        <SetorBreadcrumb setorName="Sector Mineiro" setorSlug="sector-mineiro" />
      </div>
      
      <section className="bg-gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-foreground/20 rounded-full">
              <PickaxeIcon className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            {mineiroInfo.title}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            {mineiroInfo.subtitle}
          </p>
          <p className="text-lg text-primary-foreground/80 max-w-4xl mx-auto">
            {mineiroInfo.description}
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <TargetIcon className="w-6 h-6 text-yellow-600" />
                <CardTitle className="text-yellow-900">Nossa Visão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-800">{mineiroInfo.vision}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <LightbulbIcon className="w-6 h-6 text-gray-600" />
                <CardTitle className="text-gray-900">Nossa Missão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800">{mineiroInfo.mission}</p>
            </CardContent>
          </Card>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Estatísticas do Sector</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {estatisticas.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-2">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos Minerais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recursosMinerais.map((recurso, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DiamondIcon className="w-5 h-5 text-primary" />
                    {recurso.nome}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPinIcon className="w-4 h-4" />
                    {recurso.localizacao}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Reservas:</span>
                    <Badge variant="outline">{recurso.reservas}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Produção:</span>
                    <Badge variant="secondary">{recurso.producao}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge className={recurso.estado === "Ativo" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                      {recurso.estado}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Tabs defaultValue="programas" className="mb-16">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="programas">Programas Mineiros</TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="programas" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programasMinerais.map((programa, index) => (
                <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PickaxeIcon className="w-5 h-5 text-primary" />
                      {programa.title}
                    </CardTitle>
                    <p className="text-muted-foreground">{programa.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        Benefícios
                      </h4>
                      <ul className="space-y-1">
                        {programa.beneficios.map((beneficio, idx) => (
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
                        {programa.requisitos.map((requisito, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            {requisito}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-sm">
                        <strong>Contacto:</strong> {programa.contact}
                      </p>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="oportunidades" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {oportunidades.map((oportunidade, index) => (
                <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="mb-2">
                        {oportunidade.vagas} vagas
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Prazo: {oportunidade.prazo}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{oportunidade.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">{oportunidade.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Requisitos:</h4>
                      <ul className="space-y-1">
                        {oportunidade.requisitos.map((req, idx) => (
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
                        {oportunidade.beneficios.map((ben, idx) => (
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
                        setOportunidadeSelecionada(oportunidade.title);
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

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Infraestruturas Mineiras</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {infraestruturas.map((infra, index) => (
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
                    <Badge className={infra.estado === "Excelente" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                      {infra.estado}
                    </Badge>
                  </div>
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
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { setDetalheInfra(infra); setOpenDetalhes(true); }}>
                    Ver Detalhes
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-muted/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Informações de Contacto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BuildingIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Endereço</h3>
              <p className="text-sm text-muted-foreground">{contactInfo.endereco}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <PhoneIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Telefone</h3>
              <p className="text-sm text-muted-foreground">{contactInfo.telefone}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MailIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CalendarIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Horário</h3>
              <p className="text-sm text-muted-foreground">{contactInfo.horario}</p>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Responsável:</strong> {contactInfo.responsavel}
            </p>
          </div>
        </section>
      </main>
      
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