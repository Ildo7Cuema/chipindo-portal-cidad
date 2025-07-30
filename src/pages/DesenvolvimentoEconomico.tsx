import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { SetorBreadcrumb } from "@/components/ui/setor-breadcrumb";
import { SetorNavigation } from "@/components/ui/setor-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUpIcon, 
  BuildingIcon, 
  UsersIcon, 
  DollarSignIcon,
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
  BriefcaseIcon,
  ShoppingBagIcon,
  FactoryIcon,
  GlobeIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import React from "react";
import { CandidaturaForm } from "@/components/ui/candidatura-form";
import { InscricaoProgramaForm } from "@/components/ui/inscricao-programa-form";

const DesenvolvimentoEconomico = () => {
  const economicoInfo = {
    title: "Desenvolvimento Económico",
    subtitle: "Impulsionando o crescimento económico e a prosperidade de Chipindo",
    description: "O setor de desenvolvimento económico de Chipindo está focado em criar um ambiente favorável ao investimento, promover o empreendedorismo e diversificar a economia local.",
    vision: "Ser um centro económico dinâmico e sustentável, atrativo para investimentos e inovação.",
    mission: "Promover o desenvolvimento económico sustentável através do apoio ao empreendedorismo e atração de investimentos."
  };

  const estatisticas = [
    { label: "Empresas Registadas", value: "245", icon: BuildingIcon },
    { label: "Empregos Criados", value: "1.850", icon: UsersIcon },
    { label: "Investimento Total", value: "25M USD", icon: DollarSignIcon },
    { label: "Crescimento PIB", value: "8.5%", icon: TrendingUpIcon },
    { label: "Projetos Ativos", value: "32", icon: BriefcaseIcon },
    { label: "Exportações", value: "12M USD", icon: GlobeIcon }
  ];

  const setoresEconomicos = [
    {
      nome: "Comércio e Serviços",
      empresas: "120",
      empregos: "850",
      contribuicao: "45%",
      estado: "Crescimento"
    },
    {
      nome: "Indústria Transformadora",
      empresas: "35",
      empregos: "420",
      contribuicao: "30%",
      estado: "Estável"
    },
    {
      nome: "Agricultura",
      empresas: "45",
      empregos: "380",
      contribuicao: "15%",
      estado: "Crescimento"
    },
    {
      nome: "Mineração",
      empresas: "8",
      empregos: "200",
      contribuicao: "10%",
      estado: "Expansão"
    }
  ];

  const programasEconomicos = [
    {
      title: "Programa de Apoio ao Empreendedorismo",
      description: "Iniciativa para apoiar novos empresários e startups",
      beneficios: [
        "Financiamento preferencial",
        "Mentoria empresarial",
        "Formação em gestão",
        "Acesso a mercados"
      ],
      requisitos: ["Plano de negócio viável", "Idade mínima 18 anos", "Residir no município"],
      contact: "Gabinete de Empreendedorismo"
    },
    {
      title: "Programa de Atração de Investimentos",
      description: "Incentivos para atrair investidores nacionais e estrangeiros",
      beneficios: [
        "Incentivos fiscais",
        "Simplificação de processos",
        "Apoio logístico",
        "Infraestruturas"
      ],
      requisitos: ["Investimento mínimo estabelecido", "Criação de empregos", "Projeto sustentável"],
      contact: "Gabinete de Investimentos"
    },
    {
      title: "Programa de Formação Profissional",
      description: "Formação técnica para aumentar a empregabilidade",
      beneficios: [
        "Cursos gratuitos",
        "Certificação reconhecida",
        "Estágios em empresas",
        "Apoio na inserção"
      ],
      requisitos: ["Idade mínima 16 anos", "Ensino básico", "Disponibilidade"],
      contact: "Centro de Formação Profissional"
    }
  ];

  const oportunidades = [
    {
      title: "Gestor de Projetos Económicos",
      description: "Vaga para gestor de projetos de desenvolvimento económico",
      requisitos: [
        "Licenciatura em Economia/Gestão",
        "Experiência de 5 anos",
        "Conhecimentos em gestão de projetos"
      ],
      beneficios: [
        "Salário competitivo",
        "Plano de carreira",
        "Formação contínua",
        "Benefícios sociais"
      ],
      prazo: "15 de Março de 2025",
      vagas: "2"
    },
    {
      title: "Analista Económico",
      description: "Vaga para analista de dados económicos",
      requisitos: [
        "Licenciatura em Economia/Estatística",
        "Experiência de 3 anos",
        "Conhecimentos em análise de dados"
      ],
      beneficios: [
        "Salário atrativo",
        "Formação especializada",
        "Trabalho remoto possível",
        "Plano de saúde"
      ],
      prazo: "20 de Março de 2025",
      vagas: "3"
    },
    {
      title: "Consultor de Investimentos",
      description: "Vaga para consultor de atração de investimentos",
      requisitos: [
        "Formação em Economia/Negócios",
        "Experiência em vendas",
        "Boa comunicação"
      ],
      beneficios: [
        "Salário base + comissões",
        "Formação em técnicas de vendas",
        "Viagens nacionais",
        "Plano de carreira"
      ],
      prazo: "25 de Março de 2025",
      vagas: "4"
    }
  ];

  const infraestruturas = [
    {
      nome: "Centro de Negócios",
      localizacao: "Zona Comercial",
      capacidade: "50 empresas",
      equipamentos: ["Escritórios", "Sala de Reuniões", "Centro de Conferências", "Café"],
      estado: "Excelente"
    },
    {
      nome: "Parque Industrial",
      localizacao: "Zona Industrial",
      capacidade: "30 fábricas",
      equipamentos: ["Armazéns", "Oficinas", "Centro Logístico", "Segurança 24h"],
      estado: "Bom"
    },
    {
      nome: "Centro de Formação",
      localizacao: "Centro da Cidade",
      capacidade: "200 formandos",
      equipamentos: ["Salas de Aula", "Laboratórios", "Biblioteca", "Sala de Informática"],
      estado: "Excelente"
    }
  ];

  const contactInfo = {
    endereco: "Rua do Desenvolvimento, Centro Comercial, Chipindo",
    telefone: "+244 XXX XXX XXX",
    email: "desenvolvimento@chipindo.gov.ao",
    horario: "Segunda a Sexta: 08:00 - 16:00",
    responsavel: "Dr. Ana Costa - Diretora Municipal de Desenvolvimento Económico"
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
      
      <section className="bg-gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-foreground/20 rounded-full">
              <TrendingUpIcon className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            {economicoInfo.title}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            {economicoInfo.subtitle}
          </p>
          <p className="text-lg text-primary-foreground/80 max-w-4xl mx-auto">
            {economicoInfo.description}
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <TargetIcon className="w-6 h-6 text-green-600" />
                <CardTitle className="text-green-900">Nossa Visão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-800">{economicoInfo.vision}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <LightbulbIcon className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-blue-900">Nossa Missão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800">{economicoInfo.mission}</p>
            </CardContent>
          </Card>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Estatísticas Económicas</h2>
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
          <h2 className="text-3xl font-bold text-center mb-12">Setores Económicos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {setoresEconomicos.map((setor, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FactoryIcon className="w-5 h-5 text-primary" />
                    {setor.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Empresas:</span>
                    <Badge variant="outline">{setor.empresas}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Empregos:</span>
                    <Badge variant="secondary">{setor.empregos}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Contribuição:</span>
                    <Badge className="bg-green-100 text-green-800">{setor.contribuicao}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge className={setor.estado === "Crescimento" ? "bg-green-100 text-green-800" : setor.estado === "Expansão" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}>
                      {setor.estado}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Tabs defaultValue="programas" className="mb-16">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="programas">Programas Económicos</TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="programas" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programasEconomicos.map((programa, index) => (
                <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUpIcon className="w-5 h-5 text-primary" />
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
          <h2 className="text-3xl font-bold text-center mb-12">Infraestruturas Económicas</h2>
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
        setor="Desenvolvimento Económico"
        oportunidade={oportunidadeSelecionada}
        onSuccess={() => {
          setOportunidadeSelecionada("");
        }}
      />
      <InscricaoProgramaForm
        open={openInscricaoPrograma}
        onOpenChange={setOpenInscricaoPrograma}
        setor="Desenvolvimento Económico"
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
    </div>
  );
};

export default DesenvolvimentoEconomico; 