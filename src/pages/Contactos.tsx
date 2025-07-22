import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPinIcon, 
  PhoneIcon, 
  MailIcon, 
  ClockIcon,
  BuildingIcon,
  UserIcon,
  MessageSquareIcon,
  SendIcon
} from "lucide-react";
import { MapboxMap } from "@/components/MapboxMap";

const contactosData = [
  {
    id: 1,
    title: "Administração Municipal",
    endereco: "Rua Principal, nº 123, Chipindo",
    telefone: "+244 923 456 789",
    email: "geral@chipindo.gov.ao",
    horario: "Segunda a Sexta: 08:00 - 16:00",
    responsavel: "Administrador Municipal",
    icon: BuildingIcon
  },
  {
    id: 2,
    title: "Direção de Educação",
    endereco: "Rua da Educação, nº 45, Chipindo",
    telefone: "+244 923 456 790",
    email: "educacao@chipindo.gov.ao",
    horario: "Segunda a Sexta: 07:30 - 15:30",
    responsavel: "Diretor de Educação",
    icon: BuildingIcon
  },
  {
    id: 3,
    title: "Direção de Saúde",
    endereco: "Hospital Municipal, Chipindo",
    telefone: "+244 923 456 791",
    email: "saude@chipindo.gov.ao",
    horario: "24 horas (Urgências)",
    responsavel: "Diretor de Saúde",
    icon: BuildingIcon
  },
  {
    id: 4,
    title: "Direção de Obras Públicas",
    endereco: "Rua das Obras, nº 67, Chipindo",
    telefone: "+244 923 456 792",
    email: "obras@chipindo.gov.ao",
    horario: "Segunda a Sexta: 08:00 - 16:00",
    responsavel: "Diretor de Obras",
    icon: BuildingIcon
  },
  {
    id: 5,
    title: "Direção de Agricultura",
    endereco: "Campos de Demonstração, Chipindo",
    telefone: "+244 923 456 793",
    email: "agricultura@chipindo.gov.ao",
    horario: "Segunda a Sexta: 07:00 - 15:00",
    responsavel: "Diretor de Agricultura",
    icon: BuildingIcon
  },
  {
    id: 6,
    title: "Registo Civil",
    endereco: "Rua Principal, nº 123, Chipindo",
    telefone: "+244 923 456 794",
    email: "registo@chipindo.gov.ao",
    horario: "Segunda a Sexta: 08:00 - 16:00",
    responsavel: "Conservador do Registo",
    icon: BuildingIcon
  }
];

export default function Contactos() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria implementada a lógica de envio
    alert("Mensagem enviada com sucesso! Entraremos em contacto em breve.");
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      assunto: "",
      mensagem: ""
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contactos</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Entre em contacto connosco. Estamos aqui para ajudar e esclarecer suas dúvidas.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquareIcon className="w-6 h-6 text-primary" />
                  Envie-nos uma Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        placeholder="Digite seu nome completo"
                        required
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="assunto">Assunto *</Label>
                      <Input
                        id="assunto"
                        value={formData.assunto}
                        onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                        placeholder="Assunto da sua mensagem"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mensagem">Mensagem *</Label>
                    <Textarea
                      id="mensagem"
                      value={formData.mensagem}
                      onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                      placeholder="Digite sua mensagem aqui..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <SendIcon className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6 text-primary" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MapboxMap height="400px" className="w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
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
                    <p className="text-sm text-muted-foreground">Rua Principal, nº 123<br />Chipindo, Angola</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PhoneIcon className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">Telefone Geral</p>
                    <p className="text-sm text-muted-foreground">+244 923 456 789</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MailIcon className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">Email Geral</p>
                    <p className="text-sm text-muted-foreground">geral@chipindo.gov.ao</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClockIcon className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">Horário de Funcionamento</p>
                    <p className="text-sm text-muted-foreground">Segunda a Sexta<br />08:00 - 16:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Contactos de Emergência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Bombeiros</span>
                  <span className="text-red-600 font-bold">115</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Polícia</span>
                  <span className="text-red-600 font-bold">113</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Hospital Municipal</span>
                  <span className="text-red-600 font-bold">+244 923 456 791</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Departmental Contacts */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Contactos por Direção</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactosData.map(contacto => {
              const IconComponent = contacto.icon;
              return (
                <Card key={contacto.id} className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{contacto.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="w-4 h-4 text-muted-foreground mt-1" />
                      <p className="text-sm text-muted-foreground">{contacto.endereco}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm">{contacto.telefone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm">{contacto.email}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ClockIcon className="w-4 h-4 text-muted-foreground mt-1" />
                      <p className="text-sm text-muted-foreground">{contacto.horario}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{contacto.responsavel}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}