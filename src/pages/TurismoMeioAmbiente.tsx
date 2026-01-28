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
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">A carregar dados do turismo e meio ambiente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-red-600 mb-4 text-sm sm:text-base">Erro ao carregar dados: {error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="min-h-[44px] px-6 rounded-xl transition-all duration-200 active:scale-[0.98]"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!turismoInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-muted-foreground text-sm sm:text-base">Informações do sector não encontradas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <SetorBreadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Sectores Estratégicos", href: "/setores" },
            { label: turismoInfo.nome, href: "#" }
          ]}
        />

        {/* Hero Section com Carrossel - Responsivo */}
        <section className="mb-6 sm:mb-8 lg:mb-12">
          <div className="relative">
            <Carousel className="w-full h-[280px] sm:h-[380px] md:h-[450px] lg:h-[500px] rounded-xl overflow-hidden">
              <CarouselContent>
                {carouselImages.map((image, index) => (
                  <CarouselItem key={image.id}>
                    <div className="relative h-[280px] sm:h-[380px] md:h-[450px] lg:h-[500px] w-full">
                      <img
                        src={image.image_url}
                        alt={image.title}
                        className="w-full h-full object-cover transition-all duration-200"
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/800/500?random=${index}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                        <div className="p-4 sm:p-6 lg:p-8 text-white w-full">
                          <Badge variant="secondary" className="mb-2 text-xs sm:text-sm">
                            {image.category === 'turismo' ? 'Turismo' : 'Meio Ambiente'}
                          </Badge>
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 line-clamp-2">{image.title}</h2>
                          <p className="text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 line-clamp-2">{image.description}</p>
                          {image.location && (
                            <p className="text-xs sm:text-sm opacity-90 flex items-center gap-1">
                              <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                              <span className="truncate">{image.location}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 sm:left-4 h-10 w-10 sm:h-12 sm:w-12 transition-all duration-200 active:scale-[0.98]" />
              <CarouselNext className="right-2 sm:right-4 h-10 w-10 sm:h-12 sm:w-12 transition-all duration-200 active:scale-[0.98]" />
            </Carousel>
          </div>
        </section>

        {/* Informações do Sector - Responsivo */}
        <section className="mb-6 sm:mb-8 lg:mb-12">
          <div className="text-center mb-6 sm:mb-8 px-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4" style={{ color: turismoInfo.cor_primaria }}>
              {turismoInfo.nome}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {turismoInfo.descricao}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            <Card className="rounded-xl transition-all duration-200 hover:shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <TargetIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" style={{ color: turismoInfo.cor_primaria }} />
                  Visão
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{turismoInfo.visao}</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl transition-all duration-200 hover:shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" style={{ color: turismoInfo.cor_primaria }} />
                  Missão
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{turismoInfo.missao}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Estatísticas - Responsivo com Stats Compactos Mobile */}
        <section className="mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center">Estatísticas do Sector</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
            {estatisticas.map((estatistica) => {
              const IconComponent = getIconComponent(estatistica.icone);
              return (
                <Card key={estatistica.id} className="text-center rounded-xl transition-all duration-200 hover:shadow-lg active:scale-[0.98]">
                  <CardContent className="p-3 sm:p-4 lg:pt-6 lg:p-6">
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mx-auto mb-1.5 sm:mb-2" style={{ color: turismoInfo.cor_primaria }} />
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: turismoInfo.cor_primaria }}>
                      {estatistica.valor}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{estatistica.nome}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Tabs com Scroll Horizontal Mobile */}
        <section className="mb-6 sm:mb-8 lg:mb-12">
          <Tabs defaultValue="programas" className="w-full">
            <div className="overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
              <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-3 h-auto p-1 gap-1 rounded-xl">
                <TabsTrigger 
                  value="programas" 
                  className="min-h-[44px] px-4 sm:px-6 text-sm sm:text-base whitespace-nowrap rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  Programas
                </TabsTrigger>
                <TabsTrigger 
                  value="oportunidades"
                  className="min-h-[44px] px-4 sm:px-6 text-sm sm:text-base whitespace-nowrap rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  Oportunidades
                </TabsTrigger>
                <TabsTrigger 
                  value="infraestruturas"
                  className="min-h-[44px] px-4 sm:px-6 text-sm sm:text-base whitespace-nowrap rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  Infraestruturas
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="programas" className="mt-4 sm:mt-6 lg:mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {programas.map((programa) => (
                  <Card key={programa.id} className="hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 active:scale-[0.98] border-0 bg-white dark:bg-gray-800 overflow-hidden group rounded-xl">
                    <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600 w-full" />
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg group-hover:text-cyan-600 transition-colors">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-200 shrink-0">
                          <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <span className="line-clamp-2">{programa.titulo}</span>
                      </CardTitle>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{programa.descricao}</p>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 px-4 pb-4 sm:px-6 sm:pb-6">
                      <div className="space-y-2 sm:space-y-3">
                        <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <CheckCircleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 shrink-0" />
                          Benefícios
                        </h4>
                        <ul className="grid gap-1.5 sm:gap-2">
                          {programa.beneficios.map((beneficio, index) => (
                            <li key={index} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                              {beneficio}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <StarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500 shrink-0" />
                          Requisitos
                        </h4>
                        <ul className="grid gap-1.5 sm:gap-2">
                          {programa.requisitos.map((requisito, index) => (
                            <li key={index} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 shrink-0" />
                              {requisito}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 sm:pt-4 border-t border-gray-100 mt-auto">
                        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 flex items-center gap-2">
                          <PhoneIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          <strong>Contacto:</strong> <span className="truncate">{programa.contacto}</span>
                        </p>
                        <Button
                          className="w-full min-h-[44px] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-200 rounded-xl transition-all duration-200 active:scale-[0.98]"
                          onClick={() => {
                            setProgramaSelecionado(programa.titulo);
                            setOpenInscricaoPrograma(true);
                          }}
                        >
                          <span className="text-sm sm:text-base">Inscrever-se Agora</span>
                          <ArrowRightIcon className="w-4 h-4 ml-2 shrink-0" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="oportunidades" className="mt-4 sm:mt-6 lg:mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {oportunidades.map((oportunidade) => (
                  <Card key={oportunidade.id} className="hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 active:scale-[0.98] border-0 bg-white dark:bg-gray-800 overflow-hidden group rounded-xl">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 w-full" />
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-xs sm:text-sm">
                          {oportunidade.vagas || 'Várias'} vagas
                        </Badge>
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                          {oportunidade.prazo || 'Aberto'}
                        </Badge>
                      </div>
                      <CardTitle className="text-base sm:text-lg group-hover:text-blue-600 transition-colors line-clamp-2">{oportunidade.titulo}</CardTitle>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{oportunidade.descricao}</p>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 px-4 pb-4 sm:px-6 sm:pb-6">
                      <div className="space-y-2 sm:space-y-3">
                        <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <CheckCircleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
                          Requisitos
                        </h4>
                        <ul className="grid gap-1.5 sm:gap-2">
                          {oportunidade.requisitos.map((requisito, index) => (
                            <li key={index} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                              {requisito}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <StarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 shrink-0" />
                          Benefícios
                        </h4>
                        <ul className="grid gap-1.5 sm:gap-2">
                          {oportunidade.beneficios.map((beneficio, index) => (
                            <li key={index} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                              {beneficio}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        className="w-full min-h-[44px] bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-200 mt-auto rounded-xl transition-all duration-200 active:scale-[0.98]"
                        onClick={() => {
                          setOportunidadeSelecionada(oportunidade.titulo);
                          setOpenCandidatura(true);
                        }}
                      >
                        <span className="text-sm sm:text-base">Candidatar-se</span>
                        <ArrowRightIcon className="w-4 h-4 ml-2 shrink-0" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="infraestruturas" className="mt-4 sm:mt-6 lg:mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {infraestruturas.map((infraestrutura) => (
                  <Card key={infraestrutura.id} className="hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 active:scale-[0.98] border-0 bg-white dark:bg-gray-800 overflow-hidden group rounded-xl">
                    <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500 w-full" />
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
                        <Badge variant="secondary" className="bg-orange-50 text-orange-700 text-xs sm:text-sm">{infraestrutura.estado}</Badge>
                        <Badge variant="outline" className="border-orange-200 text-orange-700 text-xs sm:text-sm">
                          {infraestrutura.capacidade}
                        </Badge>
                      </div>
                      <CardTitle className="text-base sm:text-lg group-hover:text-orange-600 transition-colors line-clamp-2">{infraestrutura.nome}</CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex items-start gap-1.5">
                        <MapPinIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 shrink-0 mt-0.5" />
                        <span>{infraestrutura.localizacao}</span>
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 px-4 pb-4 sm:px-6 sm:pb-6">
                      <div className="space-y-2 sm:space-y-3">
                        <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                          <BuildingIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 shrink-0" />
                          Equipamentos
                        </h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {infraestrutura.equipamentos.map((equipamento, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                              {equipamento}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full min-h-[44px] border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 mt-auto rounded-xl transition-all duration-200 active:scale-[0.98]"
                        onClick={() => {
                          setDetalheInfra(infraestrutura);
                          setOpenDetalhes(true);
                        }}
                      >
                        <span className="text-sm sm:text-base">Ver Detalhes</span>
                        <ArrowRightIcon className="w-4 h-4 ml-2 shrink-0" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Contactos - Responsivo */}
        {contactInfo && (
          <section className="mb-6 sm:mb-8 lg:mb-12">
            <Card className="rounded-xl transition-all duration-200 hover:shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" style={{ color: turismoInfo.cor_primaria }} />
                  Contactos
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Informações de Contacto</h4>
                    <div className="space-y-2 sm:space-y-3">
                      <p className="flex items-start gap-2 text-sm sm:text-base min-h-[44px] sm:min-h-0 py-2 sm:py-0">
                        <MapPinIcon className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{contactInfo.endereco}</span>
                      </p>
                      <p className="flex items-center gap-2 text-sm sm:text-base min-h-[44px] sm:min-h-0 py-2 sm:py-0">
                        <PhoneIcon className="w-4 h-4 shrink-0" />
                        <a href={`tel:${contactInfo.telefone}`} className="hover:underline">{contactInfo.telefone}</a>
                      </p>
                      <p className="flex items-center gap-2 text-sm sm:text-base min-h-[44px] sm:min-h-0 py-2 sm:py-0">
                        <MailIcon className="w-4 h-4 shrink-0" />
                        <a href={`mailto:${contactInfo.email}`} className="hover:underline truncate">{contactInfo.email}</a>
                      </p>
                      <p className="flex items-start gap-2 text-sm sm:text-base min-h-[44px] sm:min-h-0 py-2 sm:py-0">
                        <CalendarIcon className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{contactInfo.horario}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Responsável</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">{contactInfo.responsavel}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <Footer />

      {/* Modal de Candidatura - Fullscreen Mobile */}
      <Dialog open={openCandidatura} onOpenChange={setOpenCandidatura}>
        <DialogContent className="w-full max-w-full sm:max-w-2xl h-full sm:h-auto max-h-full sm:max-h-[90vh] rounded-none sm:rounded-xl overflow-y-auto overscroll-contain">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b sm:border-b-0">
            <DialogTitle className="text-lg sm:text-xl pr-8">Candidatura para {oportunidadeSelecionada}</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Preencha o formulário abaixo para se candidatar a esta oportunidade.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <CandidaturaForm
              vaga={oportunidadeSelecionada}
              onSuccess={() => setOpenCandidatura(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Inscrição em Programa - Fullscreen Mobile */}
      <Dialog open={openInscricaoPrograma} onOpenChange={setOpenInscricaoPrograma}>
        <DialogContent className="w-full max-w-full sm:max-w-2xl h-full sm:h-auto max-h-full sm:max-h-[90vh] rounded-none sm:rounded-xl overflow-y-auto overscroll-contain">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b sm:border-b-0">
            <DialogTitle className="text-lg sm:text-xl pr-8">Inscrição no Programa {programaSelecionado}</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Preencha o formulário abaixo para se inscrever neste programa.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <InscricaoProgramaForm
              programa={programaSelecionado}
              onSuccess={() => setOpenInscricaoPrograma(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes da Infraestrutura - Fullscreen Mobile */}
      <Dialog open={openDetalhes} onOpenChange={setOpenDetalhes}>
        <DialogContent className="w-full max-w-full sm:max-w-2xl h-full sm:h-auto max-h-full sm:max-h-[90vh] rounded-none sm:rounded-xl overflow-y-auto overscroll-contain">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b sm:border-b-0">
            <DialogTitle className="text-lg sm:text-xl pr-8">{detalheInfra?.nome}</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Informações detalhadas sobre esta infraestrutura.
            </DialogDescription>
          </DialogHeader>
          {detalheInfra && (
            <div className="space-y-4 sm:space-y-5 py-4">
              <div>
                <h4 className="font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Localização</h4>
                <p className="text-sm sm:text-base text-muted-foreground">{detalheInfra.localizacao}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Capacidade</h4>
                <p className="text-sm sm:text-base text-muted-foreground">{detalheInfra.capacidade}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Estado</h4>
                <Badge variant="secondary" className="text-xs sm:text-sm">{detalheInfra.estado}</Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Equipamentos</h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {detalheInfra.equipamentos.map((equipamento, index) => (
                    <Badge key={index} variant="outline" className="text-xs sm:text-sm">
                      {equipamento}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t sm:border-t-0">
            <Button 
              onClick={() => setOpenDetalhes(false)}
              className="w-full sm:w-auto min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TurismoMeioAmbiente;
