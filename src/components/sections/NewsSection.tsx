import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { CalendarIcon, EyeIcon, ArrowRightIcon, ClockIcon, TrendingUpIcon, BookOpenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  created_at: string;
  category: string;
  image_url?: string;
  featured?: boolean;
  views?: number;
}

export const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('id, title, excerpt, created_at, image_url, featured')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      const newsWithCategories = data?.map((item, index) => ({
        ...item,
        category: getCategoryByIndex(index),
        views: Math.floor(Math.random() * 500) + 50 // Mock views for demo
      })) || [];

      setNews(newsWithCategories);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryByIndex = (index: number) => {
    const categories = ['Desenvolvimento', 'Educação', 'Saúde', 'Obras Públicas', 'Turismo', 'Agricultura'];
    return categories[index % categories.length];
  };

  const featuredNews = news.find(newsItem => newsItem.featured);
  const regularNews = news.filter(newsItem => !newsItem.featured).slice(0, 3);

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
    return `Há ${diffInDays} dias`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Educação': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
      'Saúde': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
      'Obras Públicas': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',
      'Desenvolvimento': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
      'Turismo': 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800',
      'Agricultura': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  };

  if (loading) {
    return (
      <Section id="noticias" variant="secondary" size="lg" pattern="dots">
        <SectionHeader
          subtitle="Informações"
          title="Últimas Notícias"
          description="Mantenha-se informado sobre os principais acontecimentos e desenvolvimentos do município de Chipindo"
        />
        <SectionContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="animate-pulse bg-muted rounded-xl h-96 card-elevated" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-muted rounded-xl h-32 card-elevated" />
              ))}
            </div>
          </div>
        </SectionContent>
      </Section>
    );
  }

  return (
    <Section id="noticias" variant="secondary" size="lg" pattern="dots">
      <SectionHeader
        subtitle="Informações"
        title="Últimas Notícias"
        description="Mantenha-se informado sobre os principais acontecimentos e desenvolvimentos do município de Chipindo"
        badge="Actualizado"
      />

      <SectionContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured News */}
          {featuredNews && (
            <div className="lg:col-span-2">
              <Card className="overflow-hidden card-interactive group border-0 shadow-floating hover:shadow-glow">
                <div className="relative aspect-video bg-gradient-primary">
                  {featuredNews.image_url ? (
                    <img 
                      src={featuredNews.image_url}
                      alt={featuredNews.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-hero flex items-center justify-center">
                      <BookOpenIcon className="w-16 h-16 text-primary-foreground/60" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge className={cn("border", getCategoryColor(featuredNews.category))}>
                        {featuredNews.category}
                      </Badge>
                        <div className="flex items-center gap-1 text-white/80 text-sm">
                          <TrendingUpIcon className="w-4 h-4" />
                          <span>Destaque</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-accent transition-colors duration-300">
                        {featuredNews.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-white/70 text-sm">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(featuredNews.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {getTimeAgo(featuredNews.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4" />
                          {featuredNews.views} visualizações
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 bg-gradient-card">
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {featuredNews.excerpt}
                  </p>
                  <Button 
                    variant="default" 
                    className="group/btn bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    Ler artigo completo
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Regular News */}
          <div className="space-y-6">
            {regularNews.map((newsItem) => (
              <Card key={newsItem.id} className="overflow-hidden card-interactive group border-0 shadow-card hover:shadow-floating">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className={cn("text-xs font-medium", getCategoryColor(newsItem.category))}>
                      {newsItem.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {getTimeAgo(newsItem.created_at)}
                    </span>
                  </div>
                  
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                    {newsItem.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                    {newsItem.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                        {formatDate(newsItem.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <EyeIcon className="w-3 h-3" />
                        {newsItem.views}
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 group/btn">
                      Ler mais
                      <ArrowRightIcon className="w-3 h-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className={cn(
              "hover-lift bg-gradient-surface border-primary/20 text-primary",
              "hover:bg-primary/5 hover:border-primary/40 hover:shadow-floating group"
            )}
            onClick={() => window.location.href = '/all-news'}
          >
            <BookOpenIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Ver todas as notícias
            <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </SectionContent>
    </Section>
  );
};