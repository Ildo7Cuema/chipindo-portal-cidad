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
  const { departamentos: direccoes, loading: deptLoading } = useDepartamentos();
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
          url: settings?.facebook_url || 'https://facebook.com/chipindo.gov', 
          color: 'bg-blue-600',
          active: true
        },
        { 
          name: 'Twitter', 
          icon: TwitterIcon, 
          url: settings?.twitter_url || 'https://twitter.com/chipindo_gov', 
          color: 'bg-sky-500',
          active: true
        },
        { 
          name: 'Instagram', 
          icon: InstagramIcon, 
          url: settings?.instagram_url || 'https://instagram.com/chipindo.gov', 
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
        <Section variant="primary" size="lg">
          <SectionContent>
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                  <MessageSquareIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Contactos
                  </h1>
                  <p className="text-primary-foreground/90 text-lg">
                    Administração Municipal de Chipindo
                  </p>
                </div>
              </div>
              
              <p className="text-xl text-primary-foreground/95 max-w-3xl mx-auto leading-relaxed">
                Estamos aqui para ajudar e esclarecer suas dúvidas. Entre em contacto connosco 
                através dos nossos canais de atendimento.
              </p>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  {settings?.opening_hours_weekdays ? 'Seg-Sex: ' + settings.opening_hours_weekdays.split(': ')[1] : 'Atendimento 08:00-16:00'}
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-4 py-2">
                  <MessageSquareIcon className="w-4 h-4 mr-2" />
                  {totalMessages}+ Mensagens Atendidas
                </Badge>
                <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30 px-4 py-2">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Resposta em {responseTime}
                </Badge>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Quick Contact Cards */}
        <Section variant="muted" size="md">
          <SectionContent>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PhoneIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Telefone Geral</h3>
                  <p className="text-2xl font-bold text-primary mb-2">
                    {settings?.contact_phone || '+244 XXX XXX XXX'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {settings?.opening_hours_weekdays || 'Atendimento de segunda a sexta'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MailIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Email Oficial</h3>
                  <p className="text-lg font-bold text-primary mb-2 break-all">
                    {settings?.contact_email || 'admin@chipindo.gov.ao'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Resposta em até {responseTime}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangleIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Emergências</h3>
                  <p className="text-2xl font-bold text-red-600 mb-2">
                    {emergencyContacts.length > 0 ? emergencyContacts[0].phone : '199'}
                  </p>
                  <p className="text-sm text-muted-foreground">
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

          <SectionContent>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <MessageSquareIcon className="w-6 h-6 text-primary" />
                      Formulário de Contacto
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Preencha todos os campos obrigatórios. Responderemos o mais breve possível.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nome">Nome Completo *</Label>
                          <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({...formData, nome: e.target.value})}
                            placeholder="Digite seu nome completo"
                            required
                            disabled={submitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="seuemail@exemplo.com"
                            required
                            disabled={submitting}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input
                            id="telefone"
                            value={formData.telefone}
                            onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                            placeholder="+244 900 000 000"
                            disabled={submitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="categoria">Categoria *</Label>
                          <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                            <SelectTrigger disabled={submitting}>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {contactCategories.map(category => {
                                const IconComponent = category.icon;
                                return (
                                  <SelectItem key={category.id} value={category.id}>
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

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="assunto">Assunto *</Label>
                          <Input
                            id="assunto"
                            value={formData.assunto}
                            onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                            placeholder="Assunto da sua mensagem"
                            required
                            disabled={submitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="departamento">Departamento (Opcional)</Label>
                          <Select value={formData.departamento} onValueChange={(value) => setFormData({...formData, departamento: value})}>
                            <SelectTrigger disabled={submitting}>
                              <SelectValue placeholder="Selecione o departamento" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nenhum">Nenhum departamento específico</SelectItem>
                              {direccoes.map(dept => (
                                <SelectItem key={dept.id} value={dept.nome}>
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

                      <div>
                        <Label htmlFor="mensagem">Mensagem *</Label>
                        <Textarea
                          id="mensagem"
                          value={formData.mensagem}
                          onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                          placeholder="Digite sua mensagem detalhada aqui. Inclua todas as informações relevantes para que possamos ajudá-lo da melhor forma."
                          rows={6}
                          required
                          disabled={submitting}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          type="submit" 
                          className="flex-1 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700"
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

                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <InfoIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                          <div className="text-sm text-muted-foreground">
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
              <div className="space-y-6">
                {/* General Information */}
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BuildingIcon className="w-6 h-6 text-primary" />
                      Informações Gerais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">Endereço</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {settings?.contact_address || 'Rua Principal, Bairro Central, Chipindo, Província de Huíla, Angola'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ClockIcon className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">Horário de Funcionamento</p>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{settings?.opening_hours_weekdays || 'Segunda a Sexta: 08:00 - 16:00'}</p>
                          <p>{settings?.opening_hours_saturday || 'Sábado: 08:00 - 12:00'}</p>
                          <p>{settings?.opening_hours_sunday || 'Domingo: Encerrado'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <GlobeIcon className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">Website Oficial</p>
                        <p className="text-sm text-muted-foreground">www.chipindo.gov.ao</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media */}
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users2Icon className="w-6 h-6 text-primary" />
                      Redes Sociais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {socialMediaLinks.length > 0 ? socialMediaLinks.map(social => {
                        const IconComponent = social.icon;
                        return (
                          <Button 
                            key={social.name}
                            variant="outline" 
                            className="w-full justify-start hover:bg-muted/50"
                            onClick={() => window.open(social.url, '_blank')}
                          >
                            <div className={cn("w-5 h-5 rounded mr-3 flex items-center justify-center", social.color)}>
                              <IconComponent className="w-3 h-3 text-white" />
                            </div>
                            {social.name}
                            <ExternalLinkIcon className="w-4 h-4 ml-auto" />
                          </Button>
                        );
                      }) : (
                        <div className="text-center py-4">
                          <Users2Icon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground text-sm">Redes sociais sendo configuradas.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contacts */}
                <Card className="border-0 shadow-xl border-red-200 dark:border-red-900">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <AlertTriangleIcon className="w-6 h-6" />
                      Contactos de Emergência
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {emergencyContacts.length > 0 ? emergencyContacts.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <PhoneIcon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{contact.name}</span>
                        </div>
                        <span className="text-red-600 font-bold">{contact.phone}</span>
                      </div>
                    )) : (
                      <div className="text-center py-4">
                        <AlertTriangleIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">Nenhum contacto de emergência cadastrado.</p>
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
          
          <SectionContent>
            {direccoes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {direccoes.map(direccao => {
                  const deptContact = getDepartmentContact(direccao.id);
                  return (
                    <Card key={direccao.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <BuildingIcon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {direccao.nome}
                            </CardTitle>
                            {direccao.codigo && (
                              <Badge variant="outline" className="mt-1">
                                {direccao.codigo}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {direccao.descricao && (
                          <div className="flex items-start gap-2">
                            <InfoIcon className="w-4 h-4 text-muted-foreground mt-1" />
                            <p className="text-sm text-muted-foreground leading-relaxed">{direccao.descricao}</p>
                          </div>
                        )}
                        
                        {deptContact?.responsavel && (
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-muted-foreground" />
                            <div className="text-sm">
                              <p className="font-medium">Responsável</p>
                              <p className="text-muted-foreground">{deptContact.responsavel}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-2">
                          <ClockIcon className="w-4 h-4 text-muted-foreground mt-1" />
                          <div className="text-sm text-muted-foreground">
                            <p className="font-medium">Horário de Atendimento</p>
                            <p>{deptContact?.horario_especial || settings?.opening_hours_weekdays || 'Segunda a Sexta: 08:00 - 16:00'}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {deptContact?.telefone ? (
                            <div className="flex items-center gap-2">
                              <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">{deptContact.telefone}</p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {settings?.contact_phone || 'Telefone geral'}
                              </p>
                            </div>
                          )}

                          {deptContact?.email && (
                            <div className="flex items-center gap-2">
                              <MailIcon className="w-4 h-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground break-all">{deptContact.email}</p>
                            </div>
                          )}
                        </div>

                        {deptContact?.observacoes && (
                          <div className="bg-muted/30 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">{deptContact.observacoes}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
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
                              className="px-3 group-hover:bg-green-500 group-hover:text-white transition-colors"
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
                              className="px-3 group-hover:bg-blue-500 group-hover:text-white transition-colors"
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
              <div className="text-center py-16">
                <BuildingIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Nenhuma direcção cadastrada</h3>
                <p className="text-muted-foreground">As informações dos departamentos estão sendo organizadas.</p>
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
          
          <SectionContent>
            <div className="space-y-6">
              {/* Interactive Map */}
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <SimpleMap height="600px" className="w-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Location Cards Grid */}
              {municipalLocations.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {municipalLocations.map(location => (
                    <Card 
                      key={location.id} 
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <MapPinIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm leading-tight">{location.name}</h4>
                              <Badge variant="outline" className="text-xs mt-1">
                                {location.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-xs text-muted-foreground">
                          {location.address && (
                            <p className="line-clamp-2">{location.address}</p>
                          )}
                          <div className="flex items-center gap-1 font-mono">
                            <NavigationIcon className="w-3 h-3" />
                            <span>{Number(location.latitude).toFixed(4)}, {Number(location.longitude).toFixed(4)}</span>
                          </div>
                          {location.phone && (
                            <div className="flex items-center gap-1">
                              <PhoneIcon className="w-3 h-3" />
                              <span>{location.phone}</span>
                            </div>
                          )}
                          {location.opening_hours && (
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              <span>{location.opening_hours}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1 text-xs">
                            <NavigationIcon className="w-3 h-3 mr-1" />
                            Localizar
                          </Button>
                          {location.phone && (
                            <Button size="sm" variant="outline" className="px-2">
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
              {municipalLocations.length === 0 && (
                <div className="text-center py-12">
                  <MapPinIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Nenhuma localização cadastrada</h3>
                  <p className="text-muted-foreground mb-6">
                    As coordenadas das localizações municipais estão sendo configuradas pelos administradores.
                  </p>
                  <div className="bg-muted/30 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground">
                      <strong>Para Administradores:</strong> Cadastre as localizações na tabela 
                      <code className="bg-muted px-2 py-1 rounded mx-1">municipality_locations</code> 
                      com latitude e longitude precisas.
                    </p>
                  </div>
                </div>
              )}

              {/* Coordinates Info */}
              {municipalLocations.length > 0 && (
                <Card className="border-0 shadow-lg bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <InfoIcon className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold">Informações de Coordenadas</h4>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <BuildingIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Contactar {selectedDirecao.nome}</CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Envie sua mensagem diretamente para esta direcção
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowContactModal(false);
                    setSelectedDirecao(null);
                  }}
                >
                  <XIcon className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Direction Info */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <InfoIcon className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">Informações da Direcção</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {selectedDirecao.descricao && (
                    <div>
                      <p className="text-muted-foreground mb-1">Descrição:</p>
                      <p className="font-medium">{selectedDirecao.descricao}</p>
                    </div>
                  )}
                  {selectedDirecao.codigo && (
                    <div>
                      <p className="text-muted-foreground mb-1">Código:</p>
                      <Badge variant="outline">{selectedDirecao.codigo}</Badge>
                    </div>
                  )}
                  {getDepartmentContact(selectedDirecao.id)?.responsavel && (
                    <div>
                      <p className="text-muted-foreground mb-1">Responsável:</p>
                      <p className="font-medium">{getDepartmentContact(selectedDirecao.id)?.responsavel}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground mb-1">Horário:</p>
                    <p className="font-medium">
                      {getDepartmentContact(selectedDirecao.id)?.horario_especial || 
                       settings?.opening_hours_weekdays || 
                       'Segunda a Sexta: 08:00 - 16:00'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Contact Options */}
              <div className="flex gap-3">
                {getDepartmentContact(selectedDirecao.id)?.telefone && (
                  <Button 
                    variant="outline"
                    className="flex-1 bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
                    onClick={() => window.open(`tel:${getDepartmentContact(selectedDirecao.id)?.telefone}`, '_self')}
                  >
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    Ligar Agora
                    <span className="ml-2 text-xs">
                      {getDepartmentContact(selectedDirecao.id)?.telefone}
                    </span>
                  </Button>
                )}
                
                {getDepartmentContact(selectedDirecao.id)?.email && (
                  <Button 
                    variant="outline"
                    className="flex-1 bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
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
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageSquareIcon className="w-5 h-5 text-primary" />
                  Enviar Mensagem via Formulário
                </h4>
                
                <form className="space-y-4" onSubmit={(e) => {
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
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quickNome">Seu Nome *</Label>
                      <Input
                        id="quickNome"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        placeholder="Digite seu nome completo"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="quickEmail">Email *</Label>
                      <Input
                        id="quickEmail"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="seuemail@exemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quickTelefone">Telefone</Label>
                    <Input
                      id="quickTelefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      placeholder="+244 900 000 000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quickAssunto">Assunto *</Label>
                    <Input
                      id="quickAssunto"
                      value={formData.assunto}
                      onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                      placeholder={`Assunto relacionado a ${selectedDirecao.nome}`}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="quickMensagem">Mensagem *</Label>
                    <Textarea
                      id="quickMensagem"
                      value={formData.mensagem}
                      onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                      placeholder={`Descreva sua questão ou solicitação para ${selectedDirecao.nome}...`}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowContactModal(false);
                        setSelectedDirecao(null);
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                    >
                      <SendIcon className="w-4 h-4 mr-2" />
                      Continuar no Formulário Principal
                    </Button>
                  </div>
                </form>
              </div>

              {/* Additional Info */}
              {getDepartmentContact(selectedDirecao.id)?.observacoes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangleIcon className="w-4 h-4 text-yellow-600" />
                    <p className="font-medium text-yellow-800">Informação Importante</p>
                  </div>
                  <p className="text-sm text-yellow-700">
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