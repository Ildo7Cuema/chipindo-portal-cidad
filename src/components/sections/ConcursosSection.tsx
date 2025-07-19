import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UsersIcon, MapPinIcon, ClockIcon, FileTextIcon } from "lucide-react";

interface Concurso {
  id: string;
  title: string;
  department: string;
  category: string;
  openDate: string;
  closeDate: string;
  vacancies: number;
  requirements: string[];
  status: 'open' | 'closing-soon' | 'closed';
}

const mockConcursos: Concurso[] = [
  {
    id: "1",
    title: "Professor de Ensino Primário",
    department: "Direção de Educação",
    category: "Técnico Superior",
    openDate: "2024-01-15",
    closeDate: "2024-02-15",
    vacancies: 15,
    requirements: ["Licenciatura em Ciências da Educação", "Experiência mínima de 2 anos"],
    status: "open"
  },
  {
    id: "2",
    title: "Enfermeiro Especialista", 
    department: "Direção de Saúde",
    category: "Técnico Superior",
    openDate: "2024-01-10",
    closeDate: "2024-02-10",
    vacancies: 8,
    requirements: ["Licenciatura em Enfermagem", "Especialização em área específica"],
    status: "closing-soon"
  },
  {
    id: "3",
    title: "Engenheiro Civil",
    department: "Direção de Obras Públicas", 
    category: "Técnico Superior",
    openDate: "2024-01-20",
    closeDate: "2024-02-20",
    vacancies: 5,
    requirements: ["Licenciatura em Engenharia Civil", "Experiência em obras públicas"],
    status: "open"
  }
];

export const ConcursosSection = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-100 text-green-800">Aberto</Badge>;
      case 'closing-soon':
        return <Badge className="bg-yellow-100 text-yellow-800">Termina em breve</Badge>;
      case 'closed':
        return <Badge variant="secondary">Encerrado</Badge>;
      default:
        return <Badge variant="outline">Status desconhecido</Badge>;
    }
  };

  const getDaysRemaining = (closeDate: string) => {
    const today = new Date();
    const close = new Date(closeDate);
    const diffTime = close.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
          {mockConcursos.map((concurso) => {
            const daysRemaining = getDaysRemaining(concurso.closeDate);
            
            return (
              <Card key={concurso.id} className="overflow-hidden hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    {getStatusBadge(concurso.status)}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <UsersIcon className="w-4 h-4" />
                      {concurso.vacancies} vagas
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {concurso.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPinIcon className="w-4 h-4" />
                    {concurso.department}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Categoria:</span>
                      <span className="font-medium">{concurso.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Abertura:</span>
                      <span>{formatDate(concurso.openDate)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Encerramento:</span>
                      <span className="font-medium text-primary">
                        {formatDate(concurso.closeDate)}
                      </span>
                    </div>
                  </div>

                  {daysRemaining > 0 && (
                    <div className="flex items-center gap-2 text-sm text-accent">
                      <ClockIcon className="w-4 h-4" />
                      <span className="font-medium">
                        {daysRemaining} dias restantes
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Requisitos principais:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {concurso.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="institutional" size="sm" className="flex-1">
                      <FileTextIcon className="w-4 h-4" />
                      Inscrever-se
                    </Button>
                    <Button variant="outline" size="sm">
                      Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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