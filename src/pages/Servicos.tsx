import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileTextIcon, 
  ClockIcon, 
  MapPinIcon, 
  PhoneIcon, 
  MailIcon,
  UserIcon,
  BuildingIcon,
  GraduationCapIcon,
  HeartIcon,
  HammerIcon,
  TractorIcon,
  SearchIcon
} from "lucide-react";

const servicosData = [
  {
    id: 1,
    title: "Emissão de Bilhete de Identidade",
    direcao: "Registo Civil",
    icon: UserIcon,
    description: "Serviço de emissão e renovação de documentos de identificação para cidadãos nacionais.",
    requisitos: [
      "Certidão de Nascimento (original)",
      "2 fotografias tipo passe",
      "Comprovativo de residência",
      "Taxa de serviço"
    ],
    horario: "08:00 - 16:00",
    localizacao: "Repartição do Registo Civil",
    contacto: "+244 923 456 789",
    email: "registo@chipindo.gov.ao",
    prazo: "5 dias úteis",
    taxa: "Akz 2.500,00",
    documentos: ["Requerimento", "Declaração de residência"],
    categoria: "Documentação"
  },
  {
    id: 2,
    title: "Matrícula Escolar",
    direcao: "Educação",
    icon: GraduationCapIcon,
    description: "Inscrição de alunos no ensino primário e secundário nas escolas públicas do município.",
    requisitos: [
      "Certidão de Nascimento",
      "Cartão de Vacinas atualizado",
      "2 fotografias",
      "Boletim de notas (transferência)"
    ],
    horario: "07:30 - 15:30",
    localizacao: "Direção Municipal de Educação",
    contacto: "+244 923 456 790",
    email: "educacao@chipindo.gov.ao",
    prazo: "Imediato",
    taxa: "Gratuito",
    documentos: ["Ficha de matrícula"],
    categoria: "Educação"
  },
  {
    id: 3,
    title: "Consultas Médicas",
    direcao: "Saúde",
    icon: HeartIcon,
    description: "Atendimento médico geral e especializado no Hospital Municipal e centros de saúde.",
    requisitos: [
      "Bilhete de Identidade",
      "Cartão do utente",
      "Cartão de vacinas (crianças)"
    ],
    horario: "24 horas (Urgências)",
    localizacao: "Hospital Municipal de Chipindo",
    contacto: "+244 923 456 791",
    email: "saude@chipindo.gov.ao",
    prazo: "Mediante marcação",
    taxa: "Akz 500,00 (consulta)",
    documentos: ["Cartão do utente"],
    categoria: "Saúde"
  },
  {
    id: 4,
    title: "Licença de Construção",
    direcao: "Obras Públicas",
    icon: HammerIcon,
    description: "Autorização para construção de habitações e edifícios comerciais no município.",
    requisitos: [
      "Projeto arquitetônico aprovado",
      "Título de propriedade do terreno",
      "Planta de localização",
      "Comprovativo de pagamento de taxa"
    ],
    horario: "08:00 - 16:00",
    localizacao: "Direção de Obras Públicas",
    contacto: "+244 923 456 792",
    email: "obras@chipindo.gov.ao",
    prazo: "30 dias úteis",
    taxa: "Akz 15.000,00",
    documentos: ["Requerimento", "Projeto técnico"],
    categoria: "Licenciamento"
  },
  {
    id: 5,
    title: "Assistência Técnica Agrícola",
    direcao: "Agricultura",
    icon: TractorIcon,
    description: "Apoio técnico aos agricultores locais com formação e distribuição de sementes.",
    requisitos: [
      "Bilhete de Identidade",
      "Comprovativo de propriedade rural",
      "Declaração de atividade agrícola"
    ],
    horario: "07:00 - 15:00",
    localizacao: "Campos de Demonstração",
    contacto: "+244 923 456 793",
    email: "agricultura@chipindo.gov.ao",
    prazo: "Agendamento prévio",
    taxa: "Gratuito",
    documentos: ["Ficha de cadastro"],
    categoria: "Agricultura"
  },
  {
    id: 6,
    title: "Certidão de Óbito",
    direcao: "Registo Civil",
    icon: FileTextIcon,
    description: "Emissão de certidões de óbito para fins legais e administrativos.",
    requisitos: [
      "Atestado médico de óbito",
      "Bilhete de Identidade do requerente",
      "Certidão de Nascimento do falecido"
    ],
    horario: "08:00 - 16:00",
    localizacao: "Repartição do Registo Civil",
    contacto: "+244 923 456 789",
    email: "registo@chipindo.gov.ao",
    prazo: "24 horas",
    taxa: "Akz 1.000,00",
    documentos: ["Requerimento"],
    categoria: "Documentação"
  }
];

const categorias = ["Todas", "Documentação", "Educação", "Saúde", "Licenciamento", "Agricultura"];

export default function Servicos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedService, setSelectedService] = useState<typeof servicosData[0] | null>(null);

  const filteredServices = servicosData.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.direcao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || service.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Serviços Municipais</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Acesso rápido e fácil aos serviços oferecidos pela Administração Municipal de Chipindo
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Pesquisar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categorias.map(categoria => (
              <Button
                key={categoria}
                variant={selectedCategory === categoria ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(categoria)}
                className="transition-all duration-300"
              >
                {categoria}
              </Button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredServices.map(service => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.id} 
                className="hover:shadow-glow transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedService(service)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300`}>
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="outline">{service.categoria}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{service.direcao}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ClockIcon className="w-4 h-4" />
                      <span className="font-medium">Horário:</span> {service.horario}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="font-medium">Local:</span> {service.localizacao}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">Taxa:</span> 
                      <span className="text-primary font-semibold">{service.taxa}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <BuildingIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum serviço encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar os termos de pesquisa ou explore outras categorias.
            </p>
          </div>
        )}

        {/* Service Details Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <selectedService.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <Badge className="mb-2">{selectedService.categoria}</Badge>
                      <CardTitle className="text-2xl">{selectedService.title}</CardTitle>
                      <p className="text-muted-foreground">{selectedService.direcao}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedService(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Descrição</h3>
                  <p className="text-muted-foreground">{selectedService.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Informações Gerais</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <ClockIcon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Horário:</span>
                          <p className="text-sm text-muted-foreground">{selectedService.horario}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPinIcon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Localização:</span>
                          <p className="text-sm text-muted-foreground">{selectedService.localizacao}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileTextIcon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Prazo:</span>
                          <p className="text-sm text-muted-foreground">{selectedService.prazo}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">Taxa:</span>
                        <span className="text-primary font-semibold">{selectedService.taxa}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Contactos</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Telefone:</span>
                          <p className="text-sm text-muted-foreground">{selectedService.contacto}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MailIcon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Email:</span>
                          <p className="text-sm text-muted-foreground">{selectedService.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Documentos Necessários</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Requisitos:</h4>
                      <ul className="space-y-1">
                        {selectedService.requisitos.map((req, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Documentos a preencher:</h4>
                      <ul className="space-y-1">
                        {selectedService.documentos.map((doc, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedService(null)}
                    className="flex-1"
                  >
                    Fechar
                  </Button>
                  <Button className="flex-1">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    Contactar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}