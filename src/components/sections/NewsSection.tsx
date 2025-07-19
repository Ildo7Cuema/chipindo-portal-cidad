import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, EyeIcon, ArrowRightIcon } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  views: number;
  category: string;
  image?: string;
  featured?: boolean;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Nova Escola Primária inaugurada no Bairro Central",
    excerpt: "A Administração Municipal inaugurou uma moderna escola primária com capacidade para 500 alunos, equipada com biblioteca e laboratório de informática.",
    date: "2024-01-15",
    views: 1250,
    category: "Educação",
    featured: true
  },
  {
    id: "2", 
    title: "Centro de Saúde de Chipindo recebe novos equipamentos",
    excerpt: "Investimento em equipamentos médicos modernos fortalece os serviços de saúde oferecidos aos cidadãos do município.",
    date: "2024-01-12",
    views: 892,
    category: "Saúde"
  },
  {
    id: "3",
    title: "Obras de pavimentação da Rua Principal concluídas",
    excerpt: "Concluídas as obras de pavimentação de 5km da Rua Principal, melhorando a mobilidade urbana e o acesso ao centro da cidade.",
    date: "2024-01-10",
    views: 756,
    category: "Obras Públicas"
  },
  {
    id: "4",
    title: "Programa de capacitação para jovens empreendedores",
    excerpt: "Iniciativa visa formar jovens em técnicas de gestão e empreendedorismo, promovendo o desenvolvimento económico local.",
    date: "2024-01-08",
    views: 643,
    category: "Desenvolvimento"
  }
];

export const NewsSection = () => {
  const featuredNews = mockNews.find(news => news.featured);
  const regularNews = mockNews.filter(news => !news.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Educação': 'bg-blue-100 text-blue-800',
      'Saúde': 'bg-green-100 text-green-800',
      'Obras Públicas': 'bg-orange-100 text-orange-800',
      'Desenvolvimento': 'bg-purple-100 text-purple-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section id="noticias" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Últimas Notícias
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mantenha-se informado sobre os principais acontecimentos e 
            desenvolvimentos do município de Chipindo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured News */}
          {featuredNews && (
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-300">
                <div className="aspect-video bg-gradient-primary relative">
                  <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                    <div>
                      <Badge className={getCategoryColor(featuredNews.category)}>
                        {featuredNews.category}
                      </Badge>
                      <h3 className="text-2xl font-bold text-white mt-3 mb-2">
                        {featuredNews.title}
                      </h3>
                      <div className="flex items-center gap-4 text-white/80 text-sm">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(featuredNews.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4" />
                          {featuredNews.views.toLocaleString()} visualizações
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    {featuredNews.excerpt}
                  </p>
                  <Button variant="institutional">
                    Ler mais
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Regular News */}
          <div className="space-y-6">
            {regularNews.map((news) => (
              <Card key={news.id} className="overflow-hidden hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className={getCategoryColor(news.category)}>
                      {news.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <EyeIcon className="w-3 h-3" />
                      {news.views}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight hover:text-primary transition-colors cursor-pointer">
                    {news.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarIcon className="w-3 h-3" />
                      {formatDate(news.date)}
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Ler mais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Ver todas as notícias
            <ArrowRightIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};