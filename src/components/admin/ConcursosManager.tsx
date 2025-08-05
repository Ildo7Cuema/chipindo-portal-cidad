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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ExportUtils from "@/lib/export-utils";
import { seedSampleConcursos } from "@/lib/seed-concursos";
import { 
  Trophy, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Calendar, 
  MapPin, 
  Users, 
  FileText, 
  BriefcaseIcon as Briefcase,
  GraduationCap,
  Heart,
  Building2,
  Shield,
  Download,
  FileSpreadsheet,
  FileDown,
  ChevronDown,
  Zap,
  Archive,
  Send,
  MessageSquare,
  Star,
  TrendingUp,
  Building,
  Target,
  DollarSign,
  UserCheck,
  Timer,
  Globe,
  Printer,
  ListOrdered,
  SortAsc,
  SortDesc,
  XIcon,
  UserIcon,
  Tag,
  Filter,
  MenuIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessControl } from "@/hooks/useAccessControl";
import { SectorFilter } from "@/components/admin/SectorFilter";

interface ConcursoItem {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  deadline: string | null;
  contact_info: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  // Campos simulados para melhor UX
  category?: string;
  location?: string;
  salary_range?: string;
  positions_available?: number;
  status?: 'active' | 'closed' | 'suspended' | 'draft';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  views_count?: number;
  applications_count?: number;
}

type ConcursoCategory = 'administracao' | 'educacao' | 'saude' | 'obras' | 'tecnico' | 'seguranca' | 'outros';
type ConcursoStatus = 'active' | 'closed' | 'suspended' | 'draft';
type ConcursoPriority = 'low' | 'normal' | 'high' | 'urgent';

interface Inscricao {
  id: string;
  nome_completo: string;
  bilhete_identidade: string;
  data_nascimento: string;
  telefone: string;
  email: string;
  observacoes?: string;
  arquivos: unknown[];
  created_at: string;
  categoria?: string;
}

export const ConcursosManager = () => {
  const [concursos, setConcursos] = useState<ConcursoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConcurso, setEditingConcurso] = useState<ConcursoItem | null>(null);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inscricoesModalOpen, setInscricoesModalOpen] = useState(false);
  const [inscricoesLoading, setInscricoesLoading] = useState(false);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [inscricoesConcurso, setInscricoesConcurso] = useState<ConcursoItem | null>(null);
  const [inscricoesSort, setInscricoesSort] = useState<'nome'|'idade'|'categoria'>('nome');
  const [inscricoesSortDir, setInscricoesSortDir] = useState<'asc'|'desc'>('asc');
  
  // Estados para responsividade
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState("");

  // Controle de acesso
  const { isAdmin, getCurrentSector, getCurrentSectorName } = useAccessControl();

  // Função para obter placeholders específicos do setor
  const getSectorPlaceholders = () => {
    const currentSector = getCurrentSector();
    const currentSectorName = getCurrentSectorName();
    
    const placeholders = {
      title: "Ex: Concurso Público para Professor de Educação Primária",
      area: "Ex: Direcção de Educação, Direcção de Saúde, etc.",
      description: "Descreva detalhadamente o concurso, suas finalidades e objectivos...",
      requirements: "Liste os requisitos necessários para o concurso...",
      contact_info: "Telefone, email, endereço para mais informações...",
      location: "Ex: Chipindo Sede",
      salary_range: "Ex: 150.000 - 200.000 Kz",
      nova_categoria: "Digite uma categoria (ex: Professor Primário, Enfermeiro, etc.)"
    };

    // Personalizar placeholders baseado no setor
    switch (currentSector) {
      case 'educacao':
        return {
          title: "Ex: Concurso Público para Professor de Matemática",
          area: "Ex: Direcção de Educação e Ensino",
          description: "Descreva o cargo de professor, disciplinas, nível de ensino...",
          requirements: "Licenciatura em Educação, experiência em ensino, conhecimentos pedagógicos...",
          contact_info: "Direcção de Educação, telefone: 123-456-789, email: educacao@chipindo.ao",
          location: "Ex: Escola Primária de Chipindo",
          salary_range: "Ex: 200.000 - 300.000 Kz",
          nova_categoria: "Ex: Professor de Matemática, Professor de Português, Director de Escola"
        };
      
      case 'saude':
        return {
          title: "Ex: Concurso Público para Enfermeiro",
          area: "Ex: Direcção de Saúde Pública",
          description: "Descreva o cargo na área da saúde, responsabilidades, horários...",
          requirements: "Licenciatura em Enfermagem, registro profissional, experiência clínica...",
          contact_info: "Direcção de Saúde, telefone: 123-456-789, email: saude@chipindo.ao",
          location: "Ex: Hospital Municipal de Chipindo",
          salary_range: "Ex: 250.000 - 350.000 Kz",
          nova_categoria: "Ex: Enfermeiro, Médico, Técnico de Laboratório, Farmacêutico"
        };
      
      case 'agricultura':
        return {
          title: "Ex: Concurso Público para Técnico Agrícola",
          area: "Ex: Direcção de Agricultura e Desenvolvimento Rural",
          description: "Descreva o cargo na área agrícola, responsabilidades técnicas...",
          requirements: "Licenciatura em Agronomia, experiência em extensão rural...",
          contact_info: "Direcção de Agricultura, telefone: 123-456-789, email: agricultura@chipindo.ao",
          location: "Ex: Centro de Extensão Agrícola",
          salary_range: "Ex: 180.000 - 250.000 Kz",
          nova_categoria: "Ex: Técnico Agrícola, Engenheiro Agrónomo, Extensionista Rural"
        };
      
      case 'sector-mineiro':
        return {
          title: "Ex: Concurso Público para Técnico de Minas",
          area: "Ex: Direcção de Recursos Minerais",
          description: "Descreva o cargo na área mineira, responsabilidades técnicas...",
          requirements: "Licenciatura em Engenharia de Minas, experiência em exploração...",
          contact_info: "Direcção de Recursos Minerais, telefone: 123-456-789, email: minerais@chipindo.ao",
          location: "Ex: Centro de Recursos Minerais",
          salary_range: "Ex: 300.000 - 400.000 Kz",
          nova_categoria: "Ex: Técnico de Minas, Engenheiro de Minas, Geólogo"
        };
      
      case 'desenvolvimento-economico':
        return {
          title: "Ex: Concurso Público para Economista",
          area: "Ex: Direcção de Desenvolvimento Económico",
          description: "Descreva o cargo na área económica, responsabilidades de planeamento...",
          requirements: "Licenciatura em Economia, experiência em planeamento económico...",
          contact_info: "Direcção de Desenvolvimento Económico, telefone: 123-456-789, email: economia@chipindo.ao",
          location: "Ex: Centro de Desenvolvimento Económico",
          salary_range: "Ex: 250.000 - 350.000 Kz",
          nova_categoria: "Ex: Economista, Analista Económico, Técnico de Planeamento"
        };
      
      case 'cultura':
        return {
          title: "Ex: Concurso Público para Animador Cultural",
          area: "Ex: Direcção de Cultura e Turismo",
          description: "Descreva o cargo na área cultural, responsabilidades de animação...",
          requirements: "Licenciatura em Artes ou Cultura, experiência em animação cultural...",
          contact_info: "Direcção de Cultura, telefone: 123-456-789, email: cultura@chipindo.ao",
          location: "Ex: Centro Cultural de Chipindo",
          salary_range: "Ex: 150.000 - 220.000 Kz",
          nova_categoria: "Ex: Animador Cultural, Técnico de Museu, Gestor Cultural"
        };
      
      case 'tecnologia':
        return {
          title: "Ex: Concurso Público para Técnico de Informática",
          area: "Ex: Direcção de Tecnologia e Inovação",
          description: "Descreva o cargo na área tecnológica, responsabilidades técnicas...",
          requirements: "Licenciatura em Informática, experiência em desenvolvimento...",
          contact_info: "Direcção de Tecnologia, telefone: 123-456-789, email: tecnologia@chipindo.ao",
          location: "Ex: Centro de Tecnologia de Chipindo",
          salary_range: "Ex: 200.000 - 300.000 Kz",
          nova_categoria: "Ex: Técnico de Informática, Desenvolvedor, Analista de Sistemas"
        };
      
      case 'energia-agua':
        return {
          title: "Ex: Concurso Público para Técnico de Energia",
          area: "Ex: Direcção de Energia e Águas",
          description: "Descreva o cargo na área de energia e águas, responsabilidades técnicas...",
          requirements: "Licenciatura em Engenharia Electrotécnica, experiência em distribuição...",
          contact_info: "Direcção de Energia e Águas, telefone: 123-456-789, email: energia@chipindo.ao",
          location: "Ex: Central de Distribuição de Energia",
          salary_range: "Ex: 220.000 - 320.000 Kz",
          nova_categoria: "Ex: Técnico de Energia, Técnico de Águas, Engenheiro Electrotécnico"
        };
      
      default:
        return placeholders;
    }
  };

  const sectorPlaceholders = getSectorPlaceholders();


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    deadline: "",
    contact_info: "",
    published: false,
    category: 'outros' as ConcursoCategory,
    location: "",
    salary_range: "",
    positions_available: 1,
    priority: 'normal' as ConcursoPriority,
    area: "",
    categorias_disponiveis: [] as string[]
  });

  const concursoCategories = [
    { value: 'administracao', label: 'Administração', icon: Briefcase, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
    { value: 'educacao', label: 'Educação', icon: GraduationCap, color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
    { value: 'saude', label: 'Saúde', icon: Heart, color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
    { value: 'obras', label: 'Obras Públicas', icon: Building2, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' },
    { value: 'tecnico', label: 'Técnico', icon: Zap, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
    { value: 'seguranca', label: 'Segurança', icon: Shield, color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400' },
    { value: 'outros', label: 'Outros', icon: FileText, color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400' }
  ];

  const priorityTypes = [
    { value: 'low', label: 'Baixa', color: 'bg-gray-100 text-gray-700' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-700' },
    { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-700' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-700' }
  ];

  useEffect(() => {
    fetchConcursos();
  }, []);

  const fetchConcursos = async () => {
    try {
      // Simplificar a query para evitar problemas com colunas inexistentes
      const { data, error } = await supabase
        .from('concursos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro na query de concursos:', error);
        toast({
          title: "Erro ao carregar concursos",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Filtrar por setor no frontend se não for admin
      let filteredData = data || [];
      if (!isAdmin) {
        const currentSector = getCurrentSector();
        const currentSectorName = getCurrentSectorName();
        
        if (currentSector && currentSectorName) {
          // Filtrar no frontend por título ou descrição
          filteredData = filteredData.filter(concurso => 
            (concurso.title && concurso.title.toLowerCase().includes(currentSectorName.toLowerCase())) ||
            (concurso.description && concurso.description.toLowerCase().includes(currentSectorName.toLowerCase()))
          );
        }
      }

      // Simular campos adicionais baseados no ID
      const enrichedData = filteredData.map((item, index) => ({
        ...item,
        category: getCategoryByIndex(index),
        location: getLocationByIndex(index),
        salary_range: getSalaryRangeByIndex(index),
        positions_available: getPositionsAvailableByIndex(index),
        status: getStatusByDeadline(item.deadline),
        priority: getPriorityByIndex(index),
        views_count: Math.floor(Math.random() * 1000) + 50,
        applications_count: Math.floor(Math.random() * 200) + 10,
        categorias_disponiveis: parseCategoriasDisponiveis(item.categorias_disponiveis)
      }));
      
      setConcursos(enrichedData);
    } catch (error) {
      console.error('Erro inesperado ao carregar concursos:', error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível carregar os concursos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Funções para simular dados baseados no hash do ID
  const getCategoryByIndex = (index: number): ConcursoCategory => {
    const categories: ConcursoCategory[] = ['administracao', 'educacao', 'saude', 'obras', 'tecnico', 'seguranca'];
    return categories[index % categories.length];
  };

  const getLocationByIndex = (index: number): string => {
    const locations = ['Chipindo Sede', 'Chibia', 'Humpata', 'Quilengues', 'Caconda', 'Lubango'];
    return locations[index % locations.length];
  };

  const getSalaryRangeByIndex = (index: number): string => {
    const ranges = ['150.000 - 200.000 Kz', '200.000 - 300.000 Kz', '300.000 - 450.000 Kz', '450.000 - 600.000 Kz', '600.000+ Kz'];
    return ranges[index % ranges.length];
  };

  const getPositionsAvailableByIndex = (index: number): number => {
    return (index % 10) + 1;
  };

  const getPriorityByIndex = (index: number): ConcursoPriority => {
    const priorities: ConcursoPriority[] = ['low', 'normal', 'high', 'urgent'];
    return priorities[index % priorities.length];
  };

  const getStatusByDeadline = (deadline: string | null): ConcursoStatus => {
    if (!deadline) return 'active';
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate > now ? 'active' : 'closed';
  };

  const parseCategoriasDisponiveis = (categorias: unknown): string[] => {
    if (!categorias) return [];
    if (Array.isArray(categorias)) return categorias;
    if (typeof categorias === 'string') {
      try {
        const parsed = JSON.parse(categorias);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const adicionarCategoria = () => {
    if (novaCategoria.trim() && !formData.categorias_disponiveis.includes(novaCategoria.trim())) {
      setFormData({
        ...formData,
        categorias_disponiveis: [...formData.categorias_disponiveis, novaCategoria.trim()]
      });
      setNovaCategoria("");
    }
  };

  const removerCategoria = (index: number) => {
    const novasCategorias = formData.categorias_disponiveis.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      categorias_disponiveis: novasCategorias
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const concursoData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements || null,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        contact_info: formData.contact_info || null,
        published: formData.published,
        area: formData.area,
        categorias_disponiveis: formData.categorias_disponiveis
      };

      if (editingConcurso) {
        const { error } = await supabase
          .from('concursos')
          .update(concursoData)
          .eq('id', editingConcurso.id);

        if (error) throw error;

        toast({
          title: "Concurso actualizado",
          description: "O concurso foi actualizado com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('concursos')
          .insert([concursoData]);

        if (error) throw error;

        toast({
          title: "Concurso criado",
          description: "O concurso foi criado com sucesso.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchConcursos();
    } catch (error: unknown) {
        toast({
        title: "Erro ao actualizar",
          description: error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
        setFormData({
          title: "",
          description: "",
          requirements: "",
          deadline: "",
          contact_info: "",
          published: false,
      category: 'outros',
      location: "",
      salary_range: "",
      positions_available: 1,
      priority: 'normal',
      area: "",
      categorias_disponiveis: []
    });
    setNovaCategoria("");
    setEditingConcurso(null);
  };

  const handleEdit = (concurso: ConcursoItem) => {
    setEditingConcurso(concurso);
    setFormData({
      title: concurso.title,
      description: concurso.description,
      requirements: concurso.requirements || "",
      deadline: concurso.deadline ? new Date(concurso.deadline).toISOString().split('T')[0] : "",
      contact_info: concurso.contact_info || "",
      published: concurso.published,
      category: (concurso.category as ConcursoCategory) || 'outros' as ConcursoCategory,
      location: concurso.location || "",
      salary_range: concurso.salary_range || "",
      positions_available: concurso.positions_available || 1,
      priority: concurso.priority || 'normal',
      area: concurso.area || "",
      categorias_disponiveis: parseCategoriasDisponiveis(concurso.categorias_disponiveis)
    });
    setNovaCategoria("");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('concursos')
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
          title: "Concurso excluído",
          description: "O concurso foi excluído com sucesso.",
        });
        fetchConcursos();
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível excluir o concurso.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublished = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase
        .from('concursos')
        .update({ published })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: published ? "Concurso publicado" : "Concurso despublicado",
        description: `Concurso ${published ? 'publicado' : 'despublicado'} com sucesso.`,
      });
      fetchConcursos();
    } catch (error: unknown) {
      toast({
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'delete') => {
    if (selectedIds.length === 0) {
      toast({
        title: "Nenhum concurso selecionado",
        description: "Selecione pelo menos um concurso.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('concursos')
          .delete()
          .in('id', selectedIds);
        
        if (error) throw error;
        
        toast({
          title: "Concursos excluídos",
          description: `${selectedIds.length} concursos foram excluídos.`,
        });
      } else {
        const { error } = await supabase
          .from('concursos')
          .update({ published: action === 'publish' })
          .in('id', selectedIds);
        
        if (error) throw error;
        
        toast({
          title: `Concursos ${action === 'publish' ? 'publicados' : 'despublicados'}`,
          description: `${selectedIds.length} concursos foram ${action === 'publish' ? 'publicados' : 'despublicados'}.`,
        });
      }

      setSelectedIds([]);
      fetchConcursos();
    } catch (error: unknown) {
      toast({
        title: "Erro na operação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleSeedSampleConcursos = async () => {
    setLoading(true);
    try {
      const success = await seedSampleConcursos();
      if (success) {
        toast({
          title: "Concursos de exemplo criados",
          description: "9 concursos de exemplo foram adicionados ao sistema.",
        });
        fetchConcursos();
      } else {
        toast({
          title: "Erro ao criar concursos",
          description: "Não foi possível criar os concursos de exemplo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao criar os concursos de exemplo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Export functions
  const exportConcursosToCSV = async () => {
    setExportLoading('csv');
    try {
      const exportData = {
        title: 'Relatório de Concursos Públicos',
        subtitle: 'Portal Municipal de Chipindo',
        headers: ['Título', 'Categoria', 'Status', 'Vagas', 'Prazo', 'Localização', 'Data de Criação'],
        rows: filteredConcursos.map(item => [
          item.title,
          getCategoryLabel(item.category),
          getStatusLabel(item.status),
          item.positions_available?.toString() || '1',
          item.deadline ? new Date(item.deadline).toLocaleDateString('pt-AO') : 'Sem prazo',
          item.location || 'Não informado',
          new Date(item.created_at).toLocaleDateString('pt-AO')
        ]),
        metadata: {
          'Total de Concursos': concursos.length,
          'Publicados': concursos.filter(c => c.published).length,
          'Ativos': concursos.filter(c => c.status === 'active').length,
          'Fechados': concursos.filter(c => c.status === 'closed').length
        }
      };

      ExportUtils.exportToCSV(exportData, { 
        filename: 'concursos-publicos-chipindo',
        includeTimestamp: true 
      });
      
      toast({
        title: "Concursos exportados",
        description: "O relatório foi baixado em formato CSV.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os concursos.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(null);
    }
  };

  const getCategoryLabel = (category?: string): string => {
    const categoryObj = concursoCategories.find(c => c.value === category);
    return categoryObj?.label || 'Outros';
  };

  const getCategoryIcon = (category?: string) => {
    const categoryObj = concursoCategories.find(c => c.value === category);
    const Icon = categoryObj?.icon || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const getCategoryColor = (category?: string): string => {
    const categoryObj = concursoCategories.find(c => c.value === category);
    return categoryObj?.color || 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getStatusLabel = (status?: string): string => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'closed': return 'Fechado';
      case 'suspended': return 'Suspenso';
      case 'draft': return 'Rascunho';
      default: return 'Ativo';
    }
  };

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'closed': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'suspended': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
    }
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

  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const filteredConcursos = concursos.filter(concurso => {
    const matchesSearch = searchQuery === '' || 
      concurso.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concurso.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || concurso.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || concurso.status === statusFilter;
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'published' && concurso.published) ||
      (activeTab === 'draft' && !concurso.published) ||
      (activeTab === 'active' && concurso.status === 'active') ||
      (activeTab === 'closed' && concurso.status === 'closed');
    
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  const publishedCount = concursos.filter(c => c.published).length;
  const activeCount = concursos.filter(c => c.status === 'active').length;
  const closedCount = concursos.filter(c => c.status === 'closed').length;

  const openInscricoesModal = async (concurso: ConcursoItem) => {
    setInscricoesConcurso(concurso);
    setInscricoesModalOpen(true);
    setInscricoesLoading(true);
    try {
      const { data, error } = await supabase
        .from('inscricoes')
        .select('*')
        .eq('concurso_id', concurso.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setInscricoes(data || []);
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error);
      toast({
        title: "Erro ao carregar inscritos",
        description: "Não foi possível carregar a lista de inscritos.",
        variant: "destructive"
      });
      setInscricoes([]);
    } finally {
      setInscricoesLoading(false);
    }
  };

  const sortInscricoes = (list: Inscricao[]) => {
    const sorted = [...list];
    if (inscricoesSort === 'nome') {
      sorted.sort((a, b) => a.nome_completo.localeCompare(b.nome_completo));
    } else if (inscricoesSort === 'idade') {
      sorted.sort((a, b) => {
        const ageA = getIdade(a.data_nascimento);
        const ageB = getIdade(b.data_nascimento);
        return ageA - ageB;
      });
    } else if (inscricoesSort === 'categoria') {
      sorted.sort((a, b) => (a.categoria || '').localeCompare(b.categoria || ''));
    }
    if (inscricoesSortDir === 'desc') sorted.reverse();
    return sorted;
  };

  const getIdade = (dataNasc: string) => {
    if (!dataNasc) return 0;
    const nasc = new Date(dataNasc);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  };

  const exportInscricoes = async (format: 'excel'|'pdf') => {
    if (!inscricoesConcurso) return;
    const sorted = sortInscricoes(inscricoes);
    const exportData = {
      title: `Lista de Inscritos - ${inscricoesConcurso.title}`,
      subtitle: 'Portal Municipal de Chipindo',
      headers: ['Nome', 'Nº Do Bilhete', 'Idade', 'Categoria', 'Email', 'Telefone', 'Data de Inscrição'],
      rows: sorted.map(i => [
        i.nome_completo,
        i.bilhete_identidade,
        getIdade(i.data_nascimento).toString(),
        i.categoria || '-',
        i.email,
        i.telefone,
        new Date(i.created_at).toLocaleDateString('pt-AO')
      ]),
      metadata: {
        'Total de Inscritos': inscricoes.length
      }
    };
    if (format === 'excel') {
      ExportUtils.exportToExcel(exportData, {
        filename: `inscritos-${inscricoesConcurso.title.replace(/\s+/g, '-')}`,
        sheetName: 'Inscritos',
        author: 'Administração Municipal',
        company: 'Município de Chipindo'
      });
    } else {
      ExportUtils.exportToPDF(exportData, {
        filename: `inscritos-${inscricoesConcurso.title.replace(/\s+/g, '-')}`,
        author: 'Administração Municipal',
        company: 'Município de Chipindo'
      });
    }
    toast({
      title: `Exportação ${format === 'excel' ? 'Excel' : 'PDF'} gerada`,
      description: `A lista foi exportada em formato ${format.toUpperCase()}.`,
    });
  };

  const printInscricoes = () => {
    window.print(); // Pode ser melhorado com CSS de impressão customizado
  };

  const categoriaInputRef = useRef<HTMLInputElement>(null);

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
      {/* Sector Filter */}
      <SectorFilter />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Gestão de Concursos Públicos</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gerencie concursos públicos e processos de recrutamento municipal
          </p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Mobile Menu for Actions */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>Ações Rápidas</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={exportConcursosToCSV} 
                  disabled={exportLoading === 'csv'}
                  className="py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium">Exportar CSV</div>
                      <div className="text-xs text-muted-foreground">Baixar dados</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                {concursos.length === 0 && (
                  <DropdownMenuItem 
                    onClick={handleSeedSampleConcursos}
                    disabled={loading}
                    className="py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="font-medium">Criar Exemplos</div>
                        <div className="text-xs text-muted-foreground">Dados de teste</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={exportLoading !== null}
                  className="shadow-sm hover:shadow-md transition-all duration-200"
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
                <DropdownMenuLabel className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span>Exportar Concursos</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={exportConcursosToCSV} 
                  disabled={exportLoading === 'csv'}
                  className="py-3"
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
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-800 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <MoreVertical className="w-4 h-4" />
                      <span className="font-medium">Ações ({selectedIds.length})</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="flex items-center gap-3 py-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Ações em Lote</div>
                      <div className="text-xs text-muted-foreground">{selectedIds.length} {selectedIds.length === 1 ? 'concurso selecionado' : 'concursos selecionados'}</div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('publish')}
                    className="py-4 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
                        <Send className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-green-700 dark:text-green-300">Publicar Selecionados</div>
                        <div className="text-xs text-muted-foreground mt-1">Tornar visíveis publicamente</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('unpublish')}
                    className="py-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 flex items-center justify-center">
                        <Archive className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-blue-700 dark:text-blue-300">Despublicar Selecionados</div>
                        <div className="text-xs text-muted-foreground mt-1">Ocultar da visualização pública</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive py-4 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10"
                    onClick={() => handleBulkAction('delete')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-red-700 dark:text-red-300">Excluir Selecionados</div>
                        <div className="text-xs text-muted-foreground mt-1">Remover permanentemente</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Sample Concursos Button */}
            {concursos.length === 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSeedSampleConcursos}
                disabled={loading}
                className="shadow-sm hover:shadow-md transition-all duration-200 bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/20"
              >
                <Star className="w-4 h-4 mr-2" />
                Criar Exemplos
              </Button>
            )}
          </div>

          {/* New Concurso Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Novo Concurso</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </DialogTrigger>
          
            <DialogContent className="max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
              <DialogHeader className="pb-4 border-b border-border/50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-semibold">
                      {editingConcurso ? "Editar Concurso" : "Novo Concurso Público"}
              </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {editingConcurso 
                        ? "Edite os detalhes do concurso público" 
                        : "Crie um novo concurso público para o município"
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
                      <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <FileText className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-base font-semibold">Informações Básicas</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                          <Building className="w-3 h-3" />
                          Título do Concurso
                        </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder={sectorPlaceholders.title}
                          className="h-10"
                  required
                />
              </div>
              
              <div className="space-y-2">
                        <Label htmlFor="area" className="text-sm font-medium flex items-center gap-2">
                          <Building2 className="w-3 h-3" />
                          Direcção/Área Responsável
                        </Label>
                        <Input
                          id="area"
                          value={formData.area}
                          onChange={e => setFormData({ ...formData, area: e.target.value })}
                          placeholder={sectorPlaceholders.area}
                          className="h-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        Descrição
                      </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder={sectorPlaceholders.description}
                  rows={4}
                        className="resize-none"
                  required
                />
                    </div>
              </div>
              
                  <Separator />
                  
                  {/* Detalhes do Concurso Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <Info className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-base font-semibold">Detalhes do Concurso</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                        <Label htmlFor="positions_available" className="text-sm font-medium flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          Vagas Disponíveis
                        </Label>
                        <Input
                          id="positions_available"
                          type="number"
                          min="1"
                          value={formData.positions_available}
                          onChange={(e) => setFormData({ ...formData, positions_available: parseInt(e.target.value) || 1 })}
                          className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          Localização
                        </Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder={sectorPlaceholders.location}
                          className="h-10"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="salary_range" className="text-sm font-medium flex items-center gap-2">
                          <DollarSign className="w-3 h-3" />
                          Faixa Salarial
                        </Label>
                        <Input
                          id="salary_range"
                          value={formData.salary_range}
                          onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                          placeholder={sectorPlaceholders.salary_range}
                          className="h-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        Data Limite
                      </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="h-10"
                />
                    </div>
              </div>
              
                  <Separator />
                  
                  {/* Requisitos e Contacto Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                        <UserCheck className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                      </div>
                      <h3 className="text-base font-semibold">Requisitos e Contacto</h3>
                    </div>
                    
                    <div className="space-y-4">
              <div className="space-y-2">
                        <Label htmlFor="requirements" className="text-sm font-medium flex items-center gap-2">
                          <CheckCircle className="w-3 h-3" />
                          Requisitos
                        </Label>
                        <Textarea
                          id="requirements"
                          value={formData.requirements}
                          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                          placeholder={sectorPlaceholders.requirements}
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact_info" className="text-sm font-medium flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          Informações de Contacto
                        </Label>
                <Textarea
                  id="contact_info"
                  value={formData.contact_info}
                  onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                          placeholder={sectorPlaceholders.contact_info}
                          rows={3}
                          className="resize-none"
                />
                      </div>
                    </div>
              </div>
              
                  <Separator />

                  {/* Categorias Disponíveis Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <Tag className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-base font-semibold">Categorias Disponíveis</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="categorias_disponiveis" className="text-sm font-medium flex items-center gap-2">
                          <Tag className="w-3 h-3" />
                          Categorias para Candidatura
                        </Label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Input
                              id="nova_categoria"
                              placeholder={sectorPlaceholders.nova_categoria}
                              value={novaCategoria}
                              onChange={(e) => setNovaCategoria(e.target.value)}
                              className="flex-1"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  adicionarCategoria();
                                }
                              }}
                            />
                            <Button
                              type="button"
                              onClick={adicionarCategoria}
                              disabled={!novaCategoria.trim()}
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          {formData.categorias_disponiveis.length > 0 && (
                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-muted-foreground">
                                Categorias adicionadas:
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {formData.categorias_disponiveis.map((categoria, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-md text-sm"
                                  >
                                    <span>{categoria}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removerCategoria(index)}
                                      className="h-4 w-4 p-0 hover:bg-purple-200 dark:hover:bg-purple-800"
                                    >
                                      <XIcon className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {formData.categorias_disponiveis.length === 0 && (
                            <p className="text-xs text-muted-foreground">
                              Adicione categorias para que os candidatos possam escolher ao se inscrever.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />

                  {/* Status Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <Eye className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-base font-semibold">Status de Publicação</h3>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                      <div>
                        <Label htmlFor="published" className="text-sm font-medium">
                          {formData.published ? "Publicado" : "Rascunho"}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {formData.published 
                            ? "O concurso será visível publicamente" 
                            : "O concurso ficará como rascunho"
                          }
                        </p>
              </div>
                    </div>
                  </div>
                </form>
              </ScrollArea>
              
              <div className="pt-4 border-t border-border/50 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    {editingConcurso ? "Modificando concurso existente" : "Criando novo concurso"}
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
                      disabled={loading || !formData.title || !formData.description}
                      className="min-w-[100px] h-9 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                      onClick={handleSubmit}
                      size="sm"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Salvando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {editingConcurso ? <Edit className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          {editingConcurso ? "Actualizar" : "Criar"}
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-medium truncate">Total</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-900 dark:text-blue-100">{concursos.length}</p>
              </div>
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm font-medium truncate">Publicados</p>
                <p className="text-lg sm:text-2xl font-bold text-green-900 dark:text-green-100">{publishedCount}</p>
              </div>
              <Send className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-medium truncate">Ativos</p>
                <p className="text-lg sm:text-2xl font-bold text-emerald-900 dark:text-emerald-100">{activeCount}</p>
              </div>
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium truncate">Fechados</p>
                <p className="text-lg sm:text-2xl font-bold text-red-900 dark:text-red-100">{closedCount}</p>
              </div>
              <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Pesquisar concursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 sm:h-11"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between sm:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtros
                <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
              </Button>
              
              {selectedIds.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className={cn(
                    "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-800 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 shadow-sm transition-all duration-200",
                    showBulkActions && "ring-2 ring-amber-300 dark:ring-amber-700"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <MoreVertical className="w-4 h-4" />
                    <span className="font-medium">{selectedIds.length} {selectedIds.length === 1 ? 'selecionado' : 'selecionados'}</span>
                    <ChevronDown className={cn("w-3 h-3 transition-transform", showBulkActions && "rotate-180")} />
                  </div>
                </Button>
              )}
            </div>

            {/* Mobile Filters */}
            <div className={cn("space-y-3 sm:hidden", showFilters ? "block" : "hidden")}>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {concursoCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="closed">Fechados</SelectItem>
                  <SelectItem value="suspended">Suspensos</SelectItem>
                  <SelectItem value="draft">Rascunhos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Filters */}
            <div className="hidden sm:flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {concursoCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="closed">Fechados</SelectItem>
                  <SelectItem value="suspended">Suspensos</SelectItem>
                  <SelectItem value="draft">Rascunhos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Bulk Actions */}
            {selectedIds.length > 0 && showBulkActions && (
              <div className="sm:hidden space-y-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                      {selectedIds.length} {selectedIds.length === 1 ? 'concurso selecionado' : 'concursos selecionados'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedIds([])}
                    className="h-8 w-8 p-0 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleBulkAction('publish')}
                    className="h-10 bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Publicar Selecionados
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('unpublish')}
                    className="h-10 border-blue-300 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 font-medium"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Despublicar Selecionados
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    className="h-10 border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 font-medium"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Selecionados
                  </Button>
                </div>
                
                <div className="text-xs text-amber-700 dark:text-amber-300 text-center">
                  Clique em "X" para cancelar a seleção
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Concursos List */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-5 min-w-[600px] sm:min-w-0">
            <TabsTrigger value="all" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Todos</span>
              <span className="sm:hidden">Todos</span>
              <span className="hidden sm:inline">({concursos.length})</span>
              <span className="sm:hidden text-xs">({concursos.length})</span>
            </TabsTrigger>
            <TabsTrigger value="published" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Publicados</span>
              <span className="sm:hidden">Pub</span>
              <span className="hidden sm:inline">({publishedCount})</span>
              <span className="sm:hidden text-xs">({publishedCount})</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Ativos</span>
              <span className="sm:hidden">Ativos</span>
              <span className="hidden sm:inline">({activeCount})</span>
              <span className="sm:hidden text-xs">({activeCount})</span>
            </TabsTrigger>
            <TabsTrigger value="closed" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Timer className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Fechados</span>
              <span className="sm:hidden">Fech</span>
              <span className="hidden sm:inline">({closedCount})</span>
              <span className="sm:hidden text-xs">({closedCount})</span>
            </TabsTrigger>
            <TabsTrigger value="draft" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Archive className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Rascunhos</span>
              <span className="sm:hidden">Rasc</span>
              <span className="hidden sm:inline">({concursos.length - publishedCount})</span>
              <span className="sm:hidden text-xs">({concursos.length - publishedCount})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Selection Indicator */}
          {selectedIds.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                      {selectedIds.length} {selectedIds.length === 1 ? 'concurso selecionado' : 'concursos selecionados'}
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-300">
                      Use as ações abaixo para gerenciar os itens selecionados
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds([])}
                  className="text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                >
                  <XIcon className="w-4 h-4 mr-1" />
                  Limpar
                </Button>
              </div>
            </div>
          )}

          {filteredConcursos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 bg-muted/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">
                  {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' ? 'Nenhum concurso encontrado' : 'Nenhum concurso disponível'}
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' ? 'Tente ajustar os filtros de pesquisa' : 'Os concursos aparecerão aqui conforme forem criados'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredConcursos.map((concurso) => (
                <Card key={concurso.id} className={cn(
                  "border-0 shadow-sm hover:shadow-md transition-all duration-200",
                  !concurso.published && "bg-gray-50/50 dark:bg-gray-950/10",
                  concurso.status === 'active' && concurso.published && "bg-green-50/30 dark:bg-green-950/10"
                )}>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Selection Checkbox */}
                      <div className="flex items-center flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(concurso.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds([...selectedIds, concurso.id]);
                            } else {
                              setSelectedIds(selectedIds.filter(id => id !== concurso.id));
                            }
                          }}
                          className="rounded border-gray-300 w-4 h-4 sm:w-5 sm:h-5"
                        />
                      </div>

                      {/* Concurso Icon */}
                      <div className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        getCategoryColor(concurso.category)
                      )}>
                        {getCategoryIcon(concurso.category)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 flex-wrap mb-1">
                              <h4 className={cn(
                                "font-semibold text-sm sm:text-base leading-tight",
                                concurso.published && "text-foreground font-bold"
                              )}>
                                {concurso.title}
                              </h4>
                              {concurso.published && (
                                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {getCategoryLabel(concurso.category)}
                              </Badge>
                              <Badge className={cn("text-xs", getStatusColor(concurso.status))}>
                                {getStatusLabel(concurso.status)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-muted-foreground hidden sm:block">
                              {formatDate(concurso.created_at)}
                            </span>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleTogglePublished(concurso.id, !concurso.published)}>
                                  {concurso.published ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                  {concurso.published ? 'Despublicar' : 'Publicar'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(concurso)}>
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
                                  <AlertDialogContent className="max-w-md">
                                    <AlertDialogHeader className="pb-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center">
                                          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                                        <div>
                                          <AlertDialogTitle className="text-lg font-semibold">Confirmar Exclusão</AlertDialogTitle>
                                          <AlertDialogDescription className="text-muted-foreground mt-1">
                                            Esta ação não pode ser desfeita
                                          </AlertDialogDescription>
                    </div>
                                      </div>
                                    </AlertDialogHeader>
                                    
                                    <div className="py-4 space-y-3">
                                      <p className="text-sm text-muted-foreground">
                                        Tem certeza que deseja excluir este concurso?
                                      </p>
                                      
                                      <div className="p-3 rounded-lg bg-muted/50 border border-dashed">
                                        <div className="flex items-center gap-2 mb-1">
                                          <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", getCategoryColor(concurso.category))}>
                                            {getCategoryIcon(concurso.category)}
                                          </div>
                                          <span className="font-medium text-sm">{concurso.title}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          {concurso.description.length > 60 
                                            ? concurso.description.substring(0, 60) + '...' 
                                            : concurso.description
                                          }
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <AlertDialogFooter className="pt-4 border-t border-border/50">
                                      <AlertDialogCancel className="min-w-[100px]">
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDelete(concurso.id)}
                                        className="min-w-[100px] bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
                                      >
                                        <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                                          Excluir
                    </div>
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                <DropdownMenuItem onClick={() => openInscricoesModal(concurso)}>
                                  <ListOrdered className="w-4 h-4 mr-2" />
                                  Ver Inscritos
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                  </div>
                        </div>
                        
                        <p className={cn(
                          "text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2",
                          concurso.published && "text-foreground/80"
                        )}>
                          {concurso.description}
                        </p>

                        {/* Additional Info */}
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 text-xs text-muted-foreground mb-3">
                          {concurso.positions_available && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{concurso.positions_available} vagas</span>
                            </div>
                          )}
                          {concurso.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{concurso.location}</span>
                            </div>
                          )}
                          {concurso.deadline && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">Até {new Date(concurso.deadline).toLocaleDateString('pt-AO')}</span>
                            </div>
                          )}
                          {concurso.salary_range && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{concurso.salary_range}</span>
                            </div>
                          )}
                          {concurso.views_count && (
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{concurso.views_count} visualizações</span>
                            </div>
                          )}
                          {concurso.applications_count && (
                            <div className="flex items-center gap-1">
                              <UserCheck className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{concurso.applications_count} candidaturas</span>
                            </div>
                          )}
                        </div>

                        {/* Deadline Warning */}
                        {concurso.deadline && (
                          <div className="mt-3">
                            {(() => {
                              const daysRemaining = getDaysRemaining(concurso.deadline);
                              if (daysRemaining === null) return null;
                              if (daysRemaining === 0) {
                                return (
                                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm font-medium">Prazo expirado</span>
                                  </div>
                                );
                              } else if (daysRemaining <= 7) {
                                return (
                                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm font-medium">
                                      {daysRemaining === 1 ? 'Último dia' : `${daysRemaining} dias restantes`}
                                    </span>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm font-medium">
                                      {daysRemaining} dias restantes
                                    </span>
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        )}

                        {/* Requirements Preview */}
                        {concurso.requirements && (
                          <div className="mt-3 p-2 sm:p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground mb-1 sm:mb-2">Requisitos:</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {concurso.requirements.length > 80 
                                ? concurso.requirements.substring(0, 80) + '...' 
                                : concurso.requirements
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
              </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {inscricoesModalOpen && inscricoesConcurso && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-2 sm:p-4">
          <Card className="max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <ListOrdered className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    Lista de Inscritos
                  </CardTitle>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1 font-medium truncate">{inscricoesConcurso.title}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setInscricoesModalOpen(false)} className="flex-shrink-0">
                  <XIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-col gap-3">
                {/* Mobile Controls */}
                <div className="sm:hidden space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Ordenar:</span>
                    <Select value={inscricoesSort} onValueChange={(value: 'nome'|'idade'|'categoria') => setInscricoesSort(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nome">Nome</SelectItem>
                        <SelectItem value="idade">Idade</SelectItem>
                        <SelectItem value="categoria">Categoria</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={()=>setInscricoesSortDir(inscricoesSortDir==='asc'?'desc':'asc')} className="h-8 w-8">
                      <SortAsc className={inscricoesSortDir==='asc'?'':'hidden'} />
                      <SortDesc className={inscricoesSortDir==='desc'?'':'hidden'} />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={()=>exportInscricoes('excel')} className="flex-1 text-xs">
                      <FileSpreadsheet className="w-3 h-3 mr-1"/>
                      Excel
                    </Button>
                    <Button variant="outline" size="sm" onClick={()=>exportInscricoes('pdf')} className="flex-1 text-xs">
                      <FileDown className="w-3 h-3 mr-1"/>
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={printInscricoes} className="flex-1 text-xs">
                      <Printer className="w-3 h-3 mr-1"/>
                      Imprimir
                    </Button>
                  </div>
                </div>

                {/* Desktop Controls */}
                <div className="hidden sm:flex sm:items-center sm:justify-between">
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Ordenar por:</span>
                    <Button variant={inscricoesSort==='nome' ? 'default' : 'outline'} size="sm" onClick={()=>setInscricoesSort('nome')}>
                      <UserIcon className="w-4 h-4 mr-1"/>
                      Nome
                    </Button>
                    <Button variant={inscricoesSort==='idade' ? 'default' : 'outline'} size="sm" onClick={()=>setInscricoesSort('idade')}>
                      <Calendar className="w-4 h-4 mr-1"/>
                      Idade
                    </Button>
                    <Button variant={inscricoesSort==='categoria' ? 'default' : 'outline'} size="sm" onClick={()=>setInscricoesSort('categoria')}>
                      <Tag className="w-4 h-4 mr-1"/>
                      Categoria
                    </Button>
                    <Button variant="ghost" size="icon" onClick={()=>setInscricoesSortDir(inscricoesSortDir==='asc'?'desc':'asc')}>
                      <SortAsc className={inscricoesSortDir==='asc'?'':'hidden'} />
                      <SortDesc className={inscricoesSortDir==='desc'?'':'hidden'} />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={()=>exportInscricoes('excel')}>
                      <FileSpreadsheet className="w-4 h-4 mr-1"/>
                      Excel
                    </Button>
                    <Button variant="outline" size="sm" onClick={()=>exportInscricoes('pdf')}>
                      <FileDown className="w-4 h-4 mr-1"/>
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={printInscricoes}>
                      <Printer className="w-4 h-4 mr-1"/>
                      Imprimir
                    </Button>
                  </div>
                </div>
              </div>

              {inscricoesLoading ? (
                <div className="text-center py-8">Carregando inscritos...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs sm:text-sm border rounded-lg">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left">#</th>
                        <th className="p-2 text-left">Nome</th>
                        <th className="p-2 text-left hidden sm:table-cell">Nº Do Bilhete</th>
                        <th className="p-2 text-left hidden sm:table-cell">Idade</th>
                        <th className="p-2 text-left hidden sm:table-cell">Categoria</th>
                        <th className="p-2 text-left hidden sm:table-cell">Email</th>
                        <th className="p-2 text-left hidden sm:table-cell">Telefone</th>
                        <th className="p-2 text-left">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortInscricoes(inscricoes).map((i, idx) => (
                        <tr key={i.id} className="border-b hover:bg-muted/30">
                          <td className="p-2">{idx+1}</td>
                          <td className="p-2 font-medium">
                            <div>
                              <div className="font-medium">{i.nome_completo}</div>
                              <div className="text-xs text-muted-foreground sm:hidden">
                                BI: {i.bilhete_identidade} • {getIdade(i.data_nascimento)} anos • {i.categoria || '-'}
                              </div>
                            </div>
                          </td>
                          <td className="p-2 hidden sm:table-cell">{i.bilhete_identidade}</td>
                          <td className="p-2 hidden sm:table-cell">{getIdade(i.data_nascimento)}</td>
                          <td className="p-2 hidden sm:table-cell">{i.categoria || '-'}</td>
                          <td className="p-2 hidden sm:table-cell">{i.email}</td>
                          <td className="p-2 hidden sm:table-cell">{i.telefone}</td>
                          <td className="p-2">{new Date(i.created_at).toLocaleDateString('pt-AO')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {inscricoes.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">Nenhum inscrito encontrado para este concurso.</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};