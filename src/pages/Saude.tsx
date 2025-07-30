import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { SetorBreadcrumb } from "@/components/ui/setor-breadcrumb";
import { SetorNavigation } from "@/components/ui/setor-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HeartIcon, 
  StethoscopeIcon, 
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
  ActivityIcon,
  BabyIcon,
  PillIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import React, { useState } from "react";
import { CandidaturaForm } from "@/components/ui/candidatura-form";
import { InscricaoProgramaForm } from "@/components/ui/inscricao-programa-form";
import { BookMedicalAppointmentForm } from "@/components/ui/book-medical-appointment-form";

const Saude = () => {
  const saudeInfo = {
    title: "Setor de Saúde",
    subtitle: "Cuidando da saúde e bem-estar da população de Chipindo",
    description: "O setor de saúde de Chipindo está comprometido em proporcionar cuidados de saúde de qualidade, acessíveis e equitativos para todos os cidadãos, promovendo a prevenção e o tratamento adequado.",
    vision: "Ser referência em saúde municipal, garantindo uma população saudável e com qualidade de vida.",
    mission: "Proporcionar cuidados de saúde integrais, preventivos e curativos, com foco na promoção da saúde e bem-estar da comunidade."
  };

  const estatisticas = [
    { label: "Unidades de Saúde", value: "8", icon: BuildingIcon },
    { label: "Profissionais de Saúde", value: "89", icon: UsersIcon },
    { label: "Consultas Mensais", value: "3.245", icon: StethoscopeIcon },
    { label: "Vacinas Aplicadas", value: "1.567", icon: ShieldIcon },
    { label: "Taxa de Cobertura", value: "92%", icon: TrendingUpIcon },
    { label: "Programas de Saúde", value: "12", icon: HeartHandshakeIcon }
  ];

  const programasSaude = [
    {
      title: "Programa de Vacinação",
      description: "Campanha de vacinação para todas as idades",
      beneficios: [
        "Vacinas gratuitas",
        "Acompanhamento de carteira vacinal",
        "Campanhas sazonais",
        "Visitas domiciliárias"
      ],
      requisitos: ["Residir no município", "Apresentar documento de identidade", "Carteira de vacinação"],
      contact: "Departamento de Imunização"
    },
    {
      title: "Saúde Materno-Infantil",
      description: "Acompanhamento pré-natal e pós-parto",
      beneficios: [
        "Consultas pré-natais gratuitas",
        "Exames laboratoriais",
        "Acompanhamento pós-parto",
        "Educação para pais"
      ],
      requisitos: ["Gestantes residentes no município", "Crianças até 5 anos", "Documentação médica"],
      contact: "Centro de Saúde Materno-Infantil"
    },
    {
      title: "Programa de Prevenção",
      description: "Ações preventivas e educativas em saúde",
      beneficios: [
        "Palestras educativas",
        "Rastreios gratuitos",
        "Material informativo",
        "Aconselhamento nutricional"
      ],
      requisitos: ["Interesse em saúde preventiva", "Participação em atividades", "Residir no município"],
      contact: "Coordenação de Promoção da Saúde"
    },
    {
      title: "Saúde Mental",
      description: "Apoio psicológico e psiquiátrico",
      beneficios: [
        "Consultas psicológicas",
        "Aconselhamento familiar",
        "Grupos de apoio",
        "Medicação subsidiada"
      ],
      requisitos: ["Encaminhamento médico", "Compromisso com tratamento", "Acompanhamento regular"],
      contact: "Centro de Saúde Mental"
    }
  ];

  const oportunidades = [
    {
      title: "Concurso para Médicos",
      description: "Abertura de vagas para médicos generalistas e especialistas",
      requisitos: [
        "Licenciatura em Medicina",
        "Registro na Ordem dos Médicos",
        "Experiência mínima de 3 anos"
      ],
      beneficios: [
        "Salário competitivo",
        "Plano de saúde",
        "Formação contínua",
        "Apoio habitacional"
      ],
      prazo: "20 de Março de 2025",
      vagas: "5"
    },
    {
      title: "Estágio para Enfermeiros",
      description: "Programa de estágio para estudantes de enfermagem",
      requisitos: [
        "Estudante de Enfermagem",
        "Disponibilidade de 30h semanais",
        "Interesse em saúde pública"
      ],
      beneficios: [
        "Bolsa de estágio",
        "Experiência prática",
        "Supervisão profissional",
        "Certificado de estágio"
      ],
      prazo: "25 de Março de 2025",
      vagas: "8"
    },
    {
      title: "Voluntariado em Saúde",
      description: "Programa de voluntariado para apoio em atividades de saúde",
      requisitos: [
        "Maior de 18 anos",
        "Interesse em saúde pública",
        "Disponibilidade de 15h semanais"
      ],
      beneficios: [
        "Formação em primeiros socorros",
        "Certificado de voluntariado",
        "Experiência em saúde pública",
        "Networking profissional"
      ],
      prazo: "Aberto permanentemente",
      vagas: "Ilimitadas"
    }
  ];

  const infraestruturas = [
    {
      nome: "Hospital Municipal",
      localizacao: "Bairro Central",
      capacidade: "50 camas",
      equipamentos: ["Bloco Operatório", "Laboratório", "Radiologia", "Farmácia", "UTI"],
      estado: "Excelente"
    },
    {
      nome: "Centro de Saúde Principal",
      localizacao: "Bairro dos Funcionários",
      capacidade: "200 consultas/dia",
      equipamentos: ["Consultórios", "Laboratório Básico", "Farmácia", "Sala de Vacinação"],
      estado: "Bom"
    },
    {
      nome: "Posto de Saúde Rural",
      localizacao: "Zona Rural",
      capacidade: "50 consultas/dia",
      equipamentos: ["Consultório", "Sala de Vacinação", "Farmácia Básica", "Ambulância"],
      estado: "Regular"
    }
  ];

  const servicosEspecializados = [
    {
      nome: "Cardiologia",
      medico: "Dr. Carlos Santos",
      horario: "Segunda a Sexta: 09:00 - 16:00",
      local: "Hospital Municipal"
    },
    {
      nome: "Pediatria",
      medico: "Dra. Maria Costa",
      horario: "Segunda a Sexta: 08:00 - 17:00",
      local: "Centro de Saúde Principal"
    },
    {
      nome: "Ginecologia",
      medico: "Dra. Ana Silva",
      horario: "Terça e Quinta: 14:00 - 18:00",
      local: "Hospital Municipal"
    },
    {
      nome: "Ortopedia",
      medico: "Dr. Pedro Oliveira",
      horario: "Segunda e Quarta: 10:00 - 15:00",
      local: "Centro de Saúde Principal"
    }
  ];

  const contactInfo = {
    endereco: "Rua da Saúde, Bairro Central, Chipindo",
    telefone: "+244 XXX XXX XXX",
    email: "saude@chipindo.gov.ao",
    horario: "Segunda a Sexta: 08:00 - 16:00",
    responsavel: "Dr. Manuel Ferreira - Diretor Municipal de Saúde"
  };

  const [openCandidatura, setOpenCandidatura] = React.useState(false);
  const [openDetalhes, setOpenDetalhes] = React.useState(false);
  const [detalheInfra, setDetalheInfra] = React.useState<any>(null);
  const [oportunidadeSelecionada, setOportunidadeSelecionada] = React.useState<string>("");
  const [openInscricaoPrograma, setOpenInscricaoPrograma] = React.useState(false);
  const [programaSelecionado, setProgramaSelecionado] = React.useState<string>("");
  const [openConsulta, setOpenConsulta] = useState(false);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<string>("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 pt-6">
        <SetorBreadcrumb setorName="Saúde" setorSlug="saude" />
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-foreground/20 rounded-full">
              <HeartIcon className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            {saudeInfo.title}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            {saudeInfo.subtitle}
          </p>
          <p className="text-lg text-primary-foreground/80 max-w-4xl mx-auto">
            {saudeInfo.description}
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Visão e Missão */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <TargetIcon className="w-6 h-6 text-red-600" />
                <CardTitle className="text-red-900">Nossa Visão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-red-800">{saudeInfo.vision}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <LightbulbIcon className="w-6 h-6 text-green-600" />
                <CardTitle className="text-green-900">Nossa Missão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-800">{saudeInfo.mission}</p>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Estatísticas do Setor</h2>
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

        {/* Tabs para Programas e Oportunidades */}
        <Tabs defaultValue="programas" className="mb-16">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="programas">Programas de Saúde</TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="programas" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programasSaude.map((programa, index) => (
                <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HeartIcon className="w-5 h-5 text-primary" />
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

        {/* Serviços Especializados */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Serviços Especializados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicosEspecializados.map((servico, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <StethoscopeIcon className="w-5 h-5 text-primary" />
                    {servico.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <UsersIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{servico.medico}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{servico.horario}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{servico.local}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setEspecialidadeSelecionada(servico.nome);
                      setOpenConsulta(true);
                    }}
                  >
                    Marcar Consulta
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <BookMedicalAppointmentForm
            open={openConsulta}
            onOpenChange={setOpenConsulta}
            especialidade={especialidadeSelecionada}
            onSuccess={() => setEspecialidadeSelecionada("")}
          />
        </section>

        {/* Infraestruturas */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Infraestruturas de Saúde</h2>
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
                    <Badge className={infra.estado === "Excelente" ? "bg-green-100 text-green-800" : infra.estado === "Bom" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}>
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

        {/* Contact Information */}
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
        setor="Setor de Saúde"
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
      <InscricaoProgramaForm
        open={openInscricaoPrograma}
        onOpenChange={setOpenInscricaoPrograma}
        setor="Setor de Saúde"
        programa={programaSelecionado}
        onSuccess={() => {
          setProgramaSelecionado("");
        }}
      />
    </div>
  );
};

export default Saude; 