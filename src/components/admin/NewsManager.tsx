import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ExportUtils from "@/lib/export-utils";
import { 
  Newspaper, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  X, 
  Calendar,
  Download,
  FileSpreadsheet,
  FileDown,
  ChevronDown,
  Star,
  TrendingUp,
  Users,
  BookOpen,
  Image as ImageIcon,
  Type,
  FileText,
  Zap,
  Send,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  featured: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
  category?: string;
  views?: number;
}

type CategoryType = 'desenvolvimento' | 'educacao' | 'saude' | 'obras' | 'turismo' | 'agricultura' | 'cultura';

export const NewsManager = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    published: false,
    featured: false,
    category: 'desenvolvimento' as CategoryType,
    image_url: "",
  });

  const categories = [
    { value: 'desenvolvimento', label: 'Desenvolvimento', icon: TrendingUp, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
    { value: 'educacao', label: 'Educação', icon: BookOpen, color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
    { value: 'saude', label: 'Saúde', icon: Users, color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
    { value: 'obras', label: 'Obras Públicas', icon: Building2, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' },
    { value: 'turismo', label: 'Turismo', icon: Star, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
    { value: 'agricultura', label: 'Agricultura', icon: Zap, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
    { value: 'cultura', label: 'Cultura', icon: MessageSquare, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400' },
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar notícias",
          description: error.message,
          variant: "destructive",
        });
      } else {
        const newsWithCategories = data?.map((item, index) => ({
          ...item,
          category: getCategoryByIndex(index),
          views: Math.floor(Math.random() * 2000) + 100,
        })) || [];
        setNews(newsWithCategories);
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível carregar as notícias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryByIndex = (index: number): CategoryType => {
    const categoryValues: CategoryType[] = ['desenvolvimento', 'educacao', 'saude', 'obras', 'turismo', 'agricultura', 'cultura'];
    return categoryValues[index % categoryValues.length];
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    console.log('Removendo imagem...');
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, image_url: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Force re-render by updating editingNews if we're editing
    if (editingNews) {
      setEditingNews({ ...editingNews, image_url: "" });
    }
    console.log('Imagem removida com sucesso');
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `news/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('news-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Obter usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');

      const newsData = {
        ...formData,
        image_url: imageUrl,
        author_id: user.id, // Adicionar author_id para novas notícias
      };

      if (editingNews) {
        // Para edição, removemos o author_id dos dados de actualização
        const { author_id, ...updateData } = newsData;
        const { error } = await supabase
          .from('news')
          .update(updateData)
          .eq('id', editingNews.id);

        if (error) throw error;

        toast({
          title: "Notícia atualizada",
          description: "A notícia foi atualizada com sucesso.",
        });
      } else {
        // Inserir nova notícia
        const { error } = await supabase
          .from('news')
          .insert([newsData]);

        if (error) throw error;

        toast({
          title: "Notícia criada",
          description: "A notícia foi criada com sucesso.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchNews();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      published: false,
      featured: false,
      category: 'desenvolvimento',
      image_url: "",
    });
    setEditingNews(null);
    setImageFile(null);
    setImagePreview("");
  };

  const handleEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      excerpt: newsItem.excerpt,
      published: newsItem.published,
      featured: newsItem.featured,
      category: (newsItem.category as CategoryType) || 'desenvolvimento',
      image_url: newsItem.image_url || "",
    });
    setImageFile(null); // Reset imageFile to null when editing
    setImagePreview(newsItem.image_url || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro ao excluir",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Notícia excluída",
          description: "A notícia foi excluída com sucesso.",
        });
        fetchNews();
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível excluir a notícia.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublished = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase
        .from('news')
        .update({ published })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: published ? "Notícia publicada" : "Notícia despublicada",
        description: `Notícia ${published ? 'publicada' : 'despublicada'} com sucesso.`,
      });
      fetchNews();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'delete' | 'feature' | 'unfeature') => {
    if (selectedIds.length === 0) {
      toast({
        title: "Nenhuma notícia selecionada",
        description: "Selecione pelo menos uma notícia.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('news')
          .delete()
          .in('id', selectedIds);
        
        if (error) throw error;
        
        toast({
          title: "Notícias excluídas",
          description: `${selectedIds.length} notícias foram excluídas.`,
        });
      } else {
        const updateData: any = {};
        switch (action) {
          case 'publish':
            updateData.published = true;
            break;
          case 'unpublish':
            updateData.published = false;
            break;
          case 'feature':
            updateData.featured = true;
            break;
          case 'unfeature':
            updateData.featured = false;
            break;
        }

        const { error } = await supabase
          .from('news')
          .update(updateData)
          .in('id', selectedIds);
        
        if (error) throw error;
        
        toast({
          title: "Notícias atualizadas",
          description: `${selectedIds.length} notícias foram atualizadas.`,
        });
      }

      setSelectedIds([]);
      fetchNews();
    } catch (error: any) {
      toast({
        title: "Erro na operação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Export functions
  const exportNewsToCSV = async () => {
    setExportLoading('csv');
    try {
      const exportData = {
        title: 'Relatório de Notícias',
        subtitle: 'Portal Municipal de Chipindo',
        headers: ['Título', 'Categoria', 'Status', 'Destaque', 'Visualizações', 'Data de Criação'],
        rows: filteredNews.map(item => [
          item.title,
          getCategoryLabel(item.category || 'desenvolvimento'),
          item.published ? 'Publicado' : 'Rascunho',
          item.featured ? 'Sim' : 'Não',
          item.views?.toString() || '0',
          new Date(item.created_at).toLocaleString('pt-AO')
        ]),
        metadata: {
          'Total de Notícias': news.length,
          'Publicadas': news.filter(n => n.published).length,
          'Rascunhos': news.filter(n => !n.published).length,
          'Em Destaque': news.filter(n => n.featured).length,
        }
      };

      ExportUtils.exportToCSV(exportData, { 
        filename: 'noticias-chipindo',
        includeTimestamp: true 
      });
      
      toast({
        title: "Notícias exportadas",
        description: "O relatório foi baixado em formato CSV.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar as notícias.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(null);
    }
  };

  const exportNewsToExcel = async () => {
    setExportLoading('excel');
    try {
      const exportData = {
        title: 'Relatório de Notícias',
        subtitle: 'Portal Municipal de Chipindo',
        headers: ['Título', 'Resumo', 'Categoria', 'Status', 'Destaque', 'Visualizações', 'Data de Criação'],
        rows: filteredNews.map(item => [
          item.title,
          item.excerpt,
          getCategoryLabel(item.category || 'desenvolvimento'),
          item.published ? 'Publicado' : 'Rascunho',
          item.featured ? 'Sim' : 'Não',
          item.views?.toString() || '0',
          new Date(item.created_at).toLocaleString('pt-AO')
        ]),
        metadata: {
          'Total de Notícias': news.length,
          'Publicadas': news.filter(n => n.published).length,
          'Rascunhos': news.filter(n => !n.published).length,
          'Em Destaque': news.filter(n => n.featured).length,
        }
      };

      ExportUtils.exportToExcel(exportData, { 
        filename: 'noticias-chipindo',
        sheetName: 'Notícias',
        author: 'Administração Municipal',
        company: 'Município de Chipindo'
      });
      
      toast({
        title: "Relatório Excel gerado",
        description: "O relatório foi gerado em formato Excel.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o relatório Excel.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(null);
    }
  };

  const exportNewsToPDF = async () => {
    setExportLoading('pdf');
    try {
      const exportData = {
        title: 'Relatório de Notícias',
        subtitle: 'Portal Municipal de Chipindo',
        headers: ['Título', 'Categoria', 'Status', 'Data'],
        rows: filteredNews.map(item => [
          item.title,
          getCategoryLabel(item.category || 'desenvolvimento'),
          item.published ? 'Publicado' : 'Rascunho',
          new Date(item.created_at).toLocaleDateString('pt-AO')
        ]),
        metadata: {
          'Total de Notícias': news.length,
          'Publicadas': news.filter(n => n.published).length,
          'Rascunhos': news.filter(n => !n.published).length,
          'Em Destaque': news.filter(n => n.featured).length,
        }
      };

      ExportUtils.exportToPDF(exportData, { 
        filename: 'noticias-chipindo',
        author: 'Administração Municipal',
        company: 'Município de Chipindo - Província da Huíla'
      });
      
      toast({
        title: "Relatório PDF gerado",
        description: "O relatório foi gerado em formato PDF.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o relatório PDF.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(null);
    }
  };

  const getCategoryLabel = (category: string): string => {
    const categoryObj = categories.find(c => c.value === category);
    return categoryObj?.label || category;
  };

  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find(c => c.value === category);
    const Icon = categoryObj?.icon || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string): string => {
    const categoryObj = categories.find(c => c.value === category);
    return categoryObj?.color || 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const filteredNews = news.filter(newsItem => {
    const matchesSearch = searchQuery === '' || 
      newsItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      newsItem.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      newsItem.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || newsItem.category === categoryFilter;
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'published' && newsItem.published) ||
      (activeTab === 'draft' && !newsItem.published) ||
      (activeTab === 'featured' && newsItem.featured);
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const publishedCount = news.filter(n => n.published).length;
  const draftCount = news.filter(n => !n.published).length;
  const featuredCount = news.filter(n => n.featured).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-16" />
                </div>
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-border/50 shadow-sm">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-foreground mb-2">Gestão de Notícias</h2>
          <p className="text-muted-foreground leading-relaxed">
            Gerencie conteúdo noticioso e comunicações do portal municipal
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={exportLoading !== null}
                className="h-9 px-4 hover:bg-muted/60 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {exportLoading ? (
                  <div className="w-4 h-4 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Exportar
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2 font-semibold">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span>Exportar Notícias</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={exportNewsToCSV} 
                disabled={exportLoading === 'csv'}
                className="py-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium">Formato CSV</div>
                    <div className="text-xs text-muted-foreground">Para análise de dados</div>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={exportNewsToExcel} 
                disabled={exportLoading === 'excel'}
                className="py-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <FileDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">Formato Excel</div>
                    <div className="text-xs text-muted-foreground">Relatório completo</div>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={exportNewsToPDF} 
                disabled={exportLoading === 'pdf'}
                className="py-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <Download className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="font-medium">Formato PDF</div>
                    <div className="text-xs text-muted-foreground">Documento oficial</div>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="shadow-sm hover:shadow-md transition-all duration-200 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                >
                  <MoreVertical className="w-4 h-4 mr-2" />
                  Ações ({selectedIds.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span>Ações em Lote</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleBulkAction('publish')}
                  className="py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <Send className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium">Publicar</div>
                      <div className="text-xs text-muted-foreground">{selectedIds.length} selecionadas</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleBulkAction('unpublish')}
                  className="py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                      <EyeOff className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="font-medium">Despublicar</div>
                      <div className="text-xs text-muted-foreground">{selectedIds.length} selecionadas</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleBulkAction('feature')}
                  className="py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-medium">Marcar Destaque</div>
                      <div className="text-xs text-muted-foreground">{selectedIds.length} selecionadas</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive py-3"
                  onClick={() => handleBulkAction('delete')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="font-medium">Excluir Selecionadas</div>
                      <div className="text-xs text-muted-foreground">{selectedIds.length} selecionadas</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* New News Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Nova Notícia
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
              <DialogHeader className="pb-4 border-b border-border/50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center">
                    <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-semibold">
                      {editingNews ? "Editar Notícia" : "Nova Notícia"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {editingNews 
                        ? "Edite o conteúdo da notícia existente" 
                        : "Crie uma nova notícia para informar os cidadãos"
                      }
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <ScrollArea className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                  {/* Informações Básicas Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <Type className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-base font-semibold">Informações Básicas</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                          <FileText className="w-3 h-3" />
                          Título da Notícia
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Ex: Nova escola inaugurada no centro da cidade"
                          className="h-10"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Título claro e atrativo que aparecerá em destaque
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
                          <Building2 className="w-3 h-3" />
                          Categoria
                        </Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => setFormData({ ...formData, category: value as CategoryType })}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value} className="py-2">
                                <div className="flex items-center gap-2">
                                  <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", category.color)}>
                                    <category.icon className="w-3 h-3" />
                                  </div>
                                  <div className="font-medium text-sm">{category.label}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Categoria que melhor descreve a notícia
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Conteúdo Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <MessageSquare className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-base font-semibold">Conteúdo da Notícia</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="excerpt" className="text-sm font-medium flex items-center gap-2">
                          <Eye className="w-3 h-3" />
                          Resumo
                        </Label>
                        <Textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                          placeholder="Breve resumo que será exibido na listagem de notícias"
                          rows={3}
                          className="resize-none"
                          required
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            Resumo atrativo que aparece na listagem
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formData.excerpt.length} caracteres
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="content" className="text-sm font-medium flex items-center gap-2">
                          <FileText className="w-3 h-3" />
                          Conteúdo Completo
                        </Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Escreva o conteúdo completo da notícia com detalhes relevantes"
                          rows={6}
                          className="resize-none"
                          required
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            Conteúdo detalhado da notícia
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formData.content.length} caracteres
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />
                  
                  {/* Imagem Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                        <ImageIcon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h3 className="text-base font-semibold">Imagem da Notícia</h3>
                    </div>
                    
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                      {(() => {
                        const shouldShowImage = imagePreview || (editingNews?.image_url && !imageFile);
                        console.log('Debug imagem:', {
                          imagePreview,
                          editingNewsImageUrl: editingNews?.image_url,
                          imageFile: !!imageFile,
                          shouldShowImage
                        });
                        return shouldShowImage;
                      })() ? (
                        <div className="relative">
                          <img
                            src={imagePreview || editingNews?.image_url}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              console.error('Erro ao carregar imagem:', imagePreview || editingNews?.image_url);
                              // Remove the image if it fails to load
                              removeImage();
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-7 w-7 p-0"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Botão de remover imagem clicado');
                              removeImage();
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                          <p className="text-sm text-muted-foreground mb-3">
                            Selecione uma imagem para ilustrar a notícia
                          </p>
                          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                            <ImageIcon className="w-3 h-3 mr-2" />
                            Selecionar Imagem
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Imagem opcional que aparecerá junto com a notícia
                    </p>
                  </div>

                  <Separator />
                  
                  {/* Configurações Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-base font-semibold">Configurações de Publicação</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                              <Send className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <Label htmlFor="published" className="font-medium text-sm">Publicar Notícia</Label>
                              <p className="text-xs text-muted-foreground">Ficará visível no portal</p>
                            </div>
                          </div>
                          <Switch
                            id="published"
                            checked={formData.published}
                            onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                          />
                        </div>
                      </Card>
                      
                      <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                              <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                              <Label htmlFor="featured" className="font-medium text-sm">Notícia Destacada</Label>
                              <p className="text-xs text-muted-foreground">Aparecerá em destaque</p>
                            </div>
                          </div>
                          <Switch
                            id="featured"
                            checked={formData.featured}
                            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                          />
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Preview Section */}
                  {(formData.title || formData.excerpt) && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                            <Eye className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <h3 className="text-base font-semibold">Pré-visualização</h3>
                        </div>
                        
                        <Card className="border-dashed border-2 border-muted-foreground/20">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                                getCategoryColor(formData.category)
                              )}>
                                {getCategoryIcon(formData.category)}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-foreground text-sm">
                                    {formData.title || "Título da notícia"}
                                  </h4>
                                  <Badge variant="outline" className="text-xs">
                                    {getCategoryLabel(formData.category)}
                                  </Badge>
                                  {formData.featured && <Star className="w-3 h-3 text-yellow-500" />}
                                  {formData.published && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {formData.excerpt || "Resumo da notícia aparecerá aqui"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </form>
              </ScrollArea>
              
              <div className="pt-4 border-t border-border/50 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    {editingNews ? "Modificando notícia existente" : "Criando nova notícia"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="min-w-[80px] h-9"
                      size="sm"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={uploading || !formData.title || !formData.content}
                      className="min-w-[100px] h-9 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                      onClick={handleSubmit}
                      size="sm"
                    >
                      {uploading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Salvando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {editingNews ? <Edit className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          {editingNews ? "Actualizar" : "Criar"}
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{news.length}</p>
              </div>
              <Newspaper className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Publicadas</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{publishedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Rascunhos</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{draftCount}</p>
              </div>
              <Edit className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Destaque</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{featuredCount}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Pesquisar notícias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and News List */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            Todas ({news.length})
          </TabsTrigger>
          <TabsTrigger value="published" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Publicadas ({publishedCount})
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Rascunhos ({draftCount})
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Destaque ({featuredCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 bg-muted/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Newspaper className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">
                  {searchQuery || categoryFilter !== 'all' ? 'Nenhuma notícia encontrada' : 'Nenhuma notícia disponível'}
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  {searchQuery || categoryFilter !== 'all' ? 'Tente ajustar os filtros de pesquisa' : 'As notícias aparecerão aqui conforme forem criadas'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNews.map((newsItem) => (
                <Card key={newsItem.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(newsItem.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds([...selectedIds, newsItem.id]);
                            } else {
                              setSelectedIds(selectedIds.filter(id => id !== newsItem.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </div>

                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {newsItem.image_url ? (
                          <img 
                            src={newsItem.image_url} 
                            alt={newsItem.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={cn("w-full h-full flex items-center justify-center", getCategoryColor(newsItem.category || 'desenvolvimento'))}>
                            {getCategoryIcon(newsItem.category || 'desenvolvimento')}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className="font-semibold text-lg">{newsItem.title}</h4>
                            <Badge variant="outline" className={cn("text-xs", getCategoryColor(newsItem.category || 'desenvolvimento'))}>
                              {getCategoryIcon(newsItem.category || 'desenvolvimento')}
                              <span className="ml-1">{getCategoryLabel(newsItem.category || 'desenvolvimento')}</span>
                            </Badge>
                            {newsItem.published && (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                Publicado
                              </Badge>
                            )}
                            {newsItem.featured && (
                              <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                                <Star className="w-3 h-3 mr-1" />
                                Destaque
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(newsItem.created_at)}
                            </span>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleTogglePublished(newsItem.id, !newsItem.published)}>
                                  {newsItem.published ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                  {newsItem.published ? 'Despublicar' : 'Publicar'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(newsItem)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem 
                                      onSelect={(e) => e.preventDefault()}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDelete(newsItem.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {newsItem.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(newsItem.created_at).toLocaleDateString('pt-AO')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {newsItem.views || 0} visualizações
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};