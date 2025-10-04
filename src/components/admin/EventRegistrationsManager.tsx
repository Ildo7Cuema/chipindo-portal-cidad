import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  UserCheck,
  MoreVertical,
  Download,
  Settings,
  Calendar,
  MapPin,
  Building,
  Phone,
  Mail,
  User,
  FileText,
  AlertTriangle,
  Info,
  Clock as ClockIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEventRegistrationsAdmin, type EventRegistration } from "@/hooks/useEventRegistrationsAdmin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface EventRegistrationsManagerProps {
  eventId?: number;
}

const EventRegistrationsManager: React.FC<EventRegistrationsManagerProps> = ({ eventId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { toast } = useToast();

  const {
    registrations,
    filteredRegistrations,
    events,
    loading,
    error,
    stats,
    fetchRegistrations,
    filterRegistrations,
    updateRegistrationStatus,
    getCategoryStats
  } = useEventRegistrationsAdmin();

  useEffect(() => {
    fetchRegistrations({ eventId });
  }, [eventId]);

  useEffect(() => {
    filterRegistrations(searchTerm, categoryFilter);
  }, [searchTerm, categoryFilter, registrations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'attended': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      case 'attended': return 'Presente';
      default: return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cultural': return 'Cultural';
      case 'business': return 'Negócios';
      case 'sports': return 'Desporto';
      case 'educational': return 'Educacional';
      case 'community': return 'Comunitário';
      default: return category;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-AO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatEventDate = (dateString: string, timeString?: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('pt-AO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    if (timeString) {
      return `${formattedDate} às ${timeString}`;
    }
    
    return formattedDate;
  };

  const handleStatusUpdate = async (registrationId: number, newStatus: string) => {
    try {
      await updateRegistrationStatus(registrationId, newStatus);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const categoryStats = getCategoryStats();

  if (loading && registrations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestão de Inscrições</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {eventId ? 'Gestão de inscrições para evento específico' : 'Gestão completa de inscrições em eventos'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
                <p className="text-xs text-gray-600">Confirmados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.cancelled}</p>
                <p className="text-xs text-gray-600">Cancelados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.attended}</p>
                <p className="text-xs text-gray-600">Presentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, email, telefone, evento ou profissão..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="confirmed">Confirmados</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
                <SelectItem value="attended">Presentes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="business">Negócios</SelectItem>
                <SelectItem value="sports">Desporto</SelectItem>
                <SelectItem value="educational">Educacional</SelectItem>
                <SelectItem value="community">Comunitário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participante</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Inscrição</TableHead>
                <TableHead className="w-12">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{registration.participant_name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{registration.participant_email}</p>
                      <p className="text-xs text-gray-500">{registration.participant_occupation}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{registration.event_title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{registration.event_location}</p>
                      <p className="text-xs text-gray-500">{registration.event_organizer}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCategoryLabel(registration.event_category || '')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(registration.status)}>
                      {getStatusLabel(registration.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(registration.registration_date)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedRegistration(registration);
                          setShowDetailsModal(true);
                        }}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(registration.id, 'confirmed')}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirmar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(registration.id, 'cancelled')}>
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancelar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(registration.id, 'attended')}>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Marcar como presente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredRegistrations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma inscrição encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros de pesquisa</p>
          </CardContent>
        </Card>
      )}

      {/* Registration Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Detalhes da Inscrição
            </DialogTitle>
          </DialogHeader>
          
          {selectedRegistration && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Informações do Participante */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Informações do Participante
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                      <p className="text-lg font-semibold">{selectedRegistration.participant_name}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-lg">{selectedRegistration.participant_email}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Telefone</label>
                      <p className="text-lg">{selectedRegistration.participant_phone}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Idade</label>
                      <p className="text-lg">{selectedRegistration.participant_age} anos</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Gênero</label>
                      <p className="text-lg">{selectedRegistration.participant_gender}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Profissão</label>
                      <p className="text-lg">{selectedRegistration.participant_occupation}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Organização</label>
                      <p className="text-lg">{selectedRegistration.participant_organization}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <Badge className={getStatusColor(selectedRegistration.status)}>
                        {getStatusLabel(selectedRegistration.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700">Endereço</label>
                    <p className="text-lg">{selectedRegistration.participant_address}</p>
                  </div>
                </div>

                <Separator />

                {/* Informações do Evento */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Informações do Evento
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Título do Evento</label>
                      <p className="text-lg font-semibold">{selectedRegistration.event_title}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Categoria</label>
                      <Badge variant="outline">
                        {getCategoryLabel(selectedRegistration.event_category || '')}
                      </Badge>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Data do Evento</label>
                      <p className="text-lg">{formatEventDate(selectedRegistration.event_date || '')}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Local</label>
                      <p className="text-lg">{selectedRegistration.event_location}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Organizador</label>
                      <p className="text-lg">{selectedRegistration.event_organizer}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Data de Inscrição</label>
                      <p className="text-lg">{formatDate(selectedRegistration.registration_date)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Informações Adicionais */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Informações Adicionais
                  </h3>
                  
                  {selectedRegistration.special_needs && (
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700">Necessidades Especiais</label>
                      <p className="text-lg">{selectedRegistration.special_needs}</p>
                    </div>
                  )}
                  
                  {selectedRegistration.dietary_restrictions && (
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700">Restrições Alimentares</label>
                      <p className="text-lg">{selectedRegistration.dietary_restrictions}</p>
                    </div>
                  )}
                  
                  {selectedRegistration.notes && (
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700">Observações</label>
                      <p className="text-lg">{selectedRegistration.notes}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Contato de Emergência */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Contato de Emergência
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nome do Contato</label>
                      <p className="text-lg">{selectedRegistration.emergency_contact_name}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Telefone do Contato</label>
                      <p className="text-lg">{selectedRegistration.emergency_contact_phone}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Ações */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Ações
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => handleStatusUpdate(selectedRegistration.id, 'confirmed')}
                      disabled={selectedRegistration.status === 'confirmed'}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirmar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedRegistration.id, 'cancelled')}
                      disabled={selectedRegistration.status === 'cancelled'}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedRegistration.id, 'attended')}
                      disabled={selectedRegistration.status === 'attended'}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Marcar como presente
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedRegistration.id, 'pending')}
                      disabled={selectedRegistration.status === 'pending'}
                    >
                      <ClockIcon className="w-4 h-4 mr-2" />
                      Marcar como pendente
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventRegistrationsManager; 