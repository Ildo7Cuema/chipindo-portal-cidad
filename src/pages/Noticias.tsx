import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
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
  TreePineIcon as TreeIcon
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
}

const categoryMapping = [
  { id: 'desenvolvimento', name: 'Desenvolvimento', color: 'bg-blue-500', icon: TrendingUpIcon },
  { id: 'educacao', name: 'Educação', color: 'bg-green-500', icon: BookmarkIcon },
  { id: 'saude', name: 'Saúde', color: 'bg-red-500', icon: UserIcon },
  { id: 'obras', name: 'Obras Públicas', color: 'bg-orange-500', icon: GridIcon },
  { id: 'turismo', name: 'Turismo', color: 'bg-purple-500', icon: StarIcon },
  { id: 'agricultura', name: 'Agricultura', color: 'bg-emerald-500', icon: TreeIcon },
  { id: 'cultura', name: 'Cultura', color: 'bg-pink-500', icon: ShareIcon },
  { id: 'todos', name: 'Todas as Categorias', color: 'bg-slate-500', icon: NewsIcon }
];

const Noticias = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterAndSortNews();
  }, [news, searchTerm, selectedCategory, sortBy]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          profiles:author_id (
            full_name
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const newsWithCategories = data?.map((item, index) => ({
        ...item,
        category: getCategoryByIndex(index),
        views: Math.floor(Math.random() * 2000) + 100,
        author_name: item.profiles?.full_name || 'Administração Municipal'
      })) || [];

      setNews(newsWithCategories);
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
                  <NewsIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Central de Notícias
                  </h1>
                  <p className="text-primary-foreground/90 text-lg">
                    Administração Municipal de Chipindo
          </p>
        </div>
              </div>
              
              <p className="text-xl text-primary-foreground/95 max-w-3xl mx-auto leading-relaxed">
                Acompanhe os desenvolvimentos, projetos e conquistas que transformam 
                nossa comunidade e impactam a vida dos cidadãos de Chipindo.
              </p>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <TrendingUpIcon className="w-4 h-4 mr-2" />
                  {news.length} Notícias Publicadas
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-4 py-2">
                  <FlameIcon className="w-4 h-4 mr-2" />
                  {featuredNews.length} em Destaque
                </Badge>
                <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30 px-4 py-2">
                  <StarIcon className="w-4 h-4 mr-2" />
                  Atualização Diária
                </Badge>
              </div>
            </div>
          </SectionContent>
        </Section>

        {/* Featured News Section */}
        {featuredNews.length > 0 && (
          <Section variant="secondary" size="lg">
            <SectionHeader
              subtitle="Destaques da Semana"
              title={
                <span>
                  Notícias em{' '}
                  <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    Destaque
                  </span>
                </span>
              }
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
                      className="group cursor-pointer overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
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
                          <Badge className={cn("absolute top-4 left-4", categoryData.color, "text-white border-0")}>
                            <IconComponent className="w-3 h-3 mr-1" />
                            {categoryData.name}
                          </Badge>
                          <Badge className="absolute top-4 right-4 bg-yellow-500 text-yellow-900 border-0">
                            <StarIcon className="w-3 h-3 mr-1" />
                            Destaque
                  </Badge>
                </div>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors duration-300">
                          {item.title}
                  </CardTitle>
                </CardHeader>
                      
                <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-3">{item.excerpt}</p>
                        
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
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(item.created_at)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <UserIcon className="w-4 h-4" />
                            {item.author_name}
                          </div>
                          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                            Ler Mais
                            <ArrowRightIcon className="w-4 h-4 ml-1" />
                          </Button>
                  </div>
                </CardContent>
              </Card>
                  );
                })}
          </div>
            </SectionContent>
          </Section>
        )}

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
                      placeholder="Pesquisar notícias, eventos, anúncios..."
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
                      
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                          <TagIcon className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryMapping.map(category => {
                            const IconComponent = category.icon;
                            return (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="w-4 h-4" />
                                  {category.name}
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

                  {/* Category Filters */}
                  {showFilters && (
                    <div className="border-t border-border/50 pt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-3">Filtrar por categoria:</p>
                      <div className="flex flex-wrap gap-2">
                        {categoryMapping.map(category => {
                          const IconComponent = category.icon;
                          return (
                            <Button
                              key={category.id}
                              variant={selectedCategory === category.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedCategory(category.id)}
                              className="flex items-center gap-2"
                            >
                              <IconComponent className="w-4 h-4" />
                              {category.name}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Results Summary */}
                  <div className="text-sm text-muted-foreground">
                    {loading ? (
                      <Skeleton className="h-4 w-48" />
                    ) : (
                      <span>
                        {filteredNews.length} notícia{filteredNews.length !== 1 ? 's' : ''} encontrada{filteredNews.length !== 1 ? 's' : ''}
                        {searchTerm && ` para "${searchTerm}"`}
                        {selectedCategory !== 'todos' && ` em ${getCategoryData(selectedCategory).name}`}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>

        {/* News Grid/List Section */}
        <Section variant="default" size="lg">
          <SectionContent>
            {loading ? (
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
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
              <div className="text-center py-16">
                <NewsIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Nenhuma notícia encontrada</h3>
                <p className="text-muted-foreground mb-6">
                  Tente ajustar seus filtros de busca ou verificar a categoria selecionada.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("todos");
                    setSortBy("recent");
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
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
                          "group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300",
                          viewMode === 'list' && "md:flex"
                        )}
                        onClick={() => setSelectedNews(item)}
                      >
                        <div className={cn(
                          "relative overflow-hidden",
                          viewMode === 'list' ? "md:w-64 flex-shrink-0" : ""
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
                            <Badge className={cn("absolute top-3 left-3", categoryData.color, "text-white border-0")}>
                              <IconComponent className="w-3 h-3 mr-1" />
                              {categoryData.name}
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
                          
                          <p className="text-muted-foreground mb-4 line-clamp-2">{item.excerpt}</p>
                          
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
                            <span className="text-xs">
                              {getTimeAgo(item.created_at)}
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

        {/* News Modal */}
        {selectedNews && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-10"
                  onClick={() => setSelectedNews(null)}
                >
                  <XIcon className="w-5 h-5" />
                </Button>
                
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 relative overflow-hidden">
                  {selectedNews.image_url ? (
                    <img 
                      src={selectedNews.image_url} 
                      alt={selectedNews.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <NewsIcon className="w-16 h-16 text-white/80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <Badge className={cn(getCategoryData(selectedNews.category || 'desenvolvimento').color, "text-white")}>
                    {getCategoryData(selectedNews.category || 'desenvolvimento').name}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="w-4 h-4" />
                    {formatDate(selectedNews.created_at)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ClockIcon className="w-4 h-4" />
                    {getTimeAgo(selectedNews.created_at)}
                  </div>
                </div>
                
                <CardTitle className="text-3xl leading-tight">{selectedNews.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="prose max-w-none dark:prose-invert">
                  <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{selectedNews.excerpt}</p>
                  <div className="text-foreground leading-relaxed whitespace-pre-wrap">{selectedNews.content}</div>
                </div>
                
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserIcon className="w-4 h-4" />
                    {selectedNews.author_name}
                  </div>
                  <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <EyeIcon className="w-4 h-4" />
                    {selectedNews.views} visualizações
                    </div>
                    <Button size="sm" variant="outline">
                      <ShareIcon className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Noticias;