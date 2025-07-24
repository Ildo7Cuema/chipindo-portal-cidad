import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { UserIcon, BriefcaseIcon, GraduationCapIcon, PhoneIcon, MailIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const RegisterInterest = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    education: "",
    profession: "",
    experienceYears: "",
    professionalDetails: "",
    areasOfInterest: [] as string[],
    additionalInfo: "",
    acceptTerms: false
  });

  const areasOptions = [
    "Administração Pública",
    "Recursos Humanos",
    "Finanças e Contabilidade",
    "Tecnologias de Informação",
    "Engenharia Civil",
    "Saúde Pública",
    "Educação",
    "Desenvolvimento Social",
    "Meio Ambiente",
    "Segurança Pública",
    "Cultura e Turismo",
    "Agricultura e Pecuária"
  ];

  const handleAreaChange = (area: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      areasOfInterest: checked 
        ? [...prev.areasOfInterest, area]
        : prev.areasOfInterest.filter(a => a !== area)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      toast({
        title: "Erro",
        description: "Deve aceitar os termos e condições para continuar.",
        variant: "destructive"
      });
      return;
    }

    if (formData.areasOfInterest.length === 0) {
      toast({
        title: "Erro", 
        description: "Selecione pelo menos uma área de interesse.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('interest_registrations')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          profession: formData.profession || null,
          experience_years: formData.experienceYears ? parseInt(formData.experienceYears) : null,
          areas_of_interest: formData.areasOfInterest,
          additional_info: [formData.professionalDetails, formData.additionalInfo]
            .filter(info => info && info.trim())
            .join('\n\nInformações Adicionais:\n') || null,
          terms_accepted: formData.acceptTerms
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "O seu registo de interesse foi enviado com sucesso. Entraremos em contacto quando surgirem oportunidades nas suas áreas de interesse."
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        education: "",
        profession: "",
        experienceYears: "",
        professionalDetails: "",
        areasOfInterest: [],
        additionalInfo: "",
        acceptTerms: false
      });

    } catch (error: any) {
      console.error('Erro ao registrar interesse:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o registo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Cadastrar Interesse
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Registe o seu interesse e seja notificado sobre novas oportunidades 
            de concursos na Administração Municipal de Chipindo
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MailIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Notificações Personalizadas</h3>
                <p className="text-sm text-muted-foreground">
                  Receba alertas sobre concursos nas suas áreas de interesse
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BriefcaseIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Oportunidades Exclusivas</h3>
                <p className="text-sm text-muted-foreground">
                  Seja o primeiro a saber sobre novos concursos públicos
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Perfil Profissional</h3>
                <p className="text-sm text-muted-foreground">
                  Mantenha o seu perfil actualizado na nossa base de dados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Formulário de Registo de Interesse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    Informações Pessoais
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Nome Completo *</Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Digite o seu nome completo"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="seu.email@exemplo.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+244 XXX XXX XXX"
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    Informações Profissionais
                  </h3>
                  
                  <div>
                    <Label htmlFor="education">Nível de Educação</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, education: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o seu nível de educação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ensino-basico">Ensino Básico</SelectItem>
                        <SelectItem value="ensino-medio">Ensino Médio</SelectItem>
                        <SelectItem value="ensino-tecnico">Ensino Técnico</SelectItem>
                        <SelectItem value="licenciatura">Licenciatura</SelectItem>
                        <SelectItem value="mestrado">Mestrado</SelectItem>
                        <SelectItem value="doutoramento">Doutoramento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="profession">Profissão</Label>
                      <Input
                        id="profession"
                        value={formData.profession}
                        onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                        placeholder="Digite a sua profissão"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="experienceYears">Anos de Experiência</Label>
                      <Input
                        id="experienceYears"
                        type="number"
                        min="0"
                        max="50"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
                        placeholder="Ex: 5"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="additionalProfessionalInfo">Experiência Profissional Detalhada</Label>
                    <Textarea
                      id="additionalProfessionalInfo"
                      value={formData.professionalDetails}
                      onChange={(e) => setFormData(prev => ({ ...prev, professionalDetails: e.target.value }))}
                      placeholder="Descreva brevemente a sua experiência profissional, competências e qualificações relevantes..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Areas of Interest */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    Áreas de Interesse *
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {areasOptions.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={formData.areasOfInterest.includes(area)}
                          onCheckedChange={(checked) => handleAreaChange(area, checked as boolean)}
                        />
                        <Label htmlFor={area} className="text-sm">
                          {area}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <Label htmlFor="additionalInfo">Informações Adicionais</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                    placeholder="Informações adicionais que considera relevantes..."
                    rows={3}
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Aceito os termos e condições e autorizo o uso dos meus dados para fins de recrutamento *
                  </Label>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "A processar..." : "Registar Interesse"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterInterest;