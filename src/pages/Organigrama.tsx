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
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'hierarchy'>('grid');
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
    let filtered = members.filter(member => {
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

                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <GridIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <ListIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'hierarchy' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('hierarchy')}
                      >
                        <UsersIcon className="w-4 h-4" />
                      </Button>
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
            ) : viewMode === 'hierarchy' ? (
              /* Hierarchical View */
              <div className="space-y-6">
                {directions.map(direction => {
                  const directionMembers = filteredMembers.filter(member => member.departamento === direction.nome);
                  if (directionMembers.length === 0) return null;

                  const isExpanded = expandedDirections.has(direction.nome);
                  const directionData = getDirectionData(direction.nome);
                  const IconComponent = directionData.icon;

                  return (
                    <Card key={direction.id} className="overflow-hidden">
                      <div 
                        className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-b cursor-pointer hover:from-primary/15 hover:to-primary/10 transition-all duration-300"
                        onClick={() => toggleDirection(direction.nome)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", directionData.color)}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold text-foreground">{direction.nome}</h2>
                              <p className="text-sm text-muted-foreground">
                                {directionMembers.length} {directionMembers.length === 1 ? 'membro' : 'membros'}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      {isExpanded && (
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {directionMembers
                              .sort((a, b) => {
                                const aLevel = getHierarchyLevel(a);
                                const bLevel = getHierarchyLevel(b);
                                if (aLevel !== bLevel) return aLevel - bLevel;
                                return a.ordem - b.ordem;
                              })
                              .map((member) => {
                                const hierarchyLevel = getHierarchyLevel(member);
                                return (
                                  <div 
                                    key={member.id}
                                    className={cn("ml-0", hierarchyLevel > 0 && `ml-${Math.min(hierarchyLevel * 8, 32)}`)}
                                  >
                                    <Card 
                                      className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                      onClick={() => setSelectedMember(member)}
                                    >
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                          <Avatar className="h-12 w-12">
                                            <AvatarImage src={member.foto_url || ''} alt={member.nome} />
                                            <AvatarFallback className="text-sm font-medium">
                                              {formatInitials(member.nome)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                              {member.nome}
                                            </h3>
                                            <p className="text-sm text-primary font-medium">{member.cargo}</p>
                                            {getSuperiorName(member.superior_id) && (
                                              <p className="text-xs text-muted-foreground">
                                                Reporta a: {getSuperiorName(member.superior_id)}
                                              </p>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <Badge variant="outline" className="text-xs">
                                              {hierarchyLevel === 0 ? 'Dirigente' : `Nível ${hierarchyLevel + 1}`}
                                            </Badge>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                );
                              })}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* Grid/List View */
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {filteredMembers.map((member) => {
                  const directionData = getDirectionData(member.departamento);
                  const IconComponent = directionData.icon;
                  const hierarchyLevel = getHierarchyLevel(member);
                  
                  return (
                    <Card 
                      key={member.id}
                      className={cn(
                        "group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                        viewMode === 'list' && "md:flex"
                      )}
                      onClick={() => setSelectedMember(member)}
                    >
                      <div className={cn(
                        "relative overflow-hidden",
                        viewMode === 'list' ? "md:w-64 flex-shrink-0" : ""
                      )}>
                        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative">
                          {member.foto_url ? (
                            <img 
                              src={member.foto_url} 
                              alt={member.nome}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className={cn("w-full h-full flex items-center justify-center", directionData.color)}>
                              <UserIcon className="w-12 h-12 text-white/80" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <Badge className={cn("absolute top-3 left-3", directionData.color, "text-white border-0")}>
                            <IconComponent className="w-3 h-3 mr-1" />
                            {member.departamento}
                          </Badge>
                          <Badge className="absolute top-3 right-3 bg-white/20 text-white border-white/30">
                            {hierarchyLevel === 0 ? 'Dirigente' : `Nível ${hierarchyLevel + 1}`}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-6">
                        <CardTitle className={cn(
                          "leading-tight group-hover:text-primary transition-colors duration-300 mb-2",
                          viewMode === 'list' ? "text-lg" : "text-xl"
                        )}>
                          {member.nome}
                        </CardTitle>
                        
                        <p className="text-primary font-medium mb-3">{member.cargo}</p>
                        
                        {member.descricao && (
                          <p className="text-muted-foreground mb-4 line-clamp-2">{member.descricao}</p>
                        )}

                        {getSuperiorName(member.superior_id) && (
                          <p className="text-sm text-muted-foreground mb-4">
                            <strong>Reporta a:</strong> {getSuperiorName(member.superior_id)}
                          </p>
                        )}
                        
                        <div className="space-y-2 mb-4">
                          {member.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <MailIcon className="w-4 h-4 text-muted-foreground" />
                              <a 
                                href={`mailto:${member.email}`}
                                className="text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {member.email}
                              </a>
                            </div>
                          )}
                          {member.telefone && (
                            <div className="flex items-center gap-2 text-sm">
                              <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                              <a 
                                href={`tel:${member.telefone}`}
                                className="text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {member.telefone}
                              </a>
                            </div>
                          )}
                        </div>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(member);
                          }}
                          className="w-full"
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </Card>
                  );
                })}
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