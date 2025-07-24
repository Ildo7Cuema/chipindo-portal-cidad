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
  ArrowRightIcon
} from "lucide-react";

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

  const contactInfo = {
    address: "Rua Principal, Bairro Central, Chipindo",
    phone: "+244 XXX XXX XXX",
    email: "servicos@chipindo.gov.ao",
    hours: {
      weekdays: "Segunda a Sexta: 08:00 - 16:00",
      saturday: "Sábado: 08:00 - 12:00",
      sunday: "Domingo: Encerrado"
    }
  };

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
                  <Button variant="institutional" size="sm" className="w-full">
                    Solicitar serviço
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Information */}
        <div className="bg-muted/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Informações de Contacto
          </h2>
          
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;