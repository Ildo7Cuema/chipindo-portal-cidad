import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { Section, SectionHeader, SectionContent } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { 
  UsersIcon, 
  SearchIcon, 
  MailIcon, 
  PhoneIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  SortDescIcon,
  SortAscIcon,
  XIcon,
  StarIcon,
  TrendingUpIcon,
  FlameIcon,
  EyeIcon,
  BuildingIcon,
  UserIcon,
  CrownIcon,
  ShieldIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  HeartIcon,
  HammerIcon
} from 'lucide-react';
import { Tree, TreeNode } from 'react-organizational-chart';

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
  created_at?: string;
  updated_at?: string;
}

interface Direccao {
  id: string;
  nome: string;
  descricao: string | null;
  codigo: string | null;
  ativo: boolean;
  ordem: number;
  created_at?: string;
  updated_at?: string;
}

const directionIcons = {
  'Gabinete do Administrador': { icon: CrownIcon, color: 'bg-purple-500' },
  'Secretaria Geral': { icon: ShieldIcon, color: 'bg-blue-500' },
  'Departamento Administrativo': { icon: BriefcaseIcon, color: 'bg-green-500' },
  'Departamento de Obras Públicas': { icon: HammerIcon, color: 'bg-orange-500' },
  'Departamento de Saúde': { icon: HeartIcon, color: 'bg-red-500' },
  'Departamento de Educação': { icon: GraduationCapIcon, color: 'bg-indigo-500' },
  'Departamento de Agricultura': { icon: UsersIcon, color: 'bg-emerald-500' },
  'Departamento de Água e Saneamento': { icon: UsersIcon, color: 'bg-cyan-500' },
  'Departamento de Segurança': { icon: ShieldIcon, color: 'bg-gray-600' },
  'Departamento de Finanças': { icon: BriefcaseIcon, color: 'bg-yellow-500' },
  'Departamento de Cultura e Turismo': { icon: StarIcon, color: 'bg-pink-500' },
  'Departamento de Assuntos Sociais': { icon: HeartIcon, color: 'bg-teal-500' }
};

export default function Organigrama() {
  const [members, setMembers] = useState<OrganigramaMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<OrganigramaMember[]>([]);
  const [directions, setDirections] = useState<Direccao[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<OrganigramaMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('todos');
  const [sortBy, setSortBy] = useState('direction');
  // Removido: const [viewMode, setViewMode] = useState<'grid' | 'list' | 'hierarchy'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedDirections, setExpandedDirections] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([fetchMembers(), fetchDirections()]);
  }, []);

  useEffect(() => {
    filterAndSortMembers();
  }, [members, searchTerm, selectedDirection, sortBy]);

  const fetchDirections = async () => {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      setDirections(data || []);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organigrama')
        .select('*')
        .eq('ativo', true)
        .order('departamento', { ascending: true })
        .order('ordem', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
      
      // Expand first direction by default
      if (data && data.length > 0) {
        setExpandedDirections(new Set([data[0].departamento]));
      }
    } catch (error) {
      console.error('Error fetching organigrama:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMembers = () => {
    const filtered = members.filter(member => {
      const matchesSearch = member.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (member.descricao && member.descricao.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDirection = selectedDirection === 'todos' || member.departamento === selectedDirection;
      
      return matchesSearch && matchesDirection;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'direction':
          if (a.departamento !== b.departamento) {
            return a.departamento.localeCompare(b.departamento);
          }
          return a.ordem - b.ordem;
        case 'name':
          return a.nome.localeCompare(b.nome);
        case 'position':
          return a.cargo.localeCompare(b.cargo);
        case 'hierarchy':
          // Sort by hierarchy: those without superior first, then by order
          if (!a.superior_id && b.superior_id) return -1;
          if (a.superior_id && !b.superior_id) return 1;
          return a.ordem - b.ordem;
        default:
          return 0;
      }
    });

    setFilteredMembers(filtered);
  };

  const toggleDirection = (direction: string) => {
    const newExpanded = new Set(expandedDirections);
    if (newExpanded.has(direction)) {
      newExpanded.delete(direction);
    } else {
      newExpanded.add(direction);
    }
    setExpandedDirections(newExpanded);
  };

  const getSuperiorName = (superiorId: string | null) => {
    if (!superiorId) return null;
    const superior = members.find(member => member.id === superiorId);
    return superior ? superior.nome : null;
  };

  const getDirectionData = (directionName: string) => {
    return directionIcons[directionName as keyof typeof directionIcons] || 
           { icon: BuildingIcon, color: 'bg-gray-500' };
  };

  const getHierarchyLevel = (member: OrganigramaMember): number => {
    if (!member.superior_id) return 0;
    const superior = members.find(m => m.id === member.superior_id);
    if (!superior) return 1;
    return 1 + getHierarchyLevel(superior);
  };

  const getDirectionStats = () => {
    return directions.map(direction => ({
      ...direction,
      memberCount: members.filter(member => member.departamento === direction.nome).length,
      directorCount: members.filter(member => 
        member.departamento === direction.nome && !member.superior_id
      ).length
    }));
  };

  const formatInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Componente de Nó Profissional para o Organograma
  const OrgChartNode = ({ member }: { member: OrganigramaMember }) => {
    const directionData = getDirectionData(member.departamento);
    const IconComponent = directionData.icon;
    const hierarchyLevel = getHierarchyLevel(member);

    // Nó raiz virtual
    if (member.id === "virtual-root") {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl shadow-xl min-w-[220px] border-2 border-primary-foreground/20">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <UsersIcon className="h-10 w-10" />
          </div>
          <h3 className="font-bold text-xl text-center leading-tight mb-2">{member.nome}</h3>
          <p className="text-sm opacity-90 text-center">{member.cargo}</p>
        </div>
      );
    }

    return (
      <div 
        className="group relative cursor-pointer flex flex-col items-center"
        onClick={() => setSelectedMember(member)}
      >
        {/* Container da imagem circular - centralizada para as linhas conectarem */}
        <div className="relative mb-3">
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 border-4 border-primary-500 overflow-hidden">
            {/* Imagem do membro */}
            <Avatar className="w-full h-full rounded-full">
              <AvatarImage src={member.foto_url || ''} alt={member.nome} className="object-cover" />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/80 text-white">
                {formatInitials(member.nome)}
              </AvatarFallback>
            </Avatar>
            
            {/* Overlay com informações implícitas */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <h4 className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">
                {member.nome}
              </h4>
              <p className="text-white/90 text-xs line-clamp-1 font-medium">
                {member.cargo}
              </p>
            </div>
          </div>

          {/* Badge de nível hierárquico (pequeno, no canto inferior direito da imagem) */}
          {hierarchyLevel === 0 && (
            <div className="absolute -bottom-1 -right-1 z-10">
              <Badge variant="secondary" className="text-xs bg-yellow-500/90 text-yellow-100 border-yellow-400/30 px-1.5 py-0.5 rounded-full shadow-md">
                Dirigente
              </Badge>
            </div>
          )}
        </div>

        {/* Informações abaixo da imagem - centralizadas */}
        <div className="flex flex-col items-center gap-1 text-center">
          {/* Nome do membro */}
          <h4 className="font-semibold text-sm text-foreground leading-tight line-clamp-2 max-w-32">
            {member.nome}
          </h4>
          
          {/* Cargo */}
          <p className="text-xs text-muted-foreground line-clamp-1 max-w-32">
            {member.cargo}
          </p>
          
          {/* Badge do departamento */}
          <Badge className={cn("text-xs px-2 py-1 rounded-full shadow-sm mt-1", directionData.color, "text-white border-0")}>
            <IconComponent className="w-3 h-3 mr-1" />
            {member.departamento}
          </Badge>
        </div>
      </div>
    );
  };

  // Função para construir a estrutura de árvore do organograma
  const buildOrgChartNodes = (membersList: OrganigramaMember[], parentId: string | null) => {
    const nodes: React.ReactNode[] = [];
    const directReports = membersList.filter(member => member.superior_id === parentId);

    directReports.sort((a, b) => a.ordem - b.ordem);

    for (const member of directReports) {
      const children = buildOrgChartNodes(membersList, member.id);
      nodes.push(
        <TreeNode key={member.id} label={<OrgChartNode member={member} />}>
          {children}
        </TreeNode>
      );
    }
    return nodes;
  };

  // Encontrar membros de nível superior
  const topLevelMembers = members.filter(m => !m.superior_id);

  let rootMember: OrganigramaMember | null = null;
  let treeChildrenData: React.ReactNode[] = [];

  // Debug: Log para verificar os dados
  console.log('Members:', members);
  console.log('Top level members:', topLevelMembers);

  if (topLevelMembers.length === 1) {
    // Se há um único membro de nível superior, esse é nosso raiz
    rootMember = topLevelMembers[0];
    treeChildrenData = buildOrgChartNodes(members, rootMember.id);
    console.log('Single root member:', rootMember);
  } else if (topLevelMembers.length > 1) {
    // Se há múltiplos membros de nível superior, criar um raiz virtual
    rootMember = {
      id: "virtual-root",
      nome: "Administração Municipal",
      cargo: "Estrutura Organizacional",
      departamento: "Nível Superior",
      superior_id: null,
      email: null,
      telefone: null,
      descricao: "Representa a estrutura de nível mais alto da administração municipal.",
      foto_url: null,
      ordem: 0,
      ativo: true,
    };
    // Todos os membros de nível superior se tornam filhos diretos do raiz virtual
    treeChildrenData = buildOrgChartNodes(members, null);
    console.log('Virtual root created:', rootMember);
  } else if (members.length > 0) {
    // Fallback se nenhum raiz explícito for encontrado
    console.warn("No explicit root member found. Creating virtual root.");
    rootMember = {
      id: "virtual-root",
      nome: "Estrutura Sem Raiz Clara",
      cargo: "Organograma",
      departamento: "Nível Superior",
      superior_id: null,
      email: null,
      telefone: null,
      descricao: "Não foi possível determinar uma raiz clara para o organograma.",
      foto_url: null,
      ordem: 0,
      ativo: true,
    };
    treeChildrenData = buildOrgChartNodes(members, null);
    console.log('Fallback virtual root created:', rootMember);
  }

  console.log('Tree children data:', treeChildrenData);

  const directionStats = getDirectionStats();
  const totalMembers = members.length;
  const totalDirections = directions.length;
  const totalLeaders = members.filter(m => !m.superior_id).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Section variant="primary" size="lg">
            <SectionContent>
              <div className="text-center space-y-6">
                <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
                <Skeleton className="h-12 w-96 mx-auto" />
                <Skeleton className="h-6 w-64 mx-auto" />
                <div className="flex justify-center gap-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </SectionContent>
          </Section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Section variant="primary" size="lg">
          <SectionContent>
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                  <UsersIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Organigrama Municipal
                  </h1>
                  <p className="text-primary-foreground/90 text-lg">
                    Administração Municipal de Chipindo
                  </p>
                </div>
              </div>
              
              <p className="text-xl text-primary-foreground/95 max-w-3xl mx-auto leading-relaxed">
                Conheça a estrutura organizacional da nossa administração municipal 
                e os responsáveis por cada área de actuação.
              </p>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  {totalMembers} Membros da Equipe
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-4 py-2">
                  <BuildingIcon className="w-4 h-4 mr-2" />
                  {totalDirections} Direcções
                </Badge>
                <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30 px-4 py-2">
                  <CrownIcon className="w-4 h-4 mr-2" />
                  {totalLeaders} Dirigentes
                </Badge>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Search and Filters Section */}
        <Section variant="muted" size="md">
          <SectionContent>
            <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Main Search */}
                  <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Pesquisar por nome, cargo ou responsabilidades..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-3 text-lg border-2 border-border/50 focus:border-primary"
                    />
                  </div>

                  {/* Filters Row */}
                  <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-3 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                      >
                        <FilterIcon className="w-4 h-4" />
                        Filtros
                        {showFilters && <XIcon className="w-4 h-4" />}
                      </Button>
                      
                      <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                        <SelectTrigger className="w-48">
                          <BuildingIcon className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Direcção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">
                            <div className="flex items-center gap-2">
                              <BuildingIcon className="w-4 h-4" />
                              Todas as Direcções
                            </div>
                          </SelectItem>
                          {directions.map(direction => (
                            <SelectItem key={direction.id} value={direction.nome}>
                              <div className="flex items-center gap-2">
                                {(() => {
                                  const IconComponent = getDirectionData(direction.nome).icon;
                                  return <IconComponent className="w-4 h-4" />;
                                })()}
                                {direction.nome}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-44">
                          <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direction">
                            <div className="flex items-center gap-2">
                              <SortDescIcon className="w-4 h-4" />
                              Por Direcção
                            </div>
                          </SelectItem>
                          <SelectItem value="name">
                            <div className="flex items-center gap-2">
                              <SortAscIcon className="w-4 h-4" />
                              Por Nome
                            </div>
                          </SelectItem>
                          <SelectItem value="position">
                            <div className="flex items-center gap-2">
                              <BriefcaseIcon className="w-4 h-4" />
                              Por Cargo
                            </div>
                          </SelectItem>
                          <SelectItem value="hierarchy">
                            <div className="flex items-center gap-2">
                              <TrendingUpIcon className="w-4 h-4" />
                              Por Hierarquia
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Removido: Botões de alternância de visualização */}
                  </div>

                  {/* Direction Filters */}
                  {showFilters && (
                    <div className="border-t border-border/50 pt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-3">Filtrar por direcção:</p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={selectedDirection === 'todos' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDirection('todos')}
                          className="flex items-center gap-2"
                        >
                          <BuildingIcon className="w-4 h-4" />
                          Todas
                        </Button>
                        {directions.map(direction => {
                          const IconComponent = getDirectionData(direction.nome).icon;
                          return (
                            <Button
                              key={direction.id}
                              variant={selectedDirection === direction.nome ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedDirection(direction.nome)}
                              className="flex items-center gap-2"
                            >
                              <IconComponent className="w-4 h-4" />
                              {direction.nome}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Results Summary */}
                  <div className="text-sm text-muted-foreground">
                    <span>
                      {filteredMembers.length} membro{filteredMembers.length !== 1 ? 's' : ''} encontrado{filteredMembers.length !== 1 ? 's' : ''}
                      {searchTerm && ` para "${searchTerm}"`}
                      {selectedDirection !== 'todos' && ` em ${selectedDirection}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>

        {/* Members Section */}
        <Section variant="default" size="lg">
          <SectionHeader
            subtitle="Equipe Municipal"
            title={
              <span>
                Estrutura{' '}
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
                  Organizacional
                </span>
              </span>
            }
            description="Conheça os responsáveis pelas diferentes áreas da administração municipal"
            centered={true}
          />
          
          <SectionContent>
            {filteredMembers.length === 0 ? (
              <div className="text-center py-16">
                <UsersIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum membro encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedDirection !== 'todos'
                    ? "Tente ajustar seus filtros de busca."
                    : "O organigrama está sendo estruturado. Volte em breve."
                  }
                </p>
                {(searchTerm || selectedDirection !== 'todos') && (
                  <Button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedDirection("todos");
                      setSortBy("direction");
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            ) : (
              /* Sempre mostrar a visualização hierárquica */
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-inner overflow-x-auto min-h-[600px] flex items-center justify-center">
                {rootMember && treeChildrenData.length > 0 ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tree 
                      lineWidth={'3px'}
                      lineColor={'#8b5cf6'}
                      lineBorderRadius={'15px'}
                      label={<OrgChartNode member={rootMember} />}
                    >
                      {treeChildrenData}
                    </Tree>
                  </div>
                ) : rootMember && treeChildrenData.length === 0 ? (
                  <div className="text-center py-16">
                    <UsersIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Estrutura Hierárquica Simples</h3>
                    <p className="text-muted-foreground mb-6">
                      Apenas o membro raiz foi encontrado. Adicione mais membros para visualizar a estrutura hierárquica completa.
                    </p>
                    <div className="flex justify-center">
                      <OrgChartNode member={rootMember} />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <UsersIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Organigrama não disponível</h3>
                    <p className="text-muted-foreground mb-6">
                      Não foi possível carregar a estrutura do organigrama ou nenhum membro foi encontrado.
                    </p>
                    {members.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <p>Membros encontrados: {members.length}</p>
                        <p>Membros de nível superior: {topLevelMembers.length}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </SectionContent>
        </Section>

        {/* Statistics Section */}
        <Section variant="muted" size="md">
          <SectionHeader
            subtitle="Estatísticas"
            title="Distribuição por Direcção"
            description="Visão geral da estrutura organizacional e distribuição de membros"
            centered={true}
          />
          
          <SectionContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {directionStats.map(direction => {
                const directionData = getDirectionData(direction.nome);
                const IconComponent = directionData.icon;
                
                return (
                  <Card 
                    key={direction.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedDirection(direction.nome)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4", directionData.color)}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 text-sm leading-tight">
                        {direction.nome}
                      </h3>
                      <div className="text-2xl font-bold text-primary mb-1">{direction.memberCount}</div>
                      <p className="text-sm text-muted-foreground">
                        {direction.memberCount === 1 ? 'membro' : 'membros'}
                      </p>
                      {direction.directorCount > 0 && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {direction.directorCount} dirigente{direction.directorCount !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </SectionContent>
        </Section>

        {/* Member Detail Modal */}
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedMember && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedMember.foto_url || ''} alt={selectedMember.nome} />
                        <AvatarFallback className="text-lg">
                          {formatInitials(selectedMember.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <DialogTitle className="text-2xl">{selectedMember.nome}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2">
                          <Badge className={cn(getDirectionData(selectedMember.departamento).color, "text-white")}>
                            {selectedMember.departamento}
                          </Badge>
                          <Badge variant="outline">
                            {getHierarchyLevel(selectedMember) === 0 ? 'Dirigente' : `Nível ${getHierarchyLevel(selectedMember) + 1}`}
                          </Badge>
                        </DialogDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMember(null)}
                    >
                      <XIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Cargo</h4>
                    <p className="text-primary font-medium text-lg">{selectedMember.cargo}</p>
                  </div>

                  {selectedMember.descricao && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Responsabilidades</h4>
                      <p className="text-muted-foreground leading-relaxed">{selectedMember.descricao}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Informações de Contacto</h4>
                      <div className="space-y-3">
                        {selectedMember.email && (
                          <div className="flex items-center gap-2">
                            <MailIcon className="w-4 h-4 text-muted-foreground" />
                            <a 
                              href={`mailto:${selectedMember.email}`}
                              className="text-primary hover:underline"
                            >
                              {selectedMember.email}
                            </a>
                          </div>
                        )}
                        {selectedMember.telefone && (
                          <div className="flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                            <a 
                              href={`tel:${selectedMember.telefone}`}
                              className="text-primary hover:underline"
                            >
                              {selectedMember.telefone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Estrutura Hierárquica</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Direcção:</span>
                          <span className="font-medium">{selectedMember.departamento}</span>
                        </div>
                        {getSuperiorName(selectedMember.superior_id) && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Superior:</span>
                            <span className="font-medium">{getSuperiorName(selectedMember.superior_id)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nível:</span>
                          <span className="font-medium">
                            {getHierarchyLevel(selectedMember) === 0 ? 'Dirigente' : `Nível ${getHierarchyLevel(selectedMember) + 1}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
}