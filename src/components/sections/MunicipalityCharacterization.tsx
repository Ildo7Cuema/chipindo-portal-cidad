import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Users, 
  Building2, 
  TreePine, 
  Mountain, 
  Droplets, 
  Sun, 
  Car, 
  School, 
  Heart, 
  Factory, 
  ShoppingBag,
  Calendar,
  Award,
  Globe,
  ArrowRight,
  Info,
  Target,
  TrendingUp,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMunicipalityCharacterization } from "@/hooks/useMunicipalityCharacterization";

interface MunicipalityCharacterizationProps {
  className?: string;
}

export const MunicipalityCharacterization = ({ className }: MunicipalityCharacterizationProps) => {
  const { characterization: characterizationData, loading, error } = useMunicipalityCharacterization();

  const features = [
    {
      icon: MapPin,
      title: "Localização Estratégica",
      description: "Situado na Província da Huíla, Chipindo é um município de importância regional",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Mountain,
      title: "Paisagem Montanhosa",
      description: "Terreno acidentado com vales férteis e montanhas imponentes",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: Droplets,
      title: "Recursos Hídricos",
      description: "Rede hidrográfica rica com rios perenes e nascentes",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20"
    },
    {
      icon: TreePine,
      title: "Biodiversidade",
      description: "Floresta de miombo com rica diversidade de fauna e flora",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
    }
  ];

  const highlights = [
    {
      icon: Target,
      title: "Desenvolvimento Sustentável",
      description: "Compromisso com o crescimento económico e preservação ambiental"
    },
    {
      icon: Users,
      title: "Comunidade Unida",
      description: "População hospitaleira e trabalhadora, orgulhosa das suas raízes"
    },
    {
      icon: TrendingUp,
      title: "Potencial de Crescimento",
      description: "Infraestrutura em expansão e oportunidades de investimento"
    },
    {
      icon: Shield,
      title: "Segurança e Paz",
      description: "Município pacífico com baixos índices de criminalidade"
    }
  ];

  // Loading state
  if (loading) {
    return (
      <section className={cn("py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20", className)}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando caracterização do município...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className={cn("py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20", className)}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 dark:text-red-400 font-medium">Erro ao carregar dados</p>
              <p className="text-muted-foreground text-sm mt-2">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Info className="w-4 h-4 mr-2" />
            Conheça Chipindo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Caracterização do{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Município
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra as características únicas que fazem de Chipindo um Município especial na Província da Huíla
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Geography & Demography */}
          <div className="space-y-6">
            {/* Geography Card */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Geografia</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-blue-600">Área Total</p>
                    <p className="text-muted-foreground">{characterizationData.geography.area}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-600">Altitude</p>
                    <p className="text-muted-foreground">{characterizationData.geography.altitude}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-600">Clima</p>
                    <p className="text-muted-foreground">{characterizationData.geography.climate}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-600">Temperatura</p>
                    <p className="text-muted-foreground">{characterizationData.geography.temperature}</p>
                  </div>
                </div>
                
                {/* Delimitações */}
                <div className="border-t pt-4">
                  <p className="font-semibold text-blue-600 mb-3">Delimitações</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-medium">Norte:</span>
                      <span className="text-muted-foreground">{characterizationData.geography.boundaries?.north}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Sul:</span>
                      <span className="text-muted-foreground">{characterizationData.geography.boundaries?.south}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">Este:</span>
                      <span className="text-muted-foreground">{characterizationData.geography.boundaries?.east}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Oeste:</span>
                      <span className="text-muted-foreground">{characterizationData.geography.boundaries?.west}</span>
                    </div>
                  </div>
                </div>
                
                {/* Coordenadas */}
                <div className="border-t pt-4">
                  <p className="font-semibold text-blue-600 mb-2">Coordenadas</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Latitude: {characterizationData.geography.coordinates?.latitude}</p>
                    <p>Longitude: {characterizationData.geography.coordinates?.longitude}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demography Card */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Demografia</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-green-600">População</p>
                    <p className="text-muted-foreground">{characterizationData.demography.population}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-green-600">Densidade</p>
                    <p className="text-muted-foreground">{characterizationData.demography.density}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-green-600">Crescimento</p>
                    <p className="text-muted-foreground">{characterizationData.demography.growth}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-green-600">Taxa Urbana</p>
                    <p className="text-muted-foreground">{characterizationData.demography.urbanRate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Infrastructure & Economy */}
          <div className="space-y-6">
            {/* Infrastructure Card */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Building2 className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">Infraestrutura</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-orange-600" />
                    <span className="font-semibold text-orange-600">Estradas:</span>
                    <span className="text-muted-foreground">{characterizationData.infrastructure.roads}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-orange-600" />
                    <span className="font-semibold text-orange-600">Escolas:</span>
                    <span className="text-muted-foreground">{characterizationData.infrastructure.schools}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-orange-600" />
                    <span className="font-semibold text-orange-600">Centros de Saúde:</span>
                    <span className="text-muted-foreground">{characterizationData.infrastructure.healthCenters}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-orange-600" />
                    <span className="font-semibold text-orange-600">Mercados:</span>
                    <span className="text-muted-foreground">{characterizationData.infrastructure.markets}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Economy Card */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Factory className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Economia</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-purple-600 mb-2">Principais Sectores:</p>
                  <div className="flex flex-wrap gap-2">
                    {characterizationData.economy.mainSectors.map((sector, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-purple-600">PIB:</p>
                    <p className="text-muted-foreground">{characterizationData.economy.gdp}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-600">Emprego:</p>
                    <p className="text-muted-foreground">{characterizationData.economy.employment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Natural Resources & Culture */}
          <div className="space-y-6">
            {/* Natural Resources Card */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <TreePine className="w-6 h-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">Recursos Naturais</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-emerald-600 mb-1">Principais Rios:</p>
                    <div className="space-y-1">
                      {characterizationData.naturalResources.rivers.map((river, index) => (
                        <p key={index} className="text-muted-foreground">• {river}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-600 mb-1">Floresta:</p>
                    <p className="text-muted-foreground">{characterizationData.naturalResources.forests}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-600 mb-1">Minerais:</p>
                    <div className="flex flex-wrap gap-1">
                      {characterizationData.naturalResources.minerals.map((mineral, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {mineral}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Culture Card */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Globe className="w-6 h-6 text-yellow-600" />
                  </div>
                  <CardTitle className="text-xl">Cultura & Tradições</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-yellow-600 mb-1">Grupos Étnicos:</p>
                    <div className="flex flex-wrap gap-1">
                      {characterizationData.culture.ethnicGroups.map((group, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {group}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-600 mb-1">Línguas:</p>
                    <div className="flex flex-wrap gap-1">
                      {characterizationData.culture.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-600">Tradições:</p>
                    <p className="text-muted-foreground">{characterizationData.culture.traditions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4", feature.bgColor)}>
                  <feature.icon className={cn("w-6 h-6", feature.color)} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Highlights Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Destaques do Município</h3>
            <p className="text-blue-100 text-lg">
              Características que tornam Chipindo único e especial
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <highlight.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-2">{highlight.title}</h4>
                <p className="text-blue-100 text-sm">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            onClick={() => window.location.href = '/eventos'}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Conheça Nossos Eventos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-muted-foreground mt-4">
            Descubra mais sobre Chipindo e participe das nossas actividades culturais
          </p>
        </div>
      </div>
    </section>
  );
}; 