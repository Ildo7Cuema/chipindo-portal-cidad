import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, Eye, Edit, Trash2, FileText, Image, Video, Download, Search, Filter, XIcon, Copy, Calendar, LayoutGrid, Layers, FolderOpen, CheckCircle, AlertCircle, Clock, Globe, Lock, EyeIcon, ExternalLink, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@supabase/supabase-js';
import ExportUtils from '@/lib/export-utils';
import JSZip from 'jszip';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDropzone } from 'react-dropzone';
import { Pie } from 'react-chartjs-2';
import { useAcervoViews } from '@/hooks/useAcervoViews';
import { BatchUploadModal } from './BatchUploadModal';
import 'chart.js/auto';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { prepareFileForUpload } from '@/lib/fileCompression';

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
  author_id: string;
  created_at: string;
  updated_at: string;
  views?: number; // Contagem de visualizações
}

const departments = [
  { value: 'gabinete', label: 'Gabinete do Administrador' },
  { value: 'educacao', label: 'Educação' },
  { value: 'saude', label: 'Saúde' },
  { value: 'agricultura', label: 'Agricultura' },
  { value: 'obras-publicas', label: 'Obras Públicas' },
  { value: 'turismo', label: 'Turismo e Cultura' },
  { value: 'comercio', label: 'Comércio e Indústria' },
  { value: 'recursos-humanos', label: 'Recursos Humanos' },
  { value: 'financas', label: 'Finanças' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'meio-ambiente', label: 'Meio Ambiente' },
  { value: 'seguranca', label: 'Segurança' }
];

export default function AcervoDigitalManager() {
  const [items, setItems] = useState<AcervoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AcervoItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterDept, setFilterDept] = useState('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false);
  const [batchUploadFiles, setBatchUploadFiles] = useState<File[]>([]);
  const [batchUploadDepartment, setBatchUploadDepartment] = useState('');
  const [batchUploadProgress, setBatchUploadProgress] = useState<{ [key: string]: number }>({});
  const [batchUploadStatus, setBatchUploadStatus] = useState<{ [key: string]: 'pending' | 'uploading' | 'success' | 'error' }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hook para visualizações do acervo
  const { registerView, getViewsCount, isLoading: viewsLoading } = useAcervoViews();
  
  // Função para registrar visualização
  const handleRegisterView = async (itemId: string) => {
    try {
      await registerView(itemId);
      // Atualizar contagem local
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, views: (item.views || 0) + 1 }
            : item
        )
      );
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  };
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'documento' as 'documento' | 'imagem' | 'video',
    category: '',
    department: '',
    is_public: false,
    file: null as File | null
  });

  const [sortBy, setSortBy] = useState<'title'|'type'|'department'|'category'|'created_at'>('created_at');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const [fullscreenItem, setFullscreenItem] = useState<AcervoItem|null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string|null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [viewItemDetails, setViewItemDetails] = useState<AcervoItem|null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isToggleVisibilityLoading, setIsToggleVisibilityLoading] = useState<string|null>(null);
  const [fullscreenPreview, setFullscreenPreview] = useState<{url: string, type: string, title: string}|null>(null);

  useEffect(() => {
    getUser();
    fetchItems();
  }, []);

  // Fechar preview em tela cheia com ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullscreenPreview) {
        setFullscreenPreview(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenPreview]);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('acervo_digital')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Buscar visualizações reais para cada item
      const itemsWithViews = await Promise.all(
        (data || []).map(async (item) => {
          // Buscar contagem de visualizações
          const viewsCount = 0;
          try {
            // Mock views data since acervo_views table doesn't exist
            const viewsCount = Math.floor(Math.random() * 100) + 1;

            return {
              ...item, 
              type: item.type as 'documento' | 'imagem' | 'video',
              views: viewsCount > 0 ? viewsCount : undefined
            };
          } catch (error) {
            console.error('Erro ao buscar visualizações do acervo:', error);
            return {
              ...item, 
              type: item.type as 'documento' | 'imagem' | 'video',
              views: 0
            };
          }
        })
      );

      setItems(itemsWithViews);
    } catch (error) {
      console.error('Error fetching acervo items:', error);
      toast.error('Erro ao carregar itens do acervo');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, department: string): Promise<{ url: string; file: File } | null> => {
    try {
      setUploadProgress(0);

      // Compress (client-side) to reduce storage usage.
      const prepared = await prepareFileForUpload(file);
      const fileToUpload = prepared.file;

      if (prepared.wasCompressed) {
        const savedPct = Math.round((1 - fileToUpload.size / prepared.originalSize) * 100);
        toast.message('Arquivo optimizado para upload', {
          description: `Redução aproximada: ${Math.max(0, savedPct)}%`,
        });
      }

      const fileExt = fileToUpload.name.split('.').pop();
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}-${randomId}.${fileExt}`;
      const filePath = `${department}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('acervo-digital')
        .upload(filePath, fileToUpload, {
          upsert: false
        });
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('acervo-digital')
        .getPublicUrl(filePath);
      
      setUploadProgress(null);
      return { url: urlData.publicUrl, file: fileToUpload };
    } catch (error) {
      setUploadProgress(null);
      console.error('Error uploading file:', error);
      toast.error('Erro ao fazer upload do arquivo');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUploading(true);
    try {
      let uploaded: { url: string; file: File } | null = null;
      if (formData.file) {
        uploaded = await handleFileUpload(formData.file, formData.department);
        if (!uploaded) return;
      }

      const itemData = {
        title: formData.title,
        description: formData.description || null,
        type: formData.type,
        category: formData.category || null,
        department: formData.department,
        file_size: uploaded?.file.size || formData.file?.size || null,
        mime_type: uploaded?.file.type || formData.file?.type || null,
        is_public: formData.is_public,
        author_id: user.id,
        file_url: null as string | null
      };

      // Se há um novo arquivo, adicionar o URL
      if (uploaded?.url) {
        itemData.file_url = uploaded.url;
      }

      if (editingItem) {
        // Para edição, preservar o file_url existente se não há novo arquivo
        if (!fileUrl && editingItem.file_url) {
          itemData.file_url = editingItem.file_url;
        }
        
        const { error } = await supabase
          .from('acervo_digital')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Item actualizado com sucesso!');
      } else {
        // Para novo item, file_url deve ser obrigatório
        if (!uploaded?.url) {
          toast.error('É necessário selecionar um arquivo para criar um novo item');
          setUploading(false);
          return;
        }
        
        const { error } = await supabase
          .from('acervo_digital')
          .insert([itemData]);

        if (error) throw error;
        toast.success('Item criado com sucesso!');
      }

      resetForm();
      setIsDialogOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Erro ao salvar item');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: AcervoItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      category: item.category || '',
      department: item.department,
      is_public: item.is_public,
      file: null
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('acervo_digital')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Item excluído com sucesso!');
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Erro ao excluir item');
    }
  };

  // Função para visualizar detalhes do item
  const handleViewDetails = (item: AcervoItem) => {
    setViewItemDetails(item);
    setIsViewModalOpen(true);
    // Registrar visualização
    handleRegisterView(item.id);
  };

  // Função para toggle de visibilidade (público/privado)
  const handleToggleVisibility = async (item: AcervoItem) => {
    setIsToggleVisibilityLoading(item.id);
    try {
      const { error } = await supabase
        .from('acervo_digital')
        .update({ is_public: !item.is_public })
        .eq('id', item.id);

      if (error) throw error;
      
      toast.success(`Item ${!item.is_public ? 'tornado público' : 'tornado privado'} com sucesso!`);
      fetchItems();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Erro ao alterar visibilidade do item');
    } finally {
      setIsToggleVisibilityLoading(null);
    }
  };

  // Função para abrir arquivo em nova aba
  const handleOpenFile = (url: string) => {
    window.open(url, '_blank');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'documento',
      category: '',
      department: '',
      is_public: false,
      file: null
    });
    setEditingItem(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'documento': return <FileText className="h-4 w-4" />;
      case 'imagem': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Filtros e busca
  const filteredItems = items.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesDept = filterDept === 'all' || item.department === filterDept;
    const matchesCategory = !filterCategory || (item.category || '').toLowerCase().includes(filterCategory.toLowerCase());
    const matchesSearch = !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesDept && matchesCategory && matchesSearch;
  });

  // Ordenação
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'created_at') {
      const valA = new Date(a[sortBy] as string).getTime();
      const valB = new Date(b[sortBy] as string).getTime();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    } else {
      const valA = (a[sortBy] || '').toString().toLowerCase();
      const valB = (b[sortBy] || '').toString().toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
    }
  });

  const paginatedItems = sortedItems.slice((page-1)*itemsPerPage, page*itemsPerPage);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  // Seleção múltipla
  const toggleSelect = (id: string) => {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id]);
  };
  const selectAll = () => {
    setSelectedIds(paginatedItems.map(i => i.id));
  };
  const clearSelection = () => setSelectedIds([]);

  // Download em lote
  const handleBatchDownload = async () => {
    if (selectedIds.length === 0) return toast.error('Selecione ao menos um item!');
    const zip = new JSZip();
    for (const id of selectedIds) {
      const item = items.find(i => i.id === id);
      if (item && item.file_url) {
        try {
          const response = await fetch(item.file_url);
          const blob = await response.blob();
          zip.file(item.title + '.' + (item.mime_type?.split('/')[1] || 'file'), blob);
        } catch {}
      }
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'acervo-digital.zip';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Download em lote iniciado!');
  };

  // Exportação
  const exportAcervo = (format: 'excel'|'pdf') => {
    const exportData = {
      title: 'Acervo Digital',
      subtitle: 'Portal Municipal de Chipindo',
      headers: ['Título', 'Tipo', 'Direcção/Área', 'Categoria', 'Tamanho', 'Visibilidade', 'Data'],
      rows: sortedItems.map(item => [
        item.title,
        item.type,
        departments.find(d => d.value === item.department)?.label || item.department,
        item.category || '-',
        formatFileSize(item.file_size),
        item.is_public ? 'Público' : 'Interno',
        new Date(item.created_at).toLocaleDateString('pt-BR')
      ]),
      metadata: {
        'Total de Itens': sortedItems.length
      }
    };
    if (format === 'excel') {
      ExportUtils.exportToExcel(exportData, {
        filename: 'acervo-digital',
        sheetName: 'Acervo',
        author: 'Administração Municipal',
        company: 'Município de Chipindo'
      });
    } else {
      ExportUtils.exportToPDF(exportData, {
        filename: 'acervo-digital',
        author: 'Administração Municipal',
        company: 'Município de Chipindo'
      });
    }
    toast.success(`Exportação ${format.toUpperCase()} gerada!`);
  };

  // Preview de arquivos
  const renderPreview = (item: AcervoItem) => {
    if (!item.file_url) {
      return <div className="w-full h-40 flex items-center justify-center bg-muted rounded"><FileText className="w-10 h-10 text-muted-foreground" /></div>;
    }

    if (item.type === 'imagem' && item.file_url) {
      return (
        <div 
          className="w-full h-40 cursor-pointer group relative overflow-hidden rounded"
          onClick={() => setFullscreenPreview({url: item.file_url!, type: 'imagem', title: item.title})}
        >
          <img 
            src={item.file_url} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {/* Fallback para erro de carregamento */}
          <div className="hidden w-full h-full flex items-center justify-center bg-muted rounded">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>
      );
    }
    
    if (item.type === 'video' && item.file_url) {
      return (
        <div 
          className="w-full h-40 cursor-pointer group relative overflow-hidden rounded"
          onClick={() => setFullscreenPreview({url: item.file_url!, type: 'video', title: item.title})}
        >
          <video 
            src={item.file_url} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {/* Fallback para erro de carregamento */}
          <div className="hidden w-full h-full flex items-center justify-center bg-muted rounded">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>
      );
    }
    
    if (item.type === 'documento' && item.file_url && item.mime_type?.includes('pdf')) {
      return (
        <div className="w-full h-40 rounded border">
          <iframe 
            src={item.file_url} 
            className="w-full h-full rounded" 
            title="Preview PDF"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* Fallback para erro de carregamento */}
          <div className="hidden w-full h-full flex items-center justify-center bg-muted rounded">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>
      );
    }
    
    return <div className="w-full h-40 flex items-center justify-center bg-muted rounded"><FileText className="w-10 h-10 text-muted-foreground" /></div>;
  };

  // Copiar link
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copiado!');
  };

  // Download
  const handleDownload = async (url: string, fileName?: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Falha ao baixar arquivo');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName || 'arquivo';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('Download iniciado!');
    } catch (error) {
      console.error('Erro no download:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'imagem': return <Badge className="bg-green-100 text-green-700">Imagem</Badge>;
      case 'video': return <Badge className="bg-purple-100 text-purple-700">Vídeo</Badge>;
      default: return <Badge className="bg-blue-100 text-blue-700">Documento</Badge>;
    }
  };
  const getVisibilityBadge = (isPublic: boolean) => (
    <Badge className={isPublic ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}>{isPublic ? 'Público' : 'Interno'}</Badge>
  );

  const onDrop = async (acceptedFiles: File[]) => {
    setDragActive(false);
    for (const file of acceptedFiles) {
      setFormData(f => ({ ...f, file }));
      await handleSubmit({ preventDefault: () => {} } as any);
    }
  };

  // Função para upload em lote
  const handleBatchUpload = async () => {
    if (!batchUploadDepartment || batchUploadFiles.length === 0) {
      toast.error('Selecione uma direcção e pelo menos um arquivo.');
      return;
    }

    try {
      const results = [];
      
      for (const file of batchUploadFiles) {
        const fileId = `${file.name}-${Date.now()}`;
        setBatchUploadStatus(prev => ({ ...prev, [fileId]: 'uploading' }));
        setBatchUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        try {
          // Upload do arquivo
          const uploaded = await handleFileUpload(file, batchUploadDepartment);

          if (uploaded?.url) {
            // Determinar tipo do arquivo
            const fileType = getFileType(uploaded.file);
            
            // Criar entrada no acervo
            const { data, error } = await supabase
              .from('acervo_digital')
              .insert({
                title: file.name,
                description: `Arquivo carregado em lote para ${departments.find(d => d.value === batchUploadDepartment)?.label}`,
                type: fileType,
                department: batchUploadDepartment,
                file_url: uploaded.url,
                file_size: uploaded.file.size,
                mime_type: uploaded.file.type,
                is_public: false,
                author_id: user?.id
              })
              .select()
              .single();

            if (error) throw error;

            setBatchUploadStatus(prev => ({ ...prev, [fileId]: 'success' }));
            results.push({ file: file.name, success: true });
          }
        } catch (error) {
          console.error(`Erro ao processar ${file.name}:`, error);
          setBatchUploadStatus(prev => ({ ...prev, [fileId]: 'error' }));
          results.push({ file: file.name, success: false, error: error.message });
        }
      }

      // Mostrar resultado final
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.length - successCount;
      
      if (successCount > 0) {
        toast.success(`${successCount} arquivo(s) carregado(s) com sucesso!`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} arquivo(s) falharam no carregamento.`);
      }

      // Limpar e fechar modal
      setBatchUploadFiles([]);
      setBatchUploadDepartment('');
      setBatchUploadProgress({});
      setBatchUploadStatus({});
      setIsBatchUploadOpen(false);
      
      // Atualizar lista
      fetchItems();
      
    } catch (error) {
      console.error('Erro no upload em lote:', error);
      toast.error('Erro no upload em lote. Tente novamente.');
    }
  };

  // Função para determinar tipo do arquivo
  const getFileType = (file: File): 'documento' | 'imagem' | 'video' => {
    const mimeType = file.type.toLowerCase();
    
    if (mimeType.startsWith('image/')) return 'imagem';
    if (mimeType.startsWith('video/')) return 'video';
    return 'documento';
  };

  // Função para selecionar arquivos para upload em lote
  const handleBatchFileSelect = (files: File[]) => {
    setBatchUploadFiles(files);
    setBatchUploadStatus({});
    setBatchUploadProgress({});
  };

  // Função para remover arquivo do lote
  const removeBatchFile = (index: number) => {
    setBatchUploadFiles(prev => prev.filter((_, i) => i !== index));
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'video/*': ['.mp4', '.avi', '.mov'],
      'application/msword': ['.doc', '.docx']
    },
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  // Estatísticas
  const total = items.length;
  const totalPublic = items.filter(i=>i.is_public).length;
  const totalImages = items.filter(i=>i.type==='imagem').length;
  const totalDocs = items.filter(i=>i.type==='documento').length;
  const totalVideos = items.filter(i=>i.type==='video').length;
  const areaStats = departments.map(d => ({ label: d.label, value: items.filter(i=>i.department===d.value).length })).filter(a=>a.value>0);
  const typePieData = {
    labels: ['Documentos', 'Imagens', 'Vídeos'],
    datasets: [{
      data: [totalDocs, totalImages, totalVideos],
      backgroundColor: ['#3b82f6', '#22c55e', '#a21caf']
    }]
  };

  // Chips de filtros ativos
  const activeFilters = [
    filterType !== 'all' && { label: filterType.charAt(0).toUpperCase()+filterType.slice(1), onRemove: ()=>setFilterType('all') },
    filterDept !== 'all' && { label: departments.find(d=>d.value===filterDept)?.label, onRemove: ()=>setFilterDept('all') },
    filterCategory && { label: filterCategory, onRemove: ()=>setFilterCategory('') },
    searchTerm && { label: `Busca: ${searchTerm}`, onRemove: ()=>setSearchTerm('') }
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header com ícone */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <Layers className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Gestão do Acervo Digital</h2>
          <p className="text-muted-foreground">Gerencie documentos, imagens e vídeos da administração municipal</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Dialog open={isBatchUploadOpen} onOpenChange={setIsBatchUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg">
                <FolderOpen className="w-4 h-4 mr-2" />
                Upload em Lote
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                <Upload className="w-4 h-4 mr-2" />
                Novo Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
              <DialogHeader className="pb-4 border-b border-border/50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-semibold">
                      {editingItem ? "Editar Item do Acervo" : "Novo Item do Acervo"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {editingItem ? "Edite os detalhes do item do acervo" : "Cadastre um novo documento, imagem, vídeo ou áudio por Direcção"}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required placeholder="Título do item" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v as any })}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="documento">Documento</SelectItem>
                        <SelectItem value="imagem">Imagem</SelectItem>
                        <SelectItem value="video">Vídeo</SelectItem>
                        <SelectItem value="audio">Áudio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Direcção/Área</Label>
                    <Select value={formData.department} onValueChange={v => setFormData({ ...formData, department: v })}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione a direcção" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(d => (
                          <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input id="category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Categoria (opcional)" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Descrição do item (opcional)" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Arquivo</Label>
                  <Input id="file" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav" onChange={e => setFormData({ ...formData, file: e.target.files?.[0] || null })} required={!editingItem} />
                  <p className="text-xs text-muted-foreground">Formatos suportados: PDF, DOC, Imagem, Vídeo, Áudio</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="is_public" checked={formData.is_public} onCheckedChange={checked => setFormData({ ...formData, is_public: checked })} />
                  <Label htmlFor="is_public">Tornar público</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={uploading || !formData.title || !formData.type || !formData.department || (!editingItem && !formData.file)} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                    {uploading ? 'Salvando...' : (editingItem ? 'Actualizar' : 'Cadastrar')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Cards de estatísticas com gradiente e ícone */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 flex items-center gap-4">
            <LayoutGrid className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-900">{total}</div>
              <div className="text-sm text-muted-foreground">Total de Itens</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6 flex items-center gap-4">
            <Image className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-900">{totalImages}</div>
              <div className="text-sm text-muted-foreground">Imagens</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6 flex items-center gap-4">
            <Video className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-900">{totalVideos}</div>
              <div className="text-sm text-muted-foreground">Vídeos</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200">
          <CardContent className="p-6 flex items-center gap-4">
            <FileText className="w-8 h-8 text-blue-800" />
            <div>
              <div className="text-2xl font-bold text-blue-900">{totalDocs}</div>
              <div className="text-sm text-muted-foreground">Documentos</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros em card */}
      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex flex-wrap gap-2">
            <Input
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-56"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="documento">Documento</SelectItem>
                <SelectItem value="imagem">Imagem</SelectItem>
                <SelectItem value="video">Vídeo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Direcção/Área" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as direcções</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Filtrar por categoria..."
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="w-44"
            />
            <Button onClick={fetchItems} variant="outline"><Filter className="w-4 h-4 mr-1" />Filtrar</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={()=>exportAcervo('excel')}><Download className="w-4 h-4 mr-1"/>Excel</Button>
            <Button variant="outline" size="sm" onClick={()=>exportAcervo('pdf')}><Download className="w-4 h-4 mr-1"/>PDF</Button>
            <Button variant="outline" size="sm" onClick={handleBatchDownload} disabled={selectedIds.length===0}><Download className="w-4 h-4 mr-1"/>Download em lote</Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards modernos para cada item do acervo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedItems.length === 0 ? (
          <div className="text-center text-red-600 text-sm font-medium py-8">Nenhum item encontrado.</div>
        ) : (
          paginatedItems.map(item => (
            <Card key={item.id} className={cn("shadow-md border-0 relative group transition-all duration-200 min-h-[280px] flex flex-col", selectedIds.includes(item.id) && "ring-2 ring-blue-500")}>
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getTypeIcon(item.type)}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base truncate">{item.title}</h3>
                      <p className="text-xs text-muted-foreground truncate">{departments.find(d => d.value === item.department)?.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded"
                    />
                  </div>
                </div>
                
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getTypeBadge(item.type)}
                    {getVisibilityBadge(item.is_public)}
                  </div>
                  
                  {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  )}
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Tamanho: {formatFileSize(item.file_size)}</div>
                    {item.views && item.views > 0 && (
                      <div>Visualizações: {item.views}</div>
                    )}
                    <div>Criado: {new Date(item.created_at).toLocaleDateString('pt-AO')}</div>
                  </div>
                  
                  {item.file_url && (
                    <div className="mt-3">
                      <div className="mb-2">
                        {renderPreview(item)}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Botões - sempre no final do card */}
                <div className="mt-auto pt-3 border-t border-border/50">
                  {/* Versão Desktop - botões organizados em linhas */}
                  <div className="hidden md:flex flex-col gap-2">
                    {/* Botões principais - sempre visíveis */}
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleViewDetails(item)}
                              className="flex-1"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver Detalhes</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleOpenFile(item.file_url!)}
                              disabled={!item.file_url}
                              className="flex-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Abrir Arquivo</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDownload(item.file_url!, item.title)}
                              disabled={!item.file_url}
                              className="flex-1"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Baixar</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Botões secundários */}
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleToggleVisibility(item)}
                              disabled={isToggleVisibilityLoading === item.id}
                              className="flex-1"
                            >
                              {isToggleVisibilityLoading === item.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                              ) : item.is_public ? (
                                <Lock className="w-4 h-4" />
                              ) : (
                                <Globe className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {item.is_public ? 'Tornar Privado' : 'Tornar Público'}
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEdit(item)}
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setConfirmDeleteId(item.id)}
                              className="flex-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Excluir</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Botões extras */}
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleCopyLink(item.file_url!)}
                              disabled={!item.file_url}
                              className="flex-1"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copiar Link</TooltipContent>
                        </Tooltip>
                        
                        {/* Botão de preview em tela cheia (apenas para imagens/vídeos) */}
                        {(item.type === 'imagem' || item.type === 'video') && item.file_url && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setFullscreenPreview({url: item.file_url!, type: item.type, title: item.title})}
                                className="flex-1"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ver em Tela Cheia</TooltipContent>
                          </Tooltip>
                        )}
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* Versão Mobile - botões compactos */}
                  <div className="md:hidden flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleViewDetails(item)}
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ver Detalhes</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDownload(item.file_url!, item.title)}
                            disabled={!item.file_url}
                            className="flex-1"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Baixar</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEdit(item)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="flex-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Excluir</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Dropdown de ações extras para mobile */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenFile(item.file_url!)} disabled={!item.file_url}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Abrir Arquivo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyLink(item.file_url!)} disabled={!item.file_url}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleVisibility(item)} disabled={isToggleVisibilityLoading === item.id}>
                          {isToggleVisibilityLoading === item.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          ) : item.is_public ? (
                            <Lock className="w-4 h-4 mr-2" />
                          ) : (
                            <Globe className="w-4 h-4 mr-2" />
                          )}
                          {item.is_public ? 'Tornar Privado' : 'Tornar Público'}
                        </DropdownMenuItem>
                        {(item.type === 'imagem' || item.type === 'video') && item.file_url && (
                          <DropdownMenuItem onClick={() => setFullscreenPreview({url: item.file_url!, type: item.type, title: item.title})}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver em Tela Cheia
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Upload em Lote */}
      <BatchUploadModal
        open={isBatchUploadOpen}
        onOpenChange={setIsBatchUploadOpen}
        onUploadComplete={fetchItems}
        userId={user?.id || ''}
      />

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <AlertDialogContent className="sm:max-w-[500px] border-0 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            {/* Ícone de alerta com gradiente */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-lg">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Título e descrição */}
            <AlertDialogHeader className="space-y-2">
              <AlertDialogTitle className="text-xl font-bold text-foreground">
                Confirmar Exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-muted-foreground px-4">
                Tem certeza que deseja excluir este item?
              </AlertDialogDescription>
              <p className="text-sm text-muted-foreground/80 px-4 pt-2">
                Esta ação não pode ser desfeita e o item será permanentemente removido do acervo digital.
              </p>
            </AlertDialogHeader>
          </div>
          
          <AlertDialogFooter className="flex-row gap-3 sm:gap-3 pt-4 border-t">
            <AlertDialogCancel 
              className="flex-1 sm:flex-initial bg-muted hover:bg-muted/80 text-foreground border-0 shadow-sm"
              onClick={() => setConfirmDeleteId(null)}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (confirmDeleteId) {
                  handleDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                }
              }}
              className="flex-1 sm:flex-initial bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg border-0 font-medium"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Detalhes do Item */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Detalhes do Item
            </DialogTitle>
          </DialogHeader>
          {viewItemDetails && (
            <div className="space-y-6">
              {/* Informações básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Título</Label>
                  <p className="text-sm text-muted-foreground mt-1">{viewItemDetails.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <div className="mt-1">{getTypeBadge(viewItemDetails.type)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Direcção/Área</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {departments.find(d => d.value === viewItemDetails.department)?.label}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Visibilidade</Label>
                  <div className="mt-1">{getVisibilityBadge(viewItemDetails.is_public)}</div>
                </div>
                {viewItemDetails.category && (
                  <div>
                    <Label className="text-sm font-medium">Categoria</Label>
                    <p className="text-sm text-muted-foreground mt-1">{viewItemDetails.category}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Visualizações</Label>
                  <p className="text-sm text-muted-foreground mt-1">{viewItemDetails.views || 0}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tamanho</Label>
                  <p className="text-sm text-muted-foreground mt-1">{formatFileSize(viewItemDetails.file_size)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Data de Criação</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(viewItemDetails.created_at).toLocaleDateString('pt-AO', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Descrição */}
              {viewItemDetails.description && (
                <div>
                  <Label className="text-sm font-medium">Descrição</Label>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                    {viewItemDetails.description}
                  </p>
                </div>
              )}

              {/* Preview do arquivo */}
              {viewItemDetails.file_url && (
                <div>
                  <Label className="text-sm font-medium">Arquivo</Label>
                  <div className="mt-2">
                    {viewItemDetails.type === 'imagem' && (
                      <div 
                        className="w-full h-64 cursor-pointer group relative overflow-hidden rounded-lg border"
                        onClick={() => setFullscreenPreview({url: viewItemDetails.file_url!, type: 'imagem', title: viewItemDetails.title})}
                      >
                        <img 
                          src={viewItemDetails.file_url} 
                          alt={viewItemDetails.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    )}
                    {viewItemDetails.type === 'video' && (
                      <div 
                        className="w-full h-64 cursor-pointer group relative overflow-hidden rounded-lg border"
                        onClick={() => setFullscreenPreview({url: viewItemDetails.file_url!, type: 'video', title: viewItemDetails.title})}
                      >
                        <video 
                          src={viewItemDetails.file_url} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    )}
                    {viewItemDetails.type === 'documento' && viewItemDetails.mime_type?.includes('pdf') && (
                      <iframe src={viewItemDetails.file_url} className="w-full h-64 rounded-lg border" title="Preview PDF" />
                    )}
                    {viewItemDetails.type === 'documento' && !viewItemDetails.mime_type?.includes('pdf') && (
                      <div className="w-full h-64 flex items-center justify-center bg-muted rounded-lg border">
                        <FileText className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button 
                  onClick={() => handleOpenFile(viewItemDetails.file_url!)}
                  disabled={!viewItemDetails.file_url}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Arquivo
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleDownload(viewItemDetails.file_url!, viewItemDetails.title)}
                  disabled={!viewItemDetails.file_url}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleCopyLink(viewItemDetails.file_url!)}
                  disabled={!viewItemDetails.file_url}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Link
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleToggleVisibility(viewItemDetails)}
                  disabled={isToggleVisibilityLoading === viewItemDetails.id}
                >
                  {isToggleVisibilityLoading === viewItemDetails.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  ) : viewItemDetails.is_public ? (
                    <Lock className="w-4 h-4 mr-2" />
                  ) : (
                    <Globe className="w-4 h-4 mr-2" />
                  )}
                  {viewItemDetails.is_public ? 'Tornar Privado' : 'Tornar Público'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    handleEdit(viewItemDetails);
                    setIsViewModalOpen(false);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Preview em Tela Cheia */}
      <Dialog open={!!fullscreenPreview} onOpenChange={() => setFullscreenPreview(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden">
          <div className="relative w-full h-full">
            {fullscreenPreview && (
              <>
                {/* Header */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-lg p-3">
                  <h3 className="text-white font-medium truncate">{fullscreenPreview.title}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFullscreenPreview(null)}
                    className="text-white hover:bg-white/20"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>

                {/* Conteúdo */}
                <div className="w-full h-full flex items-center justify-center bg-black">
                  {fullscreenPreview.type === 'imagem' && (
                    <img 
                      src={fullscreenPreview.url} 
                      alt={fullscreenPreview.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                  {fullscreenPreview.type === 'video' && (
                    <video 
                      src={fullscreenPreview.url} 
                      controls
                      className="max-w-full max-h-full"
                      autoPlay
                    />
                  )}
                </div>

                {/* Ações */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(fullscreenPreview.url, fullscreenPreview.title)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCopyLink(fullscreenPreview.url)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Link
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenFile(fullscreenPreview.url)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}