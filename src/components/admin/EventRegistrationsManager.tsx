import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock as PendingIcon,
  User,
  Building,
  AlertTriangle,
  CheckCircle2,
  XCircle2,
  Clock2,
  FileText,
  Send,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EventRegistration {
  id: number;
  event_id: number;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  participant_age: number;
  participant_gender: string;
  participant_address: string;
  participant_occupation: string;
  participant_organization: string;
  special_needs: string;
  dietary_restrictions: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  registration_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
  notes: string;
  event_title: string;
  event_date: string;
  event_location: string;
}

interface EventRegistrationsManagerProps {
  eventId?: number;
}

const EventRegistrationsManager: React.FC<EventRegistrationsManagerProps> = ({ eventId }) => {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [sendingNotification, setSendingNotification] = useState(false);
  const { toast } = useToast();

  // Dados de exemplo
  const mockRegistrations: EventRegistration[] = [
    {
      id: 1,
      event_id: 1,
      participant_name: "Maria Silva",
      participant_email: "maria.silva@email.com",
      participant_phone: "+244 123 456 789",
      participant_age: 28,
      participant_gender: "Feminino",
      participant_address: "Rua Principal, Bairro Central, Chipindo",
      participant_occupation: "Professora",
      participant_organization: "Escola Primária de Chipindo",
      special_needs: "",
      dietary_restrictions: "Vegetariana",
      emergency_contact_name: "João Silva",
      emergency_contact_phone: "+244 987 654 321",
      registration_date: "2025-01-15T10:30:00Z",
      status: "confirmed",
      notes: "Participante interessada em workshops culturais",
      event_title: "Festival Cultural de Chipindo",
      event_date: "2025-08-15",
      event_location: "Praça Central de Chipindo"
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setRegistrations(mockRegistrations);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = registrations;
    
    if (eventId) {
      filtered = filtered.filter(reg => reg.event_id === eventId);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(reg => 
        reg.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.participant_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.participant_phone.includes(searchTerm)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reg => reg.status === statusFilter);
    }
    
    setFilteredRegistrations(filtered);
  }, [registrations, searchTerm, statusFilter, eventId]);

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

  const handleStatusUpdate = async (registrationId: number, newStatus: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, status: newStatus as any }
            : reg
        )
      );
      
      toast({
        title: "Status atualizado",
        description: `Status da inscrição atualizado para "${getStatusLabel(newStatus)}"`,
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o status da inscrição.",
        variant: "destructive"
      });
    }
  };

  const stats = {
    total: filteredRegistrations.length,
    confirmed: filteredRegistrations.filter(r => r.status === 'confirmed').length,
    pending: filteredRegistrations.filter(r => r.status === 'pending').length,
    cancelled: filteredRegistrations.filter(r => r.status === 'cancelled').length,
    attended: filteredRegistrations.filter(r => r.status === 'attended').length
  };

  if (loading) {
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
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Inscrições</h2>
          <p className="text-gray-600">Gerencie as inscrições nos eventos municipais</p>
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
              <PendingIcon className="w-5 h-5 text-yellow-600" />
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
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Pesquisar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="confirmed">Confirmados</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
                <SelectItem value="attended">Presentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Registrations List */}
      <div className="space-y-4">
        {filteredRegistrations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma inscrição encontrada</h3>
              <p className="text-gray-500">Tente ajustar os filtros de pesquisa</p>
            </CardContent>
          </Card>
        ) : (
          filteredRegistrations.map((registration) => (
            <Card key={registration.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{registration.participant_name}</h3>
                      <Badge className={getStatusColor(registration.status)}>
                        {getStatusLabel(registration.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{registration.participant_email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{registration.participant_phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{registration.participant_age} anos • {registration.participant_gender}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span>{registration.participant_occupation}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      <p><strong>Evento:</strong> {registration.event_title}</p>
                      <p><strong>Data:</strong> {formatDate(registration.event_date)}</p>
                      <p><strong>Inscrição:</strong> {formatDate(registration.registration_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRegistration(registration);
                        setShowDetailsModal(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Detalhes
                    </Button>
                    
                    <Select
                      value={registration.status}
                      onValueChange={(value) => handleStatusUpdate(registration.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="confirmed">Confirmar</SelectItem>
                        <SelectItem value="cancelled">Cancelar</SelectItem>
                        <SelectItem value="attended">Presente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Inscrição</DialogTitle>
          </DialogHeader>
          
          {selectedRegistration && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Informações Pessoais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Nome Completo</Label>
                    <p className="text-sm">{selectedRegistration.participant_name}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <p className="text-sm">{selectedRegistration.participant_email}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                    <p className="text-sm">{selectedRegistration.participant_phone}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Idade</Label>
                    <p className="text-sm">{selectedRegistration.participant_age} anos</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Género</Label>
                    <p className="text-sm">{selectedRegistration.participant_gender}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Profissão</Label>
                    <p className="text-sm">{selectedRegistration.participant_occupation}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Informações do Evento
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Evento</Label>
                    <p className="text-sm">{selectedRegistration.event_title}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Data</Label>
                    <p className="text-sm">{formatDate(selectedRegistration.event_date)}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Local</Label>
                    <p className="text-sm">{selectedRegistration.event_location}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <Badge className={getStatusColor(selectedRegistration.status)}>
                      {getStatusLabel(selectedRegistration.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventRegistrationsManager; 