import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import {
  CalendarIcon,
  EyeIcon,
  ArrowRightIcon,
  ClockIcon,
  TrendingUpIcon,
  BookOpenIcon,
  StarIcon,
  UsersIcon,
  Building2Icon,
  TreePineIcon,
  MessageSquareIcon,
  ZapIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import React from "react";

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

const categoryMapping = [
  { id: 'Desenvolvimento', icon: TrendingUpIcon, color: 'bg-blue-500', bgColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800' },
  { id: 'Educação', icon: BookOpenIcon, color: 'bg-green-500', bgColor: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800' },
  { id: 'Saúde', icon: UsersIcon, color: 'bg-red-500', bgColor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-800' },
  { id: 'Obras Públicas', icon: Building2Icon, color: 'bg-orange-500', bgColor: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-800' },
  { id: 'Turismo', icon: StarIcon, color: 'bg-purple-500', bgColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-800' },
  { id: 'Agricultura', icon: TreePineIcon, color: 'bg-emerald-500', bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-800' },
  { id: 'Cultura', icon: MessageSquareIcon, color: 'bg-pink-500', bgColor: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/20 dark:text-pink-300 dark:border-pink-800' },
];

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
        views: Math.floor(Math.random() * 2000) + 100
      })) || [];

      setNews(newsWithCategories);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryByIndex = (index: number) => {
    const categories = ['Desenvolvimento', 'Educação', 'Saúde', 'Obras Públicas', 'Turismo', 'Agricultura', 'Cultura'];
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
    return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  };

  const getCategoryData = (category: string) => {
    return categoryMapping.find(cat => cat.id === category) || categoryMapping[0];
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
              <div className="animate-pulse bg-muted rounded-xl h-96 shadow-lg" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-muted rounded-xl h-32 shadow-lg" />
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
        badge="Atualizado"
      />

      <SectionContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured News */}
          {featuredNews && (
            <div className="lg:col-span-2">
              <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <div className="relative aspect-video">
                  {featuredNews.image_url ? (
                    <img
                      src={featuredNews.image_url}
                      alt={featuredNews.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <BookOpenIcon className="w-16 h-16 text-white/80" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-3">
                    <Badge className={cn("border-0 text-white shadow-lg", getCategoryData(featuredNews.category).color)}>
                      {React.createElement(getCategoryData(featuredNews.category).icon, {
                        className: "w-3 h-3 mr-1"
                      })}
                      {featuredNews.category}
                    </Badge>
                    <Badge className="bg-yellow-500 text-yellow-900 border-0 shadow-lg">
                      <StarIcon className="w-3 h-3 mr-1" />
                      Destaque
                    </Badge>
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-yellow-300 transition-colors duration-300 line-clamp-2">
                        {featuredNews.title}
                      </h3>

                      <div className="flex items-center gap-4 text-white/80 text-sm">
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
                          {featuredNews.views}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8 relative z-20">
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-2 text-lg font-light">
                    {featuredNews.excerpt}
                  </p>
                  <Button
                    variant="default"
                    className="group/btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => window.location.href = '/noticias'}
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
            {regularNews.map((newsItem) => {
              const categoryData = getCategoryData(newsItem.category);
              const IconComponent = categoryData.icon;

              return (
                <Card
                  key={newsItem.id}
                  className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  onClick={() => window.location.href = '/noticias'}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className={cn("text-xs font-medium border", categoryData.bgColor)}>
                        <IconComponent className="w-3 h-3 mr-1" />
                        {newsItem.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {getTimeAgo(newsItem.created_at)}
                      </span>
                    </div>

                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
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
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-primary/5 hover:border-primary/40 hover:shadow-lg group bg-white dark:bg-gray-900 shadow-md"
              onClick={() => window.location.href = '/noticias'}
            >
              <BookOpenIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Ver todas as notícias
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            <Button
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg group"
              onClick={() => window.location.href = '/all-news'}
            >
              <ZapIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Arquivo completo
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </SectionContent>
    </Section>
  );
};