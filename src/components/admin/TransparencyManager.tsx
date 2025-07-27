import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Section, SectionHeader, SectionContent } from "@/components/ui/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useDropzone } from 'react-dropzone';
import { 
  FileTextIcon, 
  DollarSignIcon, 
  TrendingUpIcon, 
  UsersIcon, 
  CalendarIcon,
  DownloadIcon,
  EyeIcon,
  BarChartIcon,
  PieChartIcon,
  TargetIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  BuildingIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ExternalLinkIcon,
  FilterIcon,
  SearchIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArchiveIcon,
  AwardIcon,
  ShieldCheckIcon,
  ShieldIcon,
  ScaleIcon,
  GavelIcon,
  BookOpenIcon,
  FileIcon,
  DatabaseIcon,
  ChartBarIcon,
  TrendingDownIcon,
  CheckSquareIcon,
  AlertTriangleIcon,
  InfoIcon,
  ZapIcon,
  FlameIcon,
  XIcon,
  MaximizeIcon,
  GridIcon,
  ListIcon,
  SortDescIcon,
  SortAscIcon,
  UploadIcon,
  SaveIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SettingsIcon,
  HardDriveIcon,
  ClockIcon as ClockIcon2,
  AlertCircleIcon as AlertCircleIcon2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type TransparencyDocument = Tables<'transparency_documents'>;
type BudgetExecution = Tables<'budget_execution'>;
type TransparencyProject = Tables<'transparency_projects'>;

export const TransparencyManager = () => {
  const [activeTab, setActiveTab] = useState("documents");
  const [documents, setDocuments] = useState<TransparencyDocument[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetExecution[]>([]);
  const [projects, setProjects] = useState<TransparencyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDocument, setEditingDocument] = useState<Partial<TransparencyDocument> | null>(null);
  const [editingBudget, setEditingBudget] = useState<Partial<BudgetExecution> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<TransparencyProject> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const categories = [
    { value: "relatorios", label: "Relatórios" },
    { value: "orcamento", label: "Orçamento" },
    { value: "contratos", label: "Contratos" },
    { value: "prestacao-contas", label: "Prestação de Contas" },
    { value: "planos", label: "Planos" },
    { value: "auditorias", label: "Auditorias" }
  ];

  const statusOptions = [
    { value: "published", label: "Publicado" },
    { value: "pending", label: "Pendente" },
    { value: "archived", label: "Arquivado" }
  ];

  const budgetStatusOptions = [
    { value: "on_track", label: "No Prazo" },
    { value: "over_budget", label: "Acima do Orçamento" },
    { value: "under_budget", label: "Abaixo do Orçamento" }
  ];

  const projectStatusOptions = [
    { value: "active", label: "Ativo" },
    { value: "completed", label: "Concluído" },
    { value: "planned", label: "Planeado" }
  ];

  const years = Array.from(new Set(budgetData.map(b => b.year))).sort((a, b) => b.localeCompare(a));

  // Configuração do dropzone para upload de arquivos
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        toast({
          title: "Erro",
          description: "Arquivo muito grande. Máximo 10MB permitido",
          variant: "destructive"
        });
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        toast({
          title: "Erro",
          description: "Apenas arquivos PDF são permitidos",
          variant: "destructive"
        });
      }
    }
  });

  // Carregar dados reais do banco de dados
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar documentos
      const { data: docs, error: docsError } = await supabase
        .from('transparency_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;
      setDocuments(docs || []);

      // Carregar dados orçamentários
      const { data: budget, error: budgetError } = await supabase
        .from('budget_execution')
        .select('*')
        .order('year', { ascending: false });

      if (budgetError) throw budgetError;
      setBudgetData(budget || []);

      // Carregar projetos
      const { data: projs, error: projsError } = await supabase
        .from('transparency_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projsError) throw projsError;
      setProjects(projs || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error("Erro ao carregar dados de transparência");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Validar se é um arquivo PDF
      if (file.type !== 'application/pdf') {
        toast.error("Apenas arquivos PDF são permitidos");
        return null;
      }

      // Validar tamanho do arquivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 10MB permitido");
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `transparency-documents/${fileName}`;
      
      // Simular progresso de upload
      setUploadProgress(25);
      
      const { data, error } = await supabase.storage
        .from('transparency-documents')
        .upload(filePath, file, {
          upsert: false
        });

      if (error) throw error;

      setUploadProgress(75);

      const { data: urlData } = supabase.storage
        .from('transparency-documents')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      toast.error("Erro ao fazer upload do arquivo");
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  // Função para limpar arquivos órfãos
  const cleanupOrphanedFiles = async () => {
    try {
      // Mostrar loading
      toast.loading("Analisando arquivos...");
      
      console.log('🧹 Iniciando limpeza de arquivos órfãos...');
      
      // Listar todos os arquivos no bucket
      const { data: files, error: listError } = await supabase.storage
        .from('transparency-documents')
        .list('transparency-documents');

      if (listError) {
        console.error('Erro ao listar arquivos:', listError);
        toast.error("Erro ao acessar arquivos de storage");
        return;
      }

      if (!files || files.length === 0) {
        console.log('Nenhum arquivo encontrado para limpeza');
        toast.success("Nenhum arquivo encontrado para limpeza");
        return;
      }

      console.log(`📁 Encontrados ${files.length} arquivos no storage`);

      // Obter URLs de todos os documentos na base de dados
      const { data: documents, error: docsError } = await supabase
        .from('transparency_documents')
        .select('file_url, title');

      if (docsError) {
        console.error('Erro ao buscar documentos:', docsError);
        toast.error("Erro ao buscar documentos da base de dados");
        return;
      }

      const documentUrls = documents?.map(doc => doc.file_url).filter(Boolean) || [];
      console.log(`📄 Encontrados ${documentUrls.length} documentos na base de dados`);

      // Identificar arquivos órfãos
      const orphanedFiles = files.filter(file => {
        const fileUrl = supabase.storage
          .from('transparency-documents')
          .getPublicUrl(`transparency-documents/${file.name}`).data.publicUrl;
        
        return !documentUrls.includes(fileUrl);
      });

      if (orphanedFiles.length === 0) {
        console.log('Nenhum arquivo órfão encontrado');
        toast.success("Nenhum arquivo órfão encontrado. Todos os arquivos estão sendo utilizados!");
        return;
      }

      console.log(`🗑️ Encontrados ${orphanedFiles.length} arquivos órfãos`);
      
      // Mostrar detalhes dos arquivos órfãos
      const orphanedDetails = orphanedFiles.map(file => ({
        name: file.name,
        size: file.metadata?.size || 0,
        created: file.created_at
      }));

      const totalSize = orphanedDetails.reduce((sum, file) => sum + file.size, 0);
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

      console.log('📋 Detalhes dos arquivos órfãos:', orphanedDetails);
      console.log(`💾 Tamanho total: ${totalSizeMB} MB`);

      // Confirmar com o usuário
      const confirmMessage = `Encontrados ${orphanedFiles.length} arquivos órfãos (${totalSizeMB} MB). Deseja removê-los?`;
      
      // Para simplicidade, vamos usar um confirm nativo, mas em produção seria melhor um modal customizado
      if (!confirm(confirmMessage)) {
        console.log('Limpeza cancelada pelo usuário');
        toast.info("Limpeza cancelada");
        return;
      }

      // Remover arquivos órfãos
      toast.loading(`Removendo ${orphanedFiles.length} arquivos...`);
      
      const filePaths = orphanedFiles.map(file => `transparency-documents/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from('transparency-documents')
        .remove(filePaths);

      if (deleteError) {
        console.error('Erro ao remover arquivos órfãos:', deleteError);
        toast.error("Erro ao remover arquivos órfãos");
      } else {
        console.log(`✅ ${orphanedFiles.length} arquivos órfãos removidos com sucesso`);
        console.log(`💾 ${totalSizeMB} MB liberados`);
        
        toast.success(`Limpeza concluída! ${orphanedFiles.length} arquivos removidos (${totalSizeMB} MB)`);
        
        // Recarregar dados para atualizar a interface
        await loadData();
      }

    } catch (error) {
      console.error('Erro na limpeza de arquivos órfãos:', error);
      toast.error("Erro inesperado durante a limpeza");
    }
  };

  // Função para limpar arquivos antigos (mais de 30 dias)
  const cleanupOldFiles = async () => {
    try {
      toast.loading("Analisando arquivos antigos...");
      
      console.log('🧹 Iniciando limpeza de arquivos antigos...');
      
      // Listar todos os arquivos no bucket
      const { data: files, error: listError } = await supabase.storage
        .from('transparency-documents')
        .list('transparency-documents');

      if (listError) {
        console.error('Erro ao listar arquivos:', listError);
        toast.error("Erro ao acessar arquivos de storage");
        return;
      }

      if (!files || files.length === 0) {
        toast.success("Nenhum arquivo encontrado");
        return;
      }

      // Filtrar arquivos antigos (mais de 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const oldFiles = files.filter(file => {
        const fileDate = new Date(file.created_at);
        return fileDate < thirtyDaysAgo;
      });

      if (oldFiles.length === 0) {
        toast.success("Nenhum arquivo antigo encontrado");
        return;
      }

      const totalSize = oldFiles.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

      const confirmMessage = `Encontrados ${oldFiles.length} arquivos antigos (${totalSizeMB} MB). Deseja removê-los?`;
      
      if (!confirm(confirmMessage)) {
        toast.info("Limpeza cancelada");
        return;
      }

      toast.loading(`Removendo ${oldFiles.length} arquivos antigos...`);
      
      const filePaths = oldFiles.map(file => `transparency-documents/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from('transparency-documents')
        .remove(filePaths);

      if (deleteError) {
        console.error('Erro ao remover arquivos antigos:', deleteError);
        toast.error("Erro ao remover arquivos antigos");
      } else {
        toast.success(`Limpeza concluída! ${oldFiles.length} arquivos antigos removidos (${totalSizeMB} MB)`);
        await loadData();
      }

    } catch (error) {
      console.error('Erro na limpeza de arquivos antigos:', error);
      toast.error("Erro inesperado durante a limpeza");
    }
  };

  // Função para obter estatísticas de storage
  const getStorageStats = async () => {
    try {
      const { data: files, error: listError } = await supabase.storage
        .from('transparency-documents')
        .list('transparency-documents');

      if (listError) {
        console.error('Erro ao listar arquivos:', listError);
        return null;
      }

      if (!files || files.length === 0) {
        return {
          totalFiles: 0,
          totalSize: 0,
          totalSizeMB: '0 MB'
        };
      }

      const totalSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

      return {
        totalFiles: files.length,
        totalSize,
        totalSizeMB: `${totalSizeMB} MB`
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return null;
    }
  };

  // Salvar documento
  const saveDocument = async (document: Partial<TransparencyDocument>) => {
    try {
      // Validação dos campos obrigatórios
      if (!document.title || !document.category || !document.date || !document.description) {
        toast.error("Todos os campos obrigatórios devem ser preenchidos");
        return;
      }

      let fileUrl = document.file_url;
      let fileSize = document.file_size;

      // Se há um arquivo para upload
      if (uploadedFile) {
        fileUrl = await handleFileUpload(uploadedFile);
        if (!fileUrl) {
          toast.error("Erro ao fazer upload do arquivo");
          return;
        }
        fileSize = `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`;
      }

      if (editingDocument?.id) {
        // Atualizar documento existente
        const { error } = await supabase
          .from('transparency_documents')
          .update({
            title: document.title,
            category: document.category,
            date: document.date,
            status: document.status,
            file_size: fileSize,
            description: document.description,
            tags: document.tags || [],
            file_url: fileUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingDocument.id);

        if (error) throw error;
        toast.success("Documento atualizado com sucesso");
      } else {
        // Criar novo documento
        const { error } = await supabase
          .from('transparency_documents')
          .insert([{
            title: document.title,
            category: document.category,
            date: document.date,
            status: document.status || 'pending',
            file_size: fileSize,
            description: document.description,
            tags: document.tags || [],
            file_url: fileUrl
          }]);

        if (error) throw error;
        toast.success("Documento criado com sucesso");
      }

      setEditingDocument(null);
      setUploadedFile(null);
      loadData();
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      toast.error("Erro ao salvar documento");
    }
  };

  // Salvar dados orçamentários
  const saveBudget = async (budget: Partial<BudgetExecution>) => {
    try {
      if (editingBudget?.id) {
        // Atualizar dados existentes
        const { error } = await supabase
          .from('budget_execution')
          .update({
            year: budget.year,
            category: budget.category,
            total_budget: budget.total_budget,
            executed_budget: budget.executed_budget,
            percentage: budget.percentage,
            status: budget.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingBudget.id);

        if (error) throw error;
        toast.success("Dados orçamentários atualizados com sucesso");
      } else {
        // Criar novos dados
        const { error } = await supabase
          .from('budget_execution')
          .insert([{
            year: budget.year!,
            category: budget.category!,
            total_budget: budget.total_budget!,
            executed_budget: budget.executed_budget!,
            percentage: budget.percentage!,
            status: budget.status || 'on_track'
          }]);

        if (error) throw error;
        toast.success("Dados orçamentários criados com sucesso");
      }

      setEditingBudget(null);
      loadData();
    } catch (error) {
      console.error('Erro ao salvar dados orçamentários:', error);
      toast.error("Erro ao salvar dados orçamentários");
    }
  };

  // Salvar projeto
  const saveProject = async (project: Partial<TransparencyProject>) => {
    try {
      if (editingProject?.id) {
        // Atualizar projeto existente
        const { error } = await supabase
          .from('transparency_projects')
          .update({
            name: project.name,
            description: project.description,
            budget: project.budget,
            progress: project.progress,
            start_date: project.start_date,
            end_date: project.end_date,
            status: project.status,
            location: project.location,
            beneficiaries: project.beneficiaries,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProject.id);

        if (error) throw error;
        toast.success("Projeto atualizado com sucesso");
      } else {
        // Criar novo projeto
        const { error } = await supabase
          .from('transparency_projects')
          .insert([{
            name: project.name!,
            description: project.description!,
            budget: project.budget!,
            progress: project.progress || 0,
            start_date: project.start_date!,
            end_date: project.end_date!,
            status: project.status || 'planned',
            location: project.location!,
            beneficiaries: project.beneficiaries || 0
          }]);

        if (error) throw error;
        toast.success("Projeto criado com sucesso");
      }

      setEditingProject(null);
      loadData();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      toast.error("Erro ao salvar projeto");
    }
  };

  // Deletar item
  const deleteItem = async (table: 'transparency_documents' | 'budget_execution' | 'transparency_projects', id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Item deletado com sucesso");
      loadData();
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      toast.error("Erro ao deletar item");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando dados de transparência...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestor de Transparência</h2>
          <p className="text-slate-600">Gerencie documentos, orçamentos e projetos de transparência</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileTextIcon className="w-4 h-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center gap-2">
            <DollarSignIcon className="w-4 h-4" />
            Orçamento
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <BuildingIcon className="w-4 h-4" />
            Projetos
          </TabsTrigger>
        </TabsList>

        {/* Tab Documentos */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Documentos de Transparência</CardTitle>
                  <CardDescription>
                    Gerencie documentos e arquivos de transparência
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <SettingsIcon className="w-4 h-4" />
                        Limpeza
                        <ChevronDownIcon className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={cleanupOrphanedFiles}>
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Limpar Arquivos Órfãos
                        <span className="ml-auto text-xs text-muted-foreground">
                          Remove arquivos não utilizados
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={cleanupOldFiles}>
                        <ClockIcon2 className="w-4 h-4 mr-2" />
                        Limpar Arquivos Antigos
                        <span className="ml-auto text-xs text-muted-foreground">
                          Remove arquivos com mais de 30 dias
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={async () => {
                        const stats = await getStorageStats();
                        if (stats) {
                          toast.info(`Storage: ${stats.totalFiles} arquivos, ${stats.totalSizeMB}`);
                        } else {
                          toast.error("Erro ao obter estatísticas");
                        }
                      }}>
                        <HardDriveIcon className="w-4 h-4 mr-2" />
                        Ver Estatísticas
                        <span className="ml-auto text-xs text-muted-foreground">
                          Mostra uso do storage
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={() => setEditingDocument({} as Partial<TransparencyDocument>)} className="flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Novo Documento
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Visualizações</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.category}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(doc.date)}</TableCell>
                      <TableCell>
                        <Badge className={
                          doc.status === 'published' ? 'bg-green-100 text-green-800' :
                          doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {doc.status === 'published' ? 'Publicado' : 
                           doc.status === 'pending' ? 'Pendente' : 'Arquivado'}
                        </Badge>
                      </TableCell>
                      <TableCell>{doc.downloads}</TableCell>
                      <TableCell>{doc.views}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingDocument(doc)}
                          >
                            <EditIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteItem('transparency_documents', doc.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Orçamento */}
        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Execução Orçamentária</CardTitle>
                  <CardDescription>
                    Gerencie dados de execução orçamentária
                  </CardDescription>
                </div>
                <Button onClick={() => setEditingBudget({} as Partial<BudgetExecution>)} className="flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Novo Registro
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ano</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Orçamento Total</TableHead>
                    <TableHead>Executado</TableHead>
                    <TableHead>Percentual</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetData.map((budget) => (
                    <TableRow key={budget.id}>
                      <TableCell className="font-medium">{budget.year}</TableCell>
                      <TableCell>{budget.category}</TableCell>
                      <TableCell>{formatCurrency(budget.total_budget)}</TableCell>
                      <TableCell>{formatCurrency(budget.executed_budget)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={budget.percentage} className="w-20" />
                          <span className="text-sm">{budget.percentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          budget.status === 'on_track' ? 'bg-green-100 text-green-800' :
                          budget.status === 'over_budget' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {budget.status === 'on_track' ? 'No Prazo' : 
                           budget.status === 'over_budget' ? 'Acima' : 'Abaixo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingBudget(budget)}
                          >
                            <EditIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteItem('budget_execution', budget.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Projetos */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Projetos de Transparência</CardTitle>
                  <CardDescription>
                    Gerencie projetos e suas informações
                  </CardDescription>
                </div>
                <Button onClick={() => setEditingProject({} as Partial<TransparencyProject>)} className="flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Novo Projeto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Orçamento</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Beneficiários</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{formatCurrency(project.budget)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="w-20" />
                          <span className="text-sm">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {project.status === 'active' ? 'Ativo' : 
                           project.status === 'completed' ? 'Concluído' : 'Planeado'}
                        </Badge>
                      </TableCell>
                      <TableCell>{project.location}</TableCell>
                      <TableCell>{project.beneficiaries.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProject(project)}
                          >
                            <EditIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteItem('transparency_projects', project.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Edição de Documento */}
      {editingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingDocument.id ? 'Editar Documento' : 'Novo Documento'}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingDocument(null)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <form onSubmit={(e) => {
                e.preventDefault();
                saveDocument(editingDocument);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Título</label>
                    <Input
                      value={editingDocument.title || ''}
                      onChange={(e) => setEditingDocument({
                        ...editingDocument,
                        title: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <Select
                      value={editingDocument.category || ''}
                      onValueChange={(value) => setEditingDocument({
                        ...editingDocument,
                        category: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Data</label>
                    <Input
                      type="date"
                      value={editingDocument.date || ''}
                      onChange={(e) => setEditingDocument({
                        ...editingDocument,
                        date: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={editingDocument.status || 'pending'}
                      onValueChange={(value) => setEditingDocument({
                        ...editingDocument,
                        status: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea
                    value={editingDocument.description || ''}
                    onChange={(e) => setEditingDocument({
                      ...editingDocument,
                      description: e.target.value
                    })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tamanho do Arquivo</label>
                    <Input
                      placeholder="Ex: 2.5 MB"
                      value={editingDocument.file_size || ''}
                      onChange={(e) => setEditingDocument({
                        ...editingDocument,
                        file_size: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Arquivo PDF</label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                        isDragActive
                          ? 'border-blue-500 bg-blue-50'
                          : uploadedFile
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input {...getInputProps()} />
                      {uploadedFile ? (
                        <div className="space-y-2">
                          <FileTextIcon className="w-8 h-8 text-green-600 mx-auto" />
                          <p className="text-sm font-medium text-green-800">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-green-600">
                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFile(null);
                            }}
                          >
                            Remover
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <UploadIcon className="w-8 h-8 text-gray-400 mx-auto" />
                          <p className="text-sm font-medium text-gray-700">
                            {isDragActive ? 'Solte o arquivo aqui' : 'Clique ou arraste um arquivo PDF'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Máximo 10MB
                          </p>
                        </div>
                      )}
                    </div>
                    {uploadProgress !== null && (
                      <div className="mt-2">
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          Fazendo upload... {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Tags (separadas por vírgula)</label>
                  <Input
                    placeholder="Ex: gestão, anual, 2023"
                    value={editingDocument.tags?.join(', ') || ''}
                    onChange={(e) => setEditingDocument({
                      ...editingDocument,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                    })}
                  />
                </div>
              </form>
            </CardContent>
            <div className="p-6 pt-0 border-t bg-gray-50/50 flex-shrink-0">
              <div className="flex items-center gap-4">
                <Button 
                  type="submit" 
                  className="flex items-center gap-2"
                  disabled={uploading}
                  onClick={() => saveDocument(editingDocument)}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Fazendo Upload...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="w-4 h-4" />
                      Salvar
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingDocument(null);
                    setUploadedFile(null);
                  }}
                  disabled={uploading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Edição de Orçamento */}
      {editingBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingBudget.id ? 'Editar Dados Orçamentários' : 'Novos Dados Orçamentários'}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingBudget(null)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <form onSubmit={(e) => {
                e.preventDefault();
                saveBudget(editingBudget);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Ano</label>
                    <Input
                      value={editingBudget.year || ''}
                      onChange={(e) => setEditingBudget({
                        ...editingBudget,
                        year: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <Input
                      value={editingBudget.category || ''}
                      onChange={(e) => setEditingBudget({
                        ...editingBudget,
                        category: e.target.value
                      })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Orçamento Planeado</label>
                    <Input
                      type="number"
                      value={editingBudget.planned_budget || ''}
                      onChange={(e) => setEditingBudget({
                        ...editingBudget,
                        planned_budget: parseFloat(e.target.value)
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Orçamento Executado</label>
                    <Input
                      type="number"
                      value={editingBudget.executed_budget || ''}
                      onChange={(e) => setEditingBudget({
                        ...editingBudget,
                        executed_budget: parseFloat(e.target.value)
                      })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea
                    value={editingBudget.description || ''}
                    onChange={(e) => setEditingBudget({
                      ...editingBudget,
                      description: e.target.value
                    })}
                    required
                  />
                </div>
              </form>
            </CardContent>
            <div className="p-6 pt-0 border-t bg-gray-50/50 flex-shrink-0">
              <div className="flex items-center gap-4">
                <Button 
                  type="submit" 
                  className="flex items-center gap-2"
                  onClick={() => saveBudget(editingBudget)}
                >
                  <SaveIcon className="w-4 h-4" />
                  Salvar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingBudget(null)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Edição de Projeto */}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingProject.id ? 'Editar Projeto' : 'Novo Projeto'}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProject(null)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <form onSubmit={(e) => {
                e.preventDefault();
                saveProject(editingProject);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome do Projeto</label>
                    <Input
                      value={editingProject.name || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        name: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={editingProject.status || 'planned'}
                      onValueChange={(value) => setEditingProject({
                        ...editingProject,
                        status: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {projectStatusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Data de Início</label>
                    <Input
                      type="date"
                      value={editingProject.start_date || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        start_date: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Data de Fim</label>
                    <Input
                      type="date"
                      value={editingProject.end_date || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        end_date: e.target.value
                      })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Orçamento</label>
                    <Input
                      type="number"
                      value={editingProject.budget || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        budget: parseFloat(e.target.value)
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Progresso (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editingProject.progress || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        progress: parseInt(e.target.value)
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Localização</label>
                    <Input
                      value={editingProject.location || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        location: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Beneficiários</label>
                    <Input
                      type="number"
                      value={editingProject.beneficiaries || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        beneficiaries: parseInt(e.target.value)
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({
                      ...editingProject,
                      description: e.target.value
                    })}
                    required
                  />
                </div>
              </form>
            </CardContent>
            <div className="p-6 pt-0 border-t bg-gray-50/50 flex-shrink-0">
              <div className="flex items-center gap-4">
                <Button 
                  type="submit" 
                  className="flex items-center gap-2"
                  onClick={() => saveProject(editingProject)}
                >
                  <SaveIcon className="w-4 h-4" />
                  Salvar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProject(null)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}; 