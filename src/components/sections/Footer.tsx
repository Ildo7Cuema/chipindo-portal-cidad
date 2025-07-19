import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">C</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground">Portal de Chipindo</h3>
                <p className="text-sm text-muted-foreground">Administração Municipal</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Conectando a Administração Municipal aos cidadãos através de informação transparente, 
              serviços digitais e oportunidades de crescimento.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="p-2">
                <FacebookIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <InstagramIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <TwitterIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <YoutubeIcon className="w-4 h-4" />
              </Button>
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
                    Rua Principal, Bairro Central<br />
                    Chipindo, Província de Huíla<br />
                    Angola
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">+244 XXX XXX XXX</p>
                  <p className="text-sm text-muted-foreground">Linha principal</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MailIcon className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">admin@chipindo.gov.ao</p>
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
                    <p className="text-sm font-medium">Segunda a Sexta</p>
                    <p className="text-sm text-muted-foreground">08:00 - 16:00</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sábado</p>
                    <p className="text-sm text-muted-foreground">08:00 - 12:00</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Domingo</p>
                    <p className="text-sm text-muted-foreground">Encerrado</p>
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
              © 2024 Administração Municipal de Chipindo. Todos os direitos reservados.
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