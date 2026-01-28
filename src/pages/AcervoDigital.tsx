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
import { useAcervoViews } from '@/hooks/useAcervoViews';
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
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MaximizeIcon
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
  views?: number; // Contagem real de visualizações
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
  const [itemsPerPage] = useState(12);

  // Estados para carrossel e visualização
  const [carouselItems, setCarouselItems] = useState<AcervoItem[]>([]);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);
  const [fullscreenItem, setFullscreenItem] = useState<AcervoItem | null>(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Hook para visualizações do acervo
  const { registerView, getViewsCount, isLoading: viewsLoading } = useAcervoViews();

  useEffect(() => {
    fetchPublicItems();
  }, []);

  // Função para registrar visualização
  const handleItemView = async (itemId: string) => {
    try {
      await registerView(itemId);

      // Actualizar a contagem de visualizações no item
      const updatedViews = await getViewsCount(itemId);
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? { ...item, views: updatedViews }
            : item
        )
      );
      setFilteredItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? { ...item, views: updatedViews }
            : item
        )
      );
    } catch (error) {
      console.error('Erro ao registrar visualização do acervo:', error);
    }
  };

  const fetchPublicItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('acervo_digital')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Buscar visualizações reais para cada item
      const itemsWithViews = await Promise.all(
        (data || []).map(async (item) => {
          // Buscar contagem de visualizações
          let viewsCount = 0;
          try {
            const { data: viewsData, error: viewsError } = await supabase
              .from('acervo_views' as any)
              .select('id', { count: 'exact' })
              .eq('acervo_id', item.id);

            if (!viewsError && viewsData) {
              viewsCount = viewsData.length;
            }
          } catch (error) {
            console.error('Erro ao buscar visualizações do acervo:', error);
          }

          return {
            ...item,
            type: item.type as 'documento' | 'imagem' | 'video',
            direction: item.department, // Mapear department para direction
            views: viewsCount
          };
        })
      );

      setItems(itemsWithViews);
      setFilteredItems(itemsWithViews);
    } catch (error) {
      console.error('Error fetching public acervo items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterAndSortItems();
  }, [items, searchTerm, selectedDirection, selectedType, sortBy]);

  // Registrar visualização quando modal é aberto
  useEffect(() => {
    if (selectedItem) {
      handleItemView(selectedItem.id);
    }
  }, [selectedItem]);

  // Navegação por teclado para carrossel e modais
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showCarousel) {
          closeCarousel();
        }
        if (isFullscreenOpen) {
          closeFullscreen();
        }
      }

      // Navegação do carrossel com setas
      if (showCarousel && carouselItems.length > 0) {
        if (event.key === 'ArrowLeft') {
          prevCarouselItem();
        }
        if (event.key === 'ArrowRight') {
          nextCarouselItem();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showCarousel, carouselItems.length, isFullscreenOpen]);

  const filterAndSortItems = () => {
    const filtered = items.filter(item => {
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
    switch (type) {
      case 'documento': return <FileTextIcon className="w-8 h-8" />;
      case 'imagem': return <ImageIcon className="w-8 h-8" />;
      case 'video': return <VideoIcon className="w-8 h-8" />;
      default: return <FileTextIcon className="w-8 h-8" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'documento': return 'bg-blue-500';
      case 'imagem': return 'bg-green-500';
      case 'video': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // Função para gerar thumbnail automático
  const getThumbnailUrl = (item: AcervoItem) => {
    if (item.type === 'imagem' && item.file_url) {
      return item.file_url;
    }

    if (item.thumbnail_url) {
      return item.thumbnail_url;
    }

    return null;
  };

  // Função para verificar se é uma imagem válida
  const isValidImage = (url: string) => {
    return url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
  };

  // Função para verificar se é um vídeo válido
  const isValidVideo = (url: string) => {
    return url.match(/\.(mp4|avi|mov|webm|mkv)$/i);
  };

  // Função para verificar se URL é válido
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Função para debug de URLs
  const debugFileUrl = (item: AcervoItem) => {
    console.log('Debug file URL:', {
      id: item.id,
      title: item.title,
      type: item.type,
      file_url: item.file_url,
      thumbnail_url: item.thumbnail_url,
      is_valid_url: item.file_url ? isValidUrl(item.file_url) : false,
      is_valid_image: item.file_url ? isValidImage(item.file_url) : false,
      is_valid_video: item.file_url ? isValidVideo(item.file_url) : false
    });
  };

  const downloadFile = (item: AcervoItem) => {
    if (item.file_url) {
      const link = document.createElement('a');
      link.href = item.file_url;
      link.download = item.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Funções para o carrossel
  const openCarousel = (items: AcervoItem[], startIndex: number = 0) => {
    setCarouselItems(items);
    setCurrentCarouselIndex(startIndex);
    setShowCarousel(true);
  };

  const closeCarousel = () => {
    setShowCarousel(false);
    setCarouselItems([]);
    setCurrentCarouselIndex(0);
  };

  const nextCarouselItem = () => {
    setCurrentCarouselIndex((prev) =>
      prev === carouselItems.length - 1 ? 0 : prev + 1
    );
  };

  const prevCarouselItem = () => {
    setCurrentCarouselIndex((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
  };

  const openFullscreen = (item: AcervoItem) => {
    setFullscreenItem(item);
    setIsFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
    setFullscreenItem(null);
  };

  // Função para obter itens de mídia (imagens e vídeos) para o carrossel
  const getMediaItems = () => {
    return filteredItems.filter(item =>
      (item.type === 'imagem' || item.type === 'video') &&
      item.file_url &&
      isValidUrl(item.file_url)
    );
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
              <div className="text-center space-y-4 md:space-y-6 px-4">
                <Skeleton className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl mx-auto" />
                <Skeleton className="h-8 md:h-12 w-48 md:w-96 mx-auto rounded-xl" />
                <Skeleton className="h-4 md:h-6 w-40 md:w-64 mx-auto rounded-lg" />
                <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
                  <Skeleton className="h-8 w-20 md:w-32 rounded-xl" />
                  <Skeleton className="h-8 w-20 md:w-32 rounded-xl" />
                  <Skeleton className="h-8 w-20 md:w-32 rounded-xl" />
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
            <div className="text-center space-y-4 md:space-y-6 px-4 md:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-xl transition-all duration-200">
                  <ArchiveIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white transition-all duration-200">
                    Acervo Digital
                  </h1>
                  <p className="text-primary-foreground/90 text-sm md:text-lg">
                    Administração Municipal de Chipindo
                  </p>
                </div>
              </div>

              <p className="text-base md:text-xl text-primary-foreground/95 max-w-3xl mx-auto leading-relaxed px-2">
                Explore nossa coleção digital com documentos oficiais, imagens históricas e vídeos
                institucionais das diferentes direcções municipais.
              </p>

              <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                <Badge className="bg-white/20 text-white border-white/30 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-xl transition-all duration-200 active:scale-[0.98]">
                  <ArchiveIcon className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                  {items.length} Itens
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-xl transition-all duration-200 active:scale-[0.98]">
                  <FileTextIcon className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                  {items.filter(i => i.type === 'documento').length} Docs
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-xl transition-all duration-200 active:scale-[0.98]">
                  <ImageIcon className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                  {items.filter(i => i.type === 'imagem').length} Imgs
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-100 border-purple-400/30 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-xl transition-all duration-200 active:scale-[0.98]">
                  <VideoIcon className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                  {items.filter(i => i.type === 'video').length} Vídeos
                </Badge>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Search and Filters Section */}
        <Section variant="muted" size="md">
          <SectionContent>
            <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4 md:space-y-6">
                  {/* Main Search */}
                  <div className="relative">
                    <SearchIcon className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Pesquisar documentos, imagens, vídeos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 md:pl-12 pr-4 h-12 text-base md:text-lg border-2 border-border/50 focus:border-primary rounded-xl transition-all duration-200"
                    />
                  </div>

                  {/* Filters Row */}
                  <div className="flex flex-col gap-4">
                    {/* Mobile: Stack vertically, Desktop: Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 items-stretch lg:items-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center justify-center gap-2 h-11 min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
                      >
                        <FilterIcon className="w-4 h-4" />
                        Filtros
                        {showFilters && <XIcon className="w-4 h-4" />}
                      </Button>

                      <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                        <SelectTrigger className="w-full lg:w-48 h-11 min-h-[44px] rounded-xl transition-all duration-200">
                          <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                          <SelectValue placeholder="Direcção" />
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
                        <SelectTrigger className="w-full lg:w-40 h-11 min-h-[44px] rounded-xl transition-all duration-200">
                          <FolderIcon className="w-4 h-4 mr-2 flex-shrink-0" />
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
                        <SelectTrigger className="w-full lg:w-44 h-11 min-h-[44px] rounded-xl transition-all duration-200">
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

                    {/* View Mode and Carousel */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className="h-9 w-9 p-0 rounded-lg transition-all duration-200 active:scale-[0.98]"
                        >
                          <GridIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="h-9 w-9 p-0 rounded-lg transition-all duration-200 active:scale-[0.98]"
                        >
                          <ListIcon className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Botão do Carrossel */}
                      {getMediaItems().length > 0 && (
                        <Button
                          onClick={() => openCarousel(getMediaItems())}
                          className="flex items-center gap-2 h-11 min-h-[44px] px-4 md:px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg transition-all duration-200 active:scale-[0.98]"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">Carrossel</span>
                          <span className="text-white/80">({getMediaItems().length})</span>
                        </Button>
                      )}
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
                            onClick={() => setSelectedDirection('todos')}
                            className="flex items-center gap-2 h-10 min-h-[44px] px-3 rounded-xl transition-all duration-200 active:scale-[0.98]"
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
                                onClick={() => setSelectedDirection(dir.key)}
                                className="flex items-center gap-2 h-10 min-h-[44px] px-3 rounded-xl transition-all duration-200 active:scale-[0.98]"
                              >
                                <IconComponent className="w-4 h-4" />
                                <span className="hidden sm:inline">{dir.label}</span>
                                <span className="sm:hidden">{dir.label.split(' ')[0]}</span>
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
                                onClick={() => setSelectedType(type.id)}
                                className="flex items-center gap-2 h-10 min-h-[44px] px-3 rounded-xl transition-all duration-200 active:scale-[0.98]"
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
                  <div className="text-xs md:text-sm text-muted-foreground px-1">
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
              <div className="text-center py-12 md:py-16 px-4">
                <ArchiveIcon className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Nenhum item encontrado</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-6">
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
                    className="h-11 min-h-[44px] px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 active:scale-[0.98]"
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className={cn(
                  "grid gap-4 md:gap-6",
                  viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                )}>
                  {paginatedItems.map((item) => {
                    const directionData = getDirectionData(item.direction);
                    const DirIconComponent = directionData.icon;

                    return (
                      <Card
                        key={item.id}
                        className={cn(
                          "group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 rounded-xl active:scale-[0.98]",
                          viewMode === 'list' && "md:flex"
                        )}
                        onClick={async () => {
                          await handleItemView(item.id);
                          setSelectedItem(item);
                        }}
                      >
                        <div className={cn(
                          "relative overflow-hidden",
                          viewMode === 'list' ? "md:w-48 lg:w-64 flex-shrink-0" : ""
                        )}>
                          <div className="aspect-video h-40 sm:h-44 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative group-hover:scale-105 transition-transform duration-200 overflow-hidden">
                            {(() => {
                              // Debug do item para identificar problemas
                              debugFileUrl(item);

                              // Verificar se temos um URL válido
                              if (!item.file_url || !isValidUrl(item.file_url)) {
                                return (
                                  <div className={cn("w-full h-full flex items-center justify-center", getTypeColor(item.type))}>
                                    <div className="text-center">
                                      {getTypeIcon(item.type)}
                                      <p className="text-xs text-gray-500 mt-1">URL inválido</p>
                                    </div>
                                  </div>
                                );
                              }

                              // Para imagens
                              if (item.type === 'imagem' && isValidImage(item.file_url)) {
                                return (
                                  <div className="relative w-full h-full group">
                                    <img
                                      src={item.file_url}
                                      alt={item.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      onError={(e) => {
                                        console.error('Erro ao carregar imagem:', item.file_url);
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                          const fallback = document.createElement('div');
                                          fallback.className = `w-full h-full flex items-center justify-center ${getTypeColor(item.type)}`;
                                          fallback.innerHTML = `
                                            <div class="text-center">
                                              <svg class="w-8 h-8 text-white mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                              </svg>
                                              <p class="text-xs text-white mt-1">Erro ao carregar</p>
                                            </div>
                                          `;
                                          parent.appendChild(fallback);
                                        }
                                      }}
                                      onLoad={() => {
                                        console.log('Imagem carregada com sucesso:', item.file_url);
                                      }}
                                    />
                                    {/* Botões de ação para imagens */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                      <div className="flex gap-2">
                                        <Button
                                          variant="secondary"
                                          className="w-10 h-10 md:w-11 md:h-11 min-h-[44px] p-0 bg-white/90 text-black hover:bg-white rounded-xl transition-all duration-200 active:scale-[0.98]"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openFullscreen(item);
                                          }}
                                        >
                                          <MaximizeIcon className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          variant="secondary"
                                          className="w-10 h-10 md:w-11 md:h-11 min-h-[44px] p-0 bg-white/90 text-black hover:bg-white rounded-xl transition-all duration-200 active:scale-[0.98]"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            downloadFile(item);
                                          }}
                                        >
                                          <DownloadIcon className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }

                              // Para vídeos
                              if (item.type === 'video' && isValidVideo(item.file_url)) {
                                return (
                                  <div className="relative w-full h-full group">
                                    <video
                                      src={item.file_url}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      muted
                                      preload="metadata"
                                      onError={(e) => {
                                        console.error('Erro ao carregar vídeo:', item.file_url);
                                        const target = e.target as HTMLVideoElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                          const fallback = document.createElement('div');
                                          fallback.className = `w-full h-full flex items-center justify-center ${getTypeColor(item.type)}`;
                                          fallback.innerHTML = `
                                            <div class="text-center">
                                              <svg class="w-8 h-8 text-white mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z"/>
                                              </svg>
                                              <p class="text-xs text-white mt-1">Erro ao carregar</p>
                                            </div>
                                          `;
                                          parent.appendChild(fallback);
                                        }
                                      }}
                                      onLoadedMetadata={() => {
                                        console.log('Vídeo carregado com sucesso:', item.file_url);
                                      }}
                                    />
                                    {/* Overlay com ícone de play */}
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                                      <div className="w-11 h-11 md:w-14 md:h-14 bg-white/90 rounded-xl md:rounded-full flex items-center justify-center transition-all duration-200">
                                        <PlayIcon className="w-5 h-5 md:w-6 md:h-6 text-black ml-0.5" />
                                      </div>
                                    </div>
                                    {/* Botões de ação para vídeos */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                      <div className="flex gap-2">
                                        <Button
                                          variant="secondary"
                                          className="w-10 h-10 md:w-11 md:h-11 min-h-[44px] p-0 bg-white/90 text-black hover:bg-white rounded-xl transition-all duration-200 active:scale-[0.98]"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openFullscreen(item);
                                          }}
                                        >
                                          <MaximizeIcon className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          variant="secondary"
                                          className="w-10 h-10 md:w-11 md:h-11 min-h-[44px] p-0 bg-white/90 text-black hover:bg-white rounded-xl transition-all duration-200 active:scale-[0.98]"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            downloadFile(item);
                                          }}
                                        >
                                          <DownloadIcon className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }

                              // Para documentos ou outros tipos
                              if (item.thumbnail_url && isValidUrl(item.thumbnail_url)) {
                                return (
                                  <img
                                    src={item.thumbnail_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                      console.error('Erro ao carregar thumbnail:', item.thumbnail_url);
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent) {
                                        const fallback = document.createElement('div');
                                        fallback.className = `w-full h-full flex items-center justify-center ${getTypeColor(item.type)}`;
                                        fallback.innerHTML = `
                                          <div class="text-center">
                                            ${getTypeIcon(item.type).props.children}
                                            <p class="text-xs text-white mt-1">Sem preview</p>
                                          </div>
                                        `;
                                        parent.appendChild(fallback);
                                      }
                                    }}
                                  />
                                );
                              }

                              // Fallback para ícone
                              return (
                                <div className={cn("w-full h-full flex items-center justify-center", getTypeColor(item.type))}>
                                  <div className="text-center">
                                    {getTypeIcon(item.type)}
                                    <p className="text-xs text-white mt-1">Sem preview</p>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Overlay sutil com informações essenciais */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Badge de tipo - mais sutil */}
                            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Badge className={cn("text-xs", getTypeData(item.type).color, "text-white border-0 bg-black/50 backdrop-blur-sm")}>
                                {getTypeIcon(item.type)}
                              </Badge>
                            </div>

                            {/* Indicador de visualizações - sutil */}
                            {item.views && item.views > 0 && (
                              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Badge className="text-xs bg-black/50 backdrop-blur-sm text-white border-0">
                                  <EyeIcon className="w-3 h-3 mr-1" />
                                  {item.views}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 p-3 md:p-4">
                          {/* Título - mais proeminente */}
                          <CardTitle className={cn(
                            "leading-tight group-hover:text-primary transition-colors duration-200 mb-2 line-clamp-2",
                            viewMode === 'list' ? "text-sm md:text-base" : "text-base md:text-lg"
                          )}>
                            {item.title}
                          </CardTitle>

                          {/* Informações essenciais em uma linha */}
                          <div className="flex items-center gap-2 md:gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {formatDate(item.created_at)}
                            </span>
                            {item.category && (
                              <span className="text-primary/70 truncate max-w-[100px]">{item.category}</span>
                            )}
                          </div>

                          {/* Botões de ação - touch-friendly */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                              className="flex-1 text-xs h-10 min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
                            >
                              <EyeIcon className="w-4 h-4 mr-1" />
                              Ver
                            </Button>
                            {item.file_url && (
                              <Button
                                variant="default"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadFile(item);
                                }}
                                className="flex-1 text-xs h-10 min-h-[44px] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl transition-all duration-200 active:scale-[0.98]"
                              >
                                <DownloadIcon className="w-4 h-4 mr-1" />
                                Baixar
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
                  <div className="flex items-center justify-center gap-1 md:gap-2 mt-8 md:mt-12 px-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="h-10 md:h-11 min-h-[44px] px-3 md:px-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      <ChevronLeftIcon className="w-4 h-4 md:mr-1" />
                      <span className="hidden md:inline">Anterior</span>
                    </Button>

                    <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] md:max-w-none">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        // Show limited pages on mobile
                        const shouldShow = totalPages <= 5 || 
                          page === 1 || 
                          page === totalPages || 
                          Math.abs(page - currentPage) <= 1;
                        
                        if (!shouldShow && page === 2 && currentPage > 3) {
                          return <span key={page} className="px-1 text-muted-foreground">...</span>;
                        }
                        if (!shouldShow && page === totalPages - 1 && currentPage < totalPages - 2) {
                          return <span key={page} className="px-1 text-muted-foreground">...</span>;
                        }
                        if (!shouldShow) return null;

                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            onClick={() => setCurrentPage(page)}
                            className="w-10 h-10 md:w-11 md:h-11 min-h-[44px] p-0 rounded-xl transition-all duration-200 active:scale-[0.98]"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="h-10 md:h-11 min-h-[44px] px-3 md:px-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      <span className="hidden md:inline">Próxima</span>
                      <ChevronRightIcon className="w-4 h-4 md:ml-1" />
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
              {directionStats.map(dir => {
                const IconComponent = dir.icon;
                return (
                  <Card 
                    key={dir.key} 
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer rounded-xl active:scale-[0.98]"
                    onClick={() => setSelectedDirection(dir.key)}
                  >
                    <CardContent className="p-3 md:p-4 lg:p-6 text-center">
                      <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4 transition-all duration-200", dir.color)}>
                        <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 md:mb-2 text-xs md:text-sm lg:text-base line-clamp-2">{dir.label}</h3>
                      <div className="text-xl md:text-2xl font-bold text-primary mb-0.5 md:mb-1">{dir.count}</div>
                      <p className="text-xs md:text-sm text-muted-foreground">
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
          <DialogContent className="max-w-4xl w-[95vw] md:w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-xl md:rounded-2xl p-4 md:p-6 scroll-smooth">
            {selectedItem && (
              <>
                <DialogHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={cn("p-2 rounded-xl flex-shrink-0", getTypeColor(selectedItem.type))}>
                        {getTypeIcon(selectedItem.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <DialogTitle className="text-lg md:text-xl line-clamp-2">{selectedItem.title}</DialogTitle>
                        <DialogDescription className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs md:text-sm mt-1">
                          <Badge className={cn(getDirectionData(selectedItem.direction).color, "text-white text-xs rounded-lg")}>
                            {getDirectionData(selectedItem.direction).label}
                          </Badge>
                          {selectedItem.category && (
                            <Badge variant="outline" className="text-xs rounded-lg">{selectedItem.category}</Badge>
                          )}
                          <span className="hidden sm:inline">• {formatDate(selectedItem.created_at)}</span>
                          {selectedItem.views && selectedItem.views > 0 && (
                            <span className="hidden sm:inline">• {selectedItem.views} visualizações</span>
                          )}
                        </DialogDescription>
                        <div className="flex sm:hidden items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{formatDate(selectedItem.created_at)}</span>
                          {selectedItem.views && selectedItem.views > 0 && (
                            <span>• {selectedItem.views} views</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedItem(null)}
                      className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto h-10 w-10 min-h-[44px] p-0 rounded-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      <XIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  {/* Descrição - apenas se existir */}
                  {selectedItem.description && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Descrição</h4>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{selectedItem.description}</p>
                    </div>
                  )}

                  {/* Visualização do arquivo - foco principal */}
                  {selectedItem.file_url && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <h4 className="font-semibold text-foreground text-sm md:text-base">Arquivo</h4>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            onClick={() => window.open(selectedItem.file_url!, '_blank')}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-11 min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
                          >
                            <EyeIcon className="w-4 h-4" />
                            Abrir
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => downloadFile(selectedItem)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-11 min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
                          >
                            <DownloadIcon className="w-4 h-4" />
                            Download
                          </Button>
                        </div>
                      </div>

                      {/* Visualização do arquivo - foco na imagem/vídeo */}
                      {selectedItem.type === 'imagem' && selectedItem.file_url && isValidImage(selectedItem.file_url) && (
                        <div className="border rounded-xl overflow-hidden">
                          <img
                            src={selectedItem.file_url}
                            alt={selectedItem.title}
                            className="w-full h-auto max-h-64 md:max-h-96 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = 'w-full h-48 flex items-center justify-center bg-gray-100 border rounded-xl';
                                fallback.innerHTML = '<div class="text-center"><svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg><p class="text-sm text-gray-500">Imagem não disponível</p></div>';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                      )}

                      {selectedItem.type === 'video' && selectedItem.file_url && (
                        <div className="border rounded-xl overflow-hidden">
                          <video
                            src={selectedItem.file_url}
                            controls
                            className="w-full h-auto max-h-64 md:max-h-96"
                            preload="metadata"
                          >
                            Seu navegador não suporta o elemento de vídeo.
                          </video>
                        </div>
                      )}

                      {selectedItem.type === 'documento' && selectedItem.file_url && (
                        <div className="border rounded-xl overflow-hidden bg-gray-50 p-4 md:p-6">
                          <div className="text-center">
                            <FileTextIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                            <h5 className="font-semibold text-gray-700 mb-2 text-sm md:text-base line-clamp-2">{selectedItem.title}</h5>
                            <p className="text-xs md:text-sm text-gray-500 mb-4">
                              {selectedItem.mime_type && `Formato: ${selectedItem.mime_type}`}
                              {selectedItem.file_size && ` • Tamanho: ${formatFileSize(selectedItem.file_size)}`}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                              <Button
                                onClick={() => window.open(selectedItem.file_url!, '_blank')}
                                className="flex items-center justify-center gap-2 h-11 min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
                              >
                                <EyeIcon className="w-4 h-4" />
                                Abrir Documento
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => downloadFile(selectedItem)}
                                className="flex items-center justify-center gap-2 h-11 min-h-[44px] rounded-xl transition-all duration-200 active:scale-[0.98]"
                              >
                                <DownloadIcon className="w-4 h-4" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Informações técnicas - mais compactas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="bg-muted/30 p-3 md:p-4 rounded-xl">
                      <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Informações do Arquivo</h4>
                      <div className="space-y-1.5 text-xs md:text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span className="font-medium">{getTypeData(selectedItem.type).name}</span>
                        </div>
                        {selectedItem.mime_type && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Formato:</span>
                            <span className="font-medium truncate max-w-[150px]">{selectedItem.mime_type}</span>
                          </div>
                        )}
                        {selectedItem.file_size && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tamanho:</span>
                            <span className="font-medium">{formatFileSize(selectedItem.file_size)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-muted/30 p-3 md:p-4 rounded-xl">
                      <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Metadados</h4>
                      <div className="space-y-1.5 text-xs md:text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data:</span>
                          <span className="font-medium">{formatDate(selectedItem.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Direcção:</span>
                          <span className="font-medium truncate max-w-[150px]">{getDirectionData(selectedItem.direction).label}</span>
                        </div>
                        {selectedItem.views && selectedItem.views > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Visualizações:</span>
                            <span className="font-medium">{selectedItem.views}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>

      {/* Modal do Carrossel */}
      {showCarousel && carouselItems.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Botão de fechar */}
            <Button
              variant="ghost"
              onClick={closeCarousel}
              className="absolute top-3 right-3 md:top-4 md:right-4 z-10 w-11 h-11 md:w-12 md:h-12 min-h-[44px] p-0 bg-white/20 text-white hover:bg-white/30 rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              <XIcon className="w-5 h-5 md:w-6 md:h-6" />
            </Button>

            {/* Botões de navegação */}
            <Button
              variant="ghost"
              onClick={prevCarouselItem}
              className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-10 w-11 h-14 md:w-14 md:h-16 min-h-[44px] p-0 bg-white/20 text-white hover:bg-white/30 rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8" />
            </Button>

            <Button
              variant="ghost"
              onClick={nextCarouselItem}
              className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 w-11 h-14 md:w-14 md:h-16 min-h-[44px] p-0 bg-white/20 text-white hover:bg-white/30 rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8" />
            </Button>

            {/* Conteúdo do carrossel */}
            <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
              <div className="max-w-4xl max-h-full w-full">
                {(() => {
                  const currentItem = carouselItems[currentCarouselIndex];

                  if (currentItem.type === 'imagem' && currentItem.file_url) {
                    return (
                      <div className="relative w-full h-full">
                        <img
                          src={currentItem.file_url}
                          alt={currentItem.title}
                          className="w-full h-auto max-h-[70vh] md:max-h-[80vh] object-contain mx-auto rounded-lg"
                        />
                        {/* Informações da imagem */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white p-3 md:p-4 rounded-b-lg">
                          <h3 className="text-sm md:text-lg font-semibold line-clamp-1">{currentItem.title}</h3>
                          {currentItem.description && (
                            <p className="text-xs md:text-sm text-gray-300 mt-1 line-clamp-2 hidden sm:block">{currentItem.description}</p>
                          )}
                          <div className="flex items-center gap-2 md:gap-4 mt-1.5 md:mt-2 text-[10px] md:text-xs text-gray-300 flex-wrap">
                            <span className="truncate max-w-[100px] md:max-w-none">{getDirectionData(currentItem.direction).label}</span>
                            <span className="hidden sm:inline">{formatDate(currentItem.created_at)}</span>
                            {currentItem.views && currentItem.views > 0 && (
                              <span>{currentItem.views} views</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (currentItem.type === 'video' && currentItem.file_url) {
                    return (
                      <div className="relative w-full h-full">
                        <video
                          src={currentItem.file_url}
                          controls
                          className="w-full h-auto max-h-[70vh] md:max-h-[80vh] mx-auto rounded-lg"
                          autoPlay
                        >
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                        {/* Informações do vídeo */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white p-3 md:p-4 rounded-b-lg">
                          <h3 className="text-sm md:text-lg font-semibold line-clamp-1">{currentItem.title}</h3>
                          {currentItem.description && (
                            <p className="text-xs md:text-sm text-gray-300 mt-1 line-clamp-2 hidden sm:block">{currentItem.description}</p>
                          )}
                          <div className="flex items-center gap-2 md:gap-4 mt-1.5 md:mt-2 text-[10px] md:text-xs text-gray-300 flex-wrap">
                            <span className="truncate max-w-[100px] md:max-w-none">{getDirectionData(currentItem.direction).label}</span>
                            <span className="hidden sm:inline">{formatDate(currentItem.created_at)}</span>
                            {currentItem.views && currentItem.views > 0 && (
                              <span>{currentItem.views} views</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })()}
              </div>
            </div>

            {/* Indicadores - Touch-friendly */}
            <div className="absolute bottom-16 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 md:gap-2 max-w-[80%] overflow-x-auto py-2 px-3">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCarouselIndex(index)}
                  className={cn(
                    "w-2.5 h-2.5 md:w-3 md:h-3 min-w-[10px] rounded-full transition-all duration-200 flex-shrink-0",
                    index === currentCarouselIndex 
                      ? "bg-white scale-110" 
                      : "bg-white/50 hover:bg-white/70"
                  )}
                />
              ))}
            </div>

            {/* Contador */}
            <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/50 text-white text-xs md:text-sm px-3 py-1.5 rounded-lg backdrop-blur-sm">
              {currentCarouselIndex + 1} / {carouselItems.length}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização em Tela Cheia */}
      <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
        <DialogContent className="max-w-7xl w-[95vw] md:w-full max-h-[95vh] md:max-h-[90vh] p-0 overflow-hidden rounded-xl md:rounded-2xl">
          {fullscreenItem && (
            <div className="relative w-full h-full">
              {/* Botão de fechar */}
              <Button
                variant="ghost"
                onClick={closeFullscreen}
                className="absolute top-3 right-3 md:top-4 md:right-4 z-10 w-11 h-11 md:w-12 md:h-12 min-h-[44px] p-0 bg-black/50 text-white hover:bg-black/70 rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                <XIcon className="w-5 h-5 md:w-6 md:h-6" />
              </Button>

              {/* Conteúdo */}
              <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
                {fullscreenItem.type === 'imagem' && fullscreenItem.file_url && (
                  <img
                    src={fullscreenItem.file_url}
                    alt={fullscreenItem.title}
                    className="w-full h-auto max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg"
                  />
                )}

                {fullscreenItem.type === 'video' && fullscreenItem.file_url && (
                  <video
                    src={fullscreenItem.file_url}
                    controls
                    className="w-full h-auto max-h-[70vh] md:max-h-[80vh] rounded-lg"
                    autoPlay
                  >
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                )}
              </div>

              {/* Informações */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white p-3 md:p-4">
                <h3 className="text-sm md:text-lg font-semibold line-clamp-1">{fullscreenItem.title}</h3>
                {fullscreenItem.description && (
                  <p className="text-xs md:text-sm text-gray-300 mt-1 line-clamp-2 hidden sm:block">{fullscreenItem.description}</p>
                )}
                <div className="flex items-center gap-2 md:gap-4 mt-1.5 md:mt-2 text-[10px] md:text-xs text-gray-300 flex-wrap">
                  <span className="truncate max-w-[120px] md:max-w-none">{getDirectionData(fullscreenItem.direction).label}</span>
                  <span className="hidden sm:inline">{formatDate(fullscreenItem.created_at)}</span>
                  {fullscreenItem.views && fullscreenItem.views > 0 && (
                    <span>{fullscreenItem.views} views</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}