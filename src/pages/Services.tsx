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
  HeartIcon,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  FileText,
  MessageSquare,
  SendIcon,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
      description: "Serviços de planeamento urbano e ordenamento territorial",
      icon: MapIcon,
      color: "bg-teal-100 text-teal-800",
      services: [
        "Licenças de urbanização",
        "Plano diretor municipal",
        "Ordenamento territorial",
        "Gestão de espaços públicos",
        "Certificados urbanísticos"
      ]
    }
  ];

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

  const { contactInfo, loading: contactLoading } = useContactInfo();
  const { toast } = useToast();

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

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!contactForm.nome.trim()) {
      errors.nome = "Nome é obrigatório";
    } else if (contactForm.nome.trim().length < 2) {
      errors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!contactForm.email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = "Email inválido";
    }

    if (!contactForm.telefone.trim()) {
      errors.telefone = "Telefone é obrigatório";
    } else if (contactForm.telefone.trim().length < 9) {
      errors.telefone = "Telefone deve ter pelo menos 9 dígitos";
    }

    if (!contactForm.assunto.trim()) {
      errors.assunto = "Assunto é obrigatório";
    } else if (contactForm.assunto.trim().length < 5) {
      errors.assunto = "Assunto deve ter pelo menos 5 caracteres";
    }

    if (!contactForm.mensagem.trim()) {
      errors.mensagem = "Mensagem é obrigatória";
    } else if (contactForm.mensagem.trim().length < 10) {
      errors.mensagem = "Mensagem deve ter pelo menos 10 caracteres";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert([
          {
            service_name: servicoSelecionado,
            requester_name: contactForm.nome,
            requester_email: contactForm.email,
            requester_phone: contactForm.telefone,
            subject: contactForm.assunto,
            message: contactForm.mensagem,
            status: 'pending'
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Solicitação Enviada!",
        description: "Sua solicitação foi enviada com sucesso. Entraremos em contacto em breve.",
      });

      handleCloseModal();
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleCloseModal = () => {
    setOpenSolicitar(false);
    setServicoSelecionado("");
    setContactForm({
      nome: "",
      email: "",
      telefone: "",
      assunto: "",
      mensagem: ""
    });
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Enhanced Hero Section */}
      <section className="relative min-h-[600px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-purple-400/15 rounded-full blur-xl animate-pulse delay-1500"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            {/* Header with Enhanced Icon */}
            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-br from-white/25 to-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl">
                  <BuildingIcon className="w-14 h-14 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-sm font-medium tracking-wide uppercase">Serviços Municipais</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  Serviços
                  <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Municipais
                  </span>
                </h1>
                <p className="text-blue-100 text-xl font-medium">
                  Administração Municipal de Chipindo
                </p>
              </div>
            </div>
            
            {/* Enhanced Description */}
            <div className="max-w-4xl mx-auto space-y-8">
              <p className="text-xl md:text-2xl text-white/95 leading-relaxed font-light">
                Explore todos os <span className="font-semibold text-white">serviços disponibilizados</span> pela Administração Municipal de Chipindo 
                para <span className="font-semibold text-white">melhor servir os nossos cidadãos</span> com processos transparentes e eficientes.
              </p>
              
              {/* Service Categories Preview */}
              <div className="flex flex-wrap justify-center gap-4">
                {serviceCategories.slice(0, 4).map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={index} className="group relative">
                      <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-semibold text-white">{category.title}</div>
                            <div className="text-blue-100 text-xs">{category.services.length} serviços</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Call to Action */}
              <div className="pt-8">
                <div className="flex items-center justify-center gap-6 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Processos Simplificados</span>
                  </div>
                  <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Atendimento Personalizado</span>
                  </div>
                  <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Transparência Total</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        {/* Enhanced Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FileTextIcon className="w-4 h-4" />
              Categorias de Serviços
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Serviços{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Disponíveis
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Conheça todas as categorias de serviços oferecidos pela administração municipal. 
              Processos simplificados para melhor servir os nossos cidadãos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-white/20">
                  <CardHeader className="pb-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <Badge className={`${category.color} border-0 shadow-sm`}>
                          {category.title}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {category.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-gray-800 text-sm">Serviços Incluídos:</h4>
                      <ul className="space-y-2">
                        {category.services.map((service, serviceIndex) => (
                          <li key={serviceIndex} className="text-sm text-gray-600 flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                            <span className="leading-relaxed">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl py-3 transition-all duration-300 hover:scale-105 shadow-lg"
                      onClick={() => {
                        setServicoSelecionado(category.title);
                        setOpenSolicitar(true);
                      }}
                    >
                      <span className="flex items-center gap-2">
                        Solicitar serviço
                        <ArrowRightIcon className="w-4 h-4" />
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Enhanced Sectores Estratégicos Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl mb-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <TrendingUpIcon className="w-4 h-4" />
                Sectores Estratégicos
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Sectores{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Estratégicos
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Conheça os sectores estratégicos que impulsionam o desenvolvimento de Chipindo
              </p>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto mt-4">
                Explore informações detalhadas sobre os sectores estratégicos do município de Chipindo. 
                Cada sector possui sua própria página com programas, oportunidades e infraestruturas específicas.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {setoresEstrategicos.map((setor, index) => {
                const IconComponent = setor.icon;
                return (
                  <Link key={index} to={setor.path} className="block">
                    <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer bg-white/90 backdrop-blur-sm border border-white/20 group-hover:bg-white/95">
                      <CardHeader className="pb-4 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <Badge className={`${setor.color} border-0 shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
                              {setor.title}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 drop-shadow-sm group-hover:drop-shadow-md">
                            {setor.title}
                          </CardTitle>
                          <p className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300 drop-shadow-sm group-hover:drop-shadow-md">
                            {setor.description}
                          </p>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="relative">
                        <div className="mb-6">
                          <p className="text-xs text-gray-600 font-semibold mb-2 uppercase tracking-wide group-hover:text-gray-700 transition-colors duration-300 drop-shadow-sm">Estatísticas Principais:</p>
                          <p className="text-sm text-gray-800 font-medium leading-relaxed group-hover:text-gray-900 transition-colors duration-300 drop-shadow-sm group-hover:drop-shadow-md">{setor.stats}</p>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl py-3 transition-all duration-300 hover:scale-105 shadow-lg group-hover:shadow-xl font-semibold">
                          <span className="flex items-center gap-2">
                            Ver Detalhes
                            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Contact Information */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <PhoneIcon className="w-4 h-4" />
                Informações de Contacto
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Entre em{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Contacto
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Estamos aqui para ajudar. Entre em contacto connosco através dos canais disponíveis.
              </p>
            </div>
            
            {contactLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-gray-600 font-medium">Carregando informações...</p>
              </div>
            ) : contactInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BuildingIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Endereço</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{contactInfo.address}</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <PhoneIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Telefone</h3>
                  <p className="text-sm text-gray-600">{contactInfo.phone}</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileTextIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-sm text-gray-600">{contactInfo.email}</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ClockIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Horários</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{contactInfo.hours.weekdays}</p>
                    <p>{contactInfo.hours.saturday}</p>
                    <p>{contactInfo.hours.sunday}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-gray-600 font-medium">Erro ao carregar informações de contacto.</p>
              </div>
            )}
          </div>
        </section>
      </main>

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
          
          <form onSubmit={handleContactSubmit} className="space-y-6">
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

            {/* Nome e Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome Completo *
                </Label>
                <Input
                  id="nome"
                  value={contactForm.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Seu nome completo"
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
                  placeholder="seu@email.com"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone" className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4" />
                  Telefone *
                </Label>
                <Input
                  id="telefone"
                  value={contactForm.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="Seu número de telefone"
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
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Services;