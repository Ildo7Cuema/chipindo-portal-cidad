import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useEvents, type Event } from "@/hooks/useEvents";
import { X, Save, Plus } from "lucide-react";

interface EventFormProps {
  event?: Event | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EventForm = ({ event, onClose, onSuccess }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    event_time: '',
    location: '',
    organizer: '',
    contact: '',
    email: '',
    website: '',
    price: 'Gratuito',
    max_participants: 0,
    current_participants: 0,
    category: 'community',
    status: 'upcoming' as const,
    featured: false
  });

  const [loading, setLoading] = useState(false);
  const { createEvent, updateEvent } = useEvents();
  const { toast } = useToast();

  const isEditing = !!event;

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        event_time: event.event_time,
        location: event.location,
        organizer: event.organizer,
        contact: event.contact,
        email: event.email,
        website: event.website || '',
        price: event.price,
        max_participants: event.max_participants,
        current_participants: event.current_participants,
        category: event.category,
        status: event.status,
        featured: event.featured
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && event) {
        await updateEvent(event.id, formData);
        toast({
          title: "Evento atualizado",
          description: "O evento foi atualizado com sucesso"
        });
      } else {
        await createEvent(formData);
        toast({
          title: "Evento criado",
          description: "O evento foi criado com sucesso"
        });
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o evento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const categories = [
    { value: 'cultural', label: 'Cultura' },
    { value: 'business', label: 'Comércio' },
    { value: 'educational', label: 'Educação' },
    { value: 'health', label: 'Saúde' },
    { value: 'sports', label: 'Desporto' },
    { value: 'community', label: 'Comunidade' }
  ];

  const statusOptions = [
    { value: 'upcoming', label: 'Próximo' },
    { value: 'ongoing', label: 'Em Curso' },
    { value: 'completed', label: 'Concluído' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {isEditing ? 'Editar Evento' : 'Novo Evento'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  placeholder="Título do evento"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                placeholder="Descrição detalhada do evento"
                rows={4}
              />
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event_time">Hora</Label>
                <Input
                  id="event_time"
                  type="time"
                  value={formData.event_time}
                  onChange={(e) => handleInputChange('event_time', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
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

            {/* Localização e Organizador */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Local *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  placeholder="Local do evento"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizador *</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => handleInputChange('organizer', e.target.value)}
                  required
                  placeholder="Nome do organizador"
                />
              </div>
            </div>

            {/* Contactos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact">Telefone *</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  required
                  placeholder="+244 123 456 789"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://exemplo.com"
              />
            </div>

            {/* Preço e Participantes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="Gratuito"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max_participants">Máximo de Participantes</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="current_participants">Participantes Atuais</Label>
                <Input
                  id="current_participants"
                  type="number"
                  value={formData.current_participants}
                  onChange={(e) => handleInputChange('current_participants', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
            </div>

            {/* Opções */}
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
              <Label htmlFor="featured">Evento Destacado</Label>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Atualizar
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 