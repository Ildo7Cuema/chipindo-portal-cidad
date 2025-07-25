import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapIcon, 
  HomeIcon, 
  NewspaperIcon, 
  BriefcaseIcon, 
  ArchiveIcon,
  PhoneIcon,
  SettingsIcon,
  BuildingIcon,
  UserIcon,
  FileTextIcon,
  ShieldIcon,
  AccessibilityIcon,
  ExternalLinkIcon,
  ArrowRightIcon,
  SearchIcon,
  FolderIcon
} from "lucide-react";

const Sitemap = () => {
  const siteStructure = [
    {
      title: "Páginas Principais",
      icon: HomeIcon,
      color: "bg-blue-600",
      pages: [
        { name: "Página Inicial", path: "/", description: "Portal principal com destaques e serviços" },
        { name: "Notícias", path: "/noticias", description: "Últimas notícias e comunicados oficiais" },
        { name: "Todas as Notícias", path: "/all-news", description: "Arquivo completo de notícias" },
        { name: "Concursos", path: "/concursos", description: "Concursos públicos e oportunidades" },
        { name: "Histórico de Concursos", path: "/concursos-history", description: "Arquivo de concursos anteriores" }
      ]
    },
    {
      title: "Informações Municipais",
      icon: BuildingIcon,
      color: "bg-green-600",
      pages: [
        { name: "Contactos", path: "/contactos", description: "Informações de contacto por direcção" },
        { name: "Organigrama", path: "/organigrama", description: "Estrutura organizacional municipal" },
        { name: "Acervo Digital", path: "/acervo", description: "Documentos e arquivo histórico digital" },
        { name: "Serviços", path: "/servicos", description: "Serviços municipais disponíveis" }
      ]
    },
    {
      title: "Área do Cidadão",
      icon: UserIcon,
      color: "bg-purple-600",
      pages: [
        { name: "Autenticação", path: "/auth", description: "Login e registo de usuários" },
        { name: "Manifestar Interesse", path: "/register-interest", description: "Registo de interesse em serviços" }
      ]
    },
    {
      title: "Administração",
      icon: SettingsIcon,
      color: "bg-orange-600",
      pages: [
        { name: "Painel Administrativo", path: "/admin", description: "Área restrita para administradores", restricted: true }
      ]
    },
    {
      title: "Informações Legais",
      icon: ShieldIcon,
      color: "bg-gray-600",
      pages: [
        { name: "Política de Privacidade", path: "/privacidade", description: "Como protegemos seus dados pessoais" },
        { name: "Termos de Uso", path: "/termos", description: "Condições para uso do portal" },
        { name: "Acessibilidade", path: "/acessibilidade", description: "Compromisso com a inclusão digital" },
        { name: "Mapa do Site", path: "/sitemap", description: "Estrutura completa do portal" }
      ]
    }
  ];

  const statisticsData = [
    { label: "Total de Páginas", value: "15+", description: "Páginas principais do portal" },
    { label: "Direcções", value: "8", description: "Direcções municipais representadas" },
    { label: "Serviços Digitais", value: "12+", description: "Serviços disponíveis online" },
    { label: "Idiomas", value: "1", description: "Português (Angola)" }
  ];

  const externalLinks = [
    { name: "Governo Provincial de Huíla", url: "https://huila.gov.ao", description: "Portal oficial da província" },
    { name: "Governo de Angola", url: "https://governo.gov.ao", description: "Portal do Governo Nacional" },
    { name: "Portal do Cidadão", url: "https://cidadao.gov.ao", description: "Serviços do Governo Central" }
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
                  <MapIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Mapa do Site
                  </h1>
                  <p className="text-primary-foreground/90">
                    Navegação Completa do Portal
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-primary-foreground/95 max-w-3xl mx-auto">
                Encontre facilmente todas as páginas e serviços disponíveis no Portal da Administração Municipal de Chipindo.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <FolderIcon className="w-4 h-4 mr-2" />
                  Estrutura Organizada
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-4 py-2">
                  <SearchIcon className="w-4 h-4 mr-2" />
                  Fácil Navegação
                </Badge>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Quick Stats */}
        <Section variant="default" size="md">
          <SectionContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statisticsData.map((stat, index) => (
                <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SectionContent>
        </Section>

        {/* Site Structure */}
        <Section variant="secondary" size="lg">
          <SectionHeader
            subtitle="Estrutura do Portal"
            title="Todas as Páginas Organizadas"
            description="Navegue por categorias para encontrar rapidamente o que procura"
            centered={true}
          />
          
          <SectionContent>
            <div className="space-y-8">
              {siteStructure.map((section, sectionIndex) => {
                const IconComponent = section.icon;
                return (
                  <Card key={sectionIndex} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 border-b border-border/50">
                      <CardTitle className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${section.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-foreground">{section.title}</span>
                        <Badge variant="outline" className="ml-auto">
                          {section.pages.length} página{section.pages.length !== 1 ? 's' : ''}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        {section.pages.map((page, pageIndex) => (
                          <div 
                            key={pageIndex} 
                            className="group p-4 rounded-lg border border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-300 cursor-pointer"
                            onClick={() => window.location.href = page.path}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {page.name}
                                  </h3>
                                  {page.restricted && (
                                    <Badge variant="secondary" className="text-xs">
                                      <ShieldIcon className="w-3 h-3 mr-1" />
                                      Restrito
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{page.description}</p>
                                <div className="flex items-center gap-2">
                                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                    {page.path}
                                  </code>
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <ArrowRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </SectionContent>
        </Section>

        {/* External Links */}
        <Section variant="muted" size="md">
          <SectionContent>
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                    <ExternalLinkIcon className="w-5 h-5 text-white" />
                  </div>
                  Links Externos Importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {externalLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 rounded-lg border border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-300 block"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                            {link.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">{link.description}</p>
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {link.url}
                          </code>
                        </div>
                        <ExternalLinkIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>

        {/* Search Tip */}
        <Section variant="default" size="md">
          <SectionContent>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <SearchIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Não Encontrou o que Procura?</h2>
                      <p className="text-muted-foreground">Experimente nosso sistema de busca</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Use a função de busca no topo da página para encontrar rapidamente informações específicas 
                    em todo o portal ou entre em contacto connosco para assistência personalizada.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8" onClick={() => document.querySelector('input[type="search"]')?.focus()}>
                      <SearchIcon className="w-5 h-5 mr-2" />
                      Usar Busca
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => window.location.href = '/contactos'}>
                      <PhoneIcon className="w-5 h-5 mr-2" />
                      Contactar Suporte
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>

        {/* Technical Info */}
        <Section variant="default" size="sm">
          <SectionContent>
            <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <FileTextIcon className="w-6 h-6 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    Informações Técnicas
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    Este portal utiliza tecnologias modernas para garantir uma experiência rápida, segura e acessível. 
                    Todas as páginas são otimizadas para motores de busca e dispositivos móveis.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100">React</Badge>
                    <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100">TypeScript</Badge>
                    <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100">Responsive Design</Badge>
                    <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100">SEO Optimized</Badge>
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

export default Sitemap; 