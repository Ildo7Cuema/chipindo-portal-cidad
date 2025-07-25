import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileTextIcon, 
  ScaleIcon, 
  AlertCircleIcon, 
  UserCheckIcon, 
  ShieldIcon,
  BanIcon,
  BookOpenIcon,
  CalendarIcon,
  MailIcon,
  CheckCircleIcon
} from "lucide-react";

const Termos = () => {
  const lastUpdated = "Janeiro de 2024";

  const sections = [
    {
      title: "Aceitação dos Termos",
      icon: UserCheckIcon,
      content: [
        "Ao acessar e usar este portal, você concorda com estes Termos de Uso",
        "Se não concordar com qualquer parte destes termos, não deve usar nossos serviços",
        "O uso continuado implica aceitação de atualizações destes termos",
        "Menores de idade devem ter supervisão responsável para uso do portal"
      ]
    },
    {
      title: "Uso Permitido",
      icon: CheckCircleIcon,
      content: [
        "Acessar informações públicas e serviços municipais disponibilizados",
        "Solicitar certidões, licenças e outros documentos oficiais",
        "Participar de consultas públicas e processos democráticos",
        "Reportar problemas urbanos através dos canais apropriados",
        "Baixar formulários e documentos públicos para uso pessoal"
      ]
    },
    {
      title: "Uso Proibido",
      icon: BanIcon,
      content: [
        "Usar o portal para atividades ilegais ou não autorizadas",
        "Interferir na segurança ou funcionalidade do portal",
        "Transmitir vírus, malware ou código malicioso",
        "Fazer uso excessivo que comprometa o desempenho do sistema",
        "Reproduzir ou distribuir conteúdo sem autorização",
        "Personificar outras pessoas ou fornecer informações falsas"
      ]
    },
    {
      title: "Responsabilidades do Usuário",
      icon: UserCheckIcon,
      content: [
        "Fornecer informações verdadeiras e atualizadas",
        "Manter a confidencialidade de suas credenciais de acesso",
        "Usar o portal de forma responsável e ética",
        "Notificar imediatamente sobre uso não autorizado de sua conta",
        "Cumprir todas as leis aplicáveis ao usar nossos serviços"
      ]
    },
    {
      title: "Propriedade Intelectual",
      icon: ShieldIcon,
      content: [
        "Todo conteúdo do portal é propriedade da Administração Municipal",
        "Uso permitido apenas para fins pessoais e não comerciais",
        "Proibida reprodução sem autorização expressa",
        "Marcas e logotipos são protegidos por direitos autorais",
        "Conteúdo público pode ser usado conforme legislação de transparência"
      ]
    },
    {
      title: "Limitação de Responsabilidade",
      icon: AlertCircleIcon,
      content: [
        "Portal fornecido 'como está' sem garantias expressas",
        "Não garantimos disponibilidade ininterrupta do serviço",
        "Não nos responsabilizamos por danos indiretos ou consequenciais",
        "Usuário assume riscos do uso da internet e tecnologias",
        "Manutenções programadas podem causar indisponibilidade temporária"
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
                  <ScaleIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Termos de Uso
                  </h1>
                  <p className="text-primary-foreground/90">
                    Portal da Administração Municipal de Chipindo
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-primary-foreground/95 max-w-3xl mx-auto">
                Estes termos estabelecem as regras e condições para o uso responsável dos serviços digitais municipais.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Vigente desde {lastUpdated}
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-4 py-2">
                  <ScaleIcon className="w-4 h-4 mr-2" />
                  Legalmente Vinculativo
                </Badge>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Introduction */}
        <Section variant="default" size="md">
          <SectionContent>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpenIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Acordo Legal</h2>
                    <div className="prose prose-slate max-w-none text-muted-foreground">
                      <p className="text-base leading-relaxed mb-4">
                        Estes Termos de Uso constituem um acordo legal entre você e a Administração Municipal de Chipindo. 
                        Eles regem seu acesso e uso do portal municipal, incluindo todos os serviços, funcionalidades e 
                        conteúdos disponibilizados.
                      </p>
                      <p className="text-base leading-relaxed mb-4">
                        O portal foi desenvolvido para facilitar o acesso dos cidadãos aos serviços públicos e promover 
                        a transparência administrativa. Seu uso adequado é essencial para manter a qualidade e segurança 
                        dos serviços oferecidos.
                      </p>
                      <p className="text-base leading-relaxed">
                        Reservamo-nos o direito de modificar estes termos a qualquer momento, sendo as alterações 
                        comunicadas através do próprio portal.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>

        {/* Terms Sections */}
        <Section variant="secondary" size="lg">
          <SectionHeader
            subtitle="Condições de Uso"
            title="Direitos e Responsabilidades"
            description="Regras claras para o uso responsável dos serviços municipais digitais"
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

        {/* Service Availability */}
        <Section variant="muted" size="md">
          <SectionContent>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-3">Disponibilidade do Serviço</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Portal disponível 24 horas por dia, 7 dias por semana</li>
                        <li>• Manutenções programadas comunicadas antecipadamente</li>
                        <li>• Tempo de resposta otimizado para melhor experiência</li>
                        <li>• Suporte técnico durante horário comercial</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-3">Consequências do Mau Uso</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Suspensão temporária ou permanente do acesso</li>
                        <li>• Responsabilização civil e criminal quando aplicável</li>
                        <li>• Bloqueio de IP em casos de ataques ou abusos</li>
                        <li>• Comunicação às autoridades competentes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SectionContent>
        </Section>

        {/* Contact Section */}
        <Section variant="default" size="md">
          <SectionContent>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                      <MailIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Dúvidas sobre os Termos?</h2>
                      <p className="text-muted-foreground">Estamos aqui para esclarecer</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Se você tiver dúvidas sobre estes Termos de Uso ou precisar de esclarecimentos sobre 
                    seus direitos e responsabilidades, entre em contacto connosco.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
                      <MailIcon className="w-5 h-5 mr-2" />
                      juridico@chipindo.gov.ao
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => window.location.href = '/contactos'}>
                      Contactar Suporte
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
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <FileTextIcon className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Legislação Aplicável
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                    Estes Termos de Uso são regidos pelas leis da República de Angola. Qualquer disputa será 
                    resolvida pelos tribunais competentes da comarca de Chipindo, Província de Huíla.
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

export default Termos; 