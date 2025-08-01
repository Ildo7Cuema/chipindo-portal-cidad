import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Search, 
  BookOpen, 
  HelpCircle, 
  Settings, 
  Users, 
  FileText, 
  Trophy, 
  FolderOpen, 
  Building2, 
  MapPin, 
  Phone, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  Eye, 
  Filter, 
  RefreshCw,
  ChevronRight,
  Zap,
  Shield,
  Gauge,
  Globe,
  Mail,
  Lock,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Clock,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HelpPageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface HelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  content: React.ReactNode;
  category: 'getting-started' | 'features' | 'management' | 'troubleshooting' | 'advanced';
}

export const HelpPage = ({ open, onOpenChange }: HelpPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("getting-started");

  const helpSections: HelpSection[] = [
    // Getting Started
    {
      id: "overview",
      title: "Visão Geral do Sistema",
      icon: Gauge,
      description: "Introdução ao painel administrativo do Portal de Chipindo",
      category: "getting-started",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Bem-vindo ao painel administrativo do Portal Municipal de Chipindo. Este sistema permite gerir todo o conteúdo e funcionalidades do portal oficial do município.
          </p>
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Funcionalidades Principais:</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
              <li>Gestão de notícias e comunicados</li>
              <li>Administração de concursos públicos</li>
              <li>Controlo do acervo digital</li>
              <li>Gestão da estrutura organizacional</li>
              <li>Configuração de conteúdos do site</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "navigation",
      title: "Navegação e Interface",
      icon: Globe,
      description: "Como navegar e usar a interface do painel",
      category: "getting-started",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Como Navegar:</h4>
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Sidebar</p>
                <p className="text-sm text-muted-foreground">Use a barra lateral para aceder às diferentes secções do painel.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Filtros e Pesquisa</p>
                <p className="text-sm text-muted-foreground">Use os botões de filtro e pesquisa para encontrar conteúdo específico.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Ações Rápidas</p>
                <p className="text-sm text-muted-foreground">Use o menu de ações (⋮) para aceder a funcionalidades adicionais.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    
    // Features
    {
      id: "news-management",
      title: "Gestão de Notícias",
      icon: FileText,
      description: "Como criar, editar e publicar notícias",
      category: "features",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Criar Nova Notícia:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Clique no botão "Nova Notícia" na secção de Notícias</li>
            <li>Preencha o título e conteúdo da notícia</li>
            <li>Adicione uma imagem (opcional)</li>
            <li>Configure se a notícia deve ser publicada imediatamente</li>
            <li>Marque como "Destaque" se necessário</li>
            <li>Clique em "Criar" para salvar</li>
          </ol>
          
          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">💡 Dica:</h5>
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              Use o campo "Resumo" para criar um preview atrativo da notícia que aparecerá na página inicial.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "contests-management",
      title: "Gestão de Concursos",
      icon: Trophy,
      description: "Como gerir concursos públicos e processos seletivos",
      category: "features",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Processo de Gestão:</h4>
          <div className="grid gap-3">
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium mb-2">1. Criação do Concurso</h5>
              <p className="text-sm text-muted-foreground">Defina título, descrição, datas importantes e documentos necessários.</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium mb-2">2. Publicação</h5>
              <p className="text-sm text-muted-foreground">Publique o concurso para torná-lo visível no portal público.</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium mb-2">3. Acompanhamento</h5>
              <p className="text-sm text-muted-foreground">Monitore inscrições e atualize informações conforme necessário.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "digital-archive",
      title: "Acervo Digital",
      icon: FolderOpen,
      description: "Como organizar e gerir documentos públicos",
      category: "features",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Gestão de Documentos:</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <Upload className="w-4 h-4 mt-1 text-primary" />
              <div>
                <p className="font-medium">Upload de Documentos</p>
                <p className="text-sm text-muted-foreground">Carregue PDFs, imagens e outros ficheiros importantes.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Eye className="w-4 h-4 mt-1 text-primary" />
              <div>
                <p className="font-medium">Controlo de Visibilidade</p>
                <p className="text-sm text-muted-foreground">Defina se o documento é público ou privado.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Edit className="w-4 h-4 mt-1 text-primary" />
              <div>
                <p className="font-medium">Categorização</p>
                <p className="text-sm text-muted-foreground">Organize documentos por categorias e tags.</p>
              </div>
            </li>
          </ul>
        </div>
      )
    },

    // Management
    {
      id: "user-roles",
      title: "Gestão de Usuários e Permissões",
      icon: Users,
      description: "Como gerir utilizadores e definir permissões",
      category: "management",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Tipos de Utilizador:</h4>
          <div className="grid gap-3">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-900 dark:text-red-100">Administrador</span>
              </div>
              <p className="text-sm text-red-800 dark:text-red-200">Acesso total ao sistema, pode gerir outros utilizadores.</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Edit className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Editor</span>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">Pode criar e editar conteúdo, mas sem acesso a configurações.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "export-import",
      title: "Exportação e Backup",
      icon: Download,
      description: "Como exportar dados e fazer backup do sistema",
      category: "management",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Opções de Exportação:</h4>
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">CSV</p>
                <p className="text-sm text-muted-foreground">Para análise em Excel ou outros programas</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Excel</p>
                <p className="text-sm text-muted-foreground">Relatórios formatados com gráficos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium">PDF</p>
                <p className="text-sm text-muted-foreground">Relatórios prontos para impressão</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Troubleshooting
    {
      id: "common-issues",
      title: "Problemas Comuns",
      icon: AlertTriangle,
      description: "Soluções para problemas frequentes",
      category: "troubleshooting",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium mb-2">❌ Erro ao fazer upload de imagem</h5>
              <p className="text-sm text-muted-foreground mb-2">Verifique se a imagem tem menos de 5MB e está em formato PNG, JPG ou GIF.</p>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium mb-2">❌ Não consigo publicar conteúdo</h5>
              <p className="text-sm text-muted-foreground mb-2">Verifique se tem permissões de editor ou administrador.</p>
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Verificar Permissões
              </Button>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium mb-2">❌ Dados não estão a actualizar</h5>
              <p className="text-sm text-muted-foreground mb-2">Tente actualizar a página ou fazer logout/login.</p>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar Página
              </Button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "contact-support",
      title: "Contactar Suporte",
      icon: Mail,
      description: "Como obter ajuda técnica",
      category: "troubleshooting",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Contactos de Suporte:</h4>
            <div className="space-y-2 text-green-800 dark:text-green-200">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">suporte@chipindo.gov.ao</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+244 XXX XXX XXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Segunda a Sexta: 8h00 - 17h00</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Ao contactar o suporte, inclua sempre a descrição detalhada do problema e os passos que levaram ao erro.
          </p>
        </div>
      )
    },

    // Advanced
    {
      id: "security",
      title: "Segurança e Boas Práticas",
      icon: Lock,
      description: "Medidas de segurança e recomendações",
      category: "advanced",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Recomendações de Segurança:</h4>
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />
              <div>
                <p className="font-medium">Senha Forte</p>
                <p className="text-sm text-muted-foreground">Use pelo menos 8 caracteres com letras, números e símbolos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />
              <div>
                <p className="font-medium">Logout Seguro</p>
                <p className="text-sm text-muted-foreground">Sempre termine a sessão ao sair do computador.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />
              <div>
                <p className="font-medium">Backups Regulares</p>
                <p className="text-sm text-muted-foreground">Exporte dados importantes regularmente.</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const categories = [
    { id: 'getting-started', label: 'Começar', icon: Star },
    { id: 'features', label: 'Funcionalidades', icon: Zap },
    { id: 'management', label: 'Gestão', icon: Settings },
    { id: 'troubleshooting', label: 'Problemas', icon: AlertTriangle },
    { id: 'advanced', label: 'Avançado', icon: Shield }
  ];

  const filteredSections = helpSections.filter(section => {
    const matchesCategory = activeCategory === 'all' || section.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            Central de Ajuda
          </DialogTitle>
          <DialogDescription>
            Encontre respostas e aprenda a usar todas as funcionalidades do painel administrativo
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 min-h-0">
          {/* Categories Sidebar */}
          <div className="w-64 border-r bg-muted/20 p-4">
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <Button
                    key={category.id}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      isActive && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Pesquisar na ajuda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Help Content */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {filteredSections.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">
                      Nenhum resultado encontrado
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      Tente usar outros termos de pesquisa
                    </p>
                  </div>
                ) : (
                  filteredSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <Card key={section.id} className="border-0 shadow-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            {section.title}
                          </CardTitle>
                          <CardDescription>{section.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {section.content}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 border-t bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="w-4 h-4" />
              Portal Municipal de Chipindo - Versão 1.0
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 