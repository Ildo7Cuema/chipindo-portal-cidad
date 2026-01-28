import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  BuildingIcon,
  UserIcon,
  MessageSquareIcon,
  SendIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  StarIcon,
  TrendingUpIcon,
  FlameIcon,
  EyeIcon,
  Users2Icon,
  CalendarIcon,
  HeadphonesIcon,
  ShieldIcon,
  HelpCircleIcon,
  NavigationIcon,
  GlobeIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  ExternalLinkIcon,
  XIcon
} from "lucide-react";
import { SimpleMap } from "@/components/SimpleMap";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import { useDepartamentos } from "@/hooks/useDepartamentos";
import { useMunicipalityLocations } from "@/hooks/useMunicipalityLocations";
import { supabase } from "@/integrations/supabase/client";

interface ContactMessage {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  assunto: string;
  mensagem: string;
  categoria: string;
  departamento?: string;
  status: 'pendente' | 'em_andamento' | 'resolvido';
  created_at: string;
  updated_at: string;
}

interface SocialMediaLink {
  name: string;
  icon: any;
  url: string;
  color: string;
  active: boolean;
}

interface DepartmentContact {
  departamento_id: string;
  telefone?: string;
  email?: string;
  responsavel?: string;
  horario_especial?: string;
  observacoes?: string;
}

const contactCategories = [
  { id: 'geral', name: 'Informações Gerais', icon: InfoIcon, color: 'bg-blue-500' },
  { id: 'servicos', name: 'Serviços Municipais', icon: BuildingIcon, color: 'bg-green-500' },
  { id: 'reclamacao', name: 'Reclamações', icon: AlertTriangleIcon, color: 'bg-red-500' },
  { id: 'sugestao', name: 'Sugestões', icon: HelpCircleIcon, color: 'bg-purple-500' },
  { id: 'emergencia', name: 'Situação de Emergência', icon: ShieldIcon, color: 'bg-orange-500' },
  { id: 'suporte', name: 'Suporte Técnico', icon: HeadphonesIcon, color: 'bg-cyan-500' }
];

export default function Contactos() {
  const { settings, loading: settingsLoading } = useSiteSettings();
  const { contacts: emergencyContacts, loading: emergencyLoading } = useEmergencyContacts();
  const { direcoes: direccoes, loading: deptLoading } = useDepartamentos();
  const { locations: municipalLocations, loading: locationsLoading } = useMunicipalityLocations();
  const [submitting, setSubmitting] = useState(false);
  const [totalMessages, setTotalMessages] = useState(0);
  const [responseTime, setResponseTime] = useState("24h");
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>([]);
  const [departmentContacts, setDepartmentContacts] = useState<DepartmentContact[]>([]);
  const [selectedDirecao, setSelectedDirecao] = useState<any>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
    categoria: "geral",
    departamento: "nenhum"
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchContactStats();
    fetchSocialMediaLinks();
    fetchDepartmentContacts();
  }, []);

  const fetchContactStats = async () => {
    try {
      // Count total contact messages
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });

      if (error) {
        // If table doesn't exist, fallback to mock data
        if (error.code === '42P01') {
          console.log('Contact messages table not yet created, using mock data');
          setTotalMessages(142);
          return;
        }
        throw error;
      }

      setTotalMessages(count || 0);

      // Calculate average response time (mock calculation for now)
      // In real implementation, this would calculate based on created_at and resolved_at timestamps
      setResponseTime("24h");

    } catch (error) {
      console.error('Error fetching contact stats:', error);
      setTotalMessages(142); // Fallback
    }
  };

  const fetchSocialMediaLinks = async () => {
    try {
      // Fetch social media links from site_settings or a dedicated table
      // For now, using mock data as these would be admin-configurable
      const mockSocialMedia: SocialMediaLink[] = [
        {
          name: 'Facebook',
          icon: FacebookIcon,
          url: settings?.social_facebook || 'https://facebook.com/chipindo.gov',
          color: 'bg-blue-600',
          active: true
        },
        {
          name: 'Twitter',
          icon: TwitterIcon,
          url: settings?.social_twitter || 'https://twitter.com/chipindo_gov',
          color: 'bg-sky-500',
          active: true
        },
        {
          name: 'Instagram',
          icon: InstagramIcon,
          url: settings?.social_instagram || 'https://instagram.com/chipindo.gov',
          color: 'bg-pink-500',
          active: true
        }
      ];

      setSocialMediaLinks(mockSocialMedia.filter(link => link.active));
    } catch (error) {
      console.error('Error fetching social media links:', error);
    }
  };

  const fetchDepartmentContacts = async () => {
    try {
      // Fetch department-specific contact information
      // This would come from a departamento_contactos table
      const { data, error } = await supabase
        .from('departamento_contactos')
        .select('*');

      if (error) {
        // If table doesn't exist, use default data
        if (error.code === '42P01') {
          console.log('Department contacts table not yet created');
          return;
        }
        throw error;
      }

      setDepartmentContacts(data || []);
    } catch (error) {
      console.error('Error fetching department contacts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare data for submission, converting "nenhum" to null for database
      const submissionData = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone || null,
        assunto: formData.assunto,
        mensagem: formData.mensagem,
        categoria: formData.categoria,
        departamento: formData.departamento === "nenhum" ? null : formData.departamento,
        status: 'pendente' as const
      };

      // Save to contact_messages table
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([submissionData])
        .select()
        .single();

      if (error) {
        // If table doesn't exist, show helpful error message
        if (error.code === '42P01') {
          toast({
            title: "Configuração Pendente",
            description: "A tabela de mensagens ainda não foi criada. Contacte o administrador para configurar o sistema.",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Mensagem Enviada com Sucesso!",
        description: "Recebemos sua mensagem e entraremos em contacto em breve. Obrigado!",
      });

      setFormData({
        nome: "",
        email: "",
        telefone: "",
        assunto: "",
        mensagem: "",
        categoria: "geral",
        departamento: "nenhum"
      });

      // Update stats
      setTotalMessages(prev => prev + 1);

      // Create admin notification
      await supabase
        .from('admin_notifications')
        .insert([{
          type: 'contact_message',
          title: 'Nova Mensagem de Contacto',
          message: `Nova mensagem de ${formData.nome} sobre: ${formData.assunto}`,
          data: { contact_message_id: data.id }
        }]);

    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Erro ao Enviar Mensagem",
        description: "Ocorreu um erro ao enviar sua mensagem. Tente novamente ou use os contactos diretos.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryData = (categoryId: string) => {
    return contactCategories.find(cat => cat.id === categoryId) || contactCategories[0];
  };

  const getDepartmentContact = (departmentId: string) => {
    return departmentContacts.find(contact => contact.departamento_id === departmentId);
  };

  const getResponseTimeByCategory = (categoria: string) => {
    switch (categoria) {
      case 'emergencia':
        return 'Resposta imediata';
      case 'geral':
      case 'suporte':
        return '24-48 horas';
      case 'servicos':
        return '2-3 dias úteis';
      case 'reclamacao':
        return '48-72 horas';
      case 'sugestao':
        return '3-5 dias úteis';
      default:
        return '24-48 horas';
    }
  };

  const loading = settingsLoading || emergencyLoading || deptLoading || locationsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Section variant="primary" size="lg">
            <SectionContent>
              <div className="text-center space-y-6">
                <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
                <Skeleton className="h-12 w-96 mx-auto" />
                <Skeleton className="h-6 w-64 mx-auto" />
                <div className="flex justify-center gap-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </SectionContent>
          </Section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <Section className="relative min-h-[380px] md:min-h-[450px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden" size="lg">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

          <SectionContent className="px-4 sm:px-6 py-10 md:py-16">
            <div className="text-center space-y-6 md:space-y-8 relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 md:mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl">
                  <PhoneIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-sm">
                    Contactos
                  </h1>
                  <p className="text-blue-100 text-base sm:text-lg md:text-xl font-medium">
                    Administração Municipal de Chipindo
                  </p>
                </div>
              </div>

              <p className="text-base sm:text-lg md:text-xl text-blue-50/90 max-w-3xl mx-auto leading-relaxed font-light px-2">
                Estamos aqui para ajudar e esclarecer suas dúvidas. Entre em contacto connosco
                através dos nossos canais de atendimento.
              </p>

              <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap pt-2 md:pt-4">
                <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 px-3 py-1.5 md:px-4 md:py-2 hover:bg-white/20 transition-all duration-200 text-xs md:text-sm">
                  <ClockIcon className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                  <span className="hidden sm:inline">Seg-Feira: 08:00-16:00 | Sexta-Feira: 08:00-15:00</span>
                  <span className="sm:hidden">Seg-Sex: 08:00-16:00</span>
                </Badge>
                <Badge className="bg-emerald-500/20 backdrop-blur-md text-emerald-100 border-emerald-400/30 px-3 py-1.5 md:px-4 md:py-2 hover:bg-emerald-500/30 transition-all duration-200 text-xs md:text-sm">
                  <MessageSquareIcon className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                  {totalMessages}+ <span className="hidden sm:inline">Mensagens</span> Atendidas
                </Badge>
                <Badge className="bg-amber-500/20 backdrop-blur-md text-amber-100 border-amber-400/30 px-3 py-1.5 md:px-4 md:py-2 hover:bg-amber-500/30 transition-all duration-200 text-xs md:text-sm">
                  <CheckCircleIcon className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                  Resposta em {responseTime}
                </Badge>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Quick Contact Cards */}
        <Section variant="muted" size="md">
          <SectionContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl hover:shadow-2xl transition-all duration-200 md:hover:-translate-y-2 active:scale-[0.98] md:active:scale-100 group rounded-xl md:rounded-lg">
                <CardContent className="p-6 md:p-8 text-center min-h-[180px] md:min-h-0 flex flex-col justify-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <PhoneIcon className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg text-foreground mb-2">Telefone Geral</h3>
                  <a 
                    href={`tel:${settings?.contact_phone || '+244XXXXXXXXX'}`}
                    className="text-xl md:text-2xl font-bold text-blue-600 mb-2 min-h-[44px] flex items-center justify-center active:scale-[0.98] transition-all duration-200"
                  >
                    {settings?.contact_phone || '+244 XXX XXX XXX'}
                  </a>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {settings?.opening_hours_weekdays || 'Atendimento de segunda a sexta'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl hover:shadow-2xl transition-all duration-200 md:hover:-translate-y-2 active:scale-[0.98] md:active:scale-100 group rounded-xl md:rounded-lg">
                <CardContent className="p-6 md:p-8 text-center min-h-[180px] md:min-h-0 flex flex-col justify-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-50 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MailIcon className="w-7 h-7 md:w-8 md:h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg text-foreground mb-2">Email Oficial</h3>
                  <a 
                    href={`mailto:${settings?.contact_email || 'admin@chipindo.gov.ao'}`}
                    className="text-base md:text-lg font-bold text-purple-600 mb-2 break-all min-h-[44px] flex items-center justify-center active:scale-[0.98] transition-all duration-200"
                  >
                    {settings?.contact_email || 'admin@chipindo.gov.ao'}
                  </a>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Resposta em até {responseTime}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl hover:shadow-2xl transition-all duration-200 md:hover:-translate-y-2 active:scale-[0.98] md:active:scale-100 group rounded-xl md:rounded-lg">
                <CardContent className="p-6 md:p-8 text-center min-h-[180px] md:min-h-0 flex flex-col justify-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-red-50 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <AlertTriangleIcon className="w-7 h-7 md:w-8 md:h-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg text-foreground mb-2">Emergências</h3>
                  <a 
                    href={`tel:${emergencyContacts.length > 0 ? emergencyContacts[0].phone : '199'}`}
                    className="text-xl md:text-2xl font-bold text-red-600 mb-2 min-h-[44px] flex items-center justify-center active:scale-[0.98] transition-all duration-200"
                  >
                    {emergencyContacts.length > 0 ? emergencyContacts[0].phone : '199'}
                  </a>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Disponível 24 horas
                  </p>
                </CardContent>
              </Card>
            </div>
          </SectionContent>
        </Section>

        {/* Contact Form and Info */}
        <Section variant="default" size="lg">
          <SectionHeader
            subtitle="Atendimento ao Cidadão"
            title={
              <span>
                Envie sua{' '}
                <span className="bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 bg-clip-text text-transparent">
                  Mensagem
                </span>
              </span>
            }
            description="Use o formulário abaixo para entrar em contacto directo connosco"
            centered={true}
          />

          <SectionContent className="px-4 sm:px-6">
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-xl rounded-xl md:rounded-lg">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                      <MessageSquareIcon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      Formulário de Contacto
                    </CardTitle>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Preencha todos os campos obrigatórios. Responderemos o mais breve possível.
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                    <form id="contact-form" onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="nome" className="text-sm md:text-base">Nome Completo *</Label>
                          <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            placeholder="Digite seu nome completo"
                            required
                            disabled={submitting}
                            className="h-12 md:h-10 text-base md:text-sm rounded-xl md:rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-sm md:text-base">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="seuemail@exemplo.com"
                            required
                            disabled={submitting}
                            className="h-12 md:h-10 text-base md:text-sm rounded-xl md:rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="telefone" className="text-sm md:text-base">Telefone</Label>
                          <Input
                            id="telefone"
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            placeholder="+244 900 000 000"
                            disabled={submitting}
                            className="h-12 md:h-10 text-base md:text-sm rounded-xl md:rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="categoria" className="text-sm md:text-base">Categoria *</Label>
                          <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                            <SelectTrigger disabled={submitting} className="h-12 md:h-10 text-base md:text-sm rounded-xl md:rounded-lg">
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {contactCategories?.map(category => {
                                const IconComponent = category.icon;
                                return (
                                  <SelectItem key={category.id} value={category.id} className="min-h-[44px] md:min-h-0">
                                    <div className="flex items-center gap-2">
                                      <IconComponent className="w-4 h-4" />
                                      {category.name}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="assunto" className="text-sm md:text-base">Assunto *</Label>
                          <Input
                            id="assunto"
                            value={formData.assunto}
                            onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                            placeholder="Assunto da sua mensagem"
                            required
                            disabled={submitting}
                            className="h-12 md:h-10 text-base md:text-sm rounded-xl md:rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="departamento" className="text-sm md:text-base">Departamento (Opcional)</Label>
                          <Select value={formData.departamento} onValueChange={(value) => setFormData({ ...formData, departamento: value })}>
                            <SelectTrigger disabled={submitting} className="h-12 md:h-10 text-base md:text-sm rounded-xl md:rounded-lg">
                              <SelectValue placeholder="Selecione o departamento" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nenhum" className="min-h-[44px] md:min-h-0">Nenhum departamento específico</SelectItem>
                              {direccoes?.map(dept => (
                                <SelectItem key={dept.id} value={dept.nome} className="min-h-[44px] md:min-h-0">
                                  <div className="flex items-center gap-2">
                                    <BuildingIcon className="w-4 h-4" />
                                    {dept.nome}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="mensagem" className="text-sm md:text-base">Mensagem *</Label>
                        <Textarea
                          id="mensagem"
                          value={formData.mensagem}
                          onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                          placeholder="Digite sua mensagem detalhada aqui. Inclua todas as informações relevantes para que possamos ajudá-lo da melhor forma."
                          rows={5}
                          required
                          disabled={submitting}
                          className="text-base md:text-sm rounded-xl md:rounded-lg min-h-[120px] md:min-h-[150px]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 h-12 md:h-10 min-h-[44px] text-base md:text-sm rounded-xl md:rounded-lg transition-all duration-200 active:scale-[0.98]"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <SendIcon className="w-4 h-4 mr-2" />
                              Enviar Mensagem
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="bg-muted/30 rounded-xl md:rounded-lg p-3 md:p-4">
                        <div className="flex items-start gap-2">
                          <InfoIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="text-xs md:text-sm text-muted-foreground">
                            <p className="font-medium mb-1">Tempo de Resposta por Categoria:</p>
                            <p className="text-primary font-medium">
                              {getCategoryData(formData.categoria).name}: {getResponseTimeByCategory(formData.categoria)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information Sidebar */}
              <div className="space-y-4 md:space-y-6">
                {/* General Information */}
                <Card className="border-0 shadow-xl rounded-xl md:rounded-lg">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <BuildingIcon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      Informações Gerais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 md:pt-0 space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm md:text-base">Endereço</p>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                          {settings?.contact_address || 'Rua Principal, Bairro Central, Chipindo, Província de Huíla, Angola'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ClockIcon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm md:text-base">Horário de Funcionamento</p>
                        <div className="text-xs md:text-sm text-muted-foreground space-y-0.5">
                          <p>Seg-Feira: 08:00 - 16:00</p>
                          <p>Sexta-Feira: 08:00 - 15:00</p>
                          <p>{settings?.opening_hours_saturday || 'Sábado: 08:00 - 12:00'}</p>
                          <p>{settings?.opening_hours_sunday || 'Domingo: Encerrado'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <GlobeIcon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm md:text-base">Website Oficial</p>
                        <p className="text-xs md:text-sm text-muted-foreground">www.chipindo.gov.ao</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media */}
                <Card className="border-0 shadow-xl rounded-xl md:rounded-lg">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <Users2Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      Redes Sociais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                    <div className="grid gap-2 md:gap-3">
                      {socialMediaLinks && socialMediaLinks.length > 0 ? socialMediaLinks.map(social => {
                        const IconComponent = social.icon;
                        return (
                          <Button
                            key={social.name}
                            variant="outline"
                            className="w-full justify-start hover:bg-muted/50 h-12 md:h-10 min-h-[44px] rounded-xl md:rounded-lg transition-all duration-200 active:scale-[0.98]"
                            onClick={() => window.open(social.url, '_blank')}
                          >
                            <div className={cn("w-6 h-6 md:w-5 md:h-5 rounded mr-3 flex items-center justify-center", social.color)}>
                              <IconComponent className="w-3.5 h-3.5 md:w-3 md:h-3 text-white" />
                            </div>
                            <span className="text-sm md:text-base">{social.name}</span>
                            <ExternalLinkIcon className="w-4 h-4 ml-auto" />
                          </Button>
                        );
                      }) : (
                        <div className="text-center py-4">
                          <Users2Icon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground text-xs md:text-sm">Redes sociais sendo configuradas.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contacts */}
                <Card className="border-0 shadow-xl border-red-200 dark:border-red-900 rounded-xl md:rounded-lg">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-red-600 flex items-center gap-2 text-lg md:text-xl">
                      <AlertTriangleIcon className="w-5 h-5 md:w-6 md:h-6" />
                      Contactos de Emergência
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 md:pt-0 space-y-2 md:space-y-3">
                    {emergencyContacts && emergencyContacts.length > 0 ? emergencyContacts.map((contact) => (
                      <a 
                        key={contact.id} 
                        href={`tel:${contact.phone}`}
                        className="flex items-center justify-between p-3 md:p-3 bg-red-50 dark:bg-red-950/30 rounded-xl md:rounded-lg min-h-[52px] transition-all duration-200 active:scale-[0.98] hover:bg-red-100 dark:hover:bg-red-950/50"
                      >
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <PhoneIcon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-sm md:text-base">{contact.name}</span>
                        </div>
                        <span className="text-red-600 font-bold text-sm md:text-base">{contact.phone}</span>
                      </a>
                    )) : (
                      <div className="text-center py-4">
                        <AlertTriangleIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground text-xs md:text-sm">Nenhum contacto de emergência cadastrado.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Departmental Contacts */}
        <Section variant="muted" size="md">
          <SectionHeader
            subtitle="Contactos Específicos"
            title="Contactos por Direcção"
            description="Entre em contacto directo com os departamentos municipais"
            centered={true}
          />

          <SectionContent className="px-4 sm:px-6">
            {direccoes && direccoes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {direccoes.map(direccao => {
                  const deptContact = getDepartmentContact(direccao.id);
                  return (
                    <Card key={direccao.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 md:hover:-translate-y-1 active:scale-[0.98] md:active:scale-100 group rounded-xl md:rounded-lg">
                      <CardHeader className="p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2.5 md:p-3 rounded-xl md:rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <BuildingIcon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors truncate">
                              {direccao.nome}
                            </CardTitle>
                            {direccao.codigo && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {direccao.codigo}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6 pt-0 md:pt-0 space-y-3 md:space-y-4">
                        {direccao.descricao && (
                          <div className="flex items-start gap-2">
                            <InfoIcon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-3">{direccao.descricao}</p>
                          </div>
                        )}

                        {deptContact?.responsavel && (
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div className="text-xs md:text-sm min-w-0">
                              <p className="font-medium">Responsável</p>
                              <p className="text-muted-foreground truncate">{deptContact.responsavel}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-2">
                          <ClockIcon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="text-xs md:text-sm text-muted-foreground">
                            <p className="font-medium">Horário de Atendimento</p>
                            <div className="flex flex-col">
                              {deptContact?.horario_especial ? (
                                <p>{deptContact.horario_especial}</p>
                              ) : (
                                <>
                                  <p>Seg-Feira: 08:00 - 16:00</p>
                                  <p>Sexta-Feira: 08:00 - 15:00</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 md:space-y-2">
                          {deptContact?.telefone ? (
                            <div className="flex items-center gap-2">
                              <PhoneIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <p className="text-xs md:text-sm text-muted-foreground">{deptContact.telefone}</p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <PhoneIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <p className="text-xs md:text-sm text-muted-foreground">
                                {settings?.contact_phone || 'Telefone geral'}
                              </p>
                            </div>
                          )}

                          {deptContact?.email && (
                            <div className="flex items-center gap-2">
                              <MailIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <p className="text-xs md:text-sm text-muted-foreground break-all">{deptContact.email}</p>
                            </div>
                          )}
                        </div>

                        {deptContact?.observacoes && (
                          <div className="bg-muted/30 rounded-xl md:rounded-lg p-2.5 md:p-3">
                            <p className="text-xs text-muted-foreground">{deptContact.observacoes}</p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 h-10 md:h-9 min-h-[44px] md:min-h-0 rounded-xl md:rounded-lg active:scale-[0.98]"
                            onClick={() => {
                              setSelectedDirecao(direccao);
                              setShowContactModal(true);
                            }}
                          >
                            <MessageSquareIcon className="w-4 h-4 mr-2" />
                            Contactar
                          </Button>

                          {deptContact?.telefone && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-3 group-hover:bg-green-500 group-hover:text-white transition-all duration-200 h-10 md:h-9 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 rounded-xl md:rounded-lg active:scale-[0.98]"
                              onClick={() => window.open(`tel:${deptContact.telefone}`, '_self')}
                              title={`Ligar para ${deptContact.telefone}`}
                            >
                              <PhoneIcon className="w-4 h-4" />
                            </Button>
                          )}

                          {deptContact?.email && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-3 group-hover:bg-blue-500 group-hover:text-white transition-all duration-200 h-10 md:h-9 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 rounded-xl md:rounded-lg active:scale-[0.98]"
                              onClick={() => window.open(`mailto:${deptContact.email}?subject=Contacto - ${direccao.nome}`, '_self')}
                              title={`Enviar email para ${deptContact.email}`}
                            >
                              <MailIcon className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 md:py-16 px-4">
                <BuildingIcon className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Nenhuma direcção cadastrada</h3>
                <p className="text-sm md:text-base text-muted-foreground">As informações dos departamentos estão sendo organizadas.</p>
              </div>
            )}
          </SectionContent>
        </Section>

        {/* Map Section */}
        <Section variant="default" size="md">
          <SectionHeader
            subtitle="Localização"
            title="Encontre-nos no Mapa"
            description="Veja nossa localização e como chegar até nós através de coordenadas precisas"
            centered={true}
          />

          <SectionContent className="px-4 sm:px-6">
            <div className="space-y-4 md:space-y-6">
              {/* Interactive Map */}
              <Card className="border-0 shadow-xl overflow-hidden rounded-xl md:rounded-lg">
                <CardContent className="p-0">
                  <div className="relative">
                    <SimpleMap height="350px" className="w-full md:h-[500px] lg:h-[600px]" />
                  </div>
                </CardContent>
              </Card>

              {/* Location Cards Grid */}
              {municipalLocations && municipalLocations.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {municipalLocations.map(location => (
                    <Card
                      key={location.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 md:hover:-translate-y-1 active:scale-[0.98] md:active:scale-100 rounded-xl md:rounded-lg"
                    >
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-start justify-between mb-2 md:mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <MapPinIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm leading-tight truncate">{location.name}</h4>
                              <Badge variant="outline" className="text-xs mt-1">
                                {location.type}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 md:space-y-2 text-xs text-muted-foreground">
                          {location.address && (
                            <p className="line-clamp-2">{location.address}</p>
                          )}
                          <div className="flex items-center gap-1 font-mono text-[10px] md:text-xs">
                            <NavigationIcon className="w-3 h-3 flex-shrink-0" />
                            <span>{Number(location.latitude).toFixed(4)}, {Number(location.longitude).toFixed(4)}</span>
                          </div>
                          {location.phone && (
                            <div className="flex items-center gap-1">
                              <PhoneIcon className="w-3 h-3 flex-shrink-0" />
                              <span>{location.phone}</span>
                            </div>
                          )}
                          {location.opening_hours && (
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3 flex-shrink-0" />
                              <span>{location.opening_hours}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1 text-xs h-9 min-h-[44px] md:min-h-0 rounded-xl md:rounded-lg transition-all duration-200 active:scale-[0.98]">
                            <NavigationIcon className="w-3 h-3 mr-1" />
                            Localizar
                          </Button>
                          {location.phone && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="px-2 h-9 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 rounded-xl md:rounded-lg transition-all duration-200 active:scale-[0.98]"
                              onClick={() => window.open(`tel:${location.phone}`, '_self')}
                            >
                              <PhoneIcon className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* No Locations Found */}
              {(!municipalLocations || municipalLocations.length === 0) && (
                <div className="text-center py-10 md:py-12 px-4">
                  <MapPinIcon className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Nenhuma localização cadastrada</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                    As coordenadas das localizações municipais estão sendo configuradas pelos administradores.
                  </p>
                  <div className="bg-muted/30 rounded-xl md:rounded-lg p-3 md:p-4 max-w-md mx-auto">
                    <p className="text-xs md:text-sm text-muted-foreground">
                      <strong>Para Administradores:</strong> Cadastre as localizações na tabela
                      <code className="bg-muted px-1.5 md:px-2 py-0.5 md:py-1 rounded mx-1 text-[10px] md:text-xs">municipality_locations</code>
                      com latitude e longitude precisas.
                    </p>
                  </div>
                </div>
              )}

              {/* Coordinates Info */}
              {municipalLocations && municipalLocations.length > 0 && (
                <Card className="border-0 shadow-lg bg-muted/30 rounded-xl md:rounded-lg">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <InfoIcon className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                      <h4 className="font-semibold text-sm md:text-base">Informações de Coordenadas</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
                      <div>
                        <p className="text-muted-foreground">Região:</p>
                        <p className="font-medium">Província de Huíla</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Município:</p>
                        <p className="font-medium">Chipindo</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sistema:</p>
                        <p className="font-medium">WGS84 (GPS)</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Precisão:</p>
                        <p className="font-medium">±5 metros</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </SectionContent>
        </Section>
      </main>

      {/* Contact Direction Modal */}
      {showContactModal && selectedDirecao && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center md:p-4">
          <Card className="w-full md:max-w-2xl md:w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden rounded-t-2xl md:rounded-xl flex flex-col">
            <CardHeader className="p-4 md:p-6 border-b flex-shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  <div className="p-2.5 md:p-3 rounded-xl md:rounded-lg bg-primary/10 flex-shrink-0">
                    <BuildingIcon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg md:text-2xl truncate">Contactar {selectedDirecao.nome}</CardTitle>
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1 line-clamp-1">
                      Envie sua mensagem diretamente para esta direcção
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 min-h-[44px] min-w-[44px] rounded-xl md:rounded-lg flex-shrink-0"
                  onClick={() => {
                    setShowContactModal(false);
                    setSelectedDirecao(null);
                  }}
                >
                  <XIcon className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto flex-1">
              {/* Direction Info */}
              <div className="bg-muted/30 rounded-xl md:rounded-lg p-3 md:p-4">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <InfoIcon className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                  <h4 className="font-semibold text-sm md:text-base">Informações da Direcção</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                  {selectedDirecao.descricao && (
                    <div>
                      <p className="text-muted-foreground mb-0.5 md:mb-1">Descrição:</p>
                      <p className="font-medium">{selectedDirecao.descricao}</p>
                    </div>
                  )}
                  {selectedDirecao.codigo && (
                    <div>
                      <p className="text-muted-foreground mb-0.5 md:mb-1">Código:</p>
                      <Badge variant="outline" className="text-xs">{selectedDirecao.codigo}</Badge>
                    </div>
                  )}
                  {getDepartmentContact(selectedDirecao.id)?.responsavel && (
                    <div>
                      <p className="text-muted-foreground mb-0.5 md:mb-1">Responsável:</p>
                      <p className="font-medium">{getDepartmentContact(selectedDirecao.id)?.responsavel}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground mb-0.5 md:mb-1">Horário:</p>
                    <div className="font-medium">
                      <div className="flex flex-col">
                        {getDepartmentContact(selectedDirecao.id)?.horario_especial ? (
                          <p>{getDepartmentContact(selectedDirecao.id)?.horario_especial}</p>
                        ) : (
                          <>
                            <p>Seg-Feira: 08:00 - 16:00</p>
                            <p>Sexta-Feira: 08:00 - 15:00</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact Options */}
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                {getDepartmentContact(selectedDirecao.id)?.telefone && (
                  <Button
                    variant="outline"
                    className="flex-1 bg-green-50 border-green-200 hover:bg-green-100 text-green-700 h-12 md:h-10 min-h-[44px] rounded-xl md:rounded-lg transition-all duration-200 active:scale-[0.98]"
                    onClick={() => window.open(`tel:${getDepartmentContact(selectedDirecao.id)?.telefone}`, '_self')}
                  >
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    Ligar Agora
                    <span className="ml-2 text-xs hidden sm:inline">
                      {getDepartmentContact(selectedDirecao.id)?.telefone}
                    </span>
                  </Button>
                )}

                {getDepartmentContact(selectedDirecao.id)?.email && (
                  <Button
                    variant="outline"
                    className="flex-1 bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700 h-12 md:h-10 min-h-[44px] rounded-xl md:rounded-lg transition-all duration-200 active:scale-[0.98]"
                    onClick={() => window.open(
                      `mailto:${getDepartmentContact(selectedDirecao.id)?.email}?subject=Contacto - ${selectedDirecao.nome}`,
                      '_self'
                    )}
                  >
                    <MailIcon className="w-4 h-4 mr-2" />
                    Enviar Email
                  </Button>
                )}
              </div>

              {/* Contact Form */}
              <div className="border rounded-xl md:rounded-lg p-3 md:p-4">
                <h4 className="font-semibold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                  <MessageSquareIcon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  Enviar Mensagem via Formulário
                </h4>

                <form className="space-y-3 md:space-y-4" onSubmit={(e) => {
                  e.preventDefault();

                  // Set form data for the direction
                  setFormData({
                    ...formData,
                    departamento: selectedDirecao.nome,
                    categoria: 'servicos'
                  });

                  // Close modal and scroll to form
                  setShowContactModal(false);
                  setSelectedDirecao(null);

                  // Scroll to contact form
                  setTimeout(() => {
                    const formElement = document.getElementById('contact-form');
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }, 100);
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="quickNome" className="text-xs md:text-sm">Seu Nome *</Label>
                      <Input
                        id="quickNome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Digite seu nome completo"
                        required
                        className="h-12 md:h-10 text-base md:text-sm rounded-xl md:rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="quickEmail" className="text-xs md:text-sm">Email *</Label>
                      <Input
                        id="quickEmail"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seuemail@exemplo.com"
                        required
                        className="h-12 md:h-10 text-base md:text-sm rounded-xl md:rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="quickTelefone" className="text-xs md:text-sm">Telefone</Label>
                    <Input
                      id="quickTelefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      placeholder="+244 900 000 000"
                      className="h-12 md:h-10 text-base md:text-sm rounded-xl md:rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="quickAssunto" className="text-xs md:text-sm">Assunto *</Label>
                    <Input
                      id="quickAssunto"
                      value={formData.assunto}
                      onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                      placeholder={`Assunto relacionado a ${selectedDirecao.nome}`}
                      required
                      className="h-12 md:h-10 text-base md:text-sm rounded-xl md:rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="quickMensagem" className="text-xs md:text-sm">Mensagem *</Label>
                    <Textarea
                      id="quickMensagem"
                      value={formData.mensagem}
                      onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                      placeholder={`Descreva sua questão ou solicitação para ${selectedDirecao.nome}...`}
                      rows={3}
                      required
                      className="text-base md:text-sm rounded-xl md:rounded-lg min-h-[100px]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-3 md:pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowContactModal(false);
                        setSelectedDirecao(null);
                      }}
                      className="flex-1 h-12 md:h-10 min-h-[44px] rounded-xl md:rounded-lg order-2 sm:order-1 transition-all duration-200 active:scale-[0.98]"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary h-12 md:h-10 min-h-[44px] rounded-xl md:rounded-lg order-1 sm:order-2 transition-all duration-200 active:scale-[0.98]"
                    >
                      <SendIcon className="w-4 h-4 mr-2" />
                      Continuar no Formulário Principal
                    </Button>
                  </div>
                </form>
              </div>

              {/* Additional Info */}
              {getDepartmentContact(selectedDirecao.id)?.observacoes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl md:rounded-lg p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                    <AlertTriangleIcon className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                    <p className="font-medium text-yellow-800 text-sm md:text-base">Informação Importante</p>
                  </div>
                  <p className="text-xs md:text-sm text-yellow-700">
                    {getDepartmentContact(selectedDirecao.id)?.observacoes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}