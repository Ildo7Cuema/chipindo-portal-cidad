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
  MessageSquareIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  created_at: string;
  image_url?: string;
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
    let filtered = news.filter(item => {
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
      
      <main>
        {/* Hero Section */}
        <Section variant="primary" size="lg">
          <SectionContent>
            <div className="text-center space-y-8">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/30">
                  <NewspaperIcon className="w-10 h-10 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                    Todas as
                    <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      Notícias
                    </span>
                  </h1>
                  <p className="text-primary-foreground/90 text-xl mt-2">
                    Portal Municipal de Chipindo
                  </p>
                </div>
              </div>
              
              <p className="text-xl text-primary-foreground/95 max-w-4xl mx-auto leading-relaxed">
                Arquivo completo de todas as notícias, comunicados e acontecimentos 
                importantes do município de Chipindo, organizados para fácil consulta.
              </p>
              
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                  <NewspaperIcon className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">{news.length} Notícias Total</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-yellow-500/20 rounded-full backdrop-blur-md border border-yellow-400/30">
                  <FlameIcon className="w-5 h-5 text-yellow-100" />
                  <span className="text-yellow-100 font-medium">{featuredNews.length} Destacadas</span>
                </div>
              </div>
            </div>
          </SectionContent>
        </Section>

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
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader className="pb-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      getCategoryData(selectedNews.category || 'desenvolvimento').color
                    )}>
                      {React.createElement(getCategoryData(selectedNews.category || 'desenvolvimento').icon, {
                        className: "w-6 h-6 text-white"
                      })}
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold leading-tight">
                        {selectedNews.title}
                      </DialogTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(selectedNews.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {getTimeAgo(selectedNews.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4" />
                          {selectedNews.views} visualizações
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareNews(selectedNews)}
                    >
                      <ShareIcon className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedNews(null)}
                    >
                      <XIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              
              <ScrollArea className="flex-1 py-6">
                <div className="space-y-6">
                  {selectedNews.image_url && (
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <img 
                        src={selectedNews.image_url} 
                        alt={selectedNews.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="prose max-w-none dark:prose-invert">
                    <p className="text-xl text-muted-foreground mb-6 leading-relaxed font-medium">
                      {selectedNews.excerpt}
                    </p>
                    <div className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
                      {selectedNews.content}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="pt-6 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getCategoryData(selectedNews.category || 'desenvolvimento').color}>
                      {React.createElement(getCategoryData(selectedNews.category || 'desenvolvimento').icon, {
                        className: "w-4 h-4 mr-1 text-white"
                      })}
                      {getCategoryData(selectedNews.category || 'desenvolvimento').name}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserIcon className="w-4 h-4" />
                      {selectedNews.author_name}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                      <HeartIcon className="w-4 h-4 mr-2" />
                      Curtir
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => shareNews(selectedNews)}>
                      <SendIcon className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
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