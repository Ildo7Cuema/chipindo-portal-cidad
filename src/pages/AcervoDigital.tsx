import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { 
  Search, 
  FileText, 
  Image, 
  Video, 
  Eye, 
  Download,
  Building2,
  GraduationCap,
  Heart,
  Wheat,
  Hammer,
  Palmtree,
  Store,
  Users,
  DollarSign,
  Car,
  Leaf,
  Shield
} from 'lucide-react';

interface AcervoItem {
  id: string;
  title: string;
  description: string | null;
  type: 'documento' | 'imagem' | 'video';
  category: string | null;
  department: string;
  file_url: string | null;
  thumbnail_url: string | null;
  file_size: number | null;
  mime_type: string | null;
  is_public: boolean;
  created_at: string;
}

const departments = [
  { key: 'gabinete', label: 'Gabinete do Administrador', icon: Building2, color: 'bg-blue-500' },
  { key: 'educacao', label: 'Educação', icon: GraduationCap, color: 'bg-green-500' },
  { key: 'saude', label: 'Saúde', icon: Heart, color: 'bg-red-500' },
  { key: 'agricultura', label: 'Agricultura', icon: Wheat, color: 'bg-amber-500' },
  { key: 'obras-publicas', label: 'Obras Públicas', icon: Hammer, color: 'bg-orange-500' },
  { key: 'turismo', label: 'Turismo e Cultura', icon: Palmtree, color: 'bg-teal-500' },
  { key: 'comercio', label: 'Comércio e Indústria', icon: Store, color: 'bg-purple-500' },
  { key: 'recursos-humanos', label: 'Recursos Humanos', icon: Users, color: 'bg-pink-500' },
  { key: 'financas', label: 'Finanças', icon: DollarSign, color: 'bg-emerald-500' },
  { key: 'transporte', label: 'Transporte', icon: Car, color: 'bg-cyan-500' },
  { key: 'meio-ambiente', label: 'Meio Ambiente', icon: Leaf, color: 'bg-lime-500' },
  { key: 'seguranca', label: 'Segurança', icon: Shield, color: 'bg-slate-500' }
];

export default function AcervoDigital() {
  const [items, setItems] = useState<AcervoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDirection, setSelectedDirection] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<AcervoItem | null>(null);

  useEffect(() => {
    fetchPublicItems();
  }, []);

  const fetchPublicItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('acervo_digital')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems((data || []).map(item => ({ 
        ...item, 
        type: item.type as 'documento' | 'imagem' | 'video' 
      })));
    } catch (error) {
      console.error('Error fetching public acervo items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDirection = selectedDirection === 'all' || item.department === selectedDirection;
    
    return matchesSearch && matchesDirection;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'documento': return <FileText className="h-5 w-5" />;
      case 'imagem': return <Image className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'documento': return 'text-blue-500';
      case 'imagem': return 'text-green-500';
      case 'video': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const itemsByType = {
    all: filteredData,
    documento: filteredData.filter(item => item.type === 'documento'),
    imagem: filteredData.filter(item => item.type === 'imagem'),
    video: filteredData.filter(item => item.type === 'video')
  };

  const itemsByDepartment = departments.map(dept => ({
    ...dept,
    count: items.filter(item => item.department === dept.key).length
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Acervo Digital
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore nosso acervo digital com documentos, imagens e vídeos das diferentes 
              direções da Administração Municipal de Chipindo
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar no acervo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            <Button
              variant={selectedDirection === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedDirection('all')}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Building2 className="h-6 w-6" />
              <span className="text-xs text-center">Todas as Direções</span>
              <Badge variant="secondary">{items.length}</Badge>
            </Button>
            {itemsByDepartment.map((dept) => {
              const IconComponent = dept.icon;
              return (
                <Button
                  key={dept.key}
                  variant={selectedDirection === dept.key ? 'default' : 'outline'}
                  onClick={() => setSelectedDirection(dept.key)}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-xs text-center">{dept.label}</span>
                  <Badge variant="secondary">{dept.count}</Badge>
                </Button>
              );
            })}
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="flex items-center space-x-2">
                <span>Todos</span>
                <Badge variant="secondary">{itemsByType.all.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="documento" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Documentos</span>
                <Badge variant="secondary">{itemsByType.documento.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="imagem" className="flex items-center space-x-2">
                <Image className="h-4 w-4" />
                <span>Imagens</span>
                <Badge variant="secondary">{itemsByType.imagem.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center space-x-2">
                <Video className="h-4 w-4" />
                <span>Vídeos</span>
                <Badge variant="secondary">{itemsByType.video.length}</Badge>
              </TabsTrigger>
            </TabsList>

            {Object.entries(itemsByType).map(([type, typeItems]) => (
              <TabsContent key={type} value={type} className="mt-8">
                {loading ? (
                  <div className="text-center py-12">
                    <p>Carregando acervo...</p>
                  </div>
                ) : typeItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {searchTerm || selectedDirection !== 'all' 
                        ? 'Nenhum item encontrado com os filtros aplicados.' 
                        : 'Nenhum item disponível no momento.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {typeItems.map((item) => {
                      const department = departments.find(d => d.key === item.department);
                      const IconComponent = department?.icon || Building2;
                      
                      return (
                        <Card key={item.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                                {getTypeIcon(item.type)}
                              </div>
                              <Badge variant="outline" className="flex items-center space-x-1">
                                <IconComponent className="h-3 w-3" />
                                <span className="text-xs">
                                  {department?.label || item.department}
                                </span>
                              </Badge>
                            </div>
                            <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                            {item.description && (
                              <CardDescription className="line-clamp-2">
                                {item.description}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                              <span>{formatDate(item.created_at)}</span>
                              {item.file_size && <span>{formatFileSize(item.file_size)}</span>}
                            </div>
                            {item.category && (
                              <Badge variant="secondary" className="mb-4">
                                {item.category}
                              </Badge>
                            )}
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => setSelectedItem(item)}
                                className="flex items-center space-x-2"
                              >
                                <Eye className="h-4 w-4" />
                                <span>Visualizar</span>
                              </Button>
                              {item.file_url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(item.file_url!, '_blank')}
                                  className="flex items-center space-x-2"
                                >
                                  <Download className="h-4 w-4" />
                                  <span>Download</span>
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <span className={getTypeColor(selectedItem.type)}>
                    {getTypeIcon(selectedItem.type)}
                  </span>
                  <span>{selectedItem.title}</span>
                </DialogTitle>
                <DialogDescription>
                  {departments.find(d => d.key === selectedItem.department)?.label || selectedItem.department}
                  {selectedItem.category && ` • ${selectedItem.category}`}
                  {' • '}
                  {formatDate(selectedItem.created_at)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {selectedItem.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Descrição</h4>
                    <p className="text-muted-foreground">{selectedItem.description}</p>
                  </div>
                )}

                {selectedItem.file_url && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Arquivo</h4>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => window.open(selectedItem.file_url!, '_blank')}
                          className="flex items-center space-x-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Abrir</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedItem.file_url!;
                            link.download = selectedItem.title;
                            link.click();
                          }}
                          className="flex items-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </div>

                    {selectedItem.type === 'imagem' && (
                      <div className="border rounded-lg overflow-hidden">
                        <img
                          src={selectedItem.file_url}
                          alt={selectedItem.title}
                          className="w-full h-auto"
                        />
                      </div>
                    )}

                    {selectedItem.type === 'video' && (
                      <div className="border rounded-lg overflow-hidden">
                        <video
                          src={selectedItem.file_url}
                          controls
                          className="w-full h-auto"
                        >
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                  <span>Tipo: {selectedItem.type}</span>
                  {selectedItem.file_size && <span>Tamanho: {formatFileSize(selectedItem.file_size)}</span>}
                  {selectedItem.mime_type && <span>Formato: {selectedItem.mime_type}</span>}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}