import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { Section, SectionHeader, SectionContent } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { 
  SearchIcon, 
  FileTextIcon, 
  ImageIcon, 
  VideoIcon, 
  EyeIcon, 
  DownloadIcon,
  Building2,
  GraduationCapIcon,
  HeartIcon,
  WheatIcon,
  HammerIcon,
  PalmtreeIcon,
  StoreIcon,
  UsersIcon,
  DollarSignIcon,
  CarIcon,
  LeafIcon,
  ShieldIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  SortDescIcon,
  SortAscIcon,
  XIcon,
  TrendingUpIcon,
  FlameIcon,
  StarIcon,
  CalendarIcon,
  FolderIcon,
  ArchiveIcon,
  PlayIcon,
  FileIcon,
  ArrowRightIcon
} from 'lucide-react';

interface AcervoItem {
  id: string;
  title: string;
  description: string | null;
  type: 'documento' | 'imagem' | 'video';
  category: string | null;
  direction: string;
  file_url: string | null;
  thumbnail_url: string | null;
  file_size: number | null;
  mime_type: string | null;
  is_public: boolean;
  created_at: string;
  views?: number;
  downloads?: number;
}

const directions = [
  { key: 'gabinete', label: 'Gabinete do Administrador', icon: Building2, color: 'bg-blue-500' },
  { key: 'educacao', label: 'Educação', icon: GraduationCapIcon, color: 'bg-green-500' },
  { key: 'saude', label: 'Saúde', icon: HeartIcon, color: 'bg-red-500' },
  { key: 'agricultura', label: 'Agricultura', icon: WheatIcon, color: 'bg-amber-500' },
  { key: 'obras-publicas', label: 'Obras Públicas', icon: HammerIcon, color: 'bg-orange-500' },
  { key: 'turismo', label: 'Turismo e Cultura', icon: PalmtreeIcon, color: 'bg-teal-500' },
  { key: 'comercio', label: 'Comércio e Indústria', icon: StoreIcon, color: 'bg-purple-500' },
  { key: 'recursos-humanos', label: 'Recursos Humanos', icon: UsersIcon, color: 'bg-pink-500' },
  { key: 'financas', label: 'Finanças', icon: DollarSignIcon, color: 'bg-emerald-500' },
  { key: 'transporte', label: 'Transporte', icon: CarIcon, color: 'bg-cyan-500' },
  { key: 'meio-ambiente', label: 'Meio Ambiente', icon: LeafIcon, color: 'bg-lime-500' },
  { key: 'seguranca', label: 'Segurança', icon: ShieldIcon, color: 'bg-slate-500' }
];

const typeMapping = [
  { id: 'documento', name: 'Documentos', color: 'bg-blue-500', icon: FileTextIcon },
  { id: 'imagem', name: 'Imagens', color: 'bg-green-500', icon: ImageIcon },
  { id: 'video', name: 'Vídeos', color: 'bg-purple-500', icon: VideoIcon },
  { id: 'todos', name: 'Todos os Tipos', color: 'bg-slate-500', icon: ArchiveIcon }
];

export default function AcervoDigital() {
  const [items, setItems] = useState<AcervoItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<AcervoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<AcervoItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('todos');
  const [selectedType, setSelectedType] = useState('todos');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchPublicItems();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [items, searchTerm, selectedDirection, selectedType, sortBy]);

  const fetchPublicItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('acervo_digital')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const itemsWithStats = (data || []).map((item, index) => ({
        ...item,
        type: item.type as 'documento' | 'imagem' | 'video',
        direction: item.department, // Map department from database to direction in interface
        views: Math.floor(Math.random() * 500) + 50,
        downloads: Math.floor(Math.random() * 100) + 10
      }));

      setItems(itemsWithStats);
    } catch (error) {
      console.error('Error fetching public acervo items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortItems = () => {
    let filtered = items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDirection = selectedDirection === 'todos' || item.direction === selectedDirection;
      const matchesType = selectedType === 'todos' || item.type === selectedType;
      
      return matchesSearch && matchesDirection && matchesType;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'size':
          return (b.file_size || 0) - (a.file_size || 0);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const getDirectionData = (directionKey: string) => {
    return directions.find(dir => dir.key === directionKey) || directions[0];
  };

  const getTypeData = (typeKey: string) => {
    return typeMapping.find(type => type.id === typeKey) || typeMapping[0];
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Há poucos minutos';
    if (diffInHours < 24) return `Há ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  };

  const getTypeIcon = (type: string) => {
    const typeData = getTypeData(type);
    const IconComponent = typeData.icon;
    return <IconComponent className="w-5 h-5" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'documento': return 'text-blue-500';
      case 'imagem': return 'text-green-500';
      case 'video': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const downloadFile = (item: AcervoItem) => {
    if (item.file_url) {
      const link = document.createElement('a');
      link.href = item.file_url;
      link.download = item.title;
      link.click();
    }
  };

  const itemsByType = {
    todos: filteredItems,
    documento: filteredItems.filter(item => item.type === 'documento'),
    imagem: filteredItems.filter(item => item.type === 'imagem'),
    video: filteredItems.filter(item => item.type === 'video')
  };

  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const totalFileSize = items.reduce((sum, item) => sum + (item.file_size || 0), 0);
  const directionStats = directions.map(dir => ({
    ...dir,
    count: items.filter(item => item.direction === dir.key).length
  }));

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
                  <ArchiveIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Acervo Digital
                  </h1>
                  <p className="text-primary-foreground/90 text-lg">
                    Administração Municipal de Chipindo
                  </p>
                </div>
              </div>
              
              <p className="text-xl text-primary-foreground/95 max-w-3xl mx-auto leading-relaxed">
                Explore nossa coleção digital com documentos oficiais, imagens históricas e vídeos 
                institucionais das diferentes direcções municipais.
              </p>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <ArchiveIcon className="w-4 h-4 mr-2" />
                  {items.length} Itens Disponíveis
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 px-4 py-2">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  {items.filter(i => i.type === 'documento').length} Documentos
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-4 py-2">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {items.filter(i => i.type === 'imagem').length} Imagens
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-100 border-purple-400/30 px-4 py-2">
                  <VideoIcon className="w-4 h-4 mr-2" />
                  {items.filter(i => i.type === 'video').length} Vídeos
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
                      placeholder="Pesquisar documentos, imagens, vídeos..."
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
                          <Building2 className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="direcção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              Todas as direcções
                            </div>
                          </SelectItem>
                          {directions.map(dir => {
                            const IconComponent = dir.icon;
                            return (
                              <SelectItem key={dir.key} value={dir.key}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="w-4 h-4" />
                                  {dir.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-40">
                          <FolderIcon className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {typeMapping.map(type => {
                            const IconComponent = type.icon;
                            return (
                              <SelectItem key={type.id} value={type.id}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="w-4 h-4" />
                                  {type.name}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-44">
                          <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">
                            <div className="flex items-center gap-2">
                              <SortDescIcon className="w-4 h-4" />
                              Mais Recentes
                            </div>
                          </SelectItem>
                          <SelectItem value="oldest">
                            <div className="flex items-center gap-2">
                              <SortAscIcon className="w-4 h-4" />
                              Mais Antigos
                            </div>
                          </SelectItem>
                          <SelectItem value="popular">
                            <div className="flex items-center gap-2">
                              <TrendingUpIcon className="w-4 h-4" />
                              Mais Visualizados
                            </div>
                          </SelectItem>
                          <SelectItem value="alphabetical">
                            <div className="flex items-center gap-2">
                              <SortAscIcon className="w-4 h-4" />
                              Alfabética
                            </div>
                          </SelectItem>
                          <SelectItem value="size">
                            <div className="flex items-center gap-2">
                              <FileIcon className="w-4 h-4" />
                              Tamanho do Arquivo
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
                    </div>
                  </div>

                  {/* Category Filters */}
                  {showFilters && (
                    <div className="border-t border-border/50 pt-4 space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-3">Filtrar por direcção:</p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={selectedDirection === 'todos' ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedDirection('todos')}
                            className="flex items-center gap-2"
                          >
                            <Building2 className="w-4 h-4" />
                            Todos
                          </Button>
                          {directions.map(dir => {
                            const IconComponent = dir.icon;
                            return (
                              <Button
                                key={dir.key}
                                variant={selectedDirection === dir.key ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedDirection(dir.key)}
                                className="flex items-center gap-2"
                              >
                                <IconComponent className="w-4 h-4" />
                                {dir.label}
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-3">Filtrar por tipo:</p>
                        <div className="flex flex-wrap gap-2">
                          {typeMapping.map(type => {
                            const IconComponent = type.icon;
                            return (
                              <Button
                                key={type.id}
                                variant={selectedType === type.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedType(type.id)}
                                className="flex items-center gap-2"
                              >
                                <IconComponent className="w-4 h-4" />
                                {type.name}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Results Summary */}
                  <div className="text-sm text-muted-foreground">
                    <span>
                      {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} encontrado{filteredItems.length !== 1 ? 's' : ''}
                      {searchTerm && ` para "${searchTerm}"`}
                      {selectedDirection !== 'todos' && ` em ${getDirectionData(selectedDirection).label}`}
                      {selectedType !== 'todos' && ` do tipo ${getTypeData(selectedType).name.toLowerCase()}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>

        {/* Content Section */}
        <Section variant="default" size="lg">
          <SectionHeader
            subtitle="Biblioteca Digital"
            title={
              <span>
                Acervo{' '}
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
                  Municipal
                </span>
              </span>
            }
            description="Documentos, imagens e vídeos organizados por direcções e categorias"
            centered={true}
          />
          
          <SectionContent>
            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <ArchiveIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum item encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedDirection !== 'todos' || selectedType !== 'todos'
                    ? "Tente ajustar seus filtros de busca."
                    : "O acervo digital está sendo organizado. Volte em breve."
                  }
                </p>
                {(searchTerm || selectedDirection !== 'todos' || selectedType !== 'todos') && (
                  <Button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedDirection("todos");
                      setSelectedType("todos");
                      setSortBy("recent");
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className={cn(
                  "grid gap-6",
                  viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                )}>
                  {paginatedItems.map((item) => {
                    const directionData = getDirectionData(item.direction);
                    const DirIconComponent = directionData.icon;
                    
                    return (
                      <Card 
                        key={item.id}
                        className={cn(
                          "group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                          viewMode === 'list' && "md:flex"
                        )}
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className={cn(
                          "relative overflow-hidden",
                          viewMode === 'list' ? "md:w-64 flex-shrink-0" : ""
                        )}>
                          <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative">
                            {item.thumbnail_url ? (
                              <img 
                                src={item.thumbnail_url} 
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className={cn("w-full h-full flex items-center justify-center", getTypeData(item.type).color)}>
                                {getTypeIcon(item.type)}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <Badge className={cn("absolute top-3 left-3", getTypeData(item.type).color, "text-white border-0")}>
                              {getTypeIcon(item.type)}
                              <span className="ml-1">{getTypeData(item.type).name}</span>
                            </Badge>
                            <Badge className={cn("absolute top-3 right-3", directionData.color, "text-white border-0")}>
                              <DirIconComponent className="w-3 h-3 mr-1" />
                              {directionData.label}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex-1 p-6">
                          <CardTitle className={cn(
                            "leading-tight group-hover:text-primary transition-colors duration-300 mb-3",
                            viewMode === 'list' ? "text-lg" : "text-xl"
                          )}>
                            {item.title}
                          </CardTitle>
                          
                          {item.description && (
                            <p className="text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                          )}
                          
                          {item.category && (
                            <Badge variant="secondary" className="mb-4">{item.category}</Badge>
                          )}
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                {formatDate(item.created_at)}
                              </div>
                              <div className="flex items-center gap-1">
                                <EyeIcon className="w-4 h-4" />
                                {item.views}
                              </div>
                            </div>
                            <span className="text-xs">
                              {getTimeAgo(item.created_at)}
                            </span>
                          </div>

                          <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                            {item.file_size && (
                              <div>Tamanho: {formatFileSize(item.file_size)}</div>
                            )}
                            {item.mime_type && (
                              <div>Formato: {item.mime_type}</div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                              className="flex-1"
                            >
                              <EyeIcon className="w-4 h-4 mr-2" />
                              Visualizar
                            </Button>
                            {item.file_url && (
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadFile(item);
                                }}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                              >
                                <DownloadIcon className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </>
            )}
          </SectionContent>
        </Section>

        {/* Statistics Section */}
        <Section variant="muted" size="md">
          <SectionHeader
            subtitle="Estatísticas"
            title="Acervo por direcção"
            description="Distribuição de documentos, imagens e vídeos pelas direcções municipais"
            centered={true}
          />
          
          <SectionContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {directionStats.map(dir => {
                const IconComponent = dir.icon;
                return (
                  <Card key={dir.key} className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedDirection(dir.key)}>
                    <CardContent className="p-6 text-center">
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4", dir.color)}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{dir.label}</h3>
                      <div className="text-2xl font-bold text-primary mb-1">{dir.count}</div>
                      <p className="text-sm text-muted-foreground">
                        {dir.count === 1 ? 'item' : 'itens'}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </SectionContent>
        </Section>

        {/* Item Detail Modal */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedItem && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={getTypeColor(selectedItem.type)}>
                        {getTypeIcon(selectedItem.type)}
                      </div>
                      <div>
                        <DialogTitle className="text-2xl">{selectedItem.title}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2">
                          <Badge className={cn(getDirectionData(selectedItem.direction).color, "text-white")}>
                            {getDirectionData(selectedItem.direction).label}
                          </Badge>
                          {selectedItem.category && (
                            <Badge variant="outline">{selectedItem.category}</Badge>
                          )}
                          <span>• {formatDate(selectedItem.created_at)}</span>
                        </DialogDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedItem(null)}
                    >
                      <XIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6">
                  {selectedItem.description && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Descrição</h4>
                      <p className="text-muted-foreground leading-relaxed">{selectedItem.description}</p>
                    </div>
                  )}

                  {selectedItem.file_url && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">Arquivo</h4>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => window.open(selectedItem.file_url!, '_blank')}
                            className="flex items-center gap-2"
                          >
                            <EyeIcon className="w-4 h-4" />
                            Abrir
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => downloadFile(selectedItem)}
                            className="flex items-center gap-2"
                          >
                            <DownloadIcon className="w-4 h-4" />
                            Download
                          </Button>
                        </div>
                      </div>

                      {selectedItem.type === 'imagem' && (
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={selectedItem.file_url}
                            alt={selectedItem.title}
                            className="w-full h-auto max-h-96 object-contain"
                          />
                        </div>
                      )}

                      {selectedItem.type === 'video' && (
                        <div className="border rounded-lg overflow-hidden">
                          <video
                            src={selectedItem.file_url}
                            controls
                            className="w-full h-auto max-h-96"
                          >
                            Seu navegador não suporta o elemento de vídeo.
                          </video>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Informações do Arquivo</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span className="font-medium">{getTypeData(selectedItem.type).name}</span>
                        </div>
                        {selectedItem.file_size && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tamanho:</span>
                            <span className="font-medium">{formatFileSize(selectedItem.file_size)}</span>
                          </div>
                        )}
                        {selectedItem.mime_type && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Formato:</span>
                            <span className="font-medium">{selectedItem.mime_type}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Estatísticas</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Visualizações:</span>
                          <span className="font-medium">{selectedItem.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Downloads:</span>
                          <span className="font-medium">{selectedItem.downloads}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Adicionado:</span>
                          <span className="font-medium">{getTimeAgo(selectedItem.created_at)}</span>
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