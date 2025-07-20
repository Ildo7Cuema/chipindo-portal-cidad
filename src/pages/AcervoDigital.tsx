import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpenIcon, 
  ImageIcon, 
  VideoIcon, 
  FileTextIcon, 
  SearchIcon, 
  DownloadIcon,
  CalendarIcon,
  EyeIcon,
  PlayIcon,
  FolderIcon
} from "lucide-react";

const acervoData = {
  educacao: [
    {
      id: 1,
      title: "Manual de Alfabetização Infantil",
      type: "documento",
      category: "Material Didático",
      description: "Guia completo para professores do ensino primário",
      date: "2024-01-15",
      size: "2.5 MB",
      downloads: 234,
      thumbnail: "photo-1497486751825-1233686d5d80"
    },
    {
      id: 2,
      title: "Cerimónia de Inauguração da Escola",
      type: "video",
      category: "Eventos",
      description: "Registro da inauguração da nova escola primária",
      date: "2024-01-10",
      duration: "15:30",
      views: 890,
      thumbnail: "photo-1497486751825-1233686d5d80"
    },
    {
      id: 3,
      title: "Galeria da Feira de Ciências",
      type: "imagem",
      category: "Eventos",
      description: "Fotos da feira de ciências 2024",
      date: "2024-01-08",
      count: 45,
      views: 456,
      thumbnail: "photo-1532094349884-543bc11b234d"
    }
  ],
  saude: [
    {
      id: 4,
      title: "Protocolo de Vacinação Infantil",
      type: "documento",
      category: "Protocolos",
      description: "Diretrizes para campanha de vacinação",
      date: "2024-01-12",
      size: "1.8 MB",
      downloads: 156,
      thumbnail: "photo-1576091160399-112ba8d25d1f"
    },
    {
      id: 5,
      title: "Campanha de Prevenção da Malária",
      type: "video",
      category: "Campanhas",
      description: "Vídeo educativo sobre prevenção da malária",
      date: "2024-01-05",
      duration: "8:45",
      views: 1200,
      thumbnail: "photo-1576091160399-112ba8d25d1f"
    }
  ],
  obras: [
    {
      id: 6,
      title: "Projeto da Nova Ponte",
      type: "documento",
      category: "Projetos",
      description: "Plantas e especificações técnicas",
      date: "2024-01-14",
      size: "5.2 MB",
      downloads: 89,
      thumbnail: "photo-1504307651254-35680f356dfd"
    },
    {
      id: 7,
      title: "Progresso da Construção da Estrada",
      type: "imagem",
      category: "Obras em Curso",
      description: "Acompanhamento visual das obras",
      date: "2024-01-11",
      count: 32,
      views: 234,
      thumbnail: "photo-1504307651254-35680f356dfd"
    }
  ],
  cultura: [
    {
      id: 8,
      title: "Festival Cultural 2024",
      type: "video",
      category: "Festivais",
      description: "Highlights do festival cultural anual",
      date: "2024-01-13",
      duration: "22:15",
      views: 1850,
      thumbnail: "photo-1493932484895-752d1471eab5"
    },
    {
      id: 9,
      title: "Tradições Locais de Chipindo",
      type: "documento",
      category: "Patrimônio",
      description: "Documentário sobre as tradições culturais",
      date: "2024-01-09",
      size: "3.7 MB",
      downloads: 298,
      thumbnail: "photo-1493932484895-752d1471eab5"
    }
  ],
  agricultura: [
    {
      id: 10,
      title: "Técnicas de Cultivo Sustentável",
      type: "video",
      category: "Capacitação",
      description: "Treinamento para agricultores locais",
      date: "2024-01-16",
      duration: "18:20",
      views: 567,
      thumbnail: "photo-1416879595882-3373a0480b5b"
    },
    {
      id: 11,
      title: "Manual de Agricultura Familiar",
      type: "documento",
      category: "Manuais",
      description: "Guia prático para pequenos produtores",
      date: "2024-01-07",
      size: "4.1 MB",
      downloads: 423,
      thumbnail: "photo-1416879595882-3373a0480b5b"
    }
  ]
};

const direcoes = [
  { key: "educacao", label: "Educação", icon: BookOpenIcon, color: "bg-blue-500" },
  { key: "saude", label: "Saúde", icon: FileTextIcon, color: "bg-green-500" },
  { key: "obras", label: "Obras Públicas", icon: FolderIcon, color: "bg-orange-500" },
  { key: "cultura", label: "Cultura", icon: ImageIcon, color: "bg-purple-500" },
  { key: "agricultura", label: "Agricultura", icon: VideoIcon, color: "bg-emerald-500" }
];

export default function AcervoDigital() {
  const [selectedDirection, setSelectedDirection] = useState("educacao");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const currentData = acervoData[selectedDirection as keyof typeof acervoData] || [];
  
  const filteredData = currentData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "documento":
        return <FileTextIcon className="w-5 h-5" />;
      case "video":
        return <VideoIcon className="w-5 h-5" />;
      case "imagem":
        return <ImageIcon className="w-5 h-5" />;
      default:
        return <FileTextIcon className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "documento":
        return "bg-blue-500";
      case "video":
        return "bg-red-500";
      case "imagem":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Acervo Digital</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Documentos, imagens e vídeos organizados por direções municipais
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Pesquisar no acervo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Direction Tabs */}
        <Tabs value={selectedDirection} onValueChange={setSelectedDirection} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            {direcoes.map(direcao => {
              const IconComponent = direcao.icon;
              return (
                <TabsTrigger 
                  key={direcao.key} 
                  value={direcao.key}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{direcao.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {direcoes.map(direcao => (
            <TabsContent key={direcao.key} value={direcao.key}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map(item => (
                  <Card 
                    key={item.id} 
                    className="hover:shadow-glow transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="relative overflow-hidden">
                      <div 
                        className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                        style={{ backgroundImage: `url(https://images.unsplash.com/${item.thumbnail}?auto=format&fit=crop&w=400&q=80)` }}
                      >
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {item.type === 'video' && (
                            <PlayIcon className="w-12 h-12 text-white" />
                          )}
                          {item.type === 'documento' && (
                            <FileTextIcon className="w-12 h-12 text-white" />
                          )}
                          {item.type === 'imagem' && (
                            <ImageIcon className="w-12 h-12 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className={`${getTypeColor(item.type)} text-white`}>
                          <span className="flex items-center gap-1">
                            {getTypeIcon(item.type)}
                            {item.type}
                          </span>
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarIcon className="w-3 h-3" />
                          {new Date(item.date).toLocaleDateString('pt-PT')}
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          {item.type === 'documento' && (
                            <>
                              <div className="flex items-center gap-1">
                                <DownloadIcon className="w-3 h-3" />
                                {item.downloads}
                              </div>
                              <span>{item.size}</span>
                            </>
                          )}
                          {item.type === 'video' && (
                            <>
                              <div className="flex items-center gap-1">
                                <EyeIcon className="w-3 h-3" />
                                {'views' in item ? item.views : 0}
                              </div>
                              <span>{'duration' in item ? item.duration : 'N/A'}</span>
                            </>
                          )}
                          {item.type === 'imagem' && (
                            <>
                              <div className="flex items-center gap-1">
                                <EyeIcon className="w-3 h-3" />
                                {'views' in item ? item.views : 0}
                              </div>
                              <span>{'count' in item ? item.count : 0} fotos</span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredData.length === 0 && (
                <div className="text-center py-12">
                  <FolderIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum item encontrado
                  </h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os termos de pesquisa ou explore outras direções.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Item Details Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={`${getTypeColor(selectedItem.type)} text-white`}>
                      <span className="flex items-center gap-1">
                        {getTypeIcon(selectedItem.type)}
                        {selectedItem.type}
                      </span>
                    </Badge>
                    <Badge variant="outline">{selectedItem.category}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedItem(null)}
                  >
                    ✕
                  </Button>
                </div>
                <CardTitle className="text-2xl">{selectedItem.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div 
                  className="h-64 bg-cover bg-center rounded-lg mb-6"
                  style={{ backgroundImage: `url(https://images.unsplash.com/${selectedItem.thumbnail}?auto=format&fit=crop&w=800&q=80)` }}
                />
                
                <div className="prose max-w-none mb-6">
                  <p className="text-lg text-muted-foreground">{selectedItem.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Informações</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data de Upload:</span>
                        <span className="font-medium">{new Date(selectedItem.date).toLocaleDateString('pt-PT')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Categoria:</span>
                        <span className="font-medium">{selectedItem.category}</span>
                      </div>
                      {selectedItem.size && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tamanho:</span>
                          <span className="font-medium">{selectedItem.size}</span>
                        </div>
                      )}
                      {'duration' in selectedItem && selectedItem.duration && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duração:</span>
                          <span className="font-medium">{selectedItem.duration}</span>
                        </div>
                      )}
                      {'count' in selectedItem && selectedItem.count && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quantidade:</span>
                          <span className="font-medium">{selectedItem.count} itens</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Estatísticas</h3>
                    <div className="space-y-2 text-sm">
                      {selectedItem.downloads && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Downloads:</span>
                          <span className="font-medium">{selectedItem.downloads}</span>
                        </div>
                      )}
                      {selectedItem.views && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Visualizações:</span>
                          <span className="font-medium">{selectedItem.views}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setSelectedItem(null)} className="flex-1">
                    Fechar
                  </Button>
                  <Button className="flex-1">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    {selectedItem.type === 'video' ? 'Assistir' : selectedItem.type === 'imagem' ? 'Ver Galeria' : 'Download'}
                  </Button>
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