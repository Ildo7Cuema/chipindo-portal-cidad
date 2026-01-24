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
  BellIcon
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

      {/* Enhanced Hero Section */}
      <section className="relative min-h-[600px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-purple-400/15 rounded-full blur-xl animate-pulse delay-1500"></div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            {/* Header with Enhanced Icon */}
            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-br from-white/25 to-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl">
                  <NewsIcon className="w-14 h-14 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-sm font-medium tracking-wide uppercase">Atualizado</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  Notícias e
                  <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Comunicados
                  </span>
                </h1>
                <p className="text-blue-100 text-xl font-medium">
                  Município de Chipindo
                </p>
              </div>
            </div>

            {/* Enhanced Description */}
            <div className="max-w-3xl mx-auto space-y-8 animate-slide-up animation-delay-300">
              <p className="text-xl md:text-2xl text-blue-50/90 leading-relaxed font-light tracking-wide drop-shadow-sm">
                Fique a par das <span className="font-medium text-white">últimas notícias</span>, comunicados e desenvolvimentos
                do <span className="font-medium text-white">Município de Chipindo</span> com informações atualizadas e transparentes.
              </p>

              {/* News Stats Preview */}
              <div className="flex flex-wrap justify-center gap-4">
                <div className="group relative">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <NewsIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white">{news.length} Notícias</div>
                        <div className="text-blue-100 text-xs">Total disponível</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500/30 rounded-xl flex items-center justify-center">
                        <StarIcon className="w-5 h-5 text-yellow-100" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white">{news.filter(item => item.featured).length} Destaques</div>
                        <div className="text-blue-100 text-xs">Notícias importantes</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/30 rounded-xl flex items-center justify-center">
                        <GlobeIcon className="w-5 h-5 text-green-100" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white">7 Categorias</div>
                        <div className="text-blue-100 text-xs">Temas organizados</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/30 rounded-xl flex items-center justify-center">
                        <BellIcon className="w-5 h-5 text-purple-100" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white">Tempo Real</div>
                        <div className="text-blue-100 text-xs">Atualizações constantes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="pt-8">
                <div className="flex items-center justify-center gap-6 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Informações Oficiais</span>
                  </div>
                  <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Transparência Total</span>
                  </div>
                  <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
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
            {/* Filtros e Busca */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Pesquisar notícias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoryMapping.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {React.createElement(category.icon, { className: "w-4 h-4" })}
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                  <SelectItem value="oldest">Mais Antigas</SelectItem>
                  <SelectItem value="popular">Mais Populares</SelectItem>
                  <SelectItem value="alphabetical">Alfabética</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* Grid de Notícias */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentNews.map((item) => {
                    const categoryData = getCategoryData(item.category || 'desenvolvimento');
                    const Icon = categoryData.icon;

                    return (
                      <Card
                        key={item.id}
                        className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        onClick={() => {
                          registerView(item.id);
                          setSelectedNews(item);
                        }}
                      >
                        {/* Imagem */}
                        <div className="relative h-48 overflow-hidden">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className={cn(
                              "w-full h-full flex items-center justify-center",
                              categoryData.bgColor
                            )}>
                              <Icon className="w-16 h-16 text-white/80" />
                            </div>
                          )}

                          {/* Badge de categoria */}
                          <div className="absolute top-3 left-3">
                            <Badge className={cn(
                              "text-xs font-medium shadow-lg backdrop-blur-sm",
                              categoryData.color,
                              "text-white border-0"
                            )}>
                              <Icon className="w-3 h-3 mr-1" />
                              {categoryData.name}
                            </Badge>
                          </div>

                          {/* Featured badge */}
                          {item.featured && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-yellow-500 text-white text-xs font-medium shadow-lg">
                                <StarIcon className="w-3 h-3 mr-1" />
                                Destaque
                              </Badge>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-6">
                          <CardTitle className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </CardTitle>

                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {item.excerpt}
                          </p>

                          {/* Meta informações */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                {formatDate(item.created_at)}
                              </div>
                              <div className="flex items-center gap-1">
                                <EyeIcon className="w-3 h-3" />
                                {item.views || 0}
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(item.id);
                              }}
                              disabled={isLiking}
                              className={cn(
                                "h-6 px-2 text-xs",
                                likedNews.has(item.id)
                                  ? "text-red-600 bg-red-50 hover:bg-red-100"
                                  : "hover:bg-red-50 hover:text-red-600"
                              )}
                            >
                              <HeartIcon className={cn(
                                "w-3 h-3 mr-1",
                                likedNews.has(item.id) && "fill-current"
                              )} />
                              {newsLikes[item.id] || 0}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="shadow-sm hover:shadow-md"
                    >
                      Anterior
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (page > totalPages) return null;

                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10 h-10 p-0 shadow-sm hover:shadow-md"
                        >
                          {page}
                        </Button>
                      );
                    })}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="shadow-sm hover:shadow-md"
                    >
                      Próxima
                    </Button>
                  </div>
                )}

                {/* Mensagem quando não há notícias */}
                {!loading && currentNews.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <NewsIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma notícia encontrada</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || selectedCategory !== 'todos'
                        ? 'Tente ajustar os filtros de busca'
                        : 'Não há notícias publicadas no momento'
                      }
                    </p>
                  </div>
                )}
              </>
            )}
          </SectionContent>
        </Section>

        {/* News Modal - Layout Melhorado */}
        {selectedNews && (
          <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
            <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 bg-white rounded-xl shadow-2xl">
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

              <div className={cn(
                "h-full",
                isMobile ? "flex flex-col" : "flex"
              )}>
                {/* Coluna da Imagem - Responsiva */}
                <div className={cn(
                  "relative bg-gradient-to-br from-blue-50 to-purple-50",
                  isMobile
                    ? "w-full h-64 border-b border-gray-200"
                    : "w-1/2 border-r border-gray-200"
                )}>
                  {((selectedNews.images && selectedNews.images.length > 0) || selectedNews.image_url) ? (
                    <div className={cn(
                      "w-full flex items-center justify-center",
                      isMobile ? "h-full p-4" : "h-full p-8"
                    )}>
                      <Carousel className="w-full h-full">
                        <CarouselContent className="h-full">
                          {/* Exibir múltiplas imagens se disponíveis */}
                          {selectedNews.images && selectedNews.images.length > 0 ? (
                            selectedNews.images.map((imageUrl, index) => (
                              <CarouselItem key={index} className="h-full">
                                <div className={cn(
                                  "relative w-full h-full flex items-center justify-center",
                                  isMobile ? "max-w-full" : "max-w-md mx-auto"
                                )}>
                                  <img
                                    src={imageUrl}
                                    alt={`${selectedNews.title} - Imagem ${index + 1}`}
                                    className="w-full h-full object-contain rounded-2xl shadow-2xl border-4 border-white hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl pointer-events-none"></div>
                                  {/* Indicador de imagem destacada */}
                                  {index === (selectedNews.featured_image_index || 0) && (
                                    <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                      Principal
                                    </div>
                                  )}
                                </div>
                              </CarouselItem>
                            ))
                          ) : (
                            /* Fallback para image_url antiga */
                            <CarouselItem className="h-full">
                              <div className={cn(
                                "relative w-full h-full flex items-center justify-center",
                                isMobile ? "max-w-full" : "max-w-md mx-auto"
                              )}>
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
                        {/* Controles do carrossel apenas se houver múltiplas imagens */}
                        {selectedNews.images && selectedNews.images.length > 1 && (
                          <>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                          </>
                        )}
                      </Carousel>
                    </div>
                  ) : (
                    <div className={cn(
                      "w-full flex items-center justify-center",
                      isMobile ? "h-full p-4" : "h-full p-8"
                    )}>
                      <div className="text-center max-w-sm">
                        <div className="w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                          <BookOpenIcon className="w-16 h-16 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Sem imagem</h3>
                        <p className="text-gray-500 leading-relaxed">Esta notícia não possui imagem associada</p>
                      </div>
                    </div>
                  )}

                  {/* Badge de categoria sobre a imagem */}
                  <div className={cn(
                    "absolute z-20",
                    isMobile ? "top-4 left-4" : "top-6 left-6"
                  )}>
                    <Badge className="text-sm font-medium shadow-xl backdrop-blur-sm bg-white/90 text-gray-800 border border-gray-200 px-4 py-2">
                      {React.createElement(getCategoryData(selectedNews.category || 'desenvolvimento').icon, { className: "w-4 h-4 mr-2" })}
                      {getCategoryData(selectedNews.category || 'desenvolvimento').name}
                    </Badge>
                  </div>

                  {/* Featured badge */}
                  {selectedNews.featured && (
                    <div className={cn(
                      "absolute z-20",
                      isMobile ? "top-4 right-4" : "top-6 right-6"
                    )}>
                      <Badge className="bg-yellow-500 text-white text-sm font-medium shadow-xl px-4 py-2">
                        <StarIcon className="w-4 h-4 mr-2" />
                        Destaque
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Coluna do Conteúdo - Scrollável */}
                <div className={cn(
                  "flex flex-col h-full bg-white",
                  isMobile ? "w-full flex-1" : "w-1/2"
                )}>
                  {/* Área de scroll do conteúdo */}
                  <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{
                    maxHeight: isMobile ? 'calc(95vh - 280px)' : 'calc(95vh - 120px)'
                  }}>
                    <div className={cn(
                      "pb-32",
                      isMobile ? "p-4" : "p-8"
                    )}>
                      {/* Header do conteúdo */}
                      <div className="mb-8">
                        <h1 className={cn(
                          "font-bold leading-tight mb-6 text-gray-900",
                          isMobile ? "text-2xl" : "text-4xl"
                        )}>
                          {selectedNews.title}
                        </h1>

                        {/* Meta informações */}
                        <div className={cn(
                          "flex flex-wrap items-center text-sm text-gray-600 mb-6",
                          isMobile ? "gap-3" : "gap-6"
                        )}>
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
                            <span>{selectedNews.likes || 0} curtidas</span>
                          </div>
                        </div>

                        {/* Autor */}
                        {selectedNews.author_name && (
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                                <UserIcon className="w-8 h-8 text-white" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-lg">Por {selectedNews.author_name}</p>
                                <p className="text-gray-600">Autor da publicação</p>
                                <p className="text-sm text-gray-500 mt-1">Administração Municipal de Chipindo</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Conteúdo da notícia */}
                      <div className="space-y-8">
                        {/* Excerpt */}
                        {selectedNews.excerpt && (
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-r-2xl p-6 mb-8">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <MessageSquareIcon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Resumo</h3>
                                <p className="text-lg text-gray-700 leading-relaxed italic">
                                  "{selectedNews.excerpt}"
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Conteúdo principal */}
                        <div className="prose prose-lg max-w-none">
                          <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap space-y-6">
                            {selectedNews.content.split('\n\n').map((paragraph, index) => (
                              <p key={index} className="text-gray-800 leading-8">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Informações adicionais */}
                        <div className="bg-gray-50 rounded-2xl p-6 mt-12">
                          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <InfoIcon className="w-5 h-5 text-blue-500" />
                            Informações da Publicação
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Categoria:</span>
                              <span className="ml-2 font-medium text-gray-800">
                                {getCategoryData(selectedNews.category || 'desenvolvimento').name}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Status:</span>
                              <span className="ml-2 font-medium text-green-600">Publicada</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Criada em:</span>
                              <span className="ml-2 font-medium text-gray-800">
                                {formatDate(selectedNews.created_at)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Atualizada em:</span>
                              <span className="ml-2 font-medium text-gray-800">
                                {formatDate(selectedNews.updated_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer com ações - Fixo na parte inferior */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200 p-6">
                    <div className={cn(
                      "flex items-center",
                      isMobile ? "flex-col gap-4" : "justify-between"
                    )}>
                      <div className={cn(
                        "flex items-center",
                        isMobile ? "gap-2 w-full justify-center" : "gap-4"
                      )}>
                        <Button
                          variant="outline"
                          size="default"
                          onClick={() => handleLike(selectedNews.id)}
                          disabled={isLiking}
                          className={cn(
                            "bg-white shadow-lg border-2",
                            likedNews.has(selectedNews.id)
                              ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                              : "hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                          )}
                        >
                          <HeartIcon className={cn(
                            "w-5 h-5 mr-2",
                            likedNews.has(selectedNews.id) && "fill-current"
                          )} />
                          {newsLikes[selectedNews.id] || 0} curtidas
                        </Button>

                        <Button
                          variant="outline"
                          size="default"
                          onClick={() => shareNews(selectedNews)}
                          className="bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 shadow-lg border-2"
                        >
                          <ShareIcon className="w-5 h-5 mr-2" />
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
                          className="bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 shadow-lg border-2"
                        >
                          <CopyIcon className="w-5 h-5 mr-2" />
                          Copiar
                        </Button>
                      </div>

                      <div className={cn(
                        "flex items-center text-sm text-gray-600",
                        isMobile ? "gap-3 w-full justify-center" : "gap-4"
                      )}>
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4" />
                          {selectedNews.views || 0}
                        </div>
                        <div className="flex items-center gap-1">
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
      </main>

      <Footer />
    </div>
  );
};

export default Noticias;