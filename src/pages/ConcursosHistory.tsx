import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, SearchIcon, FileTextIcon, ClockIcon, UsersIcon } from "lucide-react";
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

const ConcursosHistory = () => {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const getStatus = (concurso: Concurso) => {
    if (!concurso.deadline) return "available";
    
    const today = new Date();
    const deadline = new Date(concurso.deadline);
    const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) return "closed";
    else if (daysRemaining <= 7) return "closing";
    else return "open";
  };

  const filteredConcursos = concursos
    .filter(concurso => {
      const matchesSearch = concurso.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           concurso.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (statusFilter === "all") return matchesSearch;
      return matchesSearch && getStatus(concurso) === statusFilter;
    });

  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    const close = new Date(deadline);
    const diffTime = close.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Histórico de Concursos
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Explore todos os concursos públicos da Administração Municipal de Chipindo, 
            incluindo oportunidades passadas e atuais
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Pesquisar concursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="open">Abertos</SelectItem>
              <SelectItem value="closing">Terminam em breve</SelectItem>
              <SelectItem value="closed">Encerrados</SelectItem>
              <SelectItem value="available">Disponíveis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{concursos.length}</div>
              <div className="text-sm text-muted-foreground">Total de concursos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {concursos.filter(c => getStatus(c) === "open").length}
              </div>
              <div className="text-sm text-muted-foreground">Concursos abertos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {concursos.filter(c => getStatus(c) === "closing").length}
              </div>
              <div className="text-sm text-muted-foreground">Terminam em breve</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {concursos.filter(c => getStatus(c) === "closed").length}
              </div>
              <div className="text-sm text-muted-foreground">Encerrados</div>
            </CardContent>
          </Card>
        </div>

        {/* Concursos Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConcursos.map((concurso) => {
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
            })}
          </div>
        )}

        {filteredConcursos.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum concurso encontrado.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ConcursosHistory;