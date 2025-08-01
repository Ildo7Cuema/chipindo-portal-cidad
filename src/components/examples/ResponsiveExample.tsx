import { 
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveSection,
  ResponsiveText
} from "@/components/layout/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HomeIcon,
  FileTextIcon,
  CalendarIcon,
  ImageIcon,
  UserIcon,
  PhoneIcon,
  WrenchIcon,
  BuildingIcon,
  ChevronRightIcon,
  StarIcon,
  CheckCircleIcon,
  TrendingUpIcon
} from "lucide-react";

export const ResponsiveExample = () => {
  const features = [
    {
      icon: HomeIcon,
      title: "Design Mobile-First",
      description: "Layout otimizado para dispositivos móveis com experiência nativa",
      benefits: ["Touch-friendly", "Performance otimizada", "Navegação intuitiva"]
    },
    {
      icon: FileTextIcon,
      title: "Tipografia Responsiva",
      description: "Textos que se adaptam automaticamente a todos os tamanhos de ecrã",
      benefits: ["Legibilidade perfeita", "Hierarquia visual clara", "Escalabilidade automática"]
    },
    {
      icon: CalendarIcon,
      title: "Grid System Inteligente",
      description: "Sistema de grid que se reorganiza automaticamente",
      benefits: ["Layout fluido", "Breakpoints otimizados", "Espaçamento consistente"]
    },
    {
      icon: ImageIcon,
      title: "Imagens Adaptativas",
      description: "Imagens que se ajustam sem distorção ao container",
      benefits: ["Carregamento otimizado", "Responsividade automática", "Performance melhorada"]
    },
    {
      icon: UserIcon,
      title: "Navegação Mobile",
      description: "Menu inferior estilo app com ícones acessíveis",
      benefits: ["Acesso rápido", "Zonas clicáveis grandes", "Feedback visual"]
    },
    {
      icon: PhoneIcon,
      title: "PWA Experience",
      description: "Comportamento semelhante a aplicativo nativo",
      benefits: ["Rolagem suave", "Transições fluidas", "Sem scroll horizontal"]
    }
  ];

  const stats = [
    { label: "Dispositivos Suportados", value: "100%", icon: TrendingUpIcon },
    { label: "Performance Mobile", value: "95%", icon: StarIcon },
    { label: "Acessibilidade", value: "A+", icon: CheckCircleIcon },
    { label: "Tempo de Carregamento", value: "<2s", icon: BuildingIcon }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ResponsiveSection background="gradient" spacing="lg">
        <ResponsiveContainer>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary-foreground/20 rounded-full">
                <WrenchIcon className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <ResponsiveText variant="h1" align="center" className="text-primary-foreground mb-6">
              Sistema Responsivo Mobile-First
            </ResponsiveText>
            <ResponsiveText variant="lead" align="center" className="text-primary-foreground/90 max-w-3xl mx-auto mb-8">
              Layout totalmente responsivo e adaptado a mobile-first, com experiência de aplicativo nativo
            </ResponsiveText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="button-responsive">
                Começar Agora
                <ChevronRightIcon className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="button-responsive">
                Ver Documentação
              </Button>
            </div>
          </div>
        </ResponsiveContainer>
      </ResponsiveSection>

      {/* Stats Section */}
      <ResponsiveSection spacing="md">
        <ResponsiveContainer>
          <ResponsiveGrid cols={{ sm: 2, md: 4 }} gap="md">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <ResponsiveCard key={index} interactive elevated className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <ResponsiveText variant="h3" className="text-primary mb-2">{stat.value}</ResponsiveText>
                  <ResponsiveText variant="small" className="text-muted-foreground">{stat.label}</ResponsiveText>
                </ResponsiveCard>
              );
            })}
          </ResponsiveGrid>
        </ResponsiveContainer>
      </ResponsiveSection>

      {/* Features Section */}
      <ResponsiveSection spacing="lg">
        <ResponsiveContainer>
          <ResponsiveText variant="h2" align="center" className="mb-12">
            Características Principais
          </ResponsiveText>
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <ResponsiveCard key={index} interactive elevated>
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                    <ResponsiveText variant="h4">{feature.title}</ResponsiveText>
                  </div>
                  <ResponsiveText variant="body" className="text-muted-foreground mb-4">
                    {feature.description}
                  </ResponsiveText>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <ResponsiveText variant="small" className="text-muted-foreground">
                          {benefit}
                        </ResponsiveText>
                      </div>
                    ))}
                  </div>
                </ResponsiveCard>
              );
            })}
          </ResponsiveGrid>
        </ResponsiveContainer>
      </ResponsiveSection>

      {/* Code Example Section */}
      <ResponsiveSection background="muted" spacing="lg">
        <ResponsiveContainer>
          <ResponsiveText variant="h2" align="center" className="mb-12">
            Como Usar
          </ResponsiveText>
          <ResponsiveGrid cols={{ sm: 1, md: 2 }} gap="lg">
            <ResponsiveCard elevated>
              <ResponsiveText variant="h4" className="mb-4">Componentes Responsivos</ResponsiveText>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`import { 
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveSection,
  ResponsiveText
} from "@/components/layout/ResponsiveLayout";

<ResponsiveContainer spacing="lg">
  <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }}>
    <ResponsiveCard interactive elevated>
      <ResponsiveText variant="h4">Título</ResponsiveText>
      <ResponsiveText variant="body">Conteúdo</ResponsiveText>
    </ResponsiveCard>
  </ResponsiveGrid>
</ResponsiveContainer>`}</pre>
              </div>
            </ResponsiveCard>

            <ResponsiveCard elevated>
              <ResponsiveText variant="h4" className="mb-4">Classes CSS Responsivas</ResponsiveText>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`// Grid responsivo
.grid-responsive-2
.grid-responsive-3
.grid-responsive-4

// Tipografia responsiva
.text-responsive-h1
.text-responsive-h2
.text-responsive-h3

// Cards responsivos
.card-responsive
.button-responsive

// Navegação mobile
.nav-mobile
.nav-mobile-item`}</pre>
              </div>
            </ResponsiveCard>
          </ResponsiveGrid>
        </ResponsiveContainer>
      </ResponsiveSection>

      {/* Benefits Section */}
      <ResponsiveSection spacing="lg">
        <ResponsiveContainer>
          <ResponsiveText variant="h2" align="center" className="mb-12">
            Benefícios do Sistema
          </ResponsiveText>
          <ResponsiveGrid cols={{ sm: 1, md: 2 }} gap="lg">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <ResponsiveText variant="h5" className="mb-2">Desenvolvimento Rápido</ResponsiveText>
                  <ResponsiveText variant="body" className="text-muted-foreground">
                    Componentes pré-configurados que se adaptam automaticamente a todos os dispositivos.
                  </ResponsiveText>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <StarIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <ResponsiveText variant="h5" className="mb-2">Experiência Consistente</ResponsiveText>
                  <ResponsiveText variant="body" className="text-muted-foreground">
                    Interface uniforme em todos os dispositivos, mantendo a identidade visual.
                  </ResponsiveText>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUpIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <ResponsiveText variant="h5" className="mb-2">Performance Otimizada</ResponsiveText>
                  <ResponsiveText variant="body" className="text-muted-foreground">
                    Carregamento rápido e eficiente, especialmente em dispositivos móveis.
                  </ResponsiveText>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BuildingIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <ResponsiveText variant="h5" className="mb-2">Manutenibilidade</ResponsiveText>
                  <ResponsiveText variant="body" className="text-muted-foreground">
                    Código limpo e organizado, fácil de manter e expandir.
                  </ResponsiveText>
                </div>
              </div>
            </div>
          </ResponsiveGrid>
        </ResponsiveContainer>
      </ResponsiveSection>

      {/* CTA Section */}
      <ResponsiveSection background="gradient" spacing="lg">
        <ResponsiveContainer>
          <div className="text-center">
            <ResponsiveText variant="h2" align="center" className="text-primary-foreground mb-6">
              Pronto para Começar?
            </ResponsiveText>
            <ResponsiveText variant="lead" align="center" className="text-primary-foreground/90 mb-8">
              Implemente o sistema responsivo em todas as suas páginas e ofereça uma experiência mobile excepcional.
            </ResponsiveText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="button-responsive bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Implementar Agora
                <ChevronRightIcon className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="button-responsive border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Ver Mais Exemplos
              </Button>
            </div>
          </div>
        </ResponsiveContainer>
      </ResponsiveSection>
    </div>
  );
}; 