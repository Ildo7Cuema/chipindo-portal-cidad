import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, ClockIcon, UsersIcon, FileTextIcon, MapPinIcon, GraduationCapIcon, BriefcaseIcon } from "lucide-react";

const concursosData = [
  {
    id: 1,
    title: "Professor de Matemática - Ensino Secundário",
    direcao: "Educação",
    categoria: "Ensino",
    vagas: 5,
    requisitos: "Licenciatura em Matemática ou Ensino de Matemática",
    salario: "Akz 85.000,00",
    dataAbertura: "2024-01-15",
    dataFecho: "2024-02-15",
    local: "Escolas Secundárias do Município",
    descricao: "Lecionar disciplinas de Matemática no ensino secundário, elaborar planos de aula e participar em atividades pedagógicas.",
    documentos: ["Bilhete de Identidade", "Certificado de Habilitações", "Curriculum Vitae"],
    declaracaoObrigatoria: true,
    ativo: true
  },
  {
    id: 2,
    title: "Enfermeiro/a",
    direcao: "Saúde",
    categoria: "Saúde",
    vagas: 8,
    requisitos: "Curso Médio de Enfermagem ou Licenciatura em Enfermagem",
    salario: "Akz 75.000,00",
    dataAbertura: "2024-01-10",
    dataFecho: "2024-02-10",
    local: "Hospital Municipal e Centros de Saúde",
    descricao: "Prestação de cuidados de enfermagem, administração de medicamentos e apoio aos médicos.",
    documentos: ["Bilhete de Identidade", "Certificado de Habilitações", "Curriculum Vitae", "Certificado do Conselho de Enfermagem"],
    declaracaoObrigatoria: false,
    ativo: true
  },
  {
    id: 3,
    title: "Engenheiro Civil",
    direcao: "Obras Públicas",
    categoria: "Engenharia",
    vagas: 3,
    requisitos: "Licenciatura em Engenharia Civil",
    salario: "Akz 120.000,00",
    dataAbertura: "2024-01-20",
    dataFecho: "2024-02-20",
    local: "Direção Municipal de Obras Públicas",
    descricao: "Supervisão de obras públicas, elaboração de projetos e fiscalização de construções.",
    documentos: ["Bilhete de Identidade", "Certificado de Habilitações", "Curriculum Vitae"],
    declaracaoObrigatoria: true,
    ativo: true
  },
  {
    id: 4,
    title: "Técnico Agrícola",
    direcao: "Agricultura",
    categoria: "Técnico",
    vagas: 6,
    requisitos: "Curso Médio em Agricultura ou áreas afins",
    salario: "Akz 65.000,00",
    dataAbertura: "2024-01-05",
    dataFecho: "2024-01-25",
    local: "Campos de Demonstração e Comunidades Rurais",
    descricao: "Assistência técnica aos agricultores, demonstração de técnicas agrícolas modernas.",
    documentos: ["Bilhete de Identidade", "Certificado de Habilitações", "Curriculum Vitae"],
    declaracaoObrigatoria: false,
    ativo: false
  }
];

export default function Concursos() {
  const [selectedConcurso, setSelectedConcurso] = useState<typeof concursosData[0] | null>(null);
  const [showInscricaoForm, setShowInscricaoForm] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    bilheteIdentidade: "",
    dataNascimento: "",
    telefone: "",
    email: "",
    observacoes: ""
  });

  const concursosAtivos = concursosData.filter(c => c.ativo);
  const concursosEncerrados = concursosData.filter(c => !c.ativo);

  const handleInscricao = (concurso: typeof concursosData[0]) => {
    setSelectedConcurso(concurso);
    setShowInscricaoForm(true);
  };

  const submitInscricao = () => {
    // Aqui seria implementada a lógica de submissão
    alert("Inscrição enviada com sucesso! Receberá confirmação por email.");
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
            {concursosAtivos.map(concurso => (
              <Card key={concurso.id} className="hover:shadow-glow transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-gradient-primary">{concurso.direcao}</Badge>
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCapIcon className="w-4 h-4" />
                      <span className="font-medium">Categoria:</span> {concurso.categoria}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UsersIcon className="w-4 h-4" />
                      <span className="font-medium">Vagas:</span> {concurso.vagas}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="font-medium">Local:</span> {concurso.local}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="w-4 h-4" />
                      <span className="font-medium">Prazo:</span> {new Date(concurso.dataFecho).toLocaleDateString('pt-PT')}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-foreground">Salário:</span> 
                      <span className="text-primary font-semibold">{concurso.salario}</span>
                    </div>
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
            ))}
          </div>
        </div>

        {/* Closed Concursos */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <ClockIcon className="w-6 h-6 text-muted-foreground" />
            Concursos Encerrados
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {concursosEncerrados.map(concurso => (
              <Card key={concurso.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{concurso.direcao}</Badge>
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      Encerrado
                    </Badge>
                  </div>
                  <CardTitle className="text-muted-foreground">{concurso.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="w-4 h-4" />
                      {concurso.vagas} vagas
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Encerrado em {new Date(concurso.dataFecho).toLocaleDateString('pt-PT')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Concurso Details Modal */}
        {selectedConcurso && !showInscricaoForm && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-gradient-primary">{selectedConcurso.direcao}</Badge>
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
                  <h3 className="font-semibold text-foreground mb-2">Descrição do Cargo</h3>
                  <p className="text-muted-foreground">{selectedConcurso.descricao}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Requisitos</h3>
                  <p className="text-muted-foreground">{selectedConcurso.requisitos}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Informações Gerais</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vagas:</span>
                        <span className="font-medium">{selectedConcurso.vagas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Salário:</span>
                        <span className="font-medium text-primary">{selectedConcurso.salario}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Abertura:</span>
                        <span className="font-medium">{new Date(selectedConcurso.dataAbertura).toLocaleDateString('pt-PT')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Encerramento:</span>
                        <span className="font-medium">{new Date(selectedConcurso.dataFecho).toLocaleDateString('pt-PT')}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Documentos Necessários</h3>
                    <ul className="space-y-1 text-sm">
                      {selectedConcurso.documentos.map((doc, index) => (
                        <li key={index} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {doc}
                        </li>
                      ))}
                      {selectedConcurso.declaracaoObrigatoria && (
                        <li className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          Declaração com notas
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {selectedConcurso.ativo && (
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
                  <Label>Upload de Documentos *</Label>
                  <div className="space-y-3 mt-2">
                    {selectedConcurso.documentos.map((doc, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                        <FileTextIcon className="w-5 h-5 text-muted-foreground" />
                        <span className="flex-1 text-sm">{doc}</span>
                        <Button variant="outline" size="sm">
                          Escolher Arquivo
                        </Button>
                      </div>
                    ))}
                    {selectedConcurso.declaracaoObrigatoria && (
                      <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                        <FileTextIcon className="w-5 h-5 text-muted-foreground" />
                        <span className="flex-1 text-sm">Declaração com notas</span>
                        <Button variant="outline" size="sm">
                          Escolher Arquivo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações (Opcional)</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    placeholder="Informações adicionais..."
                    rows={3}
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