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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, Eye, Edit, Trash2, FileText, Image, Video, Download, Search, Filter, XIcon, Copy, Calendar, LayoutGrid, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@supabase/supabase-js';
import ExportUtils from '@/lib/export-utils';
import JSZip from 'jszip';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDropzone } from 'react-dropzone';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  useEffect(() => {
    getUser();
    fetchItems();
  }, []);

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
      setItems((data || []).map(item => ({ 
        ...item, 
        type: item.type as 'documento' | 'imagem' | 'video' 
      })));
    } catch (error) {
      console.error('Error fetching acervo items:', error);
      toast.error('Erro ao carregar itens do acervo');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      setUploadProgress(0);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${formData.department}/${fileName}`;
      const { data, error } = await supabase.storage
        .from('acervo-digital')
        .upload(filePath, file, {
          upsert: false
        });
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from('acervo-digital')
        .getPublicUrl(filePath);
      setUploadProgress(null);
      return urlData.publicUrl;
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
      let fileUrl = null;
      if (formData.file) {
        fileUrl = await handleFileUpload(formData.file);
        if (!fileUrl) return;
      }

      const itemData = {
        title: formData.title,
        description: formData.description || null,
        type: formData.type,
        category: formData.category || null,
        department: formData.department,
        file_url: fileUrl,
        file_size: formData.file?.size || null,
        mime_type: formData.file?.type || null,
        is_public: formData.is_public,
        author_id: user.id
      };

      if (editingItem) {
        const { error } = await supabase
          .from('acervo_digital')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Item atualizado com sucesso!');
      } else {
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
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

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
      headers: ['Título', 'Tipo', 'Direção/Área', 'Categoria', 'Tamanho', 'Visibilidade', 'Data'],
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
    if (item.type === 'imagem' && item.file_url) {
      return <img src={item.file_url} alt={item.title} className="w-full h-40 object-cover rounded" />;
    }
    if (item.type === 'video' && item.file_url) {
      return <video src={item.file_url} controls className="w-full h-40 rounded" />;
    }
    if (item.type === 'documento' && item.file_url && item.mime_type?.includes('pdf')) {
      return <iframe src={item.file_url} className="w-full h-40 rounded" title="Preview PDF" />;
    }
    return <div className="w-full h-40 flex items-center justify-center bg-muted rounded"><FileText className="w-10 h-10 text-muted-foreground" /></div>;
  };

  // Copiar link
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copiado!');
  };

  // Download
  const handleDownload = (url: string) => {
    window.open(url, '_blank');
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
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
                    {editingItem ? "Edite os detalhes do item do acervo" : "Cadastre um novo documento, imagem, vídeo ou áudio por Direção"}
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
                  <Label htmlFor="department">Direção/Área</Label>
                  <Select value={formData.department} onValueChange={v => setFormData({ ...formData, department: v })}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecione a direção" />
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
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_public} onCheckedChange={v => setFormData({ ...formData, is_public: v })} id="is_public" />
                <Label htmlFor="is_public">Tornar público</Label>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
                <Button type="button" variant="outline" onClick={()=>setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={uploading || !formData.title || !formData.type || !formData.department || (!editingItem && !formData.file)} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                  {uploading ? 'Salvando...' : (editingItem ? 'Atualizar' : 'Cadastrar')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
              <SelectTrigger className="w-44"><SelectValue placeholder="Direção/Área" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as direções</SelectItem>
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
            <Card key={item.id} className={cn("shadow-md border-0 relative group transition-all duration-200", selectedIds.includes(item.id) && "ring-2 ring-blue-500")}
              onMouseEnter={()=>{}}
              onMouseLeave={()=>{}}>
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={()=>toggleSelect(item.id)}
                className="absolute top-2 left-2 w-5 h-5 accent-blue-600 z-10"
                title="Selecionar item"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div onClick={()=>setFullscreenItem(item)} className="cursor-pointer relative group">
                      {renderPreview(item)}
                      <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow">
                        {getTypeBadge(item.type)}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="text-xs">
                      <div><b>Título:</b> {item.title}</div>
                      <div><b>Tipo:</b> {item.type}</div>
                      <div><b>Área:</b> {departments.find(d => d.value === item.department)?.label || item.department}</div>
                      <div><b>Categoria:</b> {item.category || 'Sem categoria'}</div>
                      <div><b>Tamanho:</b> {formatFileSize(item.file_size)}</div>
                      <div><b>Visibilidade:</b> {item.is_public ? 'Público' : 'Interno'}</div>
                      <div><b>Data:</b> {new Date(item.created_at).toLocaleDateString('pt-BR')}</div>
                      {item.description && <div><b>Descrição:</b> {item.description}</div>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-lg truncate flex-1" title={item.title}>{item.title}</span>
                  {getVisibilityBadge(item.is_public)}
                </div>
                <div className="text-xs text-muted-foreground mb-2 flex flex-wrap gap-2">
                  <span className="truncate" title={departments.find(d => d.value === item.department)?.label || item.department}>{departments.find(d => d.value === item.department)?.label || item.department}</span>
                  <span className="truncate" title={item.category || 'Sem categoria'}>{item.category || 'Sem categoria'}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2 flex gap-2">
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{formatFileSize(item.file_size)}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => handleDownload(item.file_url!)}><Download className="w-4 h-4" /></Button>
                      </TooltipTrigger>
                      <TooltipContent>Baixar</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => handleCopyLink(item.file_url!)}><Copy className="w-4 h-4" /></Button>
                      </TooltipTrigger>
                      <TooltipContent>Copiar Link</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)}><Edit className="w-4 h-4" /></Button>
                      </TooltipTrigger>
                      <TooltipContent>Editar</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setConfirmDeleteId(item.id)}><Trash2 className="w-4 h-4" /></Button>
                      </TooltipTrigger>
                      <TooltipContent>Excluir</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {fullscreenItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white rounded shadow-lg p-6">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={()=>setFullscreenItem(null)}><XIcon className="w-6 h-6" /></Button>
            <h3 className="text-lg font-bold mb-2">{fullscreenItem.title}</h3>
            {renderPreview(fullscreenItem)}
            <div className="mt-4 text-sm text-muted-foreground">{fullscreenItem.description}</div>
            <div className="mt-2 flex gap-2">
              {fullscreenItem.file_url && <Button size="sm" variant="outline" onClick={()=>handleDownload(fullscreenItem.file_url!)}><Download className="w-4 h-4 mr-1"/>Baixar</Button>}
              {fullscreenItem.file_url && <Button size="sm" variant="outline" onClick={()=>handleCopyLink(fullscreenItem.file_url!)}><Copy className="w-4 h-4 mr-1"/>Copiar Link</Button>}
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center gap-2 mt-8">
        <Button variant="outline" size="sm" disabled={page===1} onClick={()=>setPage(page-1)}>Anterior</Button>
        <span className="text-sm px-2">Página {page} de {totalPages}</span>
        <Button variant="outline" size="sm" disabled={page===totalPages} onClick={()=>setPage(page+1)}>Próxima</Button>
      </div>
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Confirmar Exclusão</h3>
            <p className="mb-4">Tem certeza que deseja excluir {confirmDeleteId==='batch' ? `${selectedIds.length} itens selecionados?` : 'este item?'} Esta ação não pode ser desfeita.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={()=>setConfirmDeleteId(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={async()=>{
                if(confirmDeleteId==='batch'){
                  for(const id of selectedIds){ await handleDelete(id); }
                  clearSelection();
                }else{
                  await handleDelete(confirmDeleteId);
                }
                setConfirmDeleteId(null);
              }}>Excluir</Button>
            </div>
          </div>
        </div>
      )}
      {/* Área de upload drag & drop em card */}
      <Card className="border-0 shadow-sm mb-6">
        <CardContent>
          <div {...getRootProps()} className={cn("border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer", isDragActive || dragActive ? "border-blue-500 bg-blue-50" : "border-muted bg-muted/30") }>
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="font-medium">Arraste e solte arquivos aqui, ou clique para selecionar</p>
            <p className="text-xs text-muted-foreground">Suporta múltiplos arquivos: PDF, DOC, Imagem, Vídeo</p>
            {uploadProgress !== null && (
              <div className="w-full bg-muted rounded h-2 mt-4">
                <div className="bg-blue-500 h-2 rounded" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chips de filtros ativos */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((f, i) => (
            <Badge key={i} className="bg-blue-100 text-blue-700 cursor-pointer" onClick={f.onRemove}>{f.label} <XIcon className="w-3 h-3 ml-1" /></Badge>
          ))}
        </div>
      )}
    </div>
  );
}