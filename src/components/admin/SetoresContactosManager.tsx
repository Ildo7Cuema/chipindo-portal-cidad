import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon
} from 'lucide-react';
import { useSetoresContactos } from '@/hooks/useSetoresContactos';
import { useToast } from '@/hooks/use-toast';
import { ContactoSetor } from '@/hooks/useSetoresEstrategicos';

interface SetoresContactosManagerProps {
  setorId: string;
  setorNome: string;
}

export const SetoresContactosManager = ({ setorId, setorNome }: SetoresContactosManagerProps) => {
  const { contactos, loading, error, createContacto, updateContacto, deleteContacto } = useSetoresContactos(setorId);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContacto, setEditingContacto] = useState<ContactoSetor | null>(null);
  const [formData, setFormData] = useState({
    endereco: '',
    telefone: '',
    email: '',
    horario: '',
    responsavel: ''
  });

  const resetForm = () => {
    setFormData({
      endereco: '',
      telefone: '',
      email: '',
      horario: '',
      responsavel: ''
    });
    setEditingContacto(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const contactoData = {
        setor_id: setorId,
        ...formData
      };

      if (editingContacto) {
        await updateContacto(editingContacto.id, contactoData);
        toast({
          title: "Contacto actualizado",
          description: "O contacto foi actualizado com sucesso.",
        });
      } else {
        await createContacto(contactoData);
        toast({
          title: "Contacto criado",
          description: "O contacto foi criado com sucesso.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o contacto.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (contacto: ContactoSetor) => {
    setEditingContacto(contacto);
    setFormData({
      endereco: contacto.endereco,
      telefone: contacto.telefone,
      email: contacto.email,
      horario: contacto.horario,
      responsavel: contacto.responsavel
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este contacto?')) {
      try {
        await deleteContacto(id);
        toast({
          title: "Contacto excluído",
          description: "O contacto foi excluído com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o contacto.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNewContacto = () => {
    resetForm();
    setIsDialogOpen(true);
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
          <p className="text-red-600">Erro ao carregar contactos: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Contactos do Sector</h3>
          <p className="text-muted-foreground">
            Gerencie os contactos do sector {setorNome}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewContacto}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Novo Contacto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingContacto ? 'Editar Contacto' : 'Novo Contacto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Ex: Rua Principal, nº 123"
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
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
                  placeholder="Ex: contacto@sector.ao"
                  required
                />
              </div>

              <div>
                <Label htmlFor="horario">Horário de Funcionamento</Label>
                <Input
                  id="horario"
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  placeholder="Ex: Segunda a Sexta, 8h às 17h"
                  required
                />
              </div>

              <div>
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  placeholder="Ex: Dr. João Silva"
                  required
                />
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
                  {editingContacto ? 'Actualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contactos.map((contacto) => (
          <Card key={contacto.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PhoneIcon className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm">Contacto</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  Sector {setorNome}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPinIcon className="w-4 h-4 text-red-600" />
                  <span><strong>Endereço:</strong> {contacto.endereco}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <PhoneIcon className="w-4 h-4 text-green-600" />
                  <span><strong>Telefone:</strong> {contacto.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MailIcon className="w-4 h-4 text-blue-600" />
                  <span><strong>Email:</strong> {contacto.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon className="w-4 h-4 text-orange-600" />
                  <span><strong>Horário:</strong> {contacto.horario}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <UserIcon className="w-4 h-4 text-purple-600" />
                  <span><strong>Responsável:</strong> {contacto.responsavel}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="sm:w-auto w-full"
                  onClick={() => handleEdit(contacto)}
                >
                  <EditIcon className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 sm:w-auto w-full"
                  onClick={() => handleDelete(contacto.id)}
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contactos.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <PhoneIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum contacto encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando o primeiro contacto para este sector.
            </p>
            <Button onClick={handleNewContacto}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Criar Primeiro Contacto
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 