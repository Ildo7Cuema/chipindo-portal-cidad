import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useNewsLikes } from "@/hooks/useNewsLikes";
import { useNewsViews } from "@/hooks/useNewsViews";
import { toast } from "sonner";
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  SearchIcon, 
  TagIcon, 
  EyeIcon,
  TrendingUpIcon,
  StarIcon,
  ShareIcon,
  BookmarkIcon,
  FilterIcon,
  SortDescIcon,
  SortAscIcon,
  GridIcon,
  ListIcon,
  ArrowRightIcon,
  NewspaperIcon as NewsIcon,
  FlameIcon,
  XIcon,
  TreePineIcon as TreeIcon,
  Building2Icon,
  MessageSquareIcon,
  ZapIcon,
  BookOpenIcon,
  UsersIcon,
  HeartIcon,
  SendIcon,
  ExternalLinkIcon
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
  created_at: string;
  updated_at: string;
  category?: string;
  views?: number;
  author_name?: string;
  likes?: number;
  isLiked?: boolean;
}

const categoryMapping = [
  { 
    id: 'desenvolvimento', 
    name: 'Desenvolvimento', 
    color: 'bg-blue-500', 
    bgColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800',
    icon: TrendingUpIcon,
    description: 'Projetos e iniciativas de desenvolvimento municipal'
  },
  { 
    id: 'educacao', 
    name: 'Educação', 
    color: 'bg-green-500', 
    bgColor: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800',
    icon: BookOpenIcon,
    description: 'Educação, ensino e formação'
  },
  { 
    id: 'saude', 
    name: 'Saúde', 
    color: 'bg-red-500', 
    bgColor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-800',
    icon: UsersIcon,
    description: 'Saúde pública e bem-estar'
  },
  { 
    id: 'obras', 
    name: 'Obras Públicas', 
    color: 'bg-orange-500', 
    bgColor: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-800',
    icon: Building2Icon,
    description: 'Infraestruturas e obras públicas'
  },
  { 
    id: 'turismo', 
    name: 'Turismo', 
    color: 'bg-purple-500', 
    bgColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-800',
    icon: StarIcon,
    description: 'Turismo e promoção cultural'
  },
  { 
    id: 'agricultura', 
    name: 'Agricultura', 
    color: 'bg-emerald-500', 
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-800',
    icon: TreeIcon,
    description: 'Agricultura e desenvolvimento rural'
  },
  { 
    id: 'cultura', 
    name: 'Cultura', 
    color: 'bg-pink-500', 
    bgColor: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/20 dark:text-pink-300 dark:border-pink-800',
    icon: MessageSquareIcon,
    description: 'Eventos culturais e patrimônio'
  },
  { 
    id: 'todos', 
    name: 'Todas as Categorias', 
    color: 'bg-slate-500', 
    bgColor: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/20 dark:text-slate-300 dark:border-slate-800',
    icon: NewsIcon,
    description: 'Todas as notícias e comunicados'
  }
];

const Noticias = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "popular" | "alphabetical">("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Usar o hook de curtidas
  const { likedNews, newsLikes, handleLike, isLoading: likesLoading } = useNewsLikes();
  const { registerView, getViewsCount, isLoading: viewsLoading } = useNewsViews();

  useEffect(() => {
    getUser();
    fetchNews();
  }, []);

  // Função para registrar visualização
  const handleNewsClick = async (newsId: string) => {
    try {
      await registerView(newsId);
      
      // Atualizar a contagem de visualizações na notícia
      const updatedViews = await getViewsCount(newsId);
      setNews(prevNews => 
        prevNews.map(item => 
          item.id === newsId 
            ? { ...item, views: updatedViews }
            : item
        )
      );
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  };

  useEffect(() => {
    filterAndSortNews();
  }, [news, searchTerm, selectedCategory, sortBy]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('id, title, excerpt, content, author_id, published, featured, image_url, created_at, updated_at')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Buscar visualizações reais para cada notícia
      const newsWithData = await Promise.all(
        (data || []).map(async (item, index) => {
          // Buscar contagem de visualizações
          let viewsCount = 0;
          try {
            const { data: viewsData, error: viewsError } = await supabase
              .from('news_views' as any)
              .select('id', { count: 'exact' })
              .eq('news_id', item.id);

            if (!viewsError && viewsData) {
              viewsCount = viewsData.length;
            }
          } catch (error) {
            console.error('Erro ao buscar visualizações:', error);
          }

          return {
            ...item,
            category: getCategoryByIndex(index),
            views: viewsCount,
            author_name: 'Administração Municipal' // Default author name since we can't join with profiles
          };
        })
      );

      setNews(newsWithData);
      
      // Debug: verificar se as notícias têm image_url e content
      console.log('Notícias carregadas:', newsWithData.map(item => ({
        id: item.id,
        title: item.title,
        image_url: item.image_url,
        hasImage: !!item.image_url,
        content_length: item.content ? item.content.length : 0,
        hasContent: !!item.content,
        excerpt_length: item.excerpt ? item.excerpt.length : 0
      })));
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryByIndex = (index: number) => {
    const categories = ['desenvolvimento', 'educacao', 'saude', 'obras', 'turismo', 'agricultura', 'cultura'];
    return categories[index % categories.length];
  };

  const filterAndSortNews = () => {
    let filtered = news.filter(item => {
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
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Há poucos minutos';
    if (diffInHours < 24) return `Há ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  };

  const getCategoryData = (categoryId: string) => {
    return categoryMapping.find(cat => cat.id === categoryId) || categoryMapping[0];
  };

  const featuredNews = news.filter(item => item.featured).slice(0, 3);
  const paginatedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const shareNews = (newsItem: NewsItem) => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.title,
        text: newsItem.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    // setUser(user); // This is now handled by useNewsLikes
  };

  const fetchLikes = async () => {
    try {
      // Buscar curtidas do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Por enquanto, usar apenas localStorage até a tabela news_likes ser criada
      const savedLikedNews = localStorage.getItem('likedNews');
      const savedNewsLikes = localStorage.getItem('newsLikes');
      
      // setLikedNews(new Set(JSON.parse(savedLikedNews))); // This is now handled by useNewsLikes
      
      // setNewsLikes(JSON.parse(savedNewsLikes)); // This is now handled by useNewsLikes

      // TODO: Implementar quando a tabela news_likes for criada
      // const { data: userLikes, error } = await supabase
      //   .from('news_likes')
      //   .select('news_id')
      //   .eq('user_id', user.id);

      // if (error) throw error;

      // // Atualizar estado de curtidas do usuário
      // const likedNewsSet = new Set(userLikes?.map(like => like.news_id) || []);
      // setLikedNews(likedNewsSet);

      // // Buscar contagem total de curtidas para todas as notícias
      // const { data: allLikes, error: countError } = await supabase
      //   .from('news_likes')
      //   .select('news_id');

      // if (countError) throw countError;

      // // Contar curtidas por notícia
      // const likesMap: Record<string, number> = {};
      // allLikes?.forEach(like => {
      //   likesMap[like.news_id] = (likesMap[like.news_id] || 0) + 1;
      // });

      // setNewsLikes(likesMap);
    } catch (error) {
      console.error('Erro ao carregar curtidas:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Section variant="primary" size="lg">
          <SectionContent>
            <div className="text-center space-y-8">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/30">
                  <NewsIcon className="w-10 h-10 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                    Central de
                    <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      Notícias
                    </span>
                  </h1>
                  <p className="text-primary-foreground/90 text-xl mt-2">
                    Administração Municipal de Chipindo
                  </p>
                </div>
              </div>
              
              <p className="text-xl text-primary-foreground/95 max-w-4xl mx-auto leading-relaxed">
                Acompanhe os desenvolvimentos, projetos e conquistas que transformam 
                nossa comunidade e impactam positivamente a vida dos cidadãos de Chipindo.
              </p>
              
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                  <TrendingUpIcon className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">{news.length} Notícias</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-green-500/20 rounded-full backdrop-blur-md border border-green-400/30">
                  <FlameIcon className="w-5 h-5 text-green-100" />
                  <span className="text-green-100 font-medium">{featuredNews.length} em Destaque</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-yellow-500/20 rounded-full backdrop-blur-md border border-yellow-400/30">
                  <ZapIcon className="w-5 h-5 text-yellow-100" />
                  <span className="text-yellow-100 font-medium">Atualização Diária</span>
                </div>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Featured News Section */}
        {featuredNews.length > 0 && (
          <Section variant="secondary" size="lg">
            <SectionHeader
              subtitle="Destaques da Semana"
              title="Notícias em Destaque"
              description="As principais novidades e desenvolvimentos que estão impactando nossa comunidade"
              centered={true}
            />
            
            <SectionContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredNews.map((item, index) => {
                  const categoryData = getCategoryData(item.category || 'desenvolvimento');
                  const IconComponent = categoryData.icon;
                  
                  return (
                    <Card 
                      key={item.id} 
                      className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
                      onClick={() => setSelectedNews(item)}
                    >
                      <div className="relative overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
                          {item.image_url ? (
                            <img 
                              src={item.image_url} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <IconComponent className="w-12 h-12 text-white/80" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <Badge className={cn("absolute top-4 left-4 border-0 text-white shadow-lg", categoryData.color)}>
                            <IconComponent className="w-3 h-3 mr-1" />
                            {categoryData.name}
                          </Badge>
                          <Badge className="absolute top-4 right-4 bg-yellow-500 text-yellow-900 border-0 shadow-lg">
                            <StarIcon className="w-3 h-3 mr-1" />
                            Destaque
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{item.excerpt}</p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-3">
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
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <UserIcon className="w-4 h-4" />
                            <span className="truncate">{item.author_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant={likedNews.has(item.id) ? "default" : "outline"}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(item.id);
                              }}
                              className={likedNews.has(item.id) ? "bg-red-500 hover:bg-red-600 text-white" : ""}
                            >
                              <HeartIcon className={`w-3 h-3 ${likedNews.has(item.id) ? "fill-current" : ""}`} />
                              {newsLikes[item.id] > 0 && (
                                <span className="ml-1 text-xs">({newsLikes[item.id]})</span>
                              )}
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-md">
                              <ArrowRightIcon className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </SectionContent>
          </Section>
        )}

        {/* Categories Section */}
        <Section variant="muted" size="md">
          <SectionContent>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Explore por Categoria</h2>
                  <p className="text-muted-foreground">Encontre notícias específicas sobre diferentes áreas</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {categoryMapping.slice(0, -1).map(category => {
                    const IconComponent = category.icon;
                    const isActive = selectedCategory === category.id;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          "group p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg",
                          isActive 
                            ? "border-primary bg-primary/10 shadow-md" 
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors duration-300",
                          isActive ? "bg-primary text-primary-foreground" : category.color + " text-white group-hover:scale-110"
                        )}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className={cn(
                          "font-medium text-sm text-center transition-colors duration-300",
                          isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                        )}>
                          {category.name}
                        </h3>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>

        {/* Search and Filters Section */}
        <Section variant="default" size="md">
          <SectionContent>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Main Search */}
                  <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Pesquisar notícias, eventos, anúncios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-4 text-lg border-2 border-border/50 focus:border-primary rounded-xl"
                    />
                  </div>

                  {/* Filters Row */}
                  <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-3 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                          "flex items-center gap-2 transition-colors duration-200",
                          showFilters && "bg-primary text-primary-foreground"
                        )}
                      >
                        <FilterIcon className="w-4 h-4" />
                        Filtros Avançados
                        {showFilters && <XIcon className="w-4 h-4" />}
                      </Button>

                      <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as any)}>
                        <SelectTrigger className="w-48">
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
                              Mais Antigas
                            </div>
                          </SelectItem>
                          <SelectItem value="popular">
                            <div className="flex items-center gap-2">
                              <TrendingUpIcon className="w-4 h-4" />
                              Mais Populares
                            </div>
                          </SelectItem>
                          <SelectItem value="alphabetical">
                            <div className="flex items-center gap-2">
                              <TagIcon className="w-4 h-4" />
                              Alfabética
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

                  {/* Results Summary */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
                    {loading ? (
                      <Skeleton className="h-4 w-48" />
                    ) : (
                      <div className="flex items-center gap-4">
                        <span className="font-medium">
                          {filteredNews.length} notícia{filteredNews.length !== 1 ? 's' : ''} encontrada{filteredNews.length !== 1 ? 's' : ''}
                        </span>
                        {searchTerm && <span className="text-primary">para "{searchTerm}"</span>}
                        {selectedCategory !== 'todos' && <span className="text-primary">em {getCategoryData(selectedCategory).name}</span>}
                      </div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("todos");
                        setSortBy("recent");
                        setShowFilters(false);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>

        {/* News Grid/List Section */}
        <Section variant="secondary" size="lg">
          <SectionContent>
            {loading ? (
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden border-0 shadow-md">
                    <Skeleton className="aspect-video" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-muted/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <NewsIcon className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">Nenhuma notícia encontrada</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Tente ajustar seus filtros de busca ou verificar a categoria selecionada.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("todos");
                    setSortBy("recent");
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                >
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <>
                <div className={cn(
                  "grid gap-6",
                  viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}>
                  {paginatedNews.map((item) => {
                    const categoryData = getCategoryData(item.category || 'desenvolvimento');
                    const IconComponent = categoryData.icon;
                    
                    return (
                      <Card 
                        key={item.id}
                        className={cn(
                          "group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                          viewMode === 'list' && "md:flex"
                        )}
                        onClick={async () => {
                          await handleNewsClick(item.id);
                          setSelectedNews(item);
                        }}
                      >
                        <div className={cn(
                          "relative overflow-hidden",
                          viewMode === 'list' ? "md:w-80 flex-shrink-0" : ""
                        )}>
                          <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative">
                            {item.image_url ? (
                              <img 
                                src={item.image_url} 
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className={cn("w-full h-full flex items-center justify-center", categoryData.color)}>
                                <IconComponent className="w-8 h-8 text-white/80" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <Badge className={cn("absolute top-3 left-3 border-0 text-white shadow-md", categoryData.color)}>
                              <IconComponent className="w-3 h-3 mr-1" />
                              {categoryData.name}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex-1 p-6">
                          <CardTitle className={cn(
                            "leading-tight group-hover:text-primary transition-colors duration-300 mb-3 line-clamp-2",
                            viewMode === 'list' ? "text-lg" : "text-xl"
                          )}>
                            {item.title}
                          </CardTitle>
                          
                          <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{item.excerpt}</p>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
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
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant={likedNews.has(item.id) ? "default" : "outline"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLike(item.id);
                                }}
                                className={likedNews.has(item.id) ? "bg-red-500 hover:bg-red-600 text-white" : ""}
                              >
                                <HeartIcon className={`w-3 h-3 ${likedNews.has(item.id) ? "fill-current" : ""}`} />
                                {newsLikes[item.id] > 0 && (
                                  <span className="ml-1 text-xs">({newsLikes[item.id]})</span>
                                )}
                              </Button>
                              <span className="text-xs">
                                {getTimeAgo(item.created_at)}
                              </span>
                            </div>
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
              </>
            )}
          </SectionContent>
        </Section>

        {/* News Modal */}
        {selectedNews && (
          <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
            <DialogContent className="max-w-7xl h-[95vh] overflow-hidden p-0 bg-white">
              {/* DialogTitle para acessibilidade - oculto visualmente */}
              <DialogTitle className="sr-only">
                {selectedNews.title}
              </DialogTitle>
              
              {/* Header com botão de fechar */}
              <div className="absolute top-4 right-4 z-20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNews(null)}
                  className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border border-gray-200"
                >
                  <XIcon className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex h-full">
                
                {/* Coluna da Imagem - Lado Esquerdo */}
                <div className="w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                  {selectedNews.image_url ? (
                    <div className="h-full w-full flex items-center justify-center p-6">
                      <div className="relative w-full h-full max-w-lg max-h-[80vh] image-container">
                        <img 
                          src={selectedNews.image_url} 
                          alt={selectedNews.title}
                          className="w-full h-full object-contain rounded-xl shadow-2xl border-4 border-white hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.error('Erro ao carregar imagem:', selectedNews.image_url);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl';
                              fallback.innerHTML = `
                                <div class="text-center p-8">
                                  <svg class="w-20 h-20 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                  </svg>
                                  <p class="text-gray-500 font-medium">Imagem não disponível</p>
                                  <p class="text-xs text-gray-400 mt-2">URL: ${selectedNews.image_url}</p>
                                </div>
                              `;
                              parent.appendChild(fallback);
                            }
                          }}
                          onLoad={(e) => {
                            console.log('Imagem carregada com sucesso:', selectedNews.image_url);
                          }}
                        />
                        {/* Overlay sutil para melhor contraste */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center p-6">
                      <div className="text-center max-w-md">
                        <div className={cn(
                          "w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg",
                          getCategoryData(selectedNews.category || 'desenvolvimento').color
                        )}>
                          {React.createElement(getCategoryData(selectedNews.category || 'desenvolvimento').icon, {
                            className: "w-12 h-12 text-white"
                          })}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Sem imagem</h3>
                        <p className="text-sm text-gray-500">Esta notícia não possui imagem associada</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Badge de categoria sobre a imagem */}
                  <div className="absolute top-6 left-6 z-10">
                    <Badge className={cn(
                      "text-sm font-medium shadow-lg backdrop-blur-sm",
                      getCategoryData(selectedNews.category || 'desenvolvimento').color,
                      "text-white border-0"
                    )}>
                      {React.createElement(getCategoryData(selectedNews.category || 'desenvolvimento').icon, {
                        className: "w-4 h-4 mr-2"
                      })}
                      {getCategoryData(selectedNews.category || 'desenvolvimento').name}
                    </Badge>
                  </div>
                </div>
                
                {/* Coluna do Conteúdo - Lado Direito */}
                <div className="w-1/2 flex flex-col h-full bg-white">
                  {/* Área de scroll do conteúdo */}
                  <div className="flex-1 overflow-y-auto" style={{maxHeight: 'calc(95vh - 100px)'}}>
                    <div className="p-8 pb-24">
                      {/* Header do conteúdo */}
                      <div className="mb-8">
                        <h1 className="text-3xl font-bold leading-tight mb-6 text-gray-900">
                          {selectedNews.title}
                        </h1>
                        
                        {/* Meta informações */}
                        <div className="meta-info">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="font-medium">{formatDate(selectedNews.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4" />
                            <span>{getTimeAgo(selectedNews.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <EyeIcon className="w-4 h-4" />
                            <span>{selectedNews.views || 0} visualizações</span>
                          </div>
                        </div>
                        
                        {/* Autor */}
                        {selectedNews.author_name && (
                          <div className="author-card mt-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                <UserIcon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Por {selectedNews.author_name}</p>
                                <p className="text-sm text-gray-600">Autor da publicação</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Conteúdo da notícia */}
                      <div className="space-y-8 news-content">
                        {/* Excerpt */}
                        {selectedNews.excerpt && (
                          <div className="mb-8">
                            <div className="news-excerpt">
                              <blockquote className="pl-6">
                                <p className="text-xl text-gray-700 leading-relaxed font-medium italic">
                                  "{selectedNews.excerpt}"
                                </p>
                              </blockquote>
                            </div>
                          </div>
                        )}
                        
                        {/* Conteúdo principal */}
                        <div className="prose prose-lg max-w-none">
                          <div className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap">
                            {selectedNews.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer com ações - Fixo na parte inferior */}
                  <div className="modal-footer bg-gradient-to-r from-blue-50 to-purple-50" style={{height: '80px', minHeight: '80px'}}>
                    <div className="flex items-center justify-between h-full px-6">
                      <div className="flex items-center gap-4">
                        <Button 
                          variant={likedNews.has(selectedNews.id) ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => handleLike(selectedNews.id)}
                          className={cn(
                            "action-button like-button",
                            likedNews.has(selectedNews.id) ? "liked" : ""
                          )}
                        >
                          <HeartIcon className={cn(
                            "w-4 h-4 mr-2 transition-all duration-200",
                            likedNews.has(selectedNews.id) ? "fill-current" : ""
                          )} />
                          {selectedNews.likes || 0} curtidas
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => shareNews(selectedNews)}
                          className="action-button hover:bg-blue-50 hover:border-blue-200 bg-white shadow-lg"
                        >
                          <ShareIcon className="w-4 h-4 mr-2" />
                          Compartilhar
                        </Button>
                      </div>
                      
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <EyeIcon className="w-3 h-3" />
                        {selectedNews.views || 0} visualizações
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