import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, ClockIcon, UsersIcon, FileTextIcon, MapPinIcon, GraduationCapIcon, BriefcaseIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Concurso {
  id: string;
  title: string;
  description: string;
  created_at: string;
  deadline?: string;
  requirements?: string;
  contact_info?: string;
  published: boolean;
}

export default function Concursos() {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConcurso, setSelectedConcurso] = useState<Concurso | null>(null);
  const [showInscricaoForm, setShowInscricaoForm] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    bilheteIdentidade: "",
    dataNascimento: "",
    telefone: "",
    email: "",
    observacoes: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchConcursos();
  }, []);

  const fetchConcursos = async () => {
    try {
      const { data, error } = await supabase
        .from('concursos')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConcursos(data || []);
    } catch (error) {
      console.error('Error fetching concursos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar concursos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isActive = (concurso: Concurso) => {
    if (!concurso.deadline) return true;
    return new Date(concurso.deadline) > new Date();
  };

  const concursosAtivos = concursos.filter(c => isActive(c));
  const concursosEncerrados = concursos.filter(c => !isActive(c));

  const handleInscricao = (concurso: Concurso) => {
    setSelectedConcurso(concurso);
    setShowInscricaoForm(true);
  };

  const submitInscricao = () => {
    toast({
      title: "Sucesso!",
      description: "Inscrição enviada com sucesso! Receberá confirmação por email.",
    });
    setShowInscricaoForm(false);
    setSelectedConcurso(null);
    setFormData({
      nomeCompleto: "",
      bilheteIdentidade: "",
      dataNascimento: "",
      telefone: "",
      email: "",
      observacoes: ""
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    const close = new Date(deadline);
    const diffTime = close.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Concursos Públicos</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Oportunidades de emprego na Administração Municipal de Chipindo
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-64" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Concursos Públicos</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Oportunidades de emprego na Administração Municipal de Chipindo
          </p>
        </div>

        {/* Active Concursos */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <BriefcaseIcon className="w-6 h-6 text-primary" />
            Concursos Abertos
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {concursosAtivos.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-muted-foreground">Nenhum concurso aberto no momento.</p>
              </div>
            ) : (
              concursosAtivos.map(concurso => {
                const daysRemaining = getDaysRemaining(concurso.deadline);
                return (
                  <Card key={concurso.id} className="hover:shadow-glow transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-gradient-primary">Concurso Público</Badge>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Aberto
                        </Badge>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors duration-300">
                        {concurso.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-6">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {concurso.description}
                        </p>
                        
                        {concurso.deadline && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="font-medium">Prazo:</span> {formatDate(concurso.deadline)}
                          </div>
                        )}

                        {daysRemaining && daysRemaining > 0 && (
                          <div className="flex items-center gap-2 text-sm text-accent">
                            <ClockIcon className="w-4 h-4" />
                            <span className="font-medium">
                              {daysRemaining} dias restantes
                            </span>
                          </div>
                        )}

                        {concurso.requirements && (
                          <div className="space-y-1">
                            <span className="text-sm font-medium text-foreground">Requisitos:</span>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {concurso.requirements}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedConcurso(concurso)}
                          className="flex-1"
                        >
                          <FileTextIcon className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleInscricao(concurso)}
                          className="flex-1"
                        >
                          Inscrever-se
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Closed Concursos */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <ClockIcon className="w-6 h-6 text-muted-foreground" />
            Concursos Encerrados
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {concursosEncerrados.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-muted-foreground">Nenhum concurso encerrado.</p>
              </div>
            ) : (
              concursosEncerrados.map(concurso => (
                <Card key={concurso.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">Concurso Público</Badge>
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        Encerrado
                      </Badge>
                    </div>
                    <CardTitle className="text-muted-foreground">{concurso.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="line-clamp-2">{concurso.description}</p>
                      {concurso.deadline && (
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          Encerrado em {formatDate(concurso.deadline)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Concurso Details Modal */}
        {selectedConcurso && !showInscricaoForm && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-gradient-primary">Concurso Público</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedConcurso(null)}
                  >
                    ✕
                  </Button>
                </div>
                <CardTitle className="text-2xl">{selectedConcurso.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Descrição</h3>
                  <p className="text-muted-foreground">{selectedConcurso.description}</p>
                </div>
                
                {selectedConcurso.requirements && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Requisitos</h3>
                    <p className="text-muted-foreground">{selectedConcurso.requirements}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Informações Gerais</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Publicado:</span>
                        <span className="font-medium">{formatDate(selectedConcurso.created_at)}</span>
                      </div>
                      {selectedConcurso.deadline && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Encerramento:</span>
                          <span className="font-medium">{formatDate(selectedConcurso.deadline)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedConcurso.contact_info && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Contacto</h3>
                      <p className="text-sm text-muted-foreground">{selectedConcurso.contact_info}</p>
                    </div>
                  )}
                </div>

                {isActive(selectedConcurso) && (
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedConcurso(null)}
                      className="flex-1"
                    >
                      Fechar
                    </Button>
                    <Button 
                      onClick={() => handleInscricao(selectedConcurso)}
                      className="flex-1"
                    >
                      Inscrever-se
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Inscription Form Modal */}
        {showInscricaoForm && selectedConcurso && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inscrição no Concurso</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{selectedConcurso.title}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInscricaoForm(false)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                    <Input
                      id="nomeCompleto"
                      value={formData.nomeCompleto}
                      onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})}
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bilheteIdentidade">Nº Bilhete de Identidade *</Label>
                    <Input
                      id="bilheteIdentidade"
                      value={formData.bilheteIdentidade}
                      onChange={(e) => setFormData({...formData, bilheteIdentidade: e.target.value})}
                      placeholder="000000000LA000"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Contacto Telefônico *</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      placeholder="+244 900 000 000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="seuemail@exemplo.com"
                  />
                </div>

                <div>
                  <Label>Informações Adicionais</Label>
                  <Textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    placeholder="Informações adicionais relevantes para o concurso..."
                    rows={4}
                  />
                </div>


                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowInscricaoForm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={submitInscricao}
                    className="flex-1"
                  >
                    Confirmar Inscrição
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