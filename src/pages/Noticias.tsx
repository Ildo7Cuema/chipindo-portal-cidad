import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNewsLikes } from "@/hooks/useNewsLikes";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  SearchIcon,
  EyeIcon,
  TrendingUpIcon,
  StarIcon,
  ShareIcon,
  XIcon,
  BookOpenIcon,
  UsersIcon,
  Building2Icon,
  MessageSquareIcon,
  TreePineIcon as TreeIcon,
  NewspaperIcon as NewsIcon,
  HeartIcon,
  FilterIcon,
  SortDescIcon,
  SortAscIcon,
  InfoIcon,
  CopyIcon,
  CheckCircle,
  AlertCircle,
  ZapIcon,
  GlobeIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author_id: string;
  published: boolean;
  featured: boolean;
  image_url?: string;
  images?: string[];
  featured_image_index?: number;
  created_at: string;
  updated_at: string;
  category?: string;
  views?: number;
  author_name?: string;
  likes?: number;
}

const categoryMapping = [
  {
    id: 'desenvolvimento',
    name: 'Desenvolvimento',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: TrendingUpIcon
  },
  {
    id: 'educacao',
    name: 'Educação',
    color: 'bg-green-500',
    bgColor: 'bg-green-50 text-green-700 border-green-200',
    icon: BookOpenIcon
  },
  {
    id: 'saude',
    name: 'Saúde',
    color: 'bg-red-500',
    bgColor: 'bg-red-50 text-red-700 border-red-200',
    icon: UsersIcon
  },
  {
    id: 'obras',
    name: 'Obras Públicas',
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: Building2Icon
  },
  {
    id: 'turismo',
    name: 'Turismo',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: StarIcon
  },
  {
    id: 'agricultura',
    name: 'Agricultura',
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: TreeIcon
  },
  {
    id: 'cultura',
    name: 'Cultura',
    color: 'bg-pink-500',
    bgColor: 'bg-pink-50 text-pink-700 border-pink-200',
    icon: MessageSquareIcon
  },
  {
    id: 'todos',
    name: 'Todas as Categorias',
    color: 'bg-slate-500',
    bgColor: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: NewsIcon
  }
];

const Noticias = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "popular" | "alphabetical">("recent");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const isMobile = useIsMobile();
  const { likedNews, newsLikes, handleLike: handleLikeNews, isLoading: isLiking } = useNewsLikes();

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterAndSortNews();
  }, [news, searchTerm, selectedCategory, sortBy]);

  const fetchNews = async () => {
    try {
      setLoading(true);

      // Buscar notícias reais do banco de dados
      const { data, error } = await supabase
        .from('news')
        .select('id, title, excerpt, content, author_id, published, featured, image_url, images, featured_image_index, created_at, updated_at')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar notícias:', error);
        toast.error('Erro ao carregar notícias');
        return;
      }

      // Processar notícias com dados adicionais
      const newsWithData = await Promise.all(
        (data || []).map(async (item, index) => {
          // Buscar contagem de visualizações
          let viewsCount = 0;
          try {
            const { data: viewsData, error: viewsError } = await supabase
              .from('news_views')
              .select('id')
              .eq('news_id', item.id);

            if (!viewsError && viewsData) {
              viewsCount = viewsData.length;
            }
          } catch (error) {
            console.error('Erro ao buscar visualizações:', error);
          }

          // Usar contagem de curtidas do hook
          const likesCount = newsLikes[item.id] || 0;

          // Buscar nome do autor
          let authorName = 'Administração Municipal';
          if (item.author_id) {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', item.author_id)
                .single();

              if (!profileError && profileData?.full_name) {
                authorName = profileData.full_name;
              }
            } catch (error) {
              console.error('Erro ao buscar perfil do autor:', error);
            }
          }

          return {
            ...item,
            category: getCategoryByIndex(index),
            views: viewsCount,
            likes: likesCount,
            author_name: authorName
          };
        })
      );

      setNews(newsWithData);

      console.log('Notícias carregadas do banco:', newsWithData.length);

    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Erro ao carregar notícias do banco de dados');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryByIndex = (index: number) => {
    const categories = ['desenvolvimento', 'educacao', 'saude', 'obras', 'turismo', 'agricultura', 'cultura'];
    return categories[index % categories.length];
  };

  const filterAndSortNews = () => {
    const filtered = news.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
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
        default:
          return 0;
      }
    });

    setFilteredNews(filtered);
    setCurrentPage(1);
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
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'agora mesmo';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d atrás`;
    return `${Math.floor(diffInSeconds / 2592000)}m atrás`;
  };

  const getCategoryData = (categoryId: string) => {
    return categoryMapping.find(cat => cat.id === categoryId) || categoryMapping[0];
  };

  const shareNews = (newsItem: NewsItem) => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.title,
        text: newsItem.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  const handleLike = async (newsId: string) => {
    await handleLikeNews(newsId);
  };

  const registerView = async (newsId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase
        .from('news_views')
        .insert({
          news_id: newsId,
          user_id: user?.id || null,
          ip_address: 'client-ip', // Simplificado
          user_agent: navigator.userAgent
        });

      // Recarregar notícias para atualizar contadores
      fetchNews();
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  };

  // Paginação
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />

      {/* Enhanced Hero Section - Mobile First */}
      <section className="relative min-h-[480px] md:min-h-[560px] lg:min-h-[600px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

        {/* Floating Elements - Optimized for performance */}
        <div className="absolute top-16 left-4 md:top-20 md:left-10 w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-4 md:top-40 md:right-20 w-20 h-20 md:w-32 md:h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-16 left-1/4 w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-500 hidden sm:block"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 md:w-20 md:h-20 bg-purple-400/15 rounded-full blur-xl animate-pulse delay-1500 hidden md:block"></div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-10 md:py-16 lg:py-20">
          <div className="text-center space-y-6 md:space-y-8">
            {/* Header with Enhanced Icon - Mobile Optimized */}
            <div className="flex flex-col items-center gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 lg:w-28 md:h-24 lg:h-28 bg-gradient-to-br from-white/25 to-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl transition-transform duration-300 active:scale-95">
                  <NewsIcon className="w-10 h-10 md:w-12 lg:w-14 md:h-12 lg:h-14 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-7 h-7 md:w-9 lg:w-10 md:h-9 lg:h-10 bg-green-400 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-center gap-2 mb-2 md:mb-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-xs md:text-sm font-medium tracking-wide uppercase">Atualizado</span>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight">
                  Notícias e
                  <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Comunicados
                  </span>
                </h1>
                <p className="text-blue-100 text-base md:text-lg lg:text-xl font-medium">
                  Município de Chipindo
                </p>
              </div>
            </div>

            {/* Enhanced Description - Mobile Optimized */}
            <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 animate-slide-up animation-delay-300">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-50/90 leading-relaxed font-light tracking-wide drop-shadow-sm px-2">
                Fique a par das <span className="font-medium text-white">últimas notícias</span>, comunicados e desenvolvimentos
                do <span className="font-medium text-white">Município de Chipindo</span> com informações atualizadas e transparentes.
              </p>

              {/* News Stats Preview - 2x2 Grid on Mobile */}
              <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-3 md:gap-4 px-2 md:px-0">
                <div className="group relative">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 hover:bg-white/20 transition-all duration-300 active:scale-[0.98] md:hover:scale-105 h-full">
                    <div className="flex items-center gap-2.5 md:gap-3">
                      <div className="w-9 h-9 md:w-10 md:h-10 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        <NewsIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="text-sm md:text-sm font-semibold text-white truncate">{news.length} Notícias</div>
                        <div className="text-blue-100 text-[10px] md:text-xs">Total disponível</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 hover:bg-white/20 transition-all duration-300 active:scale-[0.98] md:hover:scale-105 h-full">
                    <div className="flex items-center gap-2.5 md:gap-3">
                      <div className="w-9 h-9 md:w-10 md:h-10 bg-yellow-500/30 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        <StarIcon className="w-4 h-4 md:w-5 md:h-5 text-yellow-100" />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="text-sm md:text-sm font-semibold text-white truncate">{news.filter(item => item.featured).length} Destaques</div>
                        <div className="text-blue-100 text-[10px] md:text-xs">Notícias importantes</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 hover:bg-white/20 transition-all duration-300 active:scale-[0.98] md:hover:scale-105 h-full">
                    <div className="flex items-center gap-2.5 md:gap-3">
                      <div className="w-9 h-9 md:w-10 md:h-10 bg-green-500/30 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        <GlobeIcon className="w-4 h-4 md:w-5 md:h-5 text-green-100" />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="text-sm md:text-sm font-semibold text-white truncate">7 Categorias</div>
                        <div className="text-blue-100 text-[10px] md:text-xs">Temas organizados</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 hover:bg-white/20 transition-all duration-300 active:scale-[0.98] md:hover:scale-105 h-full">
                    <div className="flex items-center gap-2.5 md:gap-3">
                      <div className="w-9 h-9 md:w-10 md:h-10 bg-purple-500/30 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        <BellIcon className="w-4 h-4 md:w-5 md:h-5 text-purple-100" />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="text-sm md:text-sm font-semibold text-white truncate">Tempo Real</div>
                        <div className="text-blue-100 text-[10px] md:text-xs">Atualizações constantes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action - Mobile Optimized */}
              <div className="pt-4 md:pt-8">
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-white/80 text-xs md:text-sm px-2">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full"></div>
                    <span>Informações Oficiais</span>
                  </div>
                  <div className="w-1 h-1 bg-white/40 rounded-full hidden sm:block"></div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full"></div>
                    <span>Transparência Total</span>
                  </div>
                  <div className="w-1 h-1 bg-white/40 rounded-full hidden sm:block"></div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-400 rounded-full"></div>
                    <span>Atualizações Regulares</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1">
        <Section variant="default" size="lg">
          <SectionContent>
            {/* Filtros e Busca - Mobile First com Touch Targets grandes */}
            <div className="space-y-3 md:space-y-0 md:flex md:flex-row md:gap-4 mb-6 md:mb-8">
              {/* Campo de pesquisa - Full width com altura touch-friendly */}
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 md:w-4 md:h-4 pointer-events-none" />
                <Input
                  placeholder="Pesquisar notícias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 md:pl-10 h-12 md:h-10 text-base md:text-sm rounded-xl md:rounded-lg border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              {/* Selects em linha no mobile para economizar espaço vertical */}
              <div className="flex gap-3 md:gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="flex-1 md:w-48 h-12 md:h-10 text-base md:text-sm rounded-xl md:rounded-lg border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <FilterIcon className="w-4 h-4 text-muted-foreground md:hidden" />
                      <SelectValue placeholder="Categoria" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl md:rounded-lg">
                    {categoryMapping.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id}
                        className="py-3 md:py-2 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {React.createElement(category.icon, { className: "w-4 h-4" })}
                          <span className="truncate">{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="flex-1 md:w-40 h-12 md:h-10 text-base md:text-sm rounded-xl md:rounded-lg border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <SortDescIcon className="w-4 h-4 text-muted-foreground md:hidden" />
                      <SelectValue placeholder="Ordenar" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl md:rounded-lg">
                    <SelectItem value="recent" className="py-3 md:py-2 cursor-pointer">Mais Recentes</SelectItem>
                    <SelectItem value="oldest" className="py-3 md:py-2 cursor-pointer">Mais Antigas</SelectItem>
                    <SelectItem value="popular" className="py-3 md:py-2 cursor-pointer">Mais Populares</SelectItem>
                    <SelectItem value="alphabetical" className="py-3 md:py-2 cursor-pointer">Alfabética</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Indicador de resultados - Mobile friendly */}
            {!loading && filteredNews.length > 0 && (
              <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{filteredNews.length}</span> {filteredNews.length === 1 ? 'notícia encontrada' : 'notícias encontradas'}
                  {selectedCategory !== 'todos' && (
                    <span> em <span className="font-medium text-foreground">{getCategoryData(selectedCategory).name}</span></span>
                  )}
                </p>
                {(searchTerm || selectedCategory !== 'todos') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('todos');
                    }}
                    className="text-xs h-8 px-3 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <XIcon className="w-3 h-3 mr-1" />
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}

            {/* Loading State - Mobile First Skeletons */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: isMobile ? 4 : 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden rounded-xl md:rounded-xl border-0 shadow-md animate-pulse">
                    <Skeleton className="h-48 w-full rounded-none" />
                    <div className="p-4 md:p-6 space-y-3">
                      <Skeleton className="h-5 md:h-6 w-3/4 rounded-lg" />
                      <Skeleton className="h-4 w-full rounded-lg" />
                      <Skeleton className="h-4 w-5/6 rounded-lg" />
                      <div className="flex items-center justify-between pt-2">
                        <Skeleton className="h-4 w-24 rounded-lg" />
                        <Skeleton className="h-8 w-16 rounded-full" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* Grid de Notícias - Mobile First com Cards Modernos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {currentNews.map((item) => {
                    const categoryData = getCategoryData(item.category || 'desenvolvimento');
                    const Icon = categoryData.icon;

                    return (
                      <Card
                        key={item.id}
                        className={cn(
                          "group cursor-pointer overflow-hidden transition-all duration-300",
                          "rounded-xl md:rounded-xl border-0 shadow-md hover:shadow-xl",
                          "active:scale-[0.98] md:hover:-translate-y-1",
                          "bg-card"
                        )}
                        onClick={() => {
                          registerView(item.id);
                          setSelectedNews(item);
                        }}
                      >
                        {/* Imagem - Altura fixa consistente */}
                        <div className="relative h-48 overflow-hidden">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                              loading="lazy"
                            />
                          ) : (
                            <div className={cn(
                              "w-full h-full flex items-center justify-center bg-gradient-to-br",
                              categoryData.color.replace('bg-', 'from-'),
                              "to-slate-700"
                            )}>
                              <Icon className="w-16 h-16 text-white/60" />
                            </div>
                          )}

                          {/* Gradient overlay for better text readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Badge de categoria */}
                          <div className="absolute top-3 left-3">
                            <Badge className={cn(
                              "text-xs font-medium shadow-lg backdrop-blur-md",
                              categoryData.color,
                              "text-white border-0 px-2.5 py-1"
                            )}>
                              <Icon className="w-3 h-3 mr-1.5" />
                              {categoryData.name}
                            </Badge>
                          </div>

                          {/* Featured badge */}
                          {item.featured && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-yellow-500 text-white text-xs font-medium shadow-lg px-2.5 py-1">
                                <StarIcon className="w-3 h-3 mr-1" />
                                Destaque
                              </Badge>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-4 md:p-5 space-y-3">
                          {/* Título com melhor hierarquia tipográfica */}
                          <CardTitle className="text-base md:text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                            {item.title}
                          </CardTitle>

                          {/* Excerpt com melhor legibilidade */}
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
                            {item.excerpt}
                          </p>

                          {/* Meta informações - Melhor espaçamento e touch targets */}
                          <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <div className="flex items-center gap-3 md:gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{formatDate(item.created_at)}</span>
                                <span className="sm:hidden">{getTimeAgo(item.created_at)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <EyeIcon className="w-3.5 h-3.5" />
                                <span>{item.views || 0}</span>
                              </div>
                            </div>

                            {/* Botão de curtir com touch target adequado (min 44px) */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(item.id);
                              }}
                              disabled={isLiking}
                              className={cn(
                                "h-9 min-w-[44px] px-3 text-xs rounded-full transition-all duration-200",
                                likedNews.has(item.id)
                                  ? "text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50"
                                  : "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                              )}
                            >
                              <HeartIcon className={cn(
                                "w-4 h-4 mr-1.5 transition-transform",
                                likedNews.has(item.id) && "fill-current scale-110"
                              )} />
                              {newsLikes[item.id] || 0}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Paginação - Touch Friendly */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-4 mt-8 md:mt-12">
                    {/* Indicador de página atual para mobile */}
                    <p className="text-sm text-muted-foreground md:hidden">
                      Página <span className="font-semibold text-foreground">{currentPage}</span> de <span className="font-semibold text-foreground">{totalPages}</span>
                    </p>
                    
                    <div className="flex items-center gap-2 md:gap-3">
                      {/* Botão Anterior */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={cn(
                          "h-11 md:h-10 px-4 md:px-5 rounded-xl md:rounded-lg",
                          "shadow-sm hover:shadow-md transition-all duration-200",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "min-w-[44px] touch-manipulation"
                        )}
                      >
                        <ChevronLeftIcon className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">Anterior</span>
                      </Button>

                      {/* Números de página - Simplificado no mobile */}
                      <div className="hidden md:flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                          if (page > totalPages) return null;

                          return (
                            <Button
                              key={page}
                              variant={page === currentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={cn(
                                "w-10 h-10 p-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200",
                                page === currentPage && "ring-2 ring-primary/20 shadow-md"
                              )}
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>

                      {/* Input de página para mobile - mais intuitivo */}
                      <div className="flex items-center gap-2 md:hidden bg-muted/50 rounded-xl px-3 py-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="h-8 w-8 p-0 rounded-lg"
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold text-foreground min-w-[2rem] text-center">
                          {currentPage}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="h-8 w-8 p-0 rounded-lg"
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Botão Próxima */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={cn(
                          "h-11 md:h-10 px-4 md:px-5 rounded-xl md:rounded-lg",
                          "shadow-sm hover:shadow-md transition-all duration-200",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "min-w-[44px] touch-manipulation"
                        )}
                      >
                        <span className="hidden sm:inline">Próxima</span>
                        <ChevronRightIcon className="w-4 h-4 ml-1 md:ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Estado Vazio - Mobile First */}
                {!loading && currentNews.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-muted rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                      <NewsIcon className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 text-center">
                      Nenhuma notícia encontrada
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground text-center max-w-md mb-6">
                      {searchTerm || selectedCategory !== 'todos'
                        ? 'Tente ajustar os filtros de busca para encontrar mais resultados.'
                        : 'Não há notícias publicadas no momento. Volte mais tarde para novidades.'
                      }
                    </p>
                    {(searchTerm || selectedCategory !== 'todos') && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('todos');
                        }}
                        className="h-11 px-6 rounded-xl"
                      >
                        <XIcon className="w-4 h-4 mr-2" />
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </SectionContent>
        </Section>

        {/* News Modal - Mobile: Sheet Fullscreen / Desktop: Dialog */}
        {selectedNews && (
          <>
            {/* Mobile: Sheet Bottom com fullscreen */}
            {isMobile ? (
              <Sheet open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
                <SheetContent 
                  side="bottom" 
                  className="h-[95vh] p-0 rounded-t-3xl overflow-hidden"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>{selectedNews.title}</SheetTitle>
                  </SheetHeader>

                  {/* Handle de arraste visual */}
                  <div className="flex justify-center pt-3 pb-2 sticky top-0 bg-white z-10">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                  </div>

                  {/* Conteúdo scrollável */}
                  <div className="overflow-y-auto h-full pb-safe">
                    {/* Imagem/Carrossel */}
                    <div className="relative h-56 bg-gradient-to-br from-blue-50 to-purple-50">
                      {((selectedNews.images && selectedNews.images.length > 0) || selectedNews.image_url) ? (
                        <Carousel className="w-full h-full">
                          <CarouselContent className="h-full">
                            {selectedNews.images && selectedNews.images.length > 0 ? (
                              selectedNews.images.map((imageUrl, index) => (
                                <CarouselItem key={index} className="h-full">
                                  <div className="relative w-full h-full">
                                    <img
                                      src={imageUrl}
                                      alt={`${selectedNews.title} - Imagem ${index + 1}`}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                    {index === (selectedNews.featured_image_index || 0) && (
                                      <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                                        Principal
                                      </div>
                                    )}
                                  </div>
                                </CarouselItem>
                              ))
                            ) : (
                              <CarouselItem className="h-full">
                                <img
                                  src={selectedNews.image_url}
                                  alt={selectedNews.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </CarouselItem>
                            )}
                          </CarouselContent>
                          {selectedNews.images && selectedNews.images.length > 1 && (
                            <>
                              <CarouselPrevious className="left-2 h-9 w-9" />
                              <CarouselNext className="right-2 h-9 w-9" />
                            </>
                          )}
                        </Carousel>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                            <BookOpenIcon className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="text-xs font-medium shadow-lg backdrop-blur-md bg-white/90 text-gray-800 border-0 px-3 py-1.5">
                          {React.createElement(getCategoryData(selectedNews.category || 'desenvolvimento').icon, { className: "w-3.5 h-3.5 mr-1.5" })}
                          {getCategoryData(selectedNews.category || 'desenvolvimento').name}
                        </Badge>
                      </div>
                      {selectedNews.featured && (
                        <div className="absolute top-3 right-12 z-10">
                          <Badge className="bg-yellow-500 text-white text-xs font-medium shadow-lg px-3 py-1.5">
                            <StarIcon className="w-3.5 h-3.5 mr-1" />
                            Destaque
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="p-4 pb-32 space-y-4">
                      {/* Título */}
                      <h1 className="text-xl font-bold leading-tight text-gray-900">
                        {selectedNews.title}
                      </h1>

                      {/* Meta informações - Compactas */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-2.5 py-1">
                          <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                          <span>{getTimeAgo(selectedNews.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-2.5 py-1">
                          <EyeIcon className="w-3.5 h-3.5 text-purple-500" />
                          <span>{selectedNews.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-2.5 py-1">
                          <HeartIcon className="w-3.5 h-3.5 text-red-500" />
                          <span>{newsLikes[selectedNews.id] || 0}</span>
                        </div>
                      </div>

                      {/* Autor */}
                      {selectedNews.author_name && (
                        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-100">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                            <UserIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Por {selectedNews.author_name}</p>
                            <p className="text-xs text-gray-600">Administração Municipal</p>
                          </div>
                        </div>
                      )}

                      {/* Excerpt */}
                      {selectedNews.excerpt && (
                        <div className="bg-yellow-50 border-l-3 border-yellow-400 rounded-r-xl p-4">
                          <p className="text-sm text-gray-700 leading-relaxed italic">
                            "{selectedNews.excerpt}"
                          </p>
                        </div>
                      )}

                      {/* Conteúdo */}
                      <div className="prose prose-sm max-w-none">
                        <div className="text-gray-800 leading-relaxed text-[15px] whitespace-pre-wrap space-y-4">
                          {selectedNews.content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-gray-800 leading-7">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Informações adicionais */}
                      <div className="bg-gray-50 rounded-xl p-4 mt-6">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                          <InfoIcon className="w-4 h-4 text-blue-500" />
                          Detalhes da Publicação
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="space-y-0.5">
                            <span className="text-gray-500">Categoria</span>
                            <p className="font-medium text-gray-800">{getCategoryData(selectedNews.category || 'desenvolvimento').name}</p>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-gray-500">Status</span>
                            <p className="font-medium text-green-600">Publicada</p>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-gray-500">Data</span>
                            <p className="font-medium text-gray-800">{formatDate(selectedNews.created_at)}</p>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-gray-500">Atualizada</span>
                            <p className="font-medium text-gray-800">{formatDate(selectedNews.updated_at)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Fixo - Ações */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-4 pb-safe z-20">
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => handleLike(selectedNews.id)}
                          disabled={isLiking}
                          className={cn(
                            "flex-1 h-12 rounded-xl font-medium transition-all",
                            likedNews.has(selectedNews.id)
                              ? "bg-red-50 border-red-200 text-red-600"
                              : "hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                          )}
                        >
                          <HeartIcon className={cn(
                            "w-5 h-5 mr-2",
                            likedNews.has(selectedNews.id) && "fill-current"
                          )} />
                          {newsLikes[selectedNews.id] || 0}
                        </Button>

                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => shareNews(selectedNews)}
                          className="flex-1 h-12 rounded-xl font-medium hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                        >
                          <ShareIcon className="w-5 h-5 mr-2" />
                          Partilhar
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const content = `${selectedNews.title}\n\n${selectedNews.excerpt}\n\n${selectedNews.content}`;
                            navigator.clipboard.writeText(content);
                            toast.success('Conteúdo copiado!');
                          }}
                          className="h-12 w-12 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                        >
                          <CopyIcon className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              /* Desktop: Dialog tradicional */
              <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0 bg-white rounded-2xl shadow-2xl">
                  <DialogTitle className="sr-only">
                    {selectedNews.title}
                  </DialogTitle>

                  {/* Header com botão de fechar */}
                  <div className="absolute top-4 right-4 z-30">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedNews(null)}
                      className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border border-gray-200 rounded-full w-10 h-10"
                    >
                      <XIcon className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex h-full">
                    {/* Coluna da Imagem - Desktop */}
                    <div className="relative w-1/2 bg-gradient-to-br from-blue-50 to-purple-50 border-r border-gray-200">
                      {((selectedNews.images && selectedNews.images.length > 0) || selectedNews.image_url) ? (
                        <div className="w-full h-full flex items-center justify-center p-8">
                          <Carousel className="w-full h-full">
                            <CarouselContent className="h-full">
                              {selectedNews.images && selectedNews.images.length > 0 ? (
                                selectedNews.images.map((imageUrl, index) => (
                                  <CarouselItem key={index} className="h-full">
                                    <div className="relative w-full h-full flex items-center justify-center max-w-md mx-auto">
                                      <img
                                        src={imageUrl}
                                        alt={`${selectedNews.title} - Imagem ${index + 1}`}
                                        className="w-full h-full object-contain rounded-2xl shadow-2xl border-4 border-white hover:scale-105 transition-transform duration-300"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl pointer-events-none"></div>
                                      {index === (selectedNews.featured_image_index || 0) && (
                                        <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                          Principal
                                        </div>
                                      )}
                                    </div>
                                  </CarouselItem>
                                ))
                              ) : (
                                <CarouselItem className="h-full">
                                  <div className="relative w-full h-full flex items-center justify-center max-w-md mx-auto">
                                    <img
                                      src={selectedNews.image_url}
                                      alt={selectedNews.title}
                                      className="w-full h-full object-contain rounded-2xl shadow-2xl border-4 border-white hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl pointer-events-none"></div>
                                  </div>
                                </CarouselItem>
                              )}
                            </CarouselContent>
                            {selectedNews.images && selectedNews.images.length > 1 && (
                              <>
                                <CarouselPrevious className="left-2" />
                                <CarouselNext className="right-2" />
                              </>
                            )}
                          </Carousel>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-8">
                          <div className="text-center max-w-sm">
                            <div className="w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                              <BookOpenIcon className="w-14 h-14 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Sem imagem</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">Esta notícia não possui imagem associada</p>
                          </div>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-6 left-6 z-20">
                        <Badge className="text-sm font-medium shadow-xl backdrop-blur-sm bg-white/90 text-gray-800 border border-gray-200 px-4 py-2">
                          {React.createElement(getCategoryData(selectedNews.category || 'desenvolvimento').icon, { className: "w-4 h-4 mr-2" })}
                          {getCategoryData(selectedNews.category || 'desenvolvimento').name}
                        </Badge>
                      </div>
                      {selectedNews.featured && (
                        <div className="absolute top-6 right-6 z-20">
                          <Badge className="bg-yellow-500 text-white text-sm font-medium shadow-xl px-4 py-2">
                            <StarIcon className="w-4 h-4 mr-2" />
                            Destaque
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Coluna do Conteúdo - Desktop */}
                    <div className="flex flex-col w-1/2 h-full bg-white">
                      <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
                        <div className="p-8 pb-24">
                          {/* Header do conteúdo */}
                          <div className="mb-8">
                            <h1 className="text-3xl font-bold leading-tight mb-6 text-gray-900">
                              {selectedNews.title}
                            </h1>

                            {/* Meta informações */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">{formatDate(selectedNews.created_at)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ClockIcon className="w-4 h-4 text-green-500" />
                                <span>{getTimeAgo(selectedNews.created_at)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <EyeIcon className="w-4 h-4 text-purple-500" />
                                <span>{selectedNews.views || 0} visualizações</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <HeartIcon className="w-4 h-4 text-red-500" />
                                <span>{newsLikes[selectedNews.id] || 0} curtidas</span>
                              </div>
                            </div>

                            {/* Autor */}
                            {selectedNews.author_name && (
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 mb-6 border border-blue-100">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                                    <UserIcon className="w-7 h-7 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900 text-base">Por {selectedNews.author_name}</p>
                                    <p className="text-gray-600 text-sm">Autor da publicação</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Administração Municipal de Chipindo</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Conteúdo da notícia */}
                          <div className="space-y-6">
                            {/* Excerpt */}
                            {selectedNews.excerpt && (
                              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-r-xl p-5">
                                <div className="flex items-start gap-3">
                                  <div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <MessageSquareIcon className="w-3.5 h-3.5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-800 mb-1.5 text-sm">Resumo</h3>
                                    <p className="text-base text-gray-700 leading-relaxed italic">
                                      "{selectedNews.excerpt}"
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Conteúdo principal */}
                            <div className="prose prose-base max-w-none">
                              <div className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap space-y-4">
                                {selectedNews.content.split('\n\n').map((paragraph, index) => (
                                  <p key={index} className="text-gray-800 leading-7">
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                            </div>

                            {/* Informações adicionais */}
                            <div className="bg-gray-50 rounded-xl p-5 mt-8">
                              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm">
                                <InfoIcon className="w-4 h-4 text-blue-500" />
                                Informações da Publicação
                              </h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Categoria:</span>
                                  <span className="ml-2 font-medium text-gray-800">
                                    {getCategoryData(selectedNews.category || 'desenvolvimento').name}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Status:</span>
                                  <span className="ml-2 font-medium text-green-600">Publicada</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Criada em:</span>
                                  <span className="ml-2 font-medium text-gray-800">
                                    {formatDate(selectedNews.created_at)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Atualizada em:</span>
                                  <span className="ml-2 font-medium text-gray-800">
                                    {formatDate(selectedNews.updated_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer com ações - Desktop */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="default"
                              onClick={() => handleLike(selectedNews.id)}
                              disabled={isLiking}
                              className={cn(
                                "bg-white shadow-md border-2 rounded-xl transition-all",
                                likedNews.has(selectedNews.id)
                                  ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                                  : "hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                              )}
                            >
                              <HeartIcon className={cn(
                                "w-4 h-4 mr-2",
                                likedNews.has(selectedNews.id) && "fill-current"
                              )} />
                              {newsLikes[selectedNews.id] || 0} curtidas
                            </Button>

                            <Button
                              variant="outline"
                              size="default"
                              onClick={() => shareNews(selectedNews)}
                              className="bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 shadow-md border-2 rounded-xl"
                            >
                              <ShareIcon className="w-4 h-4 mr-2" />
                              Compartilhar
                            </Button>

                            <Button
                              variant="outline"
                              size="default"
                              onClick={() => {
                                const content = `${selectedNews.title}\n\n${selectedNews.excerpt}\n\n${selectedNews.content}`;
                                navigator.clipboard.writeText(content);
                                toast.success('Conteúdo copiado para a área de transferência!');
                              }}
                              className="bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 shadow-md border-2 rounded-xl"
                            >
                              <CopyIcon className="w-4 h-4 mr-2" />
                              Copiar
                            </Button>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <EyeIcon className="w-4 h-4" />
                              {selectedNews.views || 0}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <HeartIcon className="w-4 h-4" />
                              {newsLikes[selectedNews.id] || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Noticias;