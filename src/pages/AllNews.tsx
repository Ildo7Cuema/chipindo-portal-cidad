import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CalendarIcon, 
  SearchIcon, 
  ArrowRightIcon, 
  EyeIcon,
  UserIcon,
  ClockIcon,
  NewspaperIcon,
  SortDescIcon,
  SortAscIcon,
  TrendingUpIcon,
  FilterIcon,
  XIcon,
  ShareIcon,
  HeartIcon,
  BookmarkIcon,
  SendIcon,
  GridIcon,
  ListIcon,
  TagIcon,
  FlameIcon,
  Building2Icon,
  BookOpenIcon,
  UsersIcon,
  StarIcon,
  TreePineIcon,
  MessageSquareIcon,
  CheckCircle,
  AlertCircle,
  ZapIcon,
  GlobeIcon,
  BellIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  created_at: string;
  image_url?: string;
  images?: string[];
  featured_image_index?: number;
  featured?: boolean;
  published?: boolean;
  category?: string;
  views?: number;
  author_name?: string;
}

const categoryMapping = [
  { id: 'desenvolvimento', name: 'Desenvolvimento', color: 'bg-blue-500', icon: TrendingUpIcon },
  { id: 'educacao', name: 'Educação', color: 'bg-green-500', icon: BookOpenIcon },
  { id: 'saude', name: 'Saúde', color: 'bg-red-500', icon: UsersIcon },
  { id: 'obras', name: 'Obras Públicas', color: 'bg-orange-500', icon: Building2Icon },
  { id: 'turismo', name: 'Turismo', color: 'bg-purple-500', icon: StarIcon },
  { id: 'agricultura', name: 'Agricultura', color: 'bg-emerald-500', icon: TreePineIcon },
  { id: 'cultura', name: 'Cultura', color: 'bg-pink-500', icon: MessageSquareIcon },
];

const AllNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterAndSortNews();
  }, [news, searchTerm, sortBy, categoryFilter]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const newsWithExtras = data?.map((item, index) => ({
        ...item,
        category: getCategoryByIndex(index),
        views: Math.floor(Math.random() * 2000) + 100,
        author_name: 'Administração Municipal'
      })) || [];

      setNews(newsWithExtras);
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
    const filtered = news.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
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

  const featuredNews = filteredNews.filter(item => item.featured);
  const regularNews = filteredNews.filter(item => !item.featured);
  const paginatedNews = regularNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(regularNews.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
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
                  <NewspaperIcon className="w-14 h-14 text-white drop-shadow-lg" />
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
            <div className="max-w-4xl mx-auto space-y-8">
              <p className="text-xl md:text-2xl text-white/95 leading-relaxed font-light">
                Fique a par das <span className="font-semibold text-white">últimas notícias</span>, comunicados e desenvolvimentos 
                do <span className="font-semibold text-white">Município de Chipindo</span> com informações atualizadas e transparentes.
              </p>
              
              {/* News Stats Preview */}
              <div className="flex flex-wrap justify-center gap-4">
                <div className="group relative">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <NewspaperIcon className="w-5 h-5 text-white" />
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
                        <div className="text-sm font-semibold text-white">{featuredNews.length} Destaques</div>
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

      <main>
        {/* Search and Filters */}
        <Section variant="secondary" size="md">
          <SectionContent>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Main Search */}
                  <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="Pesquisar em todas as notícias..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-4 text-lg border-2 border-border/50 focus:border-primary rounded-xl"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-3 items-center">
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-48">
                          <TagIcon className="w-4 h-4 mr-2" />
                          <span>Categoria</span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as categorias</SelectItem>
                          {categoryMapping.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <category.icon className="w-4 h-4" />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-48">
                          <span>Ordenar por</span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">
                            <div className="flex items-center gap-2">
                              <SortDescIcon className="w-4 h-4" />
                              Mais recentes
                            </div>
                          </SelectItem>
                          <SelectItem value="oldest">
                            <div className="flex items-center gap-2">
                              <SortAscIcon className="w-4 h-4" />
                              Mais antigas
                            </div>
                          </SelectItem>
                          <SelectItem value="popular">
                            <div className="flex items-center gap-2">
                              <TrendingUpIcon className="w-4 h-4" />
                              Mais populares
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
                        {categoryFilter !== 'all' && <span className="text-primary">em {getCategoryData(categoryFilter).name}</span>}
                      </div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("all");
                        setSortBy("recent");
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

        {/* Featured News Section */}
        {featuredNews.length > 0 && (
          <Section variant="muted" size="md">
            <SectionHeader
              subtitle="Em Destaque"
              title="Notícias Destacadas"
              description="As notícias mais importantes selecionadas pela administração"
            />
            
            <SectionContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredNews.slice(0, 3).map((newsItem) => {
                  const categoryData = getCategoryData(newsItem.category || 'desenvolvimento');
                  const IconComponent = categoryData.icon;
                  
                  return (
                    <Card 
                      key={newsItem.id} 
                      className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      onClick={() => setSelectedNews(newsItem)}
                    >
                      <div className="relative overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
                          {newsItem.image_url ? (
                            <img 
                              src={newsItem.image_url} 
                              alt={newsItem.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className={cn("w-full h-full flex items-center justify-center", categoryData.color)}>
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
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {newsItem.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed text-sm">
                          {newsItem.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-3 h-3" />
                            {formatDate(newsItem.created_at)}
                          </div>
                          <div className="flex items-center gap-2">
                            <EyeIcon className="w-3 h-3" />
                            {newsItem.views}
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

        {/* Main News Grid */}
        <Section variant="default" size="lg">
          <SectionContent>
            {loading ? (
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              )}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden border-0 shadow-md">
                    <Skeleton className="aspect-video" />
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4" />
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
                  <NewspaperIcon className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">Nenhuma notícia encontrada</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Tente ajustar os filtros de pesquisa ou verificar os termos utilizados.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
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
                  viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                )}>
                  {paginatedNews.map((newsItem) => {
                    const categoryData = getCategoryData(newsItem.category || 'desenvolvimento');
                    const IconComponent = categoryData.icon;
                    
                    return (
                      <Card 
                        key={newsItem.id}
                        className={cn(
                          "group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                          viewMode === 'list' && "md:flex"
                        )}
                        onClick={() => setSelectedNews(newsItem)}
                      >
                        <div className={cn(
                          "relative overflow-hidden",
                          viewMode === 'list' ? "md:w-80 flex-shrink-0" : ""
                        )}>
                          <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative">
                            {newsItem.image_url ? (
                              <img 
                                src={newsItem.image_url} 
                                alt={newsItem.title}
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
                            {newsItem.featured && (
                              <Badge className="absolute top-3 right-3 bg-yellow-500 text-yellow-900 border-0 shadow-md">
                                <StarIcon className="w-3 h-3 mr-1" />
                                Destaque
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 p-4">
                          <CardTitle className={cn(
                            "leading-tight group-hover:text-primary transition-colors duration-300 mb-3 line-clamp-2",
                            viewMode === 'list' ? "text-lg" : "text-base"
                          )}>
                            {newsItem.title}
                          </CardTitle>
                          
                          <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed text-sm">
                            {newsItem.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                {formatDate(newsItem.created_at)}
                              </div>
                              <div className="flex items-center gap-1">
                                <EyeIcon className="w-3 h-3" />
                                {newsItem.views}
                              </div>
                            </div>
                            <span className="text-xs">
                              {getTimeAgo(newsItem.created_at)}
                            </span>
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
                    
                    {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                      let page;
                      if (totalPages <= 7) {
                        page = i + 1;
                      } else {
                        if (currentPage <= 4) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 3) {
                          page = totalPages - 6 + i;
                        } else {
                          page = currentPage - 3 + i;
                        }
                      }
                      
                      if (page < 1 || page > totalPages) return null;
                      
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
            <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] p-0 bg-white overflow-hidden flex flex-col">
              {/* DialogTitle para acessibilidade - oculto visualmente */}
              <DialogTitle className="sr-only">
                {selectedNews.title}
              </DialogTitle>
              
              {/* Header com botão de fechar */}
              <div className="absolute top-2 right-2 md:top-4 md:right-4 z-50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNews(null)}
                  className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border border-gray-200 h-8 w-8 md:h-10 md:w-10 p-0"
                >
                  <XIcon className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
              
              {/* Container principal com scroll */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col md:flex-row min-h-full">
                  {/* Coluna da Imagem - Lado Esquerdo */}
                  <div className="w-full md:w-1/2 relative bg-gradient-to-br from-blue-50 to-purple-50 flex-shrink-0">
                    {((selectedNews.images && selectedNews.images.length > 0) || selectedNews.image_url) ? (
                      <div className="w-full flex items-center justify-center p-4 md:p-6 min-h-[200px] md:min-h-[400px]">
                        <div className="relative w-full max-w-md mx-auto">
                          <Carousel className="w-full">
                            <CarouselContent>
                              {/* Exibir múltiplas imagens se disponíveis */}
                              {selectedNews.images && selectedNews.images.length > 0 ? (
                                selectedNews.images.map((imageUrl, index) => (
                                  <CarouselItem key={index}>
                                    <div className="relative w-full aspect-[4/3] flex items-center justify-center">
                                      <img 
                                        src={imageUrl} 
                                        alt={`${selectedNews.title} - Imagem ${index + 1}`}
                                        className="w-full h-full object-cover rounded-xl shadow-2xl border-4 border-white"
                                      />
                                      {/* Indicador de imagem destacada */}
                                      {index === (selectedNews.featured_image_index || 0) && (
                                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                                          Principal
                                        </div>
                                      )}
                                    </div>
                                  </CarouselItem>
                                ))
                              ) : (
                                /* Fallback para image_url antiga */
                                <CarouselItem>
                                  <div className="relative w-full aspect-[4/3] flex items-center justify-center">
                                    <img 
                                      src={selectedNews.image_url} 
                                      alt={selectedNews.title}
                                      className="w-full h-full object-cover rounded-xl shadow-2xl border-4 border-white"
                                    />
                                  </div>
                                </CarouselItem>
                              )}
                            </CarouselContent>
                            {/* Controles do carrossel - visíveis apenas quando há múltiplas imagens */}
                            {selectedNews.images && selectedNews.images.length > 1 && (
                              <>
                                <CarouselPrevious className="left-2 md:left-4 z-20 bg-white hover:bg-gray-100 shadow-xl border-2 border-gray-300 h-8 w-8 md:h-10 md:w-10" />
                                <CarouselNext className="right-2 md:right-4 z-20 bg-white hover:bg-gray-100 shadow-xl border-2 border-gray-300 h-8 w-8 md:h-10 md:w-10" />
                              </>
                            )}
                          </Carousel>
                          {/* Indicador de quantidade de imagens */}
                          {selectedNews.images && selectedNews.images.length > 1 && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full z-20">
                              {selectedNews.images.length} imagens
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-center p-6 min-h-[200px]">
                        <div className="text-center">
                          <div className={cn(
                            "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg",
                            getCategoryData(selectedNews.category || 'desenvolvimento').color
                          )}>
                            {React.createElement(getCategoryData(selectedNews.category || 'desenvolvimento').icon, {
                              className: "w-10 h-10 text-white"
                            })}
                          </div>
                          <h3 className="text-base font-semibold text-gray-700 mb-1">Sem imagem</h3>
                          <p className="text-sm text-gray-500">Esta notícia não possui imagem</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Badge de categoria sobre a imagem */}
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className={cn(
                        "text-xs md:text-sm font-medium shadow-lg backdrop-blur-sm",
                        getCategoryData(selectedNews.category || 'desenvolvimento').color,
                        "text-white border-0"
                      )}>
                        {React.createElement(getCategoryData(selectedNews.category || 'desenvolvimento').icon, {
                          className: "w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2"
                        })}
                        {getCategoryData(selectedNews.category || 'desenvolvimento').name}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Coluna do Conteúdo - Lado Direito */}
                  <div className="w-full md:w-1/2 flex flex-col bg-white">
                    {/* Conteúdo com padding */}
                    <div className="p-4 md:p-6 lg:p-8">
                      {/* Header do conteúdo */}
                      <div className="mb-4 md:mb-6">
                        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight mb-3 md:mb-4 text-gray-900" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                          {selectedNews.title}
                        </h1>
                        
                        {/* Meta informações */}
                        <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            <span className="font-medium">{formatDate(selectedNews.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            <span>{getTimeAgo(selectedNews.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <EyeIcon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            <span>{selectedNews.views || 0} views</span>
                          </div>
                        </div>
                        
                        {/* Autor */}
                        {selectedNews.author_name && (
                          <div className="mt-3 md:mt-4 bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow flex-shrink-0">
                                <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900 text-sm md:text-base truncate">Por {selectedNews.author_name}</p>
                                <p className="text-xs md:text-sm text-gray-600">Autor da publicação</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Conteúdo da notícia */}
                      <div className="space-y-4 md:space-y-6">
                        {/* Excerpt */}
                        {selectedNews.excerpt && (
                          <div className="border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg overflow-hidden">
                            <blockquote className="p-3 md:p-4">
                              <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed font-medium italic" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                "{selectedNews.excerpt}"
                              </p>
                            </blockquote>
                          </div>
                        )}
                        
                        {/* Conteúdo principal */}
                        <div className="max-w-full overflow-hidden">
                          <div 
                            className="text-gray-800 leading-relaxed text-sm md:text-base whitespace-pre-wrap"
                            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                          >
                            {selectedNews.content}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer com ações */}
                    <div className="mt-auto bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200">
                      <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => shareNews(selectedNews)}
                          className="hover:bg-blue-50 hover:border-blue-200 bg-white shadow text-xs md:text-sm h-8 md:h-9"
                        >
                          <ShareIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                          Partilhar
                        </Button>
                        
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <EyeIcon className="w-3 h-3" />
                          {selectedNews.views || 0}
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

export default AllNews;