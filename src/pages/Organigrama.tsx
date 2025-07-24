import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, ChevronDown, ChevronUp, Users } from 'lucide-react';

interface OrganigramaMember {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  superior_id: string | null;
  email: string | null;
  telefone: string | null;
  descricao: string | null;
  foto_url: string | null;
  ordem: number;
  ativo: boolean;
}

interface Direccao {
  id: string;
  nome: string;
  descricao: string | null;
  codigo: string | null;
  ativo: boolean;
  ordem: number;
}

const departments = [
  'Gabinete do Administrador',
  'Secretaria Geral', 
  'Departamento Administrativo',
  'Departamento de Obras Públicas',
  'Departamento de Saúde',
  'Departamento de Educação',
  'Departamento de Agricultura',
  'Departamento de Água e Saneamento',
  'Departamento de Segurança',
  'Departamento de Finanças',
  'Departamento de Cultura e Turismo',
  'Departamento de Assuntos Sociais'
];

export default function Organigrama() {
  const [members, setMembers] = useState<OrganigramaMember[]>([]);
  const [direcoes, setDirecoes] = useState<Direccao[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
    fetchDirecoes();
  }, []);

  const fetchDirecoes = async () => {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      setDirecoes(data || []);
    } catch (error) {
      console.error('Error fetching direcoes:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('organigrama')
        .select('*')
        .eq('ativo', true)
        .order('departamento', { ascending: true })
        .order('ordem', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
      
      // Expand first department by default
      if (data && data.length > 0) {
        setExpandedDepartments(new Set([data[0].departamento]));
      }
    } catch (error) {
      console.error('Error fetching organigrama:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = selectedDepartment === 'all' 
    ? members 
    : members.filter(member => member.departamento === selectedDepartment);

  const toggleDepartment = (department: string) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(department)) {
      newExpanded.delete(department);
    } else {
      newExpanded.add(department);
    }
    setExpandedDepartments(newExpanded);
  };

  const getSuperiorName = (superiorId: string | null) => {
    if (!superiorId) return null;
    const superior = members.find(member => member.id === superiorId);
    return superior ? superior.nome : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando organigrama...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Estrutura Organizacional
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça a equipe da Administração Municipal de Chipindo e os responsáveis 
            por cada área de atuação.
          </p>
        </div>

        {/* Filter */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Direcções</SelectItem>
                {direcoes.map((direccao) => (
                  <SelectItem key={direccao.id} value={direccao.nome}>
                    {direccao.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Organigrama */}
        <div className="space-y-6">
          {direcoes.map((direccao) => {
            const deptMembers = filteredMembers.filter(member => member.departamento === direccao.nome);
            if (deptMembers.length === 0) return null;

            const isExpanded = expandedDepartments.has(direccao.nome);

            return (
              <Card key={direccao.id} className="overflow-hidden">
                <div 
                  className="p-6 bg-primary/5 border-b cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => toggleDepartment(direccao.nome)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{direccao.nome}</h2>
                      <p className="text-sm text-muted-foreground">
                        {deptMembers.length} {deptMembers.length === 1 ? 'membro' : 'membros'}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {deptMembers.map((member) => (
                        <Card key={member.id} className="p-6 hover:shadow-lg transition-shadow">
                          <div className="space-y-4">
                            {/* Photo and Basic Info */}
                            <div className="flex items-start gap-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={member.foto_url || ''} alt={member.nome} />
                                <AvatarFallback className="text-lg">
                                  {member.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg text-foreground">
                                  {member.nome}
                                </h3>
                                <p className="text-primary font-medium">{member.cargo}</p>
                                {getSuperiorName(member.superior_id) && (
                                  <p className="text-sm text-muted-foreground">
                                    Reporta a: {getSuperiorName(member.superior_id)}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Description */}
                            {member.descricao && (
                              <div>
                                <h4 className="font-medium text-sm text-foreground mb-2">
                                  Responsabilidades:
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {member.descricao}
                                </p>
                              </div>
                            )}

                            {/* Contact Info */}
                            <div className="space-y-2">
                              {member.email && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <a 
                                    href={`mailto:${member.email}`}
                                    className="text-primary hover:underline"
                                  >
                                    {member.email}
                                  </a>
                                </div>
                              )}
                              {member.telefone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <a 
                                    href={`tel:${member.telefone}`}
                                    className="text-primary hover:underline"
                                  >
                                    {member.telefone}
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* Department Badge */}
                            <div className="pt-2">
                              <Badge variant="secondary" className="text-xs">
                                {member.departamento}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum membro encontrado
            </h3>
            <p className="text-muted-foreground">
              {selectedDepartment === 'all' 
                ? 'Não há membros cadastrados no organigrama.'
                : 'Nenhum membro encontrado para a direcção selecionada.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}