import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { SetorBreadcrumb } from "@/components/ui/setor-breadcrumb";
import { SetorNavigation } from "@/components/ui/setor-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ZapIcon, 
  DropletsIcon, 
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
  BatteryIcon,
  GaugeIcon,
  WrenchIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import React from "react";
import { CandidaturaForm } from "@/components/ui/candidatura-form";
import { InscricaoProgramaForm } from "@/components/ui/inscricao-programa-form";

const EnergiaAgua = () => {
  const energiaAguaInfo = {
    title: "Energia e Água",
    subtitle: "Garantindo o fornecimento sustentável de energia e água para Chipindo",
    description: "O setor de energia e água de Chipindo está comprometido em fornecer serviços de qualidade, promover a eficiência energética e garantir o acesso universal a estes recursos essenciais.",
    vision: "Ser referência em fornecimento sustentável de energia e água, garantindo qualidade e acessibilidade.",
    mission: "Proporcionar serviços de energia e água de qualidade, promovendo a sustentabilidade e eficiência."
  };

  const estatisticas = [
    { label: "Cobertura Elétrica", value: "78%", icon: ZapIcon },
    { label: "Cobertura de Água", value: "65%", icon: DropletsIcon },
    { label: "Consumidores", value: "12.450", icon: UsersIcon },
    { label: "Centrais Elétricas", value: "3", icon: BuildingIcon },
    { label: "Estações de Água", value: "5", icon: GaugeIcon },
    { label: "Projetos Ativos", value: "15", icon: HeartHandshakeIcon }
  ];

  const programasEnergiaAgua = [
    {
      title: "Programa de Eficiência Energética",
      description: "Iniciativas para reduzir o consumo energético e promover energias renováveis",
      beneficios: [
        "Auditorias energéticas gratuitas",
        "Substituição de equipamentos",
        "Formação em eficiência energética",
        "Incentivos fiscais"
      ],
      requisitos: ["Consumidor registado", "Interesse em eficiência", "Compromisso com sustentabilidade"],
      contact: "Departamento de Eficiência Energética"
    },
    {
      title: "Programa de Gestão da Água",
      description: "Projetos para otimizar o uso da água e reduzir perdas",
      beneficios: [
        "Detecção de fugas gratuita",
        "Instalação de contadores inteligentes",
        "Formação em gestão hídrica",
        "Redução de tarifas"
      ],
      requisitos: ["Consumidor de água", "Participação em auditorias", "Compromisso com poupança"],
      contact: "Departamento de Gestão Hídrica"
    }
  ];

  const oportunidades = [
    {
      title: "Engenheiro Eletrotécnico",
      description: "Vaga para engenheiro especializado em sistemas elétricos",
      requisitos: [
        "Licenciatura em Engenharia Eletrotécnica",
        "Experiência de 4 anos",
        "Conhecimentos em redes elétricas"
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
      title: "Técnico de Água e Saneamento",
      description: "Vaga para técnico especializado em sistemas de água",
      requisitos: [
        "Formação técnica em Saneamento",
        "Experiência de 3 anos",
        "Conhecimentos em tratamento de água"
      ],
      beneficios: [
        "Salário atrativo",
        "Equipamentos fornecidos",
        "Formação especializada",
        "Plano de saúde"
      ],
      prazo: "20 de Março de 2025",
      vagas: "3"
    }
  ];

  const infraestruturas = [
    {
      nome: "Estação de Água Central",
      localizacao: "Rua da Água, Bairro do Centro",
      capacidade: "100.000 litros/dia",
      estado: "Em Operação",
      equipamentos: ["Bomba de água", "Reservatório", "Sistema de filtragem"]
    },
    {
      nome: "Estação de Energia Elétrica",
      localizacao: "Rua da Energia, Bairro do Norte",
      capacidade: "500 kW",
      estado: "Em Manutenção",
      equipamentos: ["Gerador", "Transformador", "Sistema de distribuição"]
    }
  ];

  const contactInfo = {
    endereco: "Rua da Energia e Água, Centro de Serviços, Chipindo",
    telefone: "+244 XXX XXX XXX",
    email: "energia-agua@chipindo.gov.ao",
    horario: "Segunda a Sexta: 08:00 - 16:00",
    responsavel: "Eng. João Silva - Diretor Municipal de Energia e Água"
  };

  const [openCandidatura, setOpenCandidatura] = React.useState(false);
  const [openDetalhes, setOpenDetalhes] = React.useState(false);
  const [detalheInfra, setDetalheInfra] = React.useState<any>(null);
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
              <ZapIcon className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            {energiaAguaInfo.title}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            {energiaAguaInfo.subtitle}
          </p>
          <p className="text-lg text-primary-foreground/80 max-w-4xl mx-auto">
            {energiaAguaInfo.description}
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
              <p className="text-blue-800">{energiaAguaInfo.vision}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <LightbulbIcon className="w-6 h-6 text-cyan-600" />
                <CardTitle className="text-cyan-900">Nossa Missão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-cyan-800">{energiaAguaInfo.mission}</p>
            </CardContent>
          </Card>
        </div>

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

        <Tabs defaultValue="programas" className="mb-16">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="programas">Programas Setoriais</TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="programas" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programasEnergiaAgua.map((programa, index) => (
                <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BatteryIcon className="w-5 h-5 text-primary" />
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
        setor="Energia e Água"
        oportunidade={oportunidadeSelecionada}
        onSuccess={() => {
          setOportunidadeSelecionada("");
        }}
      />
      <InscricaoProgramaForm
        open={openInscricaoPrograma}
        onOpenChange={setOpenInscricaoPrograma}
        setor="Energia e Água"
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

export default EnergiaAgua; 