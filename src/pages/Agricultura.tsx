import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { SetorBreadcrumb } from "@/components/ui/setor-breadcrumb";
import { SetorNavigation } from "@/components/ui/setor-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SproutIcon, 
  WheatIcon, 
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
  LeafIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import React from "react";
import { CandidaturaForm } from "@/components/ui/candidatura-form";
import { InscricaoProgramaForm } from "@/components/ui/inscricao-programa-form";

const Agricultura = () => {
  const agriculturaInfo = {
    title: "Sector de Agricultura",
    subtitle: "Desenvolvendo a agricultura sustentável e moderna em Chipindo",
    description: "O sector agrícola de Chipindo está focado em promover a agricultura sustentável, modernizar as técnicas de cultivo e apoiar os agricultores locais.",
    vision: "Ser referência em agricultura sustentável e moderna, garantindo a segurança alimentar.",
    mission: "Promover o desenvolvimento agrícola sustentável e apoiar os agricultores locais."
  };

  const estatisticas = [
    { label: "Agricultores", value: "1.245", icon: UsersIcon },
    { label: "Área Cultivada", value: "8.750 ha", icon: MapPinIcon },
    { label: "Produção Anual", value: "12.500 ton", icon: BuildingIcon },
    { label: "Projectos Ativos", value: "18", icon: SproutIcon },
    { label: "Crescimento", value: "15%", icon: TrendingUpIcon },
    { label: "Cooperativas", value: "6", icon: HeartHandshakeIcon }
  ];

  const programasAgricolas = [
    {
      title: "Modernização Agrícola",
      description: "Iniciativa para modernizar técnicas de cultivo",
      beneficios: ["Formação técnica", "Equipamentos subsidiados", "Assessoria gratuita"],
      requisitos: ["Agricultor registado", "Área mínima 2ha"],
      contact: "Departamento de Extensão Rural"
    },
    {
      title: "Programa de Irrigação",
      description: "Sistema de irrigação para produtividade",
      beneficios: ["Instalação de sistemas", "Formação hídrica", "Manutenção"],
      requisitos: ["Acesso a água", "Área mínima 5ha"],
      contact: "Coordenação de Recursos Hídricos"
    }
  ];

  const oportunidades = [
    {
      title: "Técnico Agrícola",
      description: "Vaga para técnico agrícola",
      requisitos: ["Licenciatura em Agronomia", "Experiência 2 anos"],
      beneficios: ["Salário competitivo", "Formação contínua"],
      prazo: "10 de Março de 2025",
      vagas: "3"
    }
  ];

  const contactInfo = {
    endereco: "Rua da Agricultura, Bairro Rural, Chipindo",
    telefone: "+244 XXX XXX XXX",
    email: "agricultura@chipindo.gov.ao",
    horario: "Segunda a Sexta: 08:00 - 16:00",
    responsavel: "Eng. Carlos Ferreira - Diretor Municipal de Agricultura"
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
      
      <div className="container mx-auto px-4 pt-6">
        <SetorBreadcrumb setorName="Agricultura" setorSlug="agricultura" />
      </div>
      
      <section className="bg-gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-foreground/20 rounded-full">
              <SproutIcon className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            {agriculturaInfo.title}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            {agriculturaInfo.subtitle}
          </p>
          <p className="text-lg text-primary-foreground/80 max-w-4xl mx-auto">
            {agriculturaInfo.description}
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
              <p className="text-green-800">{agriculturaInfo.vision}</p>
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
              <p className="text-blue-800">{agriculturaInfo.mission}</p>
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

        <Tabs defaultValue="programas" className="mb-16">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="programas">Programas Agrícolas</TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="programas" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programasAgricolas.map((programa, index) => (
                <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SproutIcon className="w-5 h-5 text-primary" />
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
        setor="Sector de Agricultura"
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
        setor="Sector de Agricultura"
        programa={programaSelecionado}
        onSuccess={() => {
          setProgramaSelecionado("");
        }}
      />
    </div>
  );
};

export default Agricultura; 