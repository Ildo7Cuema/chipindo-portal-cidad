import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UsersIcon, MapPinIcon, ClockIcon, FileTextIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export const ConcursosSection = () => {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConcursos();
  }, []);

  const fetchConcursos = async () => {
    try {
      const { data, error } = await supabase
        .from('concursos')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setConcursos(data || []);
    } catch (error) {
      console.error('Error fetching concursos:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (concurso: Concurso) => {
    if (!concurso.deadline) {
      return <Badge className="bg-blue-100 text-blue-800">Disponível</Badge>;
    }
    
    const today = new Date();
    const deadline = new Date(concurso.deadline);
    const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) {
      return <Badge variant="secondary">Encerrado</Badge>;
    } else if (daysRemaining <= 7) {
      return <Badge className="bg-yellow-100 text-yellow-800">Termina em breve</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Aberto</Badge>;
    }
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
      <section id="concursos" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Concursos Públicos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oportunidades de carreira na Administração Municipal de Chipindo. 
              Inscreva-se online e faça parte da nossa equipa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-64" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="concursos" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Concursos Públicos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Oportunidades de carreira na Administração Municipal de Chipindo. 
            Inscreva-se online e faça parte da nossa equipa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {concursos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Nenhum concurso público disponível no momento.</p>
            </div>
          ) : (
            concursos.map((concurso) => {
              const daysRemaining = getDaysRemaining(concurso.deadline);
              
              return (
                <Card key={concurso.id} className="overflow-hidden hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      {getStatusBadge(concurso)}
                      <span className="text-sm text-muted-foreground">
                        {formatDate(concurso.created_at)}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {concurso.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {concurso.description}
                    </p>

                    {concurso.deadline && (
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Prazo:</span>
                          <span className="font-medium text-primary">
                            {formatDate(concurso.deadline)}
                          </span>
                        </div>
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
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Requisitos:</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {concurso.requirements}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="institutional" size="sm" className="flex-1">
                        <FileTextIcon className="w-4 h-4" />
                        Ver detalhes
                      </Button>
                      {concurso.contact_info && (
                        <Button variant="outline" size="sm">
                          Contacto
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-primary rounded-xl p-8 text-center shadow-elegant">
          <h3 className="text-2xl font-bold text-primary-foreground mb-4">
            Não encontrou o que procura?
          </h3>
          <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            Cadastre-se na nossa base de dados de talentos e seja notificado 
            sobre novos concursos na sua área de interesse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Cadastrar interesse
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              Ver histórico de concursos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};