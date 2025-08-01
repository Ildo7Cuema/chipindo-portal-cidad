import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { SetorBreadcrumb } from "@/components/ui/setor-breadcrumb";
import { SetorNavigation } from "@/components/ui/setor-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PaletteIcon, 
  MusicIcon, 
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
  BookOpenIcon,
  CameraIcon,
  TheaterIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import React from "react";
import { CandidaturaForm } from "@/components/ui/candidatura-form";
import { InscricaoProgramaForm } from "@/components/ui/inscricao-programa-form";
import { useCulturaData } from "@/hooks/useCulturaData";

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'UsersIcon': UsersIcon,
    'CalendarIcon': CalendarIcon,
    'PaletteIcon': PaletteIcon,
    'BuildingIcon': BuildingIcon,
    'MusicIcon': MusicIcon,
    'HeartHandshakeIcon': HeartHandshakeIcon,
    'TheaterIcon': TheaterIcon
  };
  return iconMap[iconName] || UsersIcon;
};

const Cultura = () => {
  const {
    culturaInfo,
    estatisticas,
    areasCulturais,
    eventosCulturais,
    programasCulturais,
    oportunidades,
    infraestruturas,
    contactInfo,
    loading,
    error
  } = useCulturaData();

  const [openCandidatura, setOpenCandidatura] = React.useState(false);
  const [openDetalhes, setOpenDetalhes] = React.useState(false);
  const [detalheInfra, setDetalheInfra] = React.useState(null);
  const [oportunidadeSelecionada, setOportunidadeSelecionada] = React.useState<string>("");
  const [openInscricaoPrograma, setOpenInscricaoPrograma] = React.useState(false);
  const [programaSelecionado, setProgramaSelecionado] = React.useState<string>("");
  const [openDetalhesEvento, setOpenDetalhesEvento] = React.useState(false);
  const [eventoSelecionado, setEventoSelecionado] = React.useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">A carregar dados culturais...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar dados: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!culturaInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="bg-gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-foreground/20 rounded-full">
              <PaletteIcon className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            {culturaInfo.title}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            {culturaInfo.subtitle}
          </p>
          <p className="text-lg text-primary-foreground/80 max-w-4xl mx-auto">
            {culturaInfo.description}
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <TargetIcon className="w-6 h-6 text-purple-600" />
                <CardTitle className="text-purple-900">Nossa Visão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-purple-800">{culturaInfo.vision}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <LightbulbIcon className="w-6 h-6 text-pink-600" />
                <CardTitle className="text-pink-900">Nossa Missão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-pink-800">{culturaInfo.mission}</p>
            </CardContent>
          </Card>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Estatísticas Culturais</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {estatisticas.map((stat, index) => {
              const IconComponent = getIconComponent(stat.icon);
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
          <h2 className="text-3xl font-bold text-center mb-12">Áreas Culturais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {areasCulturais.map((area, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MusicIcon className="w-5 h-5 text-primary" />
                    {area.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Grupos:</span>
                    <Badge variant="outline">{area.grupos}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Eventos:</span>
                    <Badge variant="secondary">{area.eventos}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Participantes:</span>
                    <Badge className="bg-green-100 text-green-800">{area.participantes}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge className={area.estado === "Ativo" ? "bg-green-100 text-green-800" : area.estado === "Crescimento" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}>
                      {area.estado}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Próximos Eventos Culturais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventosCulturais.map((evento, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    {evento.nome}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPinIcon className="w-4 h-4" />
                    {evento.local}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Data:</span>
                    <Badge variant="outline">{evento.data}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tipo:</span>
                    <Badge variant="secondary">{evento.tipo}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge className={evento.estado === "Inscrições Abertas" ? "bg-green-100 text-green-800" : evento.estado === "Em Preparação" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}>
                      {evento.estado}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setEventoSelecionado(evento);
                      setOpenDetalhesEvento(true);
                    }}
                  >
                    Mais Informações
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Tabs defaultValue="programas" className="mb-16">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="programas">Programas Culturais</TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="programas" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programasCulturais.map((programa, index) => (
                <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PaletteIcon className="w-5 h-5 text-primary" />
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
          <h2 className="text-3xl font-bold text-center mb-12">Infraestruturas Culturais</h2>
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
        setor="Sector de Cultura"
        oportunidade={oportunidadeSelecionada}
        onSuccess={() => {
          setOportunidadeSelecionada("");
        }}
      />
      <InscricaoProgramaForm
        open={openInscricaoPrograma}
        onOpenChange={setOpenInscricaoPrograma}
        setor="Sector de Cultura"
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

      <Dialog open={openDetalhesEvento} onOpenChange={setOpenDetalhesEvento}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Evento Cultural</DialogTitle>
            <DialogDescription className="max-h-[calc(90vh-120px)] overflow-y-auto">
              {eventoSelecionado && (
                <div className="space-y-4 mt-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{eventoSelecionado.nome}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                        <span><b>Data:</b> {eventoSelecionado.data}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-primary" />
                        <span><b>Local:</b> {eventoSelecionado.local}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TheaterIcon className="w-4 h-4 text-primary" />
                        <span><b>Tipo:</b> {eventoSelecionado.tipo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-primary" />
                        <span><b>Estado:</b> {eventoSelecionado.estado}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Descrição do Evento</h4>
                    <p className="text-sm text-muted-foreground">
                      {eventoSelecionado.tipo === "Festival" && 
                        "Um evento cultural de grande magnitude que celebra a diversidade cultural de Chipindo, com apresentações de música, dança e artes tradicionais."
                      }
                      {eventoSelecionado.tipo === "Exposição" && 
                        "Uma mostra de trabalhos artísticos que destaca o talento local e promove a expressão criativa dos artistas da região."
                      }
                      {eventoSelecionado.tipo === "Encontro" && 
                        "Um espaço de partilha e aprendizagem onde grupos culturais se reúnem para trocar experiências e técnicas tradicionais."
                      }
                      {eventoSelecionado.tipo === "Feira" && 
                        "Uma celebração da literatura e cultura, com apresentações de livros, debates e atividades culturais para todas as idades."
                      }
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Informações de Participação</h4>
                    <div className="space-y-2">
                      {eventoSelecionado.estado === "Inscrições Abertas" && (
                        <>
                          <p className="text-sm text-green-600 font-medium">✓ Inscrições abertas para participantes</p>
                          <p className="text-sm text-muted-foreground">Para se inscrever, contacte o Departamento de Cultura ou visite o Centro Cultural Municipal.</p>
                        </>
                      )}
                      {eventoSelecionado.estado === "Em Preparação" && (
                        <>
                          <p className="text-sm text-blue-600 font-medium">⏳ Evento em fase de preparação</p>
                          <p className="text-sm text-muted-foreground">As inscrições serão abertas em breve. Fique atento aos anúncios.</p>
                        </>
                      )}
                      {eventoSelecionado.estado === "Em Organização" && (
                        <>
                          <p className="text-sm text-yellow-600 font-medium">🔄 Evento em organização</p>
                          <p className="text-sm text-muted-foreground">Detalhes sobre inscrições serão divulgados em breve.</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Contacto para Informações</h4>
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <p className="text-sm"><b>Departamento de Cultura</b></p>
                      <p className="text-sm text-muted-foreground">Telefone: {contactInfo.telefone}</p>
                      <p className="text-sm text-muted-foreground">Email: {contactInfo.email}</p>
                      <p className="text-sm text-muted-foreground">Endereço: {contactInfo.endereco}</p>
                    </div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpenDetalhesEvento(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cultura; 