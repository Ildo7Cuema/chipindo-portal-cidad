import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ImageIcon, 
  VideoIcon, 
  FileTextIcon, 
  DownloadIcon, 
  EyeIcon,
  BookOpenIcon,
  HeartPulseIcon,
  HammerIcon,
  GraduationCapIcon,
  TreesIcon,
  BuildingIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ArchiveItem {
  id: string;
  title: string;
  type: string;
  department: string;
  created_at: string;
  file_size?: number;
  thumbnail_url?: string;
  file_url?: string;
  is_public: boolean;
}

export const DigitalArchive = () => {
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentCounts, setDepartmentCounts] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchArchiveItems();
  }, []);

  const fetchArchiveItems = async () => {
    try {
      const { data, error } = await supabase
        .from('acervo_digital')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      
      const items = data || [];
      setArchiveItems(items);

      // Calculate department counts
      const counts: {[key: string]: number} = {};
      items.forEach(item => {
        counts[item.department] = (counts[item.department] || 0) + 1;
      });
      setDepartmentCounts(counts);
    } catch (error) {
      console.error('Error fetching archive items:', error);
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    { name: "Educação", icon: GraduationCapIcon, count: departmentCounts["Educação"] || 0 },
    { name: "Saúde", icon: HeartPulseIcon, count: departmentCounts["Saúde"] || 0 },
    { name: "Obras Públicas", icon: HammerIcon, count: departmentCounts["Obras Públicas"] || 0 },
    { name: "Desenvolvimento", icon: BuildingIcon, count: departmentCounts["Desenvolvimento"] || 0 },
    { name: "Ambiente", icon: TreesIcon, count: departmentCounts["Ambiente"] || 0 },
    { name: "Cultura", icon: BookOpenIcon, count: departmentCounts["Cultura"] || 0 }
  ];
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5" />;
      case 'video':
        return <VideoIcon className="w-5 h-5" />;
      case 'document':
        return <FileTextIcon className="w-5 h-5" />;
      default:
        return <FileTextIcon className="w-5 h-5" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      image: "bg-blue-100 text-blue-800",
      video: "bg-red-100 text-red-800", 
      document: "bg-green-100 text-green-800"
    };
    return variants[type as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <section id="acervo" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Acervo Digital
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Documentos, imagens e vídeos oficiais organizados por direcção municipal.
              Acesso público ao patrimônio digital de Chipindo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-64" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="acervo" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Acervo Digital
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Documentos, imagens e vídeos oficiais organizados por direcção municipal.
            Acesso público ao patrimônio digital de Chipindo.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="images">Imagens</TabsTrigger>
            <TabsTrigger value="videos">Vídeos</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          {/* Departments Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {departments.map((dept) => (
              <Card key={dept.name} className="text-center hover:shadow-elegant transition-all duration-300 cursor-pointer">
                <CardContent className="p-4">
                  <dept.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm mb-1">{dept.name}</h3>
                  <p className="text-xs text-muted-foreground">{dept.count} itens</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archiveItems.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Nenhum item no acervo digital disponível no momento.</p>
                </div>
              ) : (
                archiveItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-elegant transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getTypeBadge(item.type)}>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(item.type)}
                            {item.type}
                          </div>
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                      <CardTitle className="text-base leading-tight">
                        {item.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {item.department}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Thumbnail */}
                      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.thumbnail_url ? (
                          <img 
                            src={item.thumbnail_url} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getTypeIcon(item.type)
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{formatDate(item.created_at)}</span>
                        <span>{formatFileSize(item.file_size)}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="institutional" size="sm" className="flex-1">
                          <EyeIcon className="w-4 h-4" />
                          Visualizar
                        </Button>
                        {item.file_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                              <DownloadIcon className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="images">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {archiveItems.filter(item => item.type === 'image').map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-elegant transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                    {item.thumbnail_url ? (
                      <img 
                        src={item.thumbnail_url} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.department}</span>
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archiveItems.filter(item => item.type === 'video').map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-elegant transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
                    {item.thumbnail_url ? (
                      <img 
                        src={item.thumbnail_url} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <VideoIcon className="w-12 h-12 text-muted-foreground" />
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {formatFileSize(item.file_size)}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{item.department}</span>
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="space-y-4">
              {archiveItems.filter(item => item.type === 'document').map((item) => (
                <Card key={item.id} className="hover:shadow-elegant transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileTextIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">{item.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{item.department}</span>
                            <span>{formatDate(item.created_at)}</span>
                            <span>{formatFileSize(item.file_size)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="institutional" size="sm">
                          <EyeIcon className="w-4 h-4" />
                          Visualizar
                        </Button>
                        {item.file_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                              <DownloadIcon className="w-4 h-4" />
                              Download
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};