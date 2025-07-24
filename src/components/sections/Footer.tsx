import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import insigniaAngola from "@/assets/insignia-angola.png";
import { 
  MapPinIcon, 
  PhoneIcon, 
  MailIcon, 
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon
} from "lucide-react";

export const Footer = () => {
  const { settings } = useSiteSettings();
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-elegant border border-border p-1">
                <img 
                  src={insigniaAngola} 
                  alt="Insígnia da República de Angola" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{settings?.footer_about_title || 'Portal de Chipindo'}</h3>
                <p className="text-sm text-muted-foreground">{settings?.footer_about_subtitle || 'Administração Municipal'}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {settings?.footer_about_description || 'Conectando a Administração Municipal aos cidadãos através de informação transparente, serviços digitais e oportunidades de crescimento.'}
            </p>
            <div className="flex space-x-3">
              {settings?.social_facebook && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2"
                  asChild
                >
                  <a 
                    href={settings.social_facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {settings?.social_instagram && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2"
                  asChild
                >
                  <a 
                    href={settings.social_instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {settings?.social_twitter && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2"
                  asChild
                >
                  <a 
                    href={settings.social_twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {settings?.social_youtube && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2"
                  asChild
                >
                  <a 
                    href={settings.social_youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                  >
                    <YoutubeIcon className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contactos</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Sede da Administração</p>
                  <p className="text-sm text-muted-foreground">
                    {settings?.contact_address || 'Rua Principal, Bairro Central, Chipindo, Província de Huíla, Angola'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{settings?.contact_phone || '+244 XXX XXX XXX'}</p>
                  <p className="text-sm text-muted-foreground">Linha principal</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MailIcon className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{settings?.contact_email || 'admin@chipindo.gov.ao'}</p>
                  <p className="text-sm text-muted-foreground">Email oficial</p>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Horário de Atendimento</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-primary mt-0.5" />
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">{settings?.opening_hours_weekdays || 'Segunda a Sexta: 08:00 - 16:00'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{settings?.opening_hours_saturday || 'Sábado: 08:00 - 12:00'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{settings?.opening_hours_sunday || 'Domingo: Encerrado'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Links Rápidos</h4>
            <div className="space-y-2">
              <a href="#noticias" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Últimas Notícias
              </a>
              <a href="#concursos" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Concursos Públicos
              </a>
              <a href="#acervo" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Acervo Digital
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Transparência
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Ouvidoria
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Área do Cidadão
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {settings?.copyright_text || '© 2024 Administração Municipal de Chipindo. Todos os direitos reservados.'}
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Acessibilidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};