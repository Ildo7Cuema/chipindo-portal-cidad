import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileTextIcon, 
  UsersIcon, 
  BuildingIcon, 
  HeartHandshakeIcon,
  GraduationCapIcon,
  TruckIcon,
  MapIcon,
  PhoneIcon,
  ClockIcon,
  ArrowRightIcon,
  ZapIcon,
  DropletsIcon,
  SproutIcon,
  PickaxeIcon,
  TrendingUpIcon,
  PaletteIcon,
  CpuIcon,
  HeartIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, Loader2, CheckCircle, AlertCircle, User, Mail, Phone, FileText, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useContactInfo } from "@/hooks/useContactInfo";
import { useToast } from "@/hooks/use-toast";

const Services = () => {
  const serviceCategories = [
    {
      title: "Documentação Civil",
      description: "Serviços relacionados com documentos pessoais e registos civis",
      icon: FileTextIcon,
      color: "bg-blue-100 text-blue-800",
      services: [
        "Registo de nascimento",
        "Bilhete de identidade",
        "Certidões de óbito",
        "Autorização de residência",
        "Certidão de nascimento"
      ]
    },
    {
      title: "Assistência Social",
      description: "Programas de apoio e assistência à comunidade",
      icon: HeartHandshakeIcon,
      color: "bg-green-100 text-green-800",
      services: [
        "Programa de assistência alimentar",
        "Apoio a idosos",
        "Subsídios familiares",
        "Programa habitacional",
        "Apoio a pessoas com deficiência"
      ]
    },
    {
      title: "Educação",
      description: "Serviços educacionais e programas de formação",
      icon: GraduationCapIcon,
      color: "bg-purple-100 text-purple-800",
      services: [
        "Matrícula escolar",
        "Programa de bolsas de estudo",
        "Formação profissional",
        "Alfabetização de adultos",
        "Apoio escolar"
      ]
    },
    {
      title: "Obras Públicas",
      description: "Serviços de infraestrutura e manutenção urbana",
      icon: TruckIcon,
      color: "bg-orange-100 text-orange-800",
      services: [
        "Licenças de construção",
        "Reparação de estradas",
        "Saneamento básico",
        "Fornecimento de água",
        "Recolha de lixo"
      ]
    },
    {
      title: "Desenvolvimento Comunitário",
      description: "Programas de desenvolvimento local e economia",
      icon: UsersIcon,
      color: "bg-indigo-100 text-indigo-800",
      services: [
        "Microcrédito",
        "Programa de empreendedorismo",
        "Cooperativas agrícolas",
        "Mercados locais",
        "Programa de capacitação"
      ]
    },
    {
      title: "Urbanismo e Ordenamento",
      description: "Serviços de planeamento urbano e territorial",
      icon: MapIcon,
      color: "bg-teal-100 text-teal-800",
      services: [
        "Licenças urbanas",
        "Plano diretor municipal",
        "Demarcação de terrenos",
        "Avaliação imobiliária",
        "Regulamentação urbana"
      ]
    }
  ];

  const { contactInfo, loading: contactLoading } = useContactInfo();
  const { toast } = useToast();

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Validar nome
    if (!contactForm.nome.trim()) {
      errors.nome = "Nome completo é obrigatório";
    } else if (contactForm.nome.trim().length < 3) {
      errors.nome = "Nome deve ter pelo menos 3 caracteres";
    }
    
    // Validar email
    if (!contactForm.email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = "Email inválido";
    }
    
    // Validar telefone (opcional, mas se preenchido deve ser válido)
    if (contactForm.telefone.trim() && !/^\+?[0-9\s\-\(\)]{8,}$/.test(contactForm.telefone)) {
      errors.telefone = "Telefone inválido";
    }
    
    // Validar assunto
    if (!contactForm.assunto.trim()) {
      errors.assunto = "Assunto é obrigatório";
    } else if (contactForm.assunto.trim().length < 5) {
      errors.assunto = "Assunto deve ter pelo menos 5 caracteres";
    }
    
    // Validar mensagem
    if (!contactForm.mensagem.trim()) {
      errors.mensagem = "Mensagem é obrigatória";
    } else if (contactForm.mensagem.trim().length < 10) {
      errors.mensagem = "Mensagem deve ter pelo menos 10 caracteres";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = async () => {
    // Validar formulário
    if (!validateForm()) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive"
      });
      return;
    }

    if (!servicoSelecionado) {
      toast({
        title: "Erro",
        description: "Nenhum serviço selecionado.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create service request in database
      const { data, error } = await supabase
        .from('service_requests')
        .insert([{
          service_name: servicoSelecionado,
          service_direction: "Serviços Municipais",
          requester_name: contactForm.nome.trim(),
          requester_email: contactForm.email.trim(),
          requester_phone: contactForm.telefone.trim() || null,
          subject: contactForm.assunto.trim(),
          message: contactForm.mensagem.trim(),
          priority: 'normal'
        }])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message);
      }

      // Sucesso
      toast({
        title: "✅ Solicitação Enviada com Sucesso!",
        description: "Sua solicitação foi registrada. Entraremos em contacto em breve.",
      });
      
      // Reset form
      setOpenSolicitar(false);
      setContactForm({
        nome: "",
        email: "",
        telefone: "",
        assunto: "",
        mensagem: ""
      });
      setFormErrors({});
      setServicoSelecionado("");
      
    } catch (error: any) {
      console.error('Error submitting service request:', error);
      
      let errorMessage = "Erro ao enviar solicitação. Tente novamente.";
      
      if (error.message?.includes('row-level security')) {
        errorMessage = "Erro de permissão. Verifique se as migrações foram aplicadas.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Erro de conexão. Verifique sua internet.";
      }
      
      toast({
        title: "❌ Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começa a digitar
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCloseModal = () => {
    setOpenSolicitar(false);
    setContactForm({
      nome: "",
      email: "",
      telefone: "",
      assunto: "",
      mensagem: ""
    });
    setFormErrors({});
    setServicoSelecionado("");
  };

  const setoresEstrategicos = [
    {
      title: "Educação",
      description: "Informações detalhadas sobre o sector educacional, programas, oportunidades e infraestruturas",
      icon: GraduationCapIcon,
      color: "bg-blue-100 text-blue-800",
      path: "/educacao",
      stats: "12 escolas, 156 professores, 2.847 estudantes"
    },
    {
      title: "Saúde",
      description: "Serviços de saúde, programas de prevenção, oportunidades profissionais e infraestruturas médicas",
      icon: HeartIcon,
      color: "bg-red-100 text-red-800",
      path: "/saude",
      stats: "8 unidades, 89 profissionais, 3.245 consultas/mês"
    },
    {
      title: "Agricultura",
      description: "Programas agrícolas, modernização, oportunidades de emprego e infraestruturas rurais",
      icon: SproutIcon,
      color: "bg-green-100 text-green-800",
      path: "/agricultura",
      stats: "1.245 agricultores, 8.750 ha cultivados"
    },
    {
      title: "Sector Mineiro",
      description: "Recursos minerais, programas de formação, oportunidades de emprego e infraestruturas mineiras",
      icon: PickaxeIcon,
      color: "bg-yellow-100 text-yellow-800",
      path: "/sector-mineiro",
      stats: "8 minas ativas, 450 empregos diretos"
    },
    {
      title: "Desenvolvimento Económico",
      description: "Programas de desenvolvimento económico, atração de investimentos e oportunidades de negócio",
      icon: TrendingUpIcon,
      color: "bg-emerald-100 text-emerald-800",
      path: "/desenvolvimento-economico",
      stats: "245 empresas, 1.850 empregos, 25M USD investimento"
    },
    {
      title: "Cultura",
      description: "Programas culturais, eventos, oportunidades artísticas e infraestruturas culturais",
      icon: PaletteIcon,
      color: "bg-purple-100 text-purple-800",
      path: "/cultura",
      stats: "25 grupos culturais, 48 eventos anuais"
    },
    {
      title: "Tecnologia",
      description: "Inovação tecnológica, programas digitais, oportunidades IT e infraestruturas tecnológicas",
      icon: CpuIcon,
      color: "bg-indigo-100 text-indigo-800",
      path: "/tecnologia",
      stats: "15 startups tech, 89 profissionais IT"
    },
    {
      title: "Energia e Água",
      description: "Serviços de energia e água, programas de eficiência, oportunidades e infraestruturas",
      icon: ZapIcon,
      color: "bg-cyan-100 text-cyan-800",
      path: "/energia-agua",
      stats: "78% cobertura elétrica, 65% cobertura de água"
    }
  ];

  const [openSolicitar, setOpenSolicitar] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<string>("");
  const [contactForm, setContactForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: ""
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Serviços Municipais
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Explore todos os serviços disponibilizados pela Administração Municipal de Chipindo 
            para melhor servir os nossos cidadãos
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {serviceCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="overflow-hidden hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <Badge className={category.color}>
                      {category.title}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">
                    {category.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {category.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {service}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="institutional" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setServicoSelecionado(category.title);
                      setOpenSolicitar(true);
                    }}
                  >
                    Solicitar serviço
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sectores Estratégicos Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Sectores Estratégicos
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore informações detalhadas sobre os sectores estratégicos do município de Chipindo. 
              Cada sector possui sua própria página com programas, oportunidades e infraestruturas específicas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {setoresEstrategicos.map((setor, index) => {
              const IconComponent = setor.icon;
              return (
                <Link key={index} to={setor.path} className="block">
                  <Card className="h-full overflow-hidden hover:shadow-elegant transition-all duration-300 group cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <Badge className={setor.color}>
                          {setor.title}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {setor.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {setor.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground font-medium mb-2">Estatísticas Principais:</p>
                        <p className="text-sm text-foreground font-medium">{setor.stats}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Ver Detalhes
                        <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Contact Information */}
        <div className="bg-muted/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Informações de Contacto
          </h2>
          
          {contactLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Carregando informações...</p>
            </div>
          ) : contactInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BuildingIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Endereço</h3>
                <p className="text-sm text-muted-foreground">{contactInfo.address}</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <PhoneIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Telefone</h3>
                <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileTextIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ClockIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Horários</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{contactInfo.hours.weekdays}</p>
                  <p>{contactInfo.hours.saturday}</p>
                  <p>{contactInfo.hours.sunday}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Erro ao carregar informações de contacto.</p>
            </div>
          )}
        </div>
        {/* Contact Form Modal */}
        <Dialog open={openSolicitar} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">Solicitar Serviço</DialogTitle>
                  <DialogDescription className="text-base">
                    {servicoSelecionado && (
                      <span className="font-medium text-primary">
                        Serviço: {servicoSelecionado}
                      </span>
                    )}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Informações do Serviço */}
              {servicoSelecionado && (
                <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Informações do Serviço
                  </h3>
                  <p className="text-sm text-blue-800">
                    <strong>Serviço:</strong> {servicoSelecionado}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Departamento:</strong> Serviços Municipais
                  </p>
                </div>
              )}

              {/* Formulário */}
              <form onSubmit={(e) => { e.preventDefault(); handleContactSubmit(); }} className="space-y-6">
                {/* Nome e Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nome Completo *
                    </Label>
                    <Input
                      id="nome"
                      value={contactForm.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      placeholder="Digite seu nome completo"
                      className={formErrors.nome ? "border-red-500 focus:border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {formErrors.nome && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.nome}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className={formErrors.email ? "border-red-500 focus:border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Telefone e Assunto */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefone
                    </Label>
                    <Input
                      id="telefone"
                      value={contactForm.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      placeholder="+244 900 000 000"
                      className={formErrors.telefone ? "border-red-500 focus:border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {formErrors.telefone && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.telefone}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="assunto" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Assunto *
                    </Label>
                    <Input
                      id="assunto"
                      value={contactForm.assunto}
                      onChange={(e) => handleInputChange('assunto', e.target.value)}
                      placeholder="Assunto da solicitação"
                      className={formErrors.assunto ? "border-red-500 focus:border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {formErrors.assunto && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.assunto}
                      </p>
                    )}
                  </div>
                </div>

                {/* Mensagem */}
                <div className="space-y-2">
                  <Label htmlFor="mensagem" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Mensagem *
                  </Label>
                  <Textarea
                    id="mensagem"
                    value={contactForm.mensagem}
                    onChange={(e) => handleInputChange('mensagem', e.target.value)}
                    placeholder="Descreva sua solicitação ou dúvida em detalhes..."
                    rows={4}
                    className={formErrors.mensagem ? "border-red-500 focus:border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  {formErrors.mensagem && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.mensagem}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Mínimo 10 caracteres. Descreva detalhadamente sua solicitação.
                  </p>
                </div>

                {/* Informações Adicionais */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Informações Importantes
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Sua solicitação será analisada pela equipe municipal</li>
                    <li>• Entraremos em contacto através do email fornecido</li>
                    <li>• O prazo de resposta depende da complexidade da solicitação</li>
                    <li>• Mantenha seus dados atualizados para facilitar o contacto</li>
                  </ul>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleCloseModal}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <SendIcon className="w-4 h-4 mr-2" />
                        Enviar Solicitação
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;