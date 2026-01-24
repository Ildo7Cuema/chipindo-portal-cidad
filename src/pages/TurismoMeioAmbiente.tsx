import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { SetorBreadcrumb } from "@/components/ui/setor-breadcrumb";
import { SetorNavigation } from "@/components/ui/setor-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPinIcon,
  BuildingIcon,
  UsersIcon,
  Trees,
  GlobeIcon,
  Leaf,
  TargetIcon,
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  TrendingUpIcon,
  CameraIcon,
  Mountain,
  Droplets,
  SunIcon,
  Cloud,
  HeartIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import React from "react";
import { CandidaturaForm } from "@/components/ui/candidatura-form";
import { InscricaoProgramaForm } from "@/components/ui/inscricao-programa-form";
import { useTurismoMeioAmbienteData } from "@/hooks/useTurismoMeioAmbienteData";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'MapPin': MapPinIcon,
    'Building': BuildingIcon,
    'Users': UsersIcon,
    'Trees': Trees,
    'Globe': GlobeIcon,
    'Leaf': Leaf,
    'Mountain': Mountain,
    'Water': Droplets,
    'Sun': SunIcon,
    'Cloud': Cloud,
    'Heart': HeartIcon
  };
  return iconMap[iconName] || MapPinIcon;
};

const TurismoMeioAmbiente = () => {
  const {
    turismoInfo,
    estatisticas,
    programas,
    oportunidades,
    infraestruturas,
    contactInfo,
    carouselImages,
    loading,
    error
  } = useTurismoMeioAmbienteData();

  const [openCandidatura, setOpenCandidatura] = React.useState(false);
  const [openDetalhes, setOpenDetalhes] = React.useState(false);
  const [detalheInfra, setDetalheInfra] = React.useState(null);
  const [oportunidadeSelecionada, setOportunidadeSelecionada] = React.useState<string>("");
  const [openInscricaoPrograma, setOpenInscricaoPrograma] = React.useState(false);
  const [programaSelecionado, setProgramaSelecionado] = React.useState<string>("");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">A carregar dados do turismo e meio ambiente...</p>
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

  if (!turismoInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Informações do sector não encontradas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <SetorBreadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Sectores Estratégicos", href: "/setores" },
            { label: turismoInfo.nome, href: "#" }
          ]}
        />

        {/* Hero Section com Carrossel */}
        <section className="mb-12">
          <div className="relative">
            <Carousel className="w-full h-[500px] rounded-lg overflow-hidden">
              <CarouselContent>
                {carouselImages.map((image, index) => (
                  <CarouselItem key={image.id}>
                    <div className="relative h-[500px] w-full">
                      <img
                        src={image.image_url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/800/500?random=${index}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                        <div className="p-8 text-white">
                          <Badge variant="secondary" className="mb-2">
                            {image.category === 'turismo' ? 'Turismo' : 'Meio Ambiente'}
                          </Badge>
                          <h2 className="text-3xl font-bold mb-2">{image.title}</h2>
                          <p className="text-lg mb-2">{image.description}</p>
                          {image.location && (
                            <p className="text-sm opacity-90">
                              <MapPinIcon className="inline w-4 h-4 mr-1" />
                              {image.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        </section>

        {/* Informações do Sector */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4" style={{ color: turismoInfo.cor_primaria }}>
              {turismoInfo.nome}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {turismoInfo.descricao}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TargetIcon className="w-5 h-5" style={{ color: turismoInfo.cor_primaria }} />
                  Visão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{turismoInfo.visao}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5" style={{ color: turismoInfo.cor_primaria }} />
                  Missão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{turismoInfo.missao}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Estatísticas */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Estatísticas do Sector</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {estatisticas.map((estatistica) => {
              const IconComponent = getIconComponent(estatistica.icone);
              return (
                <Card key={estatistica.id} className="text-center">
                  <CardContent className="pt-6">
                    <IconComponent className="w-8 h-8 mx-auto mb-2" style={{ color: turismoInfo.cor_primaria }} />
                    <p className="text-2xl font-bold" style={{ color: turismoInfo.cor_primaria }}>
                      {estatistica.valor}
                    </p>
                    <p className="text-sm text-muted-foreground">{estatistica.nome}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Tabs com Programas, Oportunidades e Infraestruturas */}
        <section className="mb-12">
          <Tabs defaultValue="programas" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="programas">Programas</TabsTrigger>
              <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
              <TabsTrigger value="infraestruturas">Infraestruturas</TabsTrigger>
            </TabsList>

            <TabsContent value="programas" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {programas.map((programa) => (
                  <Card key={programa.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white dark:bg-gray-800 overflow-hidden group">
                    <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600 w-full" />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 group-hover:text-cyan-600 transition-colors">
                        <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                          <Leaf className="w-5 h-5" />
                        </div>
                        {programa.titulo}
                      </CardTitle>
                      <p className="text-muted-foreground leading-relaxed">{programa.descricao}</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          Benefícios
                        </h4>
                        <ul className="grid gap-2">
                          {programa.beneficios.map((beneficio, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                              {beneficio}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <StarIcon className="w-4 h-4 text-cyan-500" />
                          Requisitos
                        </h4>
                        <ul className="grid gap-2">
                          {programa.requisitos.map((requisito, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 shrink-0" />
                              {requisito}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-gray-100 mt-auto">
                        <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                          <PhoneIcon className="w-4 h-4" />
                          <strong>Contacto:</strong> {programa.contacto}
                        </p>
                        <Button
                          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-200"
                          onClick={() => {
                            setProgramaSelecionado(programa.titulo);
                            setOpenInscricaoPrograma(true);
                          }}
                        >
                          Inscrever-se Agora
                          <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="oportunidades" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {oportunidades.map((oportunidade) => (
                  <Card key={oportunidade.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white dark:bg-gray-800 overflow-hidden group">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 w-full" />
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                          {oportunidade.vagas || 'Várias'} vagas
                        </Badge>
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                          {oportunidade.prazo || 'Aberto'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{oportunidade.titulo}</CardTitle>
                      <p className="text-muted-foreground leading-relaxed">{oportunidade.descricao}</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-blue-500" />
                          Requisitos
                        </h4>
                        <ul className="grid gap-2">
                          {oportunidade.requisitos.map((requisito, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                              {requisito}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <StarIcon className="w-4 h-4 text-green-500" />
                          Benefícios
                        </h4>
                        <ul className="grid gap-2">
                          {oportunidade.beneficios.map((beneficio, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                              {beneficio}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-200 mt-auto"
                        onClick={() => {
                          setOportunidadeSelecionada(oportunidade.titulo);
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

            <TabsContent value="infraestruturas" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {infraestruturas.map((infraestrutura) => (
                  <Card key={infraestrutura.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white dark:bg-gray-800 overflow-hidden group">
                    <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500 w-full" />
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-orange-50 text-orange-700">{infraestrutura.estado}</Badge>
                        </div>
                        <Badge variant="outline" className="border-orange-200 text-orange-700">
                          {infraestrutura.capacidade}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-orange-600 transition-colors">{infraestrutura.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <MapPinIcon className="inline w-4 h-4 mr-1 text-orange-500" />
                        {infraestrutura.localizacao}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <BuildingIcon className="w-4 h-4 text-orange-500" />
                          Equipamentos
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {infraestrutura.equipamentos.map((equipamento, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                              {equipamento}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 mt-auto"
                        onClick={() => {
                          setDetalheInfra(infraestrutura);
                          setOpenDetalhes(true);
                        }}
                      >
                        Ver Detalhes
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Contactos */}
        {contactInfo && (
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5" style={{ color: turismoInfo.cor_primaria }} />
                  Contactos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Informações de Contacto</h4>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        {contactInfo.endereco}
                      </p>
                      <p className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4" />
                        {contactInfo.telefone}
                      </p>
                      <p className="flex items-center gap-2">
                        <MailIcon className="w-4 h-4" />
                        {contactInfo.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        {contactInfo.horario}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Responsável</h4>
                    <p className="text-muted-foreground">{contactInfo.responsavel}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <Footer />

      {/* Modal de Candidatura */}
      <Dialog open={openCandidatura} onOpenChange={setOpenCandidatura}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Candidatura para {oportunidadeSelecionada}</DialogTitle>
            <DialogDescription>
              Preencha o formulário abaixo para se candidatar a esta oportunidade.
            </DialogDescription>
          </DialogHeader>
          <CandidaturaForm
            vaga={oportunidadeSelecionada}
            onSuccess={() => setOpenCandidatura(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Inscrição em Programa */}
      <Dialog open={openInscricaoPrograma} onOpenChange={setOpenInscricaoPrograma}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inscrição no Programa {programaSelecionado}</DialogTitle>
            <DialogDescription>
              Preencha o formulário abaixo para se inscrever neste programa.
            </DialogDescription>
          </DialogHeader>
          <InscricaoProgramaForm
            programa={programaSelecionado}
            onSuccess={() => setOpenInscricaoPrograma(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes da Infraestrutura */}
      <Dialog open={openDetalhes} onOpenChange={setOpenDetalhes}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{detalheInfra?.nome}</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre esta infraestrutura.
            </DialogDescription>
          </DialogHeader>
          {detalheInfra && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Localização</h4>
                <p className="text-muted-foreground">{detalheInfra.localizacao}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Capacidade</h4>
                <p className="text-muted-foreground">{detalheInfra.capacidade}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Estado</h4>
                <Badge variant="secondary">{detalheInfra.estado}</Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Equipamentos</h4>
                <div className="flex flex-wrap gap-2">
                  {detalheInfra.equipamentos.map((equipamento, index) => (
                    <Badge key={index} variant="outline">
                      {equipamento}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setOpenDetalhes(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TurismoMeioAmbiente; 