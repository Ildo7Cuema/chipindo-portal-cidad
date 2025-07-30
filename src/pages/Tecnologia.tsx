import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { SetorBreadcrumb } from "@/components/ui/setor-breadcrumb";
import { SetorNavigation } from "@/components/ui/setor-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CpuIcon, 
  SmartphoneIcon, 
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
  WifiIcon,
  DatabaseIcon,
  GlobeIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import React from "react";
import { CandidaturaForm } from "@/components/ui/candidatura-form";
import { InscricaoProgramaForm } from "@/components/ui/inscricao-programa-form";

const Tecnologia = () => {
  const tecnologiaInfo = {
    title: "Setor de Tecnologia",
    subtitle: "Inovação e transformação digital para o futuro de Chipindo",
    description: "O setor de tecnologia de Chipindo está focado em promover a inovação digital, modernizar os serviços públicos e criar oportunidades na área tecnológica.",
    vision: "Ser referência em inovação tecnológica e transformação digital municipal.",
    mission: "Promover a adoção de tecnologias inovadoras e criar um ecossistema digital sustentável."
  };

  const estatisticas = [
    { label: "Startups Tech", value: "15", icon: BuildingIcon },
    { label: "Profissionais IT", value: "89", icon: UsersIcon },
    { label: "Projetos Digitais", value: "32", icon: CpuIcon },
    { label: "Cobertura Internet", value: "85%", icon: WifiIcon },
    { label: "Serviços Online", value: "24", icon: GlobeIcon },
    { label: "Investimento Tech", value: "2.5M USD", icon: TrendingUpIcon }
  ];

  const areasTecnologicas = [
    {
      nome: "Desenvolvimento de Software",
      empresas: "8",
      profissionais: "45",
      projetos: "18",
      estado: "Crescimento"
    },
    {
      nome: "Infraestrutura Digital",
      empresas: "5",
      profissionais: "25",
      projetos: "12",
      estado: "Expansão"
    },
    {
      nome: "E-commerce",
      empresas: "12",
      profissionais: "35",
      projetos: "8",
      estado: "Ativo"
    },
    {
      nome: "Consultoria IT",
      empresas: "6",
      profissionais: "28",
      projetos: "15",
      estado: "Estável"
    }
  ];

  const programasTecnologicos = [
    {
      title: "Programa de Formação em Tecnologia",
      description: "Formação em áreas tecnológicas para jovens e profissionais",
      beneficios: [
        "Cursos gratuitos",
        "Certificação reconhecida",
        "Estágios em empresas",
        "Apoio na inserção"
      ],
      requisitos: ["Idade mínima 16 anos", "Ensino básico", "Interesse em tecnologia"],
      contact: "Centro de Formação Tecnológica"
    },
    {
      title: "Programa de Incubação de Startups",
      description: "Apoio ao desenvolvimento de startups tecnológicas",
      beneficios: [
        "Espaço de coworking",
        "Mentoria técnica",
        "Acesso a investidores",
        "Recursos tecnológicos"
      ],
      requisitos: ["Ideia inovadora", "Plano de negócio", "Equipa dedicada"],
      contact: "Incubadora de Startups"
    },
    {
      title: "Programa de Digitalização",
      description: "Modernização digital dos serviços públicos",
      beneficios: [
        "Automação de processos",
        "Melhoria de eficiência",
        "Redução de custos",
        "Melhor atendimento"
      ],
      requisitos: ["Serviço público", "Processo definido", "Recursos disponíveis"],
      contact: "Departamento de Transformação Digital"
    }
  ];

  const oportunidades = [
    {
      title: "Desenvolvedor Full Stack",
      description: "Vaga para desenvolvedor com experiência em tecnologias web",
      requisitos: [
        "Licenciatura em Informática",
        "Experiência de 3 anos",
        "Conhecimentos em React/Node.js"
      ],
      beneficios: [
        "Salário competitivo",
        "Trabalho remoto",
        "Formação contínua",
        "Plano de saúde"
      ],
      prazo: "20 de Março de 2025",
      vagas: "4"
    },
    {
      title: "Analista de Dados",
      description: "Vaga para analista de dados e business intelligence",
      requisitos: [
        "Formação em Estatística/Informática",
        "Experiência de 2 anos",
        "Conhecimentos em SQL/Python"
      ],
      beneficios: [
        "Salário atrativo",
        "Horário flexível",
        "Formação especializada",
        "Plano de carreira"
      ],
      prazo: "25 de Março de 2025",
      vagas: "3"
    },
    {
      title: "Técnico de Suporte IT",
      description: "Vagas para técnicos de suporte técnico",
      requisitos: [
        "Formação técnica em IT",
        "Experiência de 1 ano",
        "Boa comunicação"
      ],
      beneficios: [
        "Salário base + prémios",
        "Formação em produtos",
        "Equipamentos fornecidos",
        "Plano de carreira"
      ],
      prazo: "30 de Março de 2025",
      vagas: "6"
    }
  ];

  const infraestruturas = [
    {
      nome: "Centro de Inovação Tecnológica",
      localizacao: "Zona Tecnológica",
      capacidade: "50 startups",
      equipamentos: ["Coworking", "Sala de Reuniões", "Laboratório", "Centro de Dados"],
      estado: "Excelente"
    },
    {
      nome: "Centro de Formação IT",
      localizacao: "Centro da Cidade",
      capacidade: "100 formandos",
      equipamentos: ["Salas de Aula", "Laboratórios", "Biblioteca Digital", "Sala de Conferências"],
      estado: "Excelente"
    },
    {
      nome: "Data Center Municipal",
      localizacao: "Zona Industrial",
      capacidade: "1000 servidores",
      equipamentos: ["Servidores", "Sistema de Refrigeração", "Backup", "Segurança 24h"],
      estado: "Bom"
    }
  ];

  const servicosDigitais = [
    {
      nome: "Portal do Cidadão",
      descricao: "Acesso online a serviços municipais",
      utilizadores: "Em desenvolvimento",
      servicos: "24",
      estado: "Ativo"
    },
    {
      nome: "App Municipal",
      descricao: "Aplicação móvel para serviços públicos",
      utilizadores: "Em desenvolvimento",
      servicos: "18",
      estado: "Ativo"
    },
    {
      nome: "Sistema de Gestão",
      descricao: "Gestão integrada de processos municipais",
      utilizadores: "150",
      servicos: "12",
      estado: "Implementação"
    },
    {
      nome: "Centro de Contacto",
      descricao: "Atendimento digital ao cidadão",
      utilizadores: "Em desenvolvimento",
      servicos: "8",
      estado: "Ativo"
    }
  ];

  const contactInfo = {
    endereco: "Rua da Tecnologia, Zona de Inovação, Chipindo",
    telefone: "+244 XXX XXX XXX",
    email: "tecnologia@chipindo.gov.ao",
    horario: "Segunda a Sexta: 08:00 - 16:00",
    responsavel: "Eng. Pedro Costa - Diretor Municipal de Tecnologia"
  };

  const [openCandidatura, setOpenCandidatura] = React.useState(false);
  const [openDetalhes, setOpenDetalhes] = React.useState(false);
  const [detalheInfra, setDetalheInfra] = React.useState(null);
  const [oportunidadeSelecionada, setOportunidadeSelecionada] = React.useState<string>("");
  const [openInscricaoPrograma, setOpenInscricaoPrograma] = React.useState(false);
  const [programaSelecionado, setProgramaSelecionado] = React.useState<string>("");
  const [openDetalhesServico, setOpenDetalhesServico] = React.useState(false);
  const [servicoSelecionado, setServicoSelecionado] = React.useState(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="bg-gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-foreground/20 rounded-full">
              <CpuIcon className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            {tecnologiaInfo.title}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            {tecnologiaInfo.subtitle}
          </p>
          <p className="text-lg text-primary-foreground/80 max-w-4xl mx-auto">
            {tecnologiaInfo.description}
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <TargetIcon className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-blue-900">Nossa Visão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800">{tecnologiaInfo.vision}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <LightbulbIcon className="w-6 h-6 text-indigo-600" />
                <CardTitle className="text-indigo-900">Nossa Missão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-800">{tecnologiaInfo.mission}</p>
            </CardContent>
          </Card>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Estatísticas Tecnológicas</h2>
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
          <h2 className="text-3xl font-bold text-center mb-12">Áreas Tecnológicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {areasTecnologicas.map((area, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CpuIcon className="w-5 h-5 text-primary" />
                    {area.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Empresas:</span>
                    <Badge variant="outline">{area.empresas}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Profissionais:</span>
                    <Badge variant="secondary">{area.profissionais}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Projetos:</span>
                    <Badge className="bg-green-100 text-green-800">{area.projetos}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge className={area.estado === "Crescimento" ? "bg-green-100 text-green-800" : area.estado === "Expansão" ? "bg-blue-100 text-blue-800" : area.estado === "Ativo" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {area.estado}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Serviços Digitais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicosDigitais.map((servico, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SmartphoneIcon className="w-5 h-5 text-primary" />
                    {servico.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{servico.descricao}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Utilizadores:</span>
                    <Badge variant="outline">{servico.utilizadores}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Serviços:</span>
                    <Badge variant="secondary">{servico.servicos}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge className={servico.estado === "Ativo" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                      {servico.estado}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setServicoSelecionado(servico);
                      setOpenDetalhesServico(true);
                    }}
                  >
                    Aceder
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Tabs defaultValue="programas" className="mb-16">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="programas">Programas Tecnológicos</TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="programas" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programasTecnologicos.map((programa, index) => (
                <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CpuIcon className="w-5 h-5 text-primary" />
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
          <h2 className="text-3xl font-bold text-center mb-12">Infraestruturas Tecnológicas</h2>
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
        setor="Setor de Tecnologia"
        oportunidade={oportunidadeSelecionada}
        onSuccess={() => {
          setOportunidadeSelecionada("");
        }}
      />
      <InscricaoProgramaForm
        open={openInscricaoPrograma}
        onOpenChange={setOpenInscricaoPrograma}
        setor="Setor de Tecnologia"
        programa={programaSelecionado}
        onSuccess={() => {
          setProgramaSelecionado("");
        }}
      />
      <Dialog open={openDetalhes} onOpenChange={setOpenDetalhes}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Infraestrutura</DialogTitle>
            <DialogDescription className="max-h-[calc(90vh-120px)] overflow-y-auto">
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

      <Dialog open={openDetalhesServico} onOpenChange={setOpenDetalhesServico}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Serviço Digital</DialogTitle>
            <DialogDescription className="max-h-[calc(90vh-120px)] overflow-y-auto">
              {servicoSelecionado && (
                <div className="space-y-4 mt-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{servicoSelecionado.nome}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{servicoSelecionado.descricao}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-primary" />
                        <span><b>Utilizadores:</b> {servicoSelecionado.utilizadores}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GlobeIcon className="w-4 h-4 text-primary" />
                        <span><b>Serviços Disponíveis:</b> {servicoSelecionado.servicos}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-primary" />
                        <span><b>Estado:</b> {servicoSelecionado.estado}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Funcionalidades Principais</h4>
                    <div className="space-y-2">
                      {servicoSelecionado.nome === "Portal do Cidadão" && (
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Acesso a documentos municipais</li>
                          <li>• Pagamento de taxas e licenças</li>
                          <li>• Agendamento de serviços</li>
                          <li>• Consulta de processos</li>
                          <li>• Comunicação com a autarquia</li>
                        </ul>
                      )}
                      {servicoSelecionado.nome === "App Municipal" && (
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Notificações em tempo real</li>
                          <li>• Localização de serviços</li>
                          <li>• Reporte de problemas</li>
                          <li>• Acesso móvel a serviços</li>
                          <li>• Informações de emergência</li>
                        </ul>
                      )}
                      {servicoSelecionado.nome === "Sistema de Gestão" && (
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Gestão de recursos humanos</li>
                          <li>• Controlo financeiro</li>
                          <li>• Gestão de projetos</li>
                          <li>• Relatórios automáticos</li>
                          <li>• Integração de dados</li>
                        </ul>
                      )}
                      {servicoSelecionado.nome === "Centro de Contacto" && (
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Atendimento por chat</li>
                          <li>• Suporte por email</li>
                          <li>• Base de conhecimento</li>
                          <li>• Tickets de suporte</li>
                          <li>• FAQ interativo</li>
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Estado de Desenvolvimento</h4>
                    <div className="space-y-2">
                      {servicoSelecionado.estado === "Ativo" && (
                        <>
                          <p className="text-sm text-green-600 font-medium">✓ Serviço em desenvolvimento ativo</p>
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <p className="text-sm text-green-800"><b>Status:</b> Em desenvolvimento</p>
                            <p className="text-sm text-green-700">Este serviço está sendo desenvolvido e será lançado em breve.</p>
                          </div>
                        </>
                      )}
                      {servicoSelecionado.estado === "Implementação" && (
                        <>
                          <p className="text-sm text-blue-600 font-medium">⏳ Serviço em fase de implementação</p>
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800"><b>Status:</b> Em implementação</p>
                            <p className="text-sm text-blue-700">O serviço está sendo implementado e testado internamente.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Cronograma de Lançamento</h4>
                    <div className="space-y-2">
                      {servicoSelecionado.nome === "Portal do Cidadão" && (
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-800"><b>Previsão de Lançamento:</b> Q2 2025</p>
                          <p className="text-sm text-yellow-700">Fase atual: Desenvolvimento da interface e integração de sistemas</p>
                        </div>
                      )}
                      {servicoSelecionado.nome === "App Municipal" && (
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-800"><b>Previsão de Lançamento:</b> Q3 2025</p>
                          <p className="text-sm text-yellow-700">Fase atual: Design da interface e desenvolvimento das funcionalidades básicas</p>
                        </div>
                      )}
                      {servicoSelecionado.nome === "Sistema de Gestão" && (
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-800"><b>Previsão de Lançamento:</b> Q1 2025</p>
                          <p className="text-sm text-yellow-700">Fase atual: Implementação e testes internos</p>
                        </div>
                      )}
                      {servicoSelecionado.nome === "Centro de Contacto" && (
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-800"><b>Previsão de Lançamento:</b> Q2 2025</p>
                          <p className="text-sm text-yellow-700">Fase atual: Configuração da infraestrutura e treinamento da equipa</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Como Acompanhar o Progresso</h4>
                    <div className="space-y-2">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800"><b>Newsletter de Tecnologia</b></p>
                        <p className="text-sm text-blue-700">Inscreva-se para receber atualizações sobre o desenvolvimento dos serviços digitais.</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800"><b>Programa Beta Tester</b></p>
                        <p className="text-sm text-green-700">Candidate-se para testar os serviços antes do lançamento oficial.</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-800"><b>Consultas Públicas</b></p>
                        <p className="text-sm text-purple-700">Participe nas consultas para dar feedback sobre as funcionalidades desejadas.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Suporte e Informações</h4>
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <p className="text-sm"><b>Departamento de Tecnologia</b></p>
                      <p className="text-sm text-muted-foreground">Telefone: {contactInfo.telefone}</p>
                      <p className="text-sm text-muted-foreground">Email: {contactInfo.email}</p>
                      <p className="text-sm text-muted-foreground">Horário: {contactInfo.horario}</p>
                      <p className="text-sm text-muted-foreground mt-2"><b>Para informações sobre desenvolvimento:</b></p>
                      <p className="text-sm text-muted-foreground">Email: desenvolvimento@chipindo.gov.ao</p>
                    </div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpenDetalhesServico(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tecnologia; 