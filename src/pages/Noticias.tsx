import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ClockIcon, UserIcon, SearchIcon, TagIcon, EyeIcon } from "lucide-react";

const newsData = [
  {
    id: 1,
    title: "Nova Escola Primária Inaugurada em Chipindo",
    excerpt: "A Administração Municipal inaugurou uma nova escola primária com capacidade para 300 alunos, equipada com laboratório de informática e biblioteca.",
    content: "A cerimónia de inauguração contou com a presença do Administrador Municipal, pais e encarregados de educação...",
    category: "Educação",
    author: "Administração Municipal",
    date: "2024-01-15",
    time: "14:30",
    image: "photo-1497486751825-1233686d5d80",
    views: 1250,
    featured: true
  },
  {
    id: 2,
    title: "Campanha de Vacinação Infantil",
    excerpt: "Inicia-se amanhã a campanha de vacinação contra sarampo e poliomielite para crianças dos 6 meses aos 5 anos.",
    content: "A campanha decorrerá em todas as unidades de saúde do município...",
    category: "Saúde",
    author: "Direção de Saúde",
    date: "2024-01-14",
    time: "09:00",
    image: "photo-1576091160399-112ba8d25d1f",
    views: 890,
    featured: false
  },
  {
    id: 3,
    title: "Reabilitação da Estrada Principal",
    excerpt: "Obras de reabilitação da estrada principal do município começaram esta semana, melhorando o acesso às comunidades rurais.",
    content: "O projeto contempla 15 km de estrada asfaltada e drenagem...",
    category: "Obras Públicas",
    author: "Direção de Obras",
    date: "2024-01-13",
    time: "16:45",
    image: "photo-1504307651254-35680f356dfd",
    views: 675,
    featured: true
  },
  {
    id: 4,
    title: "Festival Cultural de Chipindo 2024",
    excerpt: "Programação completa do festival cultural que celebra as tradições locais com música, dança e gastronomia típica.",
    content: "O evento decorrerá na praça central durante três dias...",
    category: "Cultura",
    author: "Direção de Cultura",
    date: "2024-01-12",
    time: "11:20",
    image: "photo-1493932484895-752d1471eab5",
    views: 1520,
    featured: false
  },
  {
    id: 5,
    title: "Programa de Microcrédito Rural",
    excerpt: "Lançamento de programa de apoio aos agricultores com microcrédito para aquisição de sementes e equipamentos.",
    content: "O programa visa apoiar 200 famílias rurais...",
    category: "Agricultura",
    author: "Direção de Agricultura",
    date: "2024-01-11",
    time: "08:15",
    image: "photo-1416879595882-3373a0480b5b",
    views: 432,
    featured: false
  }
];

export default function Noticias() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedNews, setSelectedNews] = useState<typeof newsData[0] | null>(null);

  const categories = ["Todas", "Educação", "Saúde", "Obras Públicas", "Cultura", "Agricultura"];

  const filteredNews = newsData.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredNews = newsData.filter(news => news.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Notícias de Chipindo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Mantenha-se informado sobre os últimos acontecimentos e desenvolvimentos do nosso município
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Pesquisar notícias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-300"
              >
                <TagIcon className="w-4 h-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured News */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Notícias em Destaque</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredNews.map(news => (
              <Card 
                key={news.id} 
                className="hover:shadow-glow transition-all duration-300 cursor-pointer group overflow-hidden"
                onClick={() => setSelectedNews(news)}
              >
                <div className="relative overflow-hidden">
                  <div 
                    className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(https://images.unsplash.com/${news.image}?auto=format&fit=crop&w=400&q=80)` }}
                  />
                  <Badge className="absolute top-3 left-3 bg-gradient-primary">
                    {news.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">
                    {news.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{news.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(news.date).toLocaleDateString('pt-PT')}
                      </div>
                      <div className="flex items-center gap-1">
                        <EyeIcon className="w-4 h-4" />
                        {news.views}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All News */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Todas as Notícias</h2>
          <div className="grid gap-6">
            {filteredNews.map(news => (
              <Card 
                key={news.id}
                className="hover:shadow-elegant transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedNews(news)}
              >
                <div className="md:flex">
                  <div 
                    className="md:w-64 h-48 md:h-auto bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(https://images.unsplash.com/${news.image}?auto=format&fit=crop&w=300&q=80)` }}
                  />
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <Badge variant="outline">{news.category}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(news.date).toLocaleDateString('pt-PT')}
                        <ClockIcon className="w-4 h-4 ml-2" />
                        {news.time}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {news.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{news.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UserIcon className="w-4 h-4" />
                        {news.author}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <EyeIcon className="w-4 h-4" />
                        {news.views} visualizações
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* News Modal */}
        {selectedNews && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={() => setSelectedNews(null)}
                >
                  ✕
                </Button>
                <div 
                  className="h-64 bg-cover bg-center rounded-lg mb-4"
                  style={{ backgroundImage: `url(https://images.unsplash.com/${selectedNews.image}?auto=format&fit=crop&w=800&q=80)` }}
                />
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-gradient-primary">{selectedNews.category}</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(selectedNews.date).toLocaleDateString('pt-PT')}
                    <ClockIcon className="w-4 h-4 ml-2" />
                    {selectedNews.time}
                  </div>
                </div>
                <CardTitle className="text-2xl">{selectedNews.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-lg text-muted-foreground mb-6">{selectedNews.excerpt}</p>
                  <p className="text-foreground leading-relaxed">{selectedNews.content}</p>
                </div>
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserIcon className="w-4 h-4" />
                    {selectedNews.author}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <EyeIcon className="w-4 h-4" />
                    {selectedNews.views} visualizações
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
}