import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSiteSettings, SiteSettings } from "@/hooks/useSiteSettings";
import { 
  LoaderIcon, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Globe, 
  Home, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Users, 
  Building2, 
  Settings, 
  Palette, 
  ImageIcon, 
  FileText, 
  Share2, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  BarChart3, 
  Calendar,
  Zap,
  Star,
  Heart,
  Shield,
  Target,
  Award,
  BookOpen,
  MessageSquare,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  Users as UsersIcon,
  Building2 as Building2Icon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  ImageIcon as ImageIconIcon,
  FileText as FileTextIcon,
  Share2 as Share2Icon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Youtube as YoutubeIcon,
  Linkedin as LinkedinIcon,
  ExternalLink as ExternalLinkIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  BarChart3 as BarChart3Icon,
  Calendar as CalendarIcon,
  Zap as ZapIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  Shield as ShieldIcon,
  Target as TargetIcon,
  Award as AwardIcon,
  BookOpen as BookOpenIcon,
  MessageSquare as MessageSquareIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export const SiteContentManager = () => {
  const { settings, loading, updateSettings } = useSiteSettings();
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  useEffect(() => {
    // Check if there are unsaved changes
    if (settings) {
      const hasUnsavedChanges = Object.keys(formData).some(key => 
        formData[key as keyof SiteSettings] !== settings[key as keyof SiteSettings]
      );
      setHasChanges(hasUnsavedChanges);
    }
  }, [formData, settings]);

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      await updateSettings(formData);
      toast.success("Configurações do site atualizadas com sucesso!", {
        description: "As alterações foram aplicadas ao portal.",
        action: {
          label: "Ver Portal",
          onClick: () => window.open("/", "_blank")
        }
      });
      setHasChanges(false);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações do site", {
        description: "Tente novamente ou contacte o administrador."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (settings) {
      setFormData(settings);
      toast.info("Alterações revertidas para os valores salvos", {
        description: "Todas as modificações foram descartadas."
      });
      setHasChanges(false);
    }
  };

  const getFieldStatus = (field: keyof SiteSettings) => {
    if (!settings) return 'default';
    return formData[field] === settings[field] ? 'default' : 'modified';
  };

  const getStatusIcon = (status: 'default' | 'modified') => {
    return status === 'modified' ? <AlertCircle className="h-4 w-4 text-orange-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando configurações do site...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Seções Configuradas</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">4</p>
              </div>
              <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Campos Preenchidos</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {Object.values(formData).filter(v => v && v.toString().trim() !== '').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Redes Sociais</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {['social_facebook', 'social_instagram', 'social_twitter', 'social_youtube'].filter(field => formData[field as keyof SiteSettings]).length}
                </p>
              </div>
              <Share2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Última Atualização</p>
                <p className="text-xs font-bold text-orange-900 dark:text-orange-100">
                  Recente
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Gestão de Conteúdo do Site
              </CardTitle>
              <CardDescription>
                Configure o conteúdo da página inicial, rodapé e informações de contacto do portal.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {previewMode ? 'Ocultar Preview' : 'Preview'}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Info className="h-4 w-4 mr-2" />
                    Ajuda
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Como usar o Gestor de Conteúdo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Dicas importantes:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• As alterações são salvas automaticamente quando clicar em "Guardar"</li>
                        <li>• Use o modo Preview para ver como ficará no site</li>
                        <li>• Campos marcados com * são obrigatórios</li>
                        <li>• Deixe campos de redes sociais vazios para ocultá-los</li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="hero" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Página Inicial
              </TabsTrigger>
              <TabsTrigger value="footer" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Rodapé
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contactos
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Redes Sociais
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hero" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Seção Hero
                    </CardTitle>
                    <CardDescription>
                      Configure o título e descrição principais da página inicial
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="hero_title" className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Título Principal *
                        </Label>
                        {getStatusIcon(getFieldStatus('hero_title'))}
                      </div>
                      <Input
                        id="hero_title"
                        value={formData.hero_title || ''}
                        onChange={(e) => handleInputChange('hero_title', e.target.value)}
                        placeholder="Bem-vindos ao Portal de Chipindo"
                        className="font-semibold"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="hero_subtitle" className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Subtítulo
                        </Label>
                        {getStatusIcon(getFieldStatus('hero_subtitle'))}
                      </div>
                      <Textarea
                        id="hero_subtitle"
                        value={formData.hero_subtitle || ''}
                        onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                        placeholder="Conectando a Administração Municipal aos cidadãos..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="hero_location_badge" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Localização
                        </Label>
                        {getStatusIcon(getFieldStatus('hero_location_badge'))}
                      </div>
                      <Input
                        id="hero_location_badge"
                        value={formData.hero_location_badge || ''}
                        onChange={(e) => handleInputChange('hero_location_badge', e.target.value)}
                        placeholder="Província de Huíla, Angola"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Estatísticas
                    </CardTitle>
                    <CardDescription>
                      Configure os números e descrições das estatísticas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="population_count" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            População (Número)
                          </Label>
                          {getStatusIcon(getFieldStatus('population_count'))}
                        </div>
                        <Input
                          id="population_count"
                          value={formData.population_count || ''}
                          onChange={(e) => handleInputChange('population_count', e.target.value)}
                          placeholder="150.000+"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="population_description" className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            População (Descrição)
                          </Label>
                          {getStatusIcon(getFieldStatus('population_description'))}
                        </div>
                        <Input
                          id="population_description"
                          value={formData.population_description || ''}
                          onChange={(e) => handleInputChange('population_description', e.target.value)}
                          placeholder="Cidadãos servidos"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="departments_count" className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Direções (Número)
                          </Label>
                          {getStatusIcon(getFieldStatus('departments_count'))}
                        </div>
                        <Input
                          id="departments_count"
                          value={formData.departments_count || ''}
                          onChange={(e) => handleInputChange('departments_count', e.target.value)}
                          placeholder="12"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="departments_description" className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Direções (Descrição)
                          </Label>
                          {getStatusIcon(getFieldStatus('departments_description'))}
                        </div>
                        <Input
                          id="departments_description"
                          value={formData.departments_description || ''}
                          onChange={(e) => handleInputChange('departments_description', e.target.value)}
                          placeholder="Áreas de atuação"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="services_count" className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Serviços (Número)
                          </Label>
                          {getStatusIcon(getFieldStatus('services_count'))}
                        </div>
                        <Input
                          id="services_count"
                          value={formData.services_count || ''}
                          onChange={(e) => handleInputChange('services_count', e.target.value)}
                          placeholder="24/7"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="services_description" className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Serviços (Descrição)
                          </Label>
                          {getStatusIcon(getFieldStatus('services_description'))}
                        </div>
                        <Input
                          id="services_description"
                          value={formData.services_description || ''}
                          onChange={(e) => handleInputChange('services_description', e.target.value)}
                          placeholder="Portal sempre ativo"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="footer" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Informações do Rodapé
                    </CardTitle>
                    <CardDescription>
                      Configure as informações exibidas no rodapé do site
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="footer_about_title" className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Título
                        </Label>
                        {getStatusIcon(getFieldStatus('footer_about_title'))}
                      </div>
                      <Input
                        id="footer_about_title"
                        value={formData.footer_about_title || ''}
                        onChange={(e) => handleInputChange('footer_about_title', e.target.value)}
                        placeholder="Portal de Chipindo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="footer_about_subtitle" className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Subtítulo
                        </Label>
                        {getStatusIcon(getFieldStatus('footer_about_subtitle'))}
                      </div>
                      <Input
                        id="footer_about_subtitle"
                        value={formData.footer_about_subtitle || ''}
                        onChange={(e) => handleInputChange('footer_about_subtitle', e.target.value)}
                        placeholder="Administração Municipal"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="footer_about_description" className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Descrição
                        </Label>
                        {getStatusIcon(getFieldStatus('footer_about_description'))}
                      </div>
                      <Textarea
                        id="footer_about_description"
                        value={formData.footer_about_description || ''}
                        onChange={(e) => handleInputChange('footer_about_description', e.target.value)}
                        placeholder="Conectando a Administração Municipal aos cidadãos..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="copyright_text" className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          Texto de Copyright
                        </Label>
                        {getStatusIcon(getFieldStatus('copyright_text'))}
                      </div>
                      <Input
                        id="copyright_text"
                        value={formData.copyright_text || ''}
                        onChange={(e) => handleInputChange('copyright_text', e.target.value)}
                        placeholder="© 2024 Administração Municipal de Chipindo. Todos os direitos reservados."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Horários de Funcionamento
                    </CardTitle>
                    <CardDescription>
                      Configure os horários de atendimento
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="opening_hours_weekdays" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Segunda a Sexta
                        </Label>
                        {getStatusIcon(getFieldStatus('opening_hours_weekdays'))}
                      </div>
                      <Input
                        id="opening_hours_weekdays"
                        value={formData.opening_hours_weekdays || ''}
                        onChange={(e) => handleInputChange('opening_hours_weekdays', e.target.value)}
                        placeholder="Segunda a Sexta: 08:00 - 16:00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="opening_hours_saturday" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Sábado
                        </Label>
                        {getStatusIcon(getFieldStatus('opening_hours_saturday'))}
                      </div>
                      <Input
                        id="opening_hours_saturday"
                        value={formData.opening_hours_saturday || ''}
                        onChange={(e) => handleInputChange('opening_hours_saturday', e.target.value)}
                        placeholder="Sábado: 08:00 - 12:00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="opening_hours_sunday" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Domingo
                        </Label>
                        {getStatusIcon(getFieldStatus('opening_hours_sunday'))}
                      </div>
                      <Input
                        id="opening_hours_sunday"
                        value={formData.opening_hours_sunday || ''}
                        onChange={(e) => handleInputChange('opening_hours_sunday', e.target.value)}
                        placeholder="Domingo: Encerrado"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Informações de Contacto
                  </CardTitle>
                  <CardDescription>
                    Configure as informações de contacto da administração
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="contact_address" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Endereço
                      </Label>
                      {getStatusIcon(getFieldStatus('contact_address'))}
                    </div>
                    <Textarea
                      id="contact_address"
                      value={formData.contact_address || ''}
                      onChange={(e) => handleInputChange('contact_address', e.target.value)}
                      placeholder="Rua Principal, Bairro Central, Chipindo, Província de Huíla, Angola"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="contact_phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Telefone
                        </Label>
                        {getStatusIcon(getFieldStatus('contact_phone'))}
                      </div>
                      <Input
                        id="contact_phone"
                        value={formData.contact_phone || ''}
                        onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                        placeholder="+244 XXX XXX XXX"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="contact_email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        {getStatusIcon(getFieldStatus('contact_email'))}
                      </div>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email || ''}
                        onChange={(e) => handleInputChange('contact_email', e.target.value)}
                        placeholder="admin@chipindo.gov.ao"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Redes Sociais
                  </CardTitle>
                  <CardDescription>
                    Configure os links das redes sociais. Deixe em branco para ocultar o ícone no rodapé.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="social_facebook" className="flex items-center gap-2">
                          <Facebook className="h-4 w-4" />
                          Facebook
                        </Label>
                        {getStatusIcon(getFieldStatus('social_facebook'))}
                      </div>
                      <Input
                        id="social_facebook"
                        value={formData.social_facebook || ''}
                        onChange={(e) => handleInputChange('social_facebook', e.target.value)}
                        placeholder="https://facebook.com/chipindo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="social_instagram" className="flex items-center gap-2">
                          <Instagram className="h-4 w-4" />
                          Instagram
                        </Label>
                        {getStatusIcon(getFieldStatus('social_instagram'))}
                      </div>
                      <Input
                        id="social_instagram"
                        value={formData.social_instagram || ''}
                        onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                        placeholder="https://instagram.com/chipindo"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="social_twitter" className="flex items-center gap-2">
                          <Twitter className="h-4 w-4" />
                          Twitter
                        </Label>
                        {getStatusIcon(getFieldStatus('social_twitter'))}
                      </div>
                      <Input
                        id="social_twitter"
                        value={formData.social_twitter || ''}
                        onChange={(e) => handleInputChange('social_twitter', e.target.value)}
                        placeholder="https://twitter.com/chipindo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="social_youtube" className="flex items-center gap-2">
                          <Youtube className="h-4 w-4" />
                          YouTube
                        </Label>
                        {getStatusIcon(getFieldStatus('social_youtube'))}
                      </div>
                      <Input
                        id="social_youtube"
                        value={formData.social_youtube || ''}
                        onChange={(e) => handleInputChange('social_youtube', e.target.value)}
                        placeholder="https://youtube.com/@chipindo"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Alterações não guardadas
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {Object.values(formData).filter(v => v && v.toString().trim() !== '').length} de {Object.keys(formData).length} campos preenchidos
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!hasChanges}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reverter Alterações
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {saving ? (
                  <>
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    A guardar...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Alterações
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};