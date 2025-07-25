import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AccessibilityIcon, 
  EyeIcon, 
  EarIcon, 
  MousePointerIcon, 
  KeyboardIcon,
  TypeIcon,
  ContrastIcon,
  VolumeIcon,
  SmartphoneIcon,
  HelpCircleIcon,
  CheckCircleIcon,
  MailIcon,
  PhoneIcon
} from "lucide-react";

const Acessibilidade = () => {
  const wcagLevel = "AA";
  const lastAudit = "Dezembro de 2023";

  const features = [
    {
      title: "Navegação por Teclado",
      icon: KeyboardIcon,
      description: "Todas as funcionalidades são acessíveis usando apenas o teclado",
      details: [
        "Ordem lógica de tabulação em todos os elementos",
        "Atalhos de teclado para funções principais",
        "Indicadores visuais claros para foco do teclado",
        "Skip links para navegar rapidamente entre seções"
      ]
    },
    {
      title: "Compatibilidade com Leitores de Tela",
      icon: VolumeIcon,
      description: "Otimizado para softwares de leitura de tela",
      details: [
        "Estrutura semântica adequada com HTML5",
        "Textos alternativos descritivos para imagens",
        "Labels apropriados para formulários",
        "Landmarks e roles ARIA implementados"
      ]
    },
    {
      title: "Alto Contraste",
      icon: ContrastIcon,
      description: "Cores e contrastes que atendem aos padrões WCAG",
      details: [
        "Contraste mínimo de 4.5:1 para texto normal",
        "Contraste de 3:1 para texto grande",
        "Modo de alto contraste disponível",
        "Cores não são o único meio de transmitir informação"
      ]
    },
    {
      title: "Tipografia Acessível",
      icon: TypeIcon,
      description: "Fontes legíveis e tamanhos adequados",
      details: [
        "Fontes sans-serif para melhor legibilidade",
        "Tamanho mínimo de 14px para texto corrido",
        "Espaçamento adequado entre linhas e caracteres",
        "Zoom até 200% sem perda de funcionalidade"
      ]
    },
    {
      title: "Design Responsivo",
      icon: SmartphoneIcon,
      description: "Funcional em todos os dispositivos e tamanhos de tela",
      details: [
        "Layout adaptável para mobile, tablet e desktop",
        "Botões e links com área mínima de toque de 44px",
        "Conteúdo reorganizado adequadamente em telas pequenas",
        "Orientação tanto vertical quanto horizontal"
      ]
    },
    {
      title: "Formulários Acessíveis",
      icon: MousePointerIcon,
      description: "Formulários claros e fáceis de usar",
      details: [
        "Labels associados corretamente aos campos",
        "Instruções claras e mensagens de erro descritivas",
        "Campos obrigatórios claramente identificados",
        "Validação em tempo real com feedback acessível"
      ]
    }
  ];

  const assistiveTechnologies = [
    {
      name: "NVDA",
      description: "Leitor de tela gratuito para Windows",
      compatibility: "Total"
    },
    {
      name: "JAWS",
      description: "Leitor de tela comercial popular",
      compatibility: "Total"
    },
    {
      name: "VoiceOver",
      description: "Leitor de tela nativo do macOS/iOS",
      compatibility: "Total"
    },
    {
      name: "TalkBack",
      description: "Leitor de tela do Android",
      compatibility: "Total"
    },
    {
      name: "Dragon NaturallySpeaking",
      description: "Software de reconhecimento de voz",
      compatibility: "Parcial"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Section variant="primary" size="md">
          <SectionContent>
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                  <AccessibilityIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Acessibilidade
                  </h1>
                  <p className="text-primary-foreground/90">
                    Portal Inclusivo para Todos os Cidadãos
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-primary-foreground/95 max-w-3xl mx-auto">
                Comprometemo-nos a tornar nosso portal acessível a todas as pessoas, independentemente de suas habilidades ou tecnologias assistivas.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  WCAG {wcagLevel} Compliant
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-4 py-2">
                  <EyeIcon className="w-4 h-4 mr-2" />
                  Auditado em {lastAudit}
                </Badge>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Commitment Section */}
        <Section variant="default" size="md">
          <SectionContent>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AccessibilityIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Nosso Compromisso</h2>
                    <div className="prose prose-slate max-w-none text-muted-foreground">
                      <p className="text-base leading-relaxed mb-4">
                        A Administração Municipal de Chipindo está comprometida em garantir que nosso portal seja 
                        acessível ao maior número possível de pessoas, incluindo aquelas com deficiências visuais, 
                        auditivas, motoras ou cognitivas.
                      </p>
                      <p className="text-base leading-relaxed mb-4">
                        Seguimos as Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1 nível AA, que são 
                        reconhecidas internacionalmente como o padrão para acessibilidade digital.
                      </p>
                      <p className="text-base leading-relaxed">
                        Trabalhamos continuamente para melhorar a acessibilidade do nosso portal e agradecemos 
                        qualquer feedback que nos ajude a servir melhor todos os cidadãos.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>

        {/* Accessibility Features */}
        <Section variant="secondary" size="lg">
          <SectionHeader
            subtitle="Recursos Implementados"
            title="Funcionalidades de Acessibilidade"
            description="Tecnologias e práticas que tornam nosso portal acessível a todos"
            centered={true}
          />
          
          <SectionContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </SectionContent>
        </Section>

        {/* Assistive Technologies */}
        <Section variant="muted" size="md">
          <SectionContent>
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <VolumeIcon className="w-5 h-5 text-white" />
                    </div>
                    Tecnologias Assistivas Testadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assistiveTechnologies.map((tech, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{tech.name}</p>
                          <p className="text-sm text-muted-foreground">{tech.description}</p>
                        </div>
                        <Badge 
                          className={tech.compatibility === "Total" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }
                        >
                          {tech.compatibility}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <KeyboardIcon className="w-5 h-5 text-white" />
                    </div>
                    Atalhos de Teclado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Ir para o conteúdo principal</span>
                        <Badge variant="outline">Alt + 1</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Pula direto para o conteúdo principal da página</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Ir para a navegação</span>
                        <Badge variant="outline">Alt + 2</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Acessa o menu de navegação principal</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Ir para busca</span>
                        <Badge variant="outline">Alt + 3</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Foca no campo de busca do portal</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Ir para rodapé</span>
                        <Badge variant="outline">Alt + 4</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Navega para o rodapé da página</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SectionContent>
        </Section>

        {/* Report Issues */}
        <Section variant="default" size="md">
          <SectionContent>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                      <HelpCircleIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Encontrou Algum Problema?</h2>
                      <p className="text-muted-foreground">Ajude-nos a melhorar</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Se você encontrar alguma barreira de acessibilidade ou tiver sugestões de melhoria, 
                    por favor, relate-nos. Seu feedback é essencial para tornarmos nosso portal verdadeiramente acessível.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8">
                      <MailIcon className="w-5 h-5 mr-2" />
                      acessibilidade@chipindo.gov.ao
                    </Button>
                    <Button variant="outline" size="lg">
                      <PhoneIcon className="w-5 h-5 mr-2" />
                      +244 926 123 456
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>

        {/* Standards Compliance */}
        <Section variant="default" size="sm">
          <SectionContent>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <CheckCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Conformidade com Padrões
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed mb-3">
                    Este portal está em conformidade com as Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1 
                    nível AA, HTML5 semântico, e as melhores práticas de acessibilidade recomendadas pelo W3C.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">WCAG 2.1 AA</Badge>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">HTML5 Semântico</Badge>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">ARIA Guidelines</Badge>
                  </div>
                </div>
              </div>
            </div>
          </SectionContent>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Acessibilidade; 