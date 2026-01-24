
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section, SectionContent } from "@/components/ui/section";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { cn } from "@/lib/utils";
import insigniaAngola from "@/assets/insignia-angola.png";
import logoRodape from "@/assets/logo_Rodape.png";
import logoRodapeHuila from "@/assets/logo_Rodape_huila.png";
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
  ExternalLinkIcon,
  HeartIcon,
  ShieldCheckIcon,
  Users2Icon,
  BuildingIcon,
  ArrowUpIcon,
  StarIcon,
  GlobeIcon,
  UserIcon
} from "lucide-react";

export const Footer = () => {
  const { settings } = useSiteSettings();

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Notícias", href: "/noticias" },
    { label: "Concursos", href: "/concursos" },
    { label: "Acervo Digital", href: "/acervo" },
    { label: "Transparência", href: "/transparencia" },
    { label: "Ouvidoria", href: "/ouvidoria" },
    { label: "Serviços", href: "/servicos" },
    { label: "Área Administrativa", href: "/auth", icon: UserIcon }
  ];

  const legalLinks = [
    { label: "Privacidade", href: "/privacidade" },
    { label: "Termos", href: "/termos" },
    { label: "Acessibilidade", href: "/acessibilidade" },
    { label: "Sitemap", href: "/sitemap" }
  ];

  const socialLinks = [
    {
      platform: "Facebook",
      icon: FacebookIcon,
      href: settings?.social_facebook || "#",
      color: "hover:bg-blue-600 hover:shadow-blue-600/25",
      bgColor: "bg-blue-600/10",
      borderColor: "border-blue-600/20",
      iconColor: "text-blue-400"
    },
    {
      platform: "Instagram",
      icon: InstagramIcon,
      href: settings?.social_instagram || "#",
      color: "hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 hover:shadow-pink-600/25",
      bgColor: "bg-gradient-to-br from-pink-600/10 to-purple-600/10",
      borderColor: "border-pink-600/20",
      iconColor: "text-pink-400"
    },
    {
      platform: "Twitter",
      icon: TwitterIcon,
      href: settings?.social_twitter || "#",
      color: "hover:bg-sky-500 hover:shadow-sky-500/25",
      bgColor: "bg-sky-600/10",
      borderColor: "border-sky-600/20",
      iconColor: "text-sky-400"
    },
    {
      platform: "YouTube",
      icon: YoutubeIcon,
      href: settings?.social_youtube || "#",
      color: "hover:bg-red-600 hover:shadow-red-600/25",
      bgColor: "bg-red-600/10",
      borderColor: "border-red-600/20",
      iconColor: "text-red-400"
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Golden accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>

      <Section variant="default" size="md" className="py-8">
        <SectionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* About Section - Compact */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center p-2 shadow-lg">
                  <img
                    src={insigniaAngola}
                    alt="Insígnia de Angola"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {settings?.footer_about_title || 'Portal de Chipindo'}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {settings?.footer_about_subtitle || 'Administração Municipal'}
                  </p>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs px-2 py-1">
                  <ShieldCheckIcon className="w-3 h-3 mr-1" />
                  Oficial
                </Badge>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {settings?.footer_about_description || 'Conectando a Administração Municipal aos cidadãos através de informação transparente e serviços digitais de qualidade.'}
              </p>

              {/* Social Media - Modern Design */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Users2Icon className="w-4 h-4 text-yellow-500" />
                  Redes Sociais
                </h4>
                <div className="flex flex-wrap justify-start sm:justify-start gap-3 sm:gap-2.5">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <Button
                        key={social.platform}
                        size="sm"
                        variant="outline"
                        className={cn(
                          "relative w-11 h-11 sm:w-12 sm:h-12 p-0 rounded-xl border-2 transition-all duration-300 ease-out group overflow-hidden",
                          "bg-slate-800/60 backdrop-blur-sm",
                          social.bgColor,
                          social.borderColor,
                          "hover:scale-110 hover:shadow-lg hover:shadow-slate-900/50",
                          "focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:ring-offset-2 focus:ring-offset-slate-900",
                          "active:scale-95",
                          social.color
                        )}
                        asChild
                      >
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Siga-nos no ${social.platform}`}
                          className="w-full h-full flex items-center justify-center"
                        >
                          {/* Background gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Icon with enhanced styling */}
                          <IconComponent className={cn(
                            "w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-all duration-300",
                            social.iconColor,
                            "group-hover:text-white group-hover:scale-110"
                          )} />

                          {/* Subtle glow effect */}
                          <div className={cn(
                            "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300",
                            social.platform === "Facebook" && "bg-blue-600",
                            social.platform === "Instagram" && "bg-gradient-to-br from-pink-500 to-purple-600",
                            social.platform === "Twitter" && "bg-sky-500",
                            social.platform === "YouTube" && "bg-red-600"
                          )} />
                        </a>
                      </Button>
                    );
                  })}
                </div>

                {/* Social media description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  Siga-nos nas redes sociais para ficar atualizado sobre as últimas notícias e serviços municipais.
                </p>

                {/* Social media stats */}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Ativo 24/7</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users2Icon className="w-3 h-3" />
                    <span>Comunidade Ativa</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information - Compact Cards */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <BuildingIcon className="w-4 h-4 text-yellow-500" />
                Contactos
              </h4>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-600/50 hover:bg-slate-800/80 transition-colors duration-300">
                  <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPinIcon className="w-3 h-3 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white">Endereço</p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {settings?.contact_address || 'Rua Principal, Chipindo, Província de Huíla'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-600/50 hover:bg-slate-800/80 transition-colors duration-300">
                  <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">{settings?.contact_phone || '+244 XXX XXX XXX'}</p>
                    <p className="text-xs text-slate-300">Linha principal</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-600/50 hover:bg-slate-800/80 transition-colors duration-300">
                  <div className="w-6 h-6 bg-orange-600 rounded-md flex items-center justify-center flex-shrink-0">
                    <MailIcon className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">{settings?.contact_email || 'admin@chipindo.gov.ao'}</p>
                    <p className="text-xs text-slate-300">Email oficial</p>
                  </div>
                </div>

                {/* Operating Hours - Compact */}
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-600/50">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ClockIcon className="w-3 h-3 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-medium text-white mb-2">Horário</h5>
                      <div className="space-y-1 text-xs text-slate-300">
                        <div className="flex justify-between">
                          <span>Seg-Feira:</span>
                          <span>08:00-16:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sexta-Feira:</span>
                          <span>08:00-15:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sáb:</span>
                          <span>{settings?.opening_hours_saturday || '08:00-12:00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dom:</span>
                          <span className="text-slate-400">{settings?.opening_hours_sunday || 'Encerrado'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links - Compact */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <GlobeIcon className="w-4 h-4 text-yellow-500" />
                Links Rápidos
              </h4>
              <div className="space-y-1">
                {quickLinks.map((link) => {
                  const IconComponent = link.icon;

                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between py-2 px-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-md transition-colors duration-300 group",
                        link.label === "Área Administrativa" && "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 hover:border-yellow-500/30"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {IconComponent && <IconComponent className="w-3 h-3" />}
                        <span>{link.label}</span>
                      </div>
                      {link.label !== "Área Administrativa" && (
                        <ExternalLinkIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Official Logos Section */}
          <div className="border-t border-slate-800 mt-8 pt-6">
            <div className="text-center space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center justify-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-yellow-500" />
                Vínculos Institucionais
              </h4>

              <div className="flex items-center justify-center">
                {/* Logos conectados sem linha divisória */}
                <div className="flex items-center">
                  <img
                    src={logoRodape}
                    alt="Governo de Angola"
                    className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
                  />
                  <img
                    src={logoRodapeHuila}
                    alt="Huíla.gov.ao - Administração Municipal de Chipindo"
                    className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-2xl mx-auto">
                Portal oficial vinculado ao Governo Provincial de Huíla e ao Governo da República de Angola
              </p>
            </div>
          </div>

          {/* Bottom Section - Compact */}
          <div className="border-t border-slate-800 mt-6 pt-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <p className="text-xs text-slate-400">
                  {settings?.copyright_text || `© ${currentYear} Administração Municipal de Chipindo. Todos os direitos reservados.`}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Feito com</span>
                  <HeartIcon className="w-3 h-3 text-red-500" />
                  <span className="text-slate-400">para Angola</span>
                  <div className="flex items-center gap-1 ml-2">
                    <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-yellow-500 font-medium text-xs">Premium</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 text-xs">
                  {legalLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-slate-400 hover:text-slate-200 transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                <Button
                  onClick={scrollToTop}
                  size="sm"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-8 w-8 p-0 group"
                >
                  <ArrowUpIcon className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </Button>
              </div>
            </div>

            {/* System Status - Minimal */}
            <div className="mt-4 pt-4 border-t border-slate-800/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span>Portal desenvolvido com tecnologias modernas</span>
                  <div className="hidden sm:flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Online</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span>v2.0.1</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>99.9% Uptime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionContent>
      </Section>
    </footer>
  );
};
