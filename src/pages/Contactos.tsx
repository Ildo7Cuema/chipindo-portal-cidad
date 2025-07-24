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
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import { useDepartamentos } from "@/hooks/useDepartamentos";


export default function Contactos() {
  const { settings } = useSiteSettings();
  const { contacts: emergencyContacts } = useEmergencyContacts();
  const { departamentos } = useDepartamentos();
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
                    <p className="text-sm text-muted-foreground">
                      {settings?.contact_address || 'Carregando...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PhoneIcon className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">Telefone Geral</p>
                    <p className="text-sm text-muted-foreground">
                      {settings?.contact_phone || 'Carregando...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MailIcon className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">Email Geral</p>
                    <p className="text-sm text-muted-foreground">
                      {settings?.contact_email || 'Carregando...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClockIcon className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">Horário de Funcionamento</p>
                    <p className="text-sm text-muted-foreground">
                      {settings?.opening_hours_weekdays || 'Carregando...'}<br />
                      {settings?.opening_hours_saturday || ''}
                    </p>
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
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between">
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-red-600 font-bold">{contact.phone}</span>
                  </div>
                ))}
                {emergencyContacts.length === 0 && (
                  <p className="text-muted-foreground text-sm">Nenhum contacto de emergência cadastrado.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Departmental Contacts */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Contactos por Direção</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departamentos.map(departamento => (
              <Card key={departamento.id} className="hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BuildingIcon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{departamento.nome}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {departamento.descricao && (
                    <div className="flex items-start gap-2">
                      <MessageSquareIcon className="w-4 h-4 text-muted-foreground mt-1" />
                      <p className="text-sm text-muted-foreground">{departamento.descricao}</p>
                    </div>
                  )}
                  {departamento.codigo && (
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-medium">Código: {departamento.codigo}</p>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <ClockIcon className="w-4 h-4 text-muted-foreground mt-1" />
                    <p className="text-sm text-muted-foreground">
                      {settings?.opening_hours_weekdays || 'Horário não definido'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {departamentos.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Nenhum departamento cadastrado.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}