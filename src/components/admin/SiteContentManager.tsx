import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSiteSettings, SiteSettings } from "@/hooks/useSiteSettings";
import { LoaderIcon } from "lucide-react";

export const SiteContentManager = () => {
  const { settings, loading, updateSettings } = useSiteSettings();
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

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
      toast.success("Configurações do site atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações do site");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (settings) {
      setFormData(settings);
      toast.info("Alterações revertidas para os valores salvos");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderIcon className="w-6 h-6 animate-spin" />
        <span className="ml-2">Carregando configurações...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gestão de Conteúdo do Site</h2>
        <p className="text-muted-foreground">
          Configure o conteúdo da página inicial e rodapé do portal.
        </p>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero">Página Inicial</TabsTrigger>
          <TabsTrigger value="footer">Rodapé</TabsTrigger>
          <TabsTrigger value="contact">Contactos</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seção Hero</CardTitle>
              <CardDescription>
                Configure o título e descrição principais da página inicial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero_title">Título Principal</Label>
                <Input
                  id="hero_title"
                  value={formData.hero_title || ''}
                  onChange={(e) => handleInputChange('hero_title', e.target.value)}
                  placeholder="Bem-vindos ao Portal de Chipindo"
                />
              </div>
              
              <div>
                <Label htmlFor="hero_subtitle">Subtítulo</Label>
                <Textarea
                  id="hero_subtitle"
                  value={formData.hero_subtitle || ''}
                  onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                  placeholder="Conectando a Administração Municipal aos cidadãos..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="hero_location_badge">Localização</Label>
                <Input
                  id="hero_location_badge"
                  value={formData.hero_location_badge || ''}
                  onChange={(e) => handleInputChange('hero_location_badge', e.target.value)}
                  placeholder="Província de Huíla, Angola"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>
                Configure os números e descrições das estatísticas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="population_count">População (Número)</Label>
                  <Input
                    id="population_count"
                    value={formData.population_count || ''}
                    onChange={(e) => handleInputChange('population_count', e.target.value)}
                    placeholder="150.000+"
                  />
                </div>
                <div>
                  <Label htmlFor="population_description">População (Descrição)</Label>
                  <Input
                    id="population_description"
                    value={formData.population_description || ''}
                    onChange={(e) => handleInputChange('population_description', e.target.value)}
                    placeholder="Cidadãos servidos"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departments_count">Direções (Número)</Label>
                  <Input
                    id="departments_count"
                    value={formData.departments_count || ''}
                    onChange={(e) => handleInputChange('departments_count', e.target.value)}
                    placeholder="12"
                  />
                </div>
                <div>
                  <Label htmlFor="departments_description">Direções (Descrição)</Label>
                  <Input
                    id="departments_description"
                    value={formData.departments_description || ''}
                    onChange={(e) => handleInputChange('departments_description', e.target.value)}
                    placeholder="Áreas de atuação"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="services_count">Serviços (Número)</Label>
                  <Input
                    id="services_count"
                    value={formData.services_count || ''}
                    onChange={(e) => handleInputChange('services_count', e.target.value)}
                    placeholder="24/7"
                  />
                </div>
                <div>
                  <Label htmlFor="services_description">Serviços (Descrição)</Label>
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
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Rodapé</CardTitle>
              <CardDescription>
                Configure as informações exibidas no rodapé do site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="footer_about_title">Título</Label>
                <Input
                  id="footer_about_title"
                  value={formData.footer_about_title || ''}
                  onChange={(e) => handleInputChange('footer_about_title', e.target.value)}
                  placeholder="Portal de Chipindo"
                />
              </div>
              
              <div>
                <Label htmlFor="footer_about_subtitle">Subtítulo</Label>
                <Input
                  id="footer_about_subtitle"
                  value={formData.footer_about_subtitle || ''}
                  onChange={(e) => handleInputChange('footer_about_subtitle', e.target.value)}
                  placeholder="Administração Municipal"
                />
              </div>
              
              <div>
                <Label htmlFor="footer_about_description">Descrição</Label>
                <Textarea
                  id="footer_about_description"
                  value={formData.footer_about_description || ''}
                  onChange={(e) => handleInputChange('footer_about_description', e.target.value)}
                  placeholder="Conectando a Administração Municipal aos cidadãos..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="copyright_text">Texto de Copyright</Label>
                <Input
                  id="copyright_text"
                  value={formData.copyright_text || ''}
                  onChange={(e) => handleInputChange('copyright_text', e.target.value)}
                  placeholder="© 2024 Administração Municipal de Chipindo. Todos os direitos reservados."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horários de Funcionamento</CardTitle>
              <CardDescription>
                Configure os horários de atendimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="opening_hours_weekdays">Segunda a Sexta</Label>
                <Input
                  id="opening_hours_weekdays"
                  value={formData.opening_hours_weekdays || ''}
                  onChange={(e) => handleInputChange('opening_hours_weekdays', e.target.value)}
                  placeholder="Segunda a Sexta: 08:00 - 16:00"
                />
              </div>
              
              <div>
                <Label htmlFor="opening_hours_saturday">Sábado</Label>
                <Input
                  id="opening_hours_saturday"
                  value={formData.opening_hours_saturday || ''}
                  onChange={(e) => handleInputChange('opening_hours_saturday', e.target.value)}
                  placeholder="Sábado: 08:00 - 12:00"
                />
              </div>
              
              <div>
                <Label htmlFor="opening_hours_sunday">Domingo</Label>
                <Input
                  id="opening_hours_sunday"
                  value={formData.opening_hours_sunday || ''}
                  onChange={(e) => handleInputChange('opening_hours_sunday', e.target.value)}
                  placeholder="Domingo: Encerrado"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contacto</CardTitle>
              <CardDescription>
                Configure as informações de contacto da administração
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact_address">Endereço</Label>
                <Textarea
                  id="contact_address"
                  value={formData.contact_address || ''}
                  onChange={(e) => handleInputChange('contact_address', e.target.value)}
                  placeholder="Rua Principal, Bairro Central, Chipindo, Província de Huíla, Angola"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="contact_phone">Telefone</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone || ''}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  placeholder="+244 XXX XXX XXX"
                />
              </div>
              
              <div>
                <Label htmlFor="contact_email">Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email || ''}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="admin@chipindo.gov.ao"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleReset}>
          Reverter Alterações
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
              A guardar...
            </>
          ) : (
            'Guardar Alterações'
          )}
        </Button>
      </div>
    </div>
  );
};