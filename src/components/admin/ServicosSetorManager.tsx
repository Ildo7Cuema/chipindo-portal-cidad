import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  EyeIcon,
  FileTextIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  DollarSignIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  StarIcon,
  TrendingUpIcon,
  UsersIcon,
  BuildingIcon
} from 'lucide-react';
import { useServicos, Servico } from '@/hooks/useServicos';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ServicosSetorManagerProps {
  setorNome: string;
  setorId: string;
}

const iconOptions = [
  { value: 'FileTextIcon', label: 'Documento', icon: FileTextIcon },
  { value: 'BuildingIcon', label: 'Edifício', icon: BuildingIcon },
  { value: 'UsersIcon', label: 'Utilizadores', icon: UsersIcon },
  { value: 'ClockIcon', label: 'Relógio', icon: ClockIcon },
  { value: 'MapPinIcon', label: 'Localização', icon: MapPinIcon },
  { value: 'PhoneIcon', label: 'Telefone', icon: PhoneIcon },
  { value: 'MailIcon', label: 'Email', icon: MailIcon },
  { value: 'DollarSignIcon', label: 'Dinheiro', icon: DollarSignIcon },
  { value: 'CheckCircleIcon', label: 'Verificação', icon: CheckCircleIcon },
  { value: 'AlertTriangleIcon', label: 'Alerta', icon: AlertTriangleIcon },
  { value: 'StarIcon', label: 'Estrela', icon: StarIcon },
  { value: 'TrendingUpIcon', label: 'Tendência', icon: TrendingUpIcon }
];

const prioridadeOptions = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' }
];

export const ServicosSetorManager = ({ setorNome, setorId }: ServicosSetorManagerProps) => {
  const { servicos, loading, error, createServico, updateServico, deleteServico, toggleServicoStatus, getServicosBySetor } = useServicos();
  const { toast } = useToast();
  const [setorServicos, setSetorServicos] = useState<Servico[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    direcao: '',
    categoria: setorNome,
    setor_id: setorId,
    icon: 'FileTextIcon',
    requisitos: [] as string[],
    documentos: [] as string[],
    horario: '',
    localizacao: '',
    contacto: '',
    email: '',
    prazo: '',
    taxa: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta',
    digital: false,
    ativo: true,
    ordem: 0
  });

  useEffect(() => {
    loadSetorServicos();
  }, [setorNome]);

  const loadSetorServicos = async () => {
    const servicos = await getServicosBySetor(setorNome, setorId);
    setSetorServicos(servicos);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      direcao: '',
      categoria: setorNome,
      setor_id: setorId,
      icon: 'FileTextIcon',
      requisitos: [],
      documentos: [],
      horario: '',
      localizacao: '',
      contacto: '',
      email: '',
      prazo: '',
      taxa: '',
      prioridade: 'media',
      digital: false,
      ativo: true,
      ordem: 0
    });
    setEditingServico(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingServico) {
        await updateServico(editingServico.id, formData);
        toast({
          title: "Serviço actualizado",
          description: "O serviço foi actualizado com sucesso.",
        });
      } else {
        await createServico(formData);
        toast({
          title: "Serviço criado",
          description: "O serviço foi criado com sucesso.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      loadSetorServicos();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o serviço.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (servico: Servico) => {
    setEditingServico(servico);
    setFormData({
      title: servico.title,
      description: servico.description,
      direcao: servico.direcao,
      categoria: servico.categoria,
      setor_id: setorId,
      icon: servico.icon,
      requisitos: servico.requisitos,
      documentos: servico.documentos,
      horario: servico.horario,
      localizacao: servico.localizacao,
      contacto: servico.contacto,
      email: servico.email,
      prazo: servico.prazo,
      taxa: servico.taxa,
      prioridade: servico.prioridade,
      digital: servico.digital,
      ativo: servico.ativo,
      ordem: servico.ordem
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await deleteServico(id);
        toast({
          title: "Serviço excluído",
          description: "O serviço foi excluído com sucesso.",
        });
        loadSetorServicos();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o serviço.",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleServicoStatus(id);
      loadSetorServicos();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao alterar o status do serviço.",
        variant: "destructive",
      });
    }
  };

  const handleNewServico = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const addArrayItem = (field: 'requisitos' | 'documentos', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: 'requisitos' | 'documentos', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const getPriorityBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <Badge className="bg-red-500">Alta</Badge>;
      case 'media':
        return <Badge className="bg-yellow-500">Média</Badge>;
      case 'baixa':
        return <Badge className="bg-green-500">Baixa</Badge>;
      default:
        return <Badge variant="outline">Desconhecida</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Erro ao carregar serviços: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Serviços do Setor: {setorNome}</h3>
          <p className="text-muted-foreground">
            Gerencie os serviços associados a este setor
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewServico}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingServico ? 'Editar Serviço' : 'Novo Serviço'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título do Serviço</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="direcao">Direção Responsável</Label>
                  <Input
                    id="direcao"
                    value={formData.direcao}
                    onChange={(e) => setFormData({ ...formData, direcao: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="icon">Ícone</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select value={formData.prioridade} onValueChange={(value: 'baixa' | 'media' | 'alta') => setFormData({ ...formData, prioridade: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {prioridadeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ordem">Ordem</Label>
                  <Input
                    id="ordem"
                    type="number"
                    value={formData.ordem}
                    onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="horario">Horário de Funcionamento</Label>
                  <Input
                    id="horario"
                    value={formData.horario}
                    onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                    placeholder="Ex: Segunda a Sexta: 8h00 - 15h00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="localizacao">Localização</Label>
                  <Input
                    id="localizacao"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contacto">Contacto</Label>
                  <Input
                    id="contacto"
                    value={formData.contacto}
                    onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                    placeholder="Ex: +244 123 456 789"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prazo">Prazo de Processamento</Label>
                  <Input
                    id="prazo"
                    value={formData.prazo}
                    onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                    placeholder="Ex: 3 dias úteis"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="taxa">Taxa/Custo</Label>
                  <Input
                    id="taxa"
                    value={formData.taxa}
                    onChange={(e) => setFormData({ ...formData, taxa: e.target.value })}
                    placeholder="Ex: Gratuito ou 15.000 Kz"
                    required
                  />
                </div>
              </div>

              {/* Requisitos */}
              <div>
                <Label>Requisitos</Label>
                <div className="space-y-2">
                  {formData.requisitos.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={req}
                        onChange={(e) => {
                          const newRequisitos = [...formData.requisitos];
                          newRequisitos[index] = e.target.value;
                          setFormData({ ...formData, requisitos: newRequisitos });
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('requisitos', index)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Adicionar requisito"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArrayItem('requisitos', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addArrayItem('requisitos', input.value);
                        input.value = '';
                      }}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Documentos */}
              <div>
                <Label>Documentos Necessários</Label>
                <div className="space-y-2">
                  {formData.documentos.map((doc, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={doc}
                        onChange={(e) => {
                          const newDocumentos = [...formData.documentos];
                          newDocumentos[index] = e.target.value;
                          setFormData({ ...formData, documentos: newDocumentos });
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('documentos', index)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Adicionar documento"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArrayItem('documentos', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addArrayItem('documentos', input.value);
                        input.value = '';
                      }}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  />
                  <Label htmlFor="ativo">Ativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="digital"
                    checked={formData.digital}
                    onCheckedChange={(checked) => setFormData({ ...formData, digital: checked })}
                  />
                  <Label htmlFor="digital">Serviço Digital</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingServico ? 'Actualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setorServicos.map((servico) => (
          <Card key={servico.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
                    <FileTextIcon className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">{servico.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(servico.prioridade)}
                  <Badge variant={servico.ativo ? "default" : "secondary"}>
                    {servico.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {servico.description.substring(0, 100)}...
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <BuildingIcon className="w-4 h-4" />
                  <span>{servico.direcao}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>{servico.prazo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="w-4 h-4" />
                  <span>{servico.taxa}</span>
                </div>
                <div className="flex items-center gap-2">
                  <EyeIcon className="w-4 h-4" />
                  <span>{servico.views} visualizações</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="sm:w-auto w-full"
                  onClick={() => handleEdit(servico)}
                >
                  <EditIcon className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="sm:w-auto w-full"
                  onClick={() => handleToggleStatus(servico.id)}
                >
                  {servico.ativo ? 'Desativar' : 'Ativar'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 sm:w-auto w-full"
                  onClick={() => handleDelete(servico.id)}
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {setorServicos.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileTextIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum serviço encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Este setor ainda não possui serviços cadastrados.
            </p>
            <Button onClick={handleNewServico}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Criar Primeiro Serviço
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 