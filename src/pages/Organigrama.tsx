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
        <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl sm:rounded-2xl shadow-xl min-w-[160px] sm:min-w-[220px] border-2 border-primary-foreground/20 transition-all duration-200 active:scale-[0.98]">
          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 backdrop-blur-sm">
            <UsersIcon className="h-7 w-7 sm:h-10 sm:w-10" />
          </div>
          <h3 className="font-bold text-base sm:text-xl text-center leading-tight mb-1 sm:mb-2">{member.nome}</h3>
          <p className="text-xs sm:text-sm opacity-90 text-center">{member.cargo}</p>
        </div>
      );
    }

    return (
      <div
        className="group relative cursor-pointer flex flex-col items-center min-h-[44px] transition-all duration-200 active:scale-[0.98]"
        onClick={() => setSelectedMember(member)}
      >
        {/* Container da imagem circular - centralizada para as linhas conectarem */}
        <div className="relative mb-2 sm:mb-3">
          <div className="relative w-20 h-20 sm:w-28 md:w-32 sm:h-28 md:h-32 rounded-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 border-3 sm:border-4 border-primary-500 overflow-hidden">
            {/* Imagem do membro */}
            <Avatar className="w-full h-full rounded-full">
              <AvatarImage src={member.foto_url || ''} alt={member.nome} className="object-cover" />
              <AvatarFallback className="text-lg sm:text-2xl font-bold bg-gradient-to-br from-primary to-primary/80 text-white">
                {formatInitials(member.nome)}
              </AvatarFallback>
            </Avatar>

            {/* Overlay com informações implícitas */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-2 sm:p-3">
              <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight line-clamp-2 mb-0.5 sm:mb-1">
                {member.nome}
              </h4>
              <p className="text-white/90 text-[10px] sm:text-xs line-clamp-1 font-medium">
                {member.cargo}
              </p>
            </div>
          </div>

          {/* Badge de nível hierárquico (pequeno, no canto inferior direito da imagem) */}
          {hierarchyLevel === 0 && (
            <div className="absolute -bottom-1 -right-1 z-10">
              <Badge variant="secondary" className="text-[10px] sm:text-xs bg-yellow-500/90 text-yellow-100 border-yellow-400/30 px-1 sm:px-1.5 py-0.5 rounded-full shadow-md">
                Dirigente
              </Badge>
            </div>
          )}
        </div>

        {/* Informações abaixo da imagem - centralizadas */}
        <div className="flex flex-col items-center gap-0.5 sm:gap-1 text-center">
          {/* Nome do membro */}
          <h4 className="font-semibold text-xs sm:text-sm text-foreground leading-tight line-clamp-2 max-w-24 sm:max-w-32 truncate">
            {member.nome}
          </h4>

          {/* Cargo */}
          <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 max-w-24 sm:max-w-32 truncate">
            {member.cargo}
          </p>

          {/* Badge do departamento */}
          <Badge className={cn("text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm mt-0.5 sm:mt-1 transition-all duration-200", directionData.color, "text-white border-0")}>
            <IconComponent className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
            <span className="hidden sm:inline">{member.departamento}</span>
            <span className="sm:hidden">{member.departamento.split(' ').slice(0, 2).join(' ')}</span>
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
      descricao: "Representa a estrutura de nível mais alto da Administração Municipal.",
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
        <Section className="relative min-h-[280px] sm:min-h-[350px] md:min-h-[450px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden" size="lg">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

          <SectionContent>
            <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 relative z-10 py-4 sm:py-0">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-200">
                  <UsersIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-sm">
                    Organigrama
                    <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                      Municipal
                    </span>
                  </h1>
                </div>
              </div>

              <p className="text-base sm:text-lg md:text-xl text-blue-50/90 max-w-3xl mx-auto leading-relaxed font-light px-4 sm:px-0">
                Conheça a estrutura organizacional da nossa Administração Municipal
                e os responsáveis por cada área de actuação.
              </p>

              <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 flex-wrap pt-2 sm:pt-4 px-2 sm:px-0">
                <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm font-medium hover:bg-white/20 transition-all duration-200 active:scale-[0.98] min-h-[36px] sm:min-h-[40px]">
                  <UsersIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">{totalMembers} Membros da Equipe</span>
                  <span className="sm:hidden">{totalMembers} Membros</span>
                </Badge>
                <Badge className="bg-emerald-500/20 backdrop-blur-md text-emerald-100 border-emerald-400/30 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm font-medium hover:bg-emerald-500/30 transition-all duration-200 active:scale-[0.98] min-h-[36px] sm:min-h-[40px]">
                  <BuildingIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  {totalDirections} Direcções
                </Badge>
                <Badge className="bg-amber-500/20 backdrop-blur-md text-amber-100 border-amber-400/30 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm font-medium hover:bg-amber-500/30 transition-all duration-200 active:scale-[0.98] min-h-[36px] sm:min-h-[40px]">
                  <CrownIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  {totalLeaders} Dirigentes
                </Badge>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Search and Filters Section */}
        <Section variant="muted" size="md">
          <SectionContent>
            <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Main Search */}
                  <div className="relative">
                    <SearchIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                    <Input
                      type="text"
                      placeholder="Pesquisar por nome, cargo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 sm:pl-12 pr-4 h-12 text-base sm:text-lg border-2 border-border/50 focus:border-primary rounded-xl transition-all duration-200"
                    />
                  </div>

                  {/* Filters Row */}
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center justify-center gap-2 h-11 sm:h-10 min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
                      >
                        <FilterIcon className="w-4 h-4" />
                        Filtros
                        {showFilters && <XIcon className="w-4 h-4" />}
                      </Button>

                      <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                        <SelectTrigger className="w-full sm:w-48 h-11 sm:h-10 min-h-[44px] rounded-xl transition-all duration-200">
                          <BuildingIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <SelectValue placeholder="Direcção" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
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
                                <span className="truncate">{direction.nome}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-44 h-11 sm:h-10 min-h-[44px] rounded-xl transition-all duration-200">
                          <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
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
                          className="flex items-center gap-1.5 sm:gap-2 h-10 min-h-[44px] px-3 sm:px-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
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
                              className="flex items-center gap-1.5 sm:gap-2 h-10 min-h-[44px] px-3 sm:px-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
                            >
                              <IconComponent className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate max-w-[120px] sm:max-w-none">{direction.nome}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Results Summary */}
                  <div className="text-xs sm:text-sm text-muted-foreground">
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
            description="Conheça os responsáveis pelas diferentes áreas da Administração Municipal"
            centered={true}
          />

          <SectionContent>
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8 sm:py-12 md:py-16 px-4">
                <UsersIcon className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Nenhum membro encontrado</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
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
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-11 min-h-[44px] px-6 rounded-xl transition-all duration-200 active:scale-[0.98]"
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            ) : (
              /* Sempre mostrar a visualização hierárquica */
              <div className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl sm:rounded-2xl shadow-inner overflow-x-auto overflow-y-hidden min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-start sm:items-center justify-start sm:justify-center -mx-4 sm:mx-0 touch-pan-x">
                {rootMember && treeChildrenData.length > 0 ? (
                  <div className="w-max min-w-full h-full flex items-center justify-center py-4 sm:py-6 px-4 sm:px-8">
                    <Tree
                      lineWidth={'2px'}
                      lineColor={'#8b5cf6'}
                      lineBorderRadius={'12px'}
                      label={<OrgChartNode member={rootMember} />}
                    >
                      {treeChildrenData}
                    </Tree>
                  </div>
                ) : rootMember && treeChildrenData.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 md:py-16 px-4 w-full">
                    <UsersIcon className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Estrutura Hierárquica Simples</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                      Apenas o membro raiz foi encontrado. Adicione mais membros para visualizar a estrutura hierárquica completa.
                    </p>
                    <div className="flex justify-center">
                      <OrgChartNode member={rootMember} />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12 md:py-16 px-4 w-full">
                    <UsersIcon className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Organigrama não disponível</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                      Não foi possível carregar a estrutura do organigrama ou nenhum membro foi encontrado.
                    </p>
                    {members.length > 0 && (
                      <div className="text-xs sm:text-sm text-muted-foreground">
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {directionStats.map(direction => {
                const directionData = getDirectionData(direction.nome);
                const IconComponent = directionData.icon;

                return (
                  <Card
                    key={direction.id}
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer rounded-xl active:scale-[0.98] min-h-[44px]"
                    onClick={() => setSelectedDirection(direction.nome)}
                  >
                    <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                      <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 transition-all duration-200", directionData.color)}>
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-xs sm:text-sm leading-tight line-clamp-2">
                        {direction.nome}
                      </h3>
                      <div className="text-xl sm:text-2xl font-bold text-primary mb-0.5 sm:mb-1">{direction.memberCount}</div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {direction.memberCount === 1 ? 'membro' : 'membros'}
                      </p>
                      {direction.directorCount > 0 && (
                        <Badge variant="outline" className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
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
          <DialogContent className="w-full max-w-2xl h-[100dvh] sm:h-auto sm:max-h-[90vh] overflow-y-auto overscroll-contain rounded-none sm:rounded-xl p-4 sm:p-6">
            {selectedMember && (
              <>
                <DialogHeader className="space-y-3 sm:space-y-4">
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <Avatar className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0">
                        <AvatarImage src={selectedMember.foto_url || ''} alt={selectedMember.nome} />
                        <AvatarFallback className="text-base sm:text-lg">
                          {formatInitials(selectedMember.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <DialogTitle className="text-xl sm:text-2xl leading-tight line-clamp-2">{selectedMember.nome}</DialogTitle>
                        <DialogDescription className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                          <Badge className={cn(getDirectionData(selectedMember.departamento).color, "text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full")}>
                            <span className="truncate max-w-[120px] sm:max-w-none">{selectedMember.departamento}</span>
                          </Badge>
                          <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                            {getHierarchyLevel(selectedMember) === 0 ? 'Dirigente' : `Nível ${getHierarchyLevel(selectedMember) + 1}`}
                          </Badge>
                        </DialogDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMember(null)}
                      className="h-11 w-11 min-h-[44px] min-w-[44px] p-0 rounded-xl transition-all duration-200 active:scale-[0.98] flex-shrink-0"
                    >
                      <XIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">Cargo</h4>
                    <p className="text-primary font-medium text-base sm:text-lg">{selectedMember.cargo}</p>
                  </div>

                  {selectedMember.descricao && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">Responsabilidades</h4>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{selectedMember.descricao}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="p-3 sm:p-4 bg-muted/50 rounded-xl">
                      <h4 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Informações de Contacto</h4>
                      <div className="space-y-2 sm:space-y-3">
                        {selectedMember.email && (
                          <a
                            href={`mailto:${selectedMember.email}`}
                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 bg-background rounded-lg hover:bg-muted transition-all duration-200 active:scale-[0.98] min-h-[44px]"
                          >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <MailIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            </div>
                            <span className="text-primary text-sm sm:text-base truncate">{selectedMember.email}</span>
                          </a>
                        )}
                        {selectedMember.telefone && (
                          <a
                            href={`tel:${selectedMember.telefone}`}
                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 bg-background rounded-lg hover:bg-muted transition-all duration-200 active:scale-[0.98] min-h-[44px]"
                          >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                            </div>
                            <span className="text-primary text-sm sm:text-base">{selectedMember.telefone}</span>
                          </a>
                        )}
                        {!selectedMember.email && !selectedMember.telefone && (
                          <p className="text-muted-foreground text-sm">Nenhum contacto disponível</p>
                        )}
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-muted/50 rounded-xl">
                      <h4 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Estrutura Hierárquica</h4>
                      <div className="space-y-2 sm:space-y-2.5 text-sm">
                        <div className="flex justify-between items-center p-2 bg-background rounded-lg min-h-[40px]">
                          <span className="text-muted-foreground">Direcção:</span>
                          <span className="font-medium text-right truncate max-w-[50%]">{selectedMember.departamento}</span>
                        </div>
                        {getSuperiorName(selectedMember.superior_id) && (
                          <div className="flex justify-between items-center p-2 bg-background rounded-lg min-h-[40px]">
                            <span className="text-muted-foreground">Superior:</span>
                            <span className="font-medium text-right truncate max-w-[50%]">{getSuperiorName(selectedMember.superior_id)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center p-2 bg-background rounded-lg min-h-[40px]">
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