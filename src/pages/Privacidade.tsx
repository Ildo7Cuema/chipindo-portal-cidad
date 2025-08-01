import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheckIcon, 
  LockIcon, 
  EyeIcon, 
  UserIcon, 
  DatabaseIcon,
  AlertTriangleIcon,
  MailIcon,
  CalendarIcon,
  FileTextIcon
} from "lucide-react";

const Privacidade = () => {
  const lastUpdated = "Janeiro de 2024";

  const sections = [
    {
      title: "Informações que Coletamos",
      icon: DatabaseIcon,
      content: [
        "Dados pessoais fornecidos voluntariamente (nome, email, telefone) ao usar nossos serviços",
        "Informações de navegação (endereço IP, tipo de navegador, páginas visitadas)",
        "Dados de interação com o portal (downloads, formulários preenchidos)",
        "Cookies e tecnologias similares para melhorar a experiência do usuário"
      ]
    },
    {
      title: "Como Usamos Suas Informações",
      icon: EyeIcon,
      content: [
        "Prestar serviços públicos solicitados pelos cidadãos",
        "Comunicar sobre procedimentos, atualizações e notificações importantes",
        "Melhorar nossos serviços e a experiência do usuário no portal",
        "Cumprir obrigações legais e regulamentares",
        "Processar solicitações de transparência e acesso à informação"
      ]
    },
    {
      title: "Compartilhamento de Dados",
      icon: UserIcon,
      content: [
        "Não vendemos, alugamos ou comercializamos dados pessoais",
        "Compartilhamos apenas quando exigido por lei ou autoridade competente",
        "Podemos compartilhar dados anonimizados para estatísticas públicas",
        "Terceiros prestadores de serviços podem ter acesso limitado conforme necessário"
      ]
    },
    {
      title: "Segurança dos Dados",
      icon: LockIcon,
      content: [
        "Implementamos medidas de segurança técnicas e organizacionais",
        "Criptografia de dados sensíveis em trânsito e armazenamento",
        "Acesso restrito aos dados apenas para pessoal autorizado",
        "Monitoramento contínuo de segurança e detecção de ameaças",
        "Backups regulares e planos de recuperação de desastres"
      ]
    },
    {
      title: "Seus Direitos",
      icon: ShieldCheckIcon,
      content: [
        "Acesso: Solicitar cópia dos dados pessoais que mantemos sobre você",
        "Retificação: Corrigir dados pessoais incorretos ou incompletos",
        "Exclusão: Solicitar a exclusão de dados quando permitido por lei",
        "Portabilidade: Receber seus dados em formato estruturado",
        "Oposição: Opor-se ao processamento em certas circunstâncias"
      ]
    },
    {
      title: "Retenção de Dados",
      icon: CalendarIcon,
      content: [
        "Mantemos dados apenas pelo tempo necessário para cumprir as finalidades",
        "Dados de serviços públicos: conforme prazos legais estabelecidos",
        "Dados de navegação: até 12 meses para análise e melhoria",
        "Cookies: conforme configurações do usuário e políticas específicas"
      ]
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
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Política de Privacidade
                  </h1>
                  <p className="text-primary-foreground/90">
                    Portal da Administração Municipal de Chipindo
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-primary-foreground/95 max-w-3xl mx-auto">
                Seu compromisso com a transparência e proteção dos dados pessoais dos cidadãos é fundamental para nós.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Actualizado em {lastUpdated}
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-4 py-2">
                  <ShieldCheckIcon className="w-4 h-4 mr-2" />
                  LGPD Compliant
                </Badge>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Introduction */}
        <Section variant="default" size="md">
          <SectionContent>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Introdução</h2>
                    <div className="prose prose-slate max-w-none text-muted-foreground">
                      <p className="text-base leading-relaxed mb-4">
                        A Administração Municipal de Chipindo respeita e protege a privacidade de todos os cidadãos que utilizam 
                        nosso portal. Esta Política de Privacidade explica como coletamos, usamos, protegemos e compartilhamos 
                        informações pessoais quando você interage com nossos serviços digitais.
                      </p>
                      <p className="text-base leading-relaxed">
                        Ao usar este portal, você concorda com as práticas descritas nesta política. Recomendamos que leia 
                        atentamente todas as seções para entender como seus dados são tratados.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>

        {/* Privacy Sections */}
        <Section variant="secondary" size="lg">
          <SectionHeader
            subtitle="Detalhes da Política"
            title="Como Protegemos Seus Dados"
            description="Informações detalhadas sobre coleta, uso e proteção de dados pessoais"
            centered={true}
          />
          
          <SectionContent>
            <div className="grid gap-8">
              {sections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 border-b border-border/50">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">{section.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3 text-muted-foreground">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm leading-relaxed">{item}</span>
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

        {/* Contact Section */}
        <Section variant="muted" size="md">
          <SectionContent>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                      <MailIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Dúvidas sobre Privacidade?</h2>
                      <p className="text-muted-foreground">Entre em contacto connosco</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Se você tiver dúvidas sobre esta Política de Privacidade, como exercer seus direitos ou 
                    relatar preocupações sobre o tratamento de dados pessoais, não hesite em nos contactar.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8">
                      <MailIcon className="w-5 h-5 mr-2" />
                      privacidade@chipindo.gov.ao
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => window.location.href = '/contactos'}>
                      Ver Todos os Contactos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>

        {/* Important Notice */}
        <Section variant="default" size="sm">
          <SectionContent>
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertTriangleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Atualizações da Política
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
                    Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em nossos 
                    serviços ou requisitos legais. Recomendamos que verifique esta página regularmente para se manter 
                    informado sobre como protegemos suas informações.
                  </p>
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

export default Privacidade; 