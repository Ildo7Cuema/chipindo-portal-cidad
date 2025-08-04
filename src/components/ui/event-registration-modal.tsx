import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  User, 
  Mail, 
  Phone, 
  MapPin as LocationIcon,
  Briefcase,
  Building,
  Heart,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEventRegistrations, RegistrationFormData } from "@/hooks/useEventRegistrations";
import { cn } from "@/lib/utils";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  event_time: string;
  location: string;
  organizer: string;
  price: string;
  max_participants: number;
  current_participants: number;
}

interface EventRegistrationModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onRegistrationSuccess: () => void;
}

interface RegistrationForm {
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  participant_age: string;
  participant_gender: string;
  participant_address: string;
  participant_occupation: string;
  participant_organization: string;
  special_needs: string;
  dietary_restrictions: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  agree_terms: boolean;
  agree_communications: boolean;
}

const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  onRegistrationSuccess
}) => {
  const [formData, setFormData] = useState<RegistrationForm>({
    participant_name: '',
    participant_email: '',
    participant_phone: '',
    participant_age: '',
    participant_gender: '',
    participant_address: '',
    participant_occupation: '',
    participant_organization: '',
    special_needs: '',
    dietary_restrictions: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    agree_terms: false,
    agree_communications: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const { registerForEvent } = useEventRegistrations();

  const totalSteps = 3;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-AO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleInputChange = (field: keyof RegistrationForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.participant_name && formData.participant_email && formData.participant_phone);
      case 2:
        return !!(formData.participant_age && formData.participant_gender && formData.participant_occupation);
      case 3:
        return formData.agree_terms;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!event || !validateStep(currentStep)) {
      toast({
        title: "Erro de validação",
        description: "Por favor, verifique todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData: RegistrationFormData = {
        event_id: event.id,
        participant_name: formData.participant_name,
        participant_email: formData.participant_email,
        participant_phone: formData.participant_phone,
        participant_age: parseInt(formData.participant_age),
        participant_gender: formData.participant_gender,
        participant_address: formData.participant_address,
        participant_occupation: formData.participant_occupation,
        participant_organization: formData.participant_organization,
        special_needs: formData.special_needs,
        dietary_restrictions: formData.dietary_restrictions,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone
      };

      await registerForEvent(registrationData);

      onRegistrationSuccess();
      onClose();
      
      // Reset form
      setFormData({
        participant_name: '',
        participant_email: '',
        participant_phone: '',
        participant_age: '',
        participant_gender: '',
        participant_address: '',
        participant_occupation: '',
        participant_organization: '',
        special_needs: '',
        dietary_restrictions: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        agree_terms: false,
        agree_communications: false
      });
      setCurrentStep(1);
    } catch (error) {
      // Erro já tratado no hook
      console.error('Erro na inscrição:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) return null;

  const availableSpots = event.max_participants > 0 
    ? event.max_participants - event.current_participants 
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-6 h-6 text-blue-600" />
            Inscrição no Evento
          </DialogTitle>
        </DialogHeader>

        {/* Event Information */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{event.organizer}</p>
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {event.price}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span>{event.event_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>
                  {event.current_participants} inscritos
                  {availableSpots !== null && ` / ${event.max_participants} vagas`}
                </span>
              </div>
            </div>

            {availableSpots !== null && availableSpots <= 5 && availableSpots > 0 && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Apenas {availableSpots} vaga{availableSpots > 1 ? 's' : ''} restante{availableSpots > 1 ? 's' : ''}!
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                currentStep > i + 1 
                  ? "bg-green-600 text-white" 
                  : currentStep === i + 1 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-600"
              )}>
                {currentStep > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={cn(
                  "w-16 h-1 mx-2",
                  currentStep > i + 1 ? "bg-green-600" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Informações Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participant_name">Nome Completo *</Label>
                <Input
                  id="participant_name"
                  value={formData.participant_name}
                  onChange={(e) => handleInputChange('participant_name', e.target.value)}
                  placeholder="Digite seu nome completo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="participant_email">Email *</Label>
                <Input
                  id="participant_email"
                  type="email"
                  value={formData.participant_email}
                  onChange={(e) => handleInputChange('participant_email', e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="participant_phone">Telefone *</Label>
                <Input
                  id="participant_phone"
                  value={formData.participant_phone}
                  onChange={(e) => handleInputChange('participant_phone', e.target.value)}
                  placeholder="+244 123 456 789"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="participant_address">Endereço</Label>
                <Input
                  id="participant_address"
                  value={formData.participant_address}
                  onChange={(e) => handleInputChange('participant_address', e.target.value)}
                  placeholder="Rua, Bairro, Cidade"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Additional Information */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Informações Adicionais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participant_age">Idade *</Label>
                <Input
                  id="participant_age"
                  type="number"
                  value={formData.participant_age}
                  onChange={(e) => handleInputChange('participant_age', e.target.value)}
                  placeholder="25"
                  min="1"
                  max="120"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="participant_gender">Género *</Label>
                <Select value={formData.participant_gender} onValueChange={(value) => handleInputChange('participant_gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                    <SelectItem value="Prefiro não dizer">Prefiro não dizer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="participant_occupation">Profissão/Ocupação *</Label>
                <Input
                  id="participant_occupation"
                  value={formData.participant_occupation}
                  onChange={(e) => handleInputChange('participant_occupation', e.target.value)}
                  placeholder="Ex: Estudante, Professor, Agricultor"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="participant_organization">Organização/Instituição</Label>
                <Input
                  id="participant_organization"
                  value={formData.participant_organization}
                  onChange={(e) => handleInputChange('participant_organization', e.target.value)}
                  placeholder="Ex: Escola, Empresa, ONG"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Nome do Contacto de Emergência</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  placeholder="Nome completo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Telefone de Emergência</Label>
                <Input
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  placeholder="+244 123 456 789"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="special_needs">Necessidades Especiais</Label>
                <Textarea
                  id="special_needs"
                  value={formData.special_needs}
                  onChange={(e) => handleInputChange('special_needs', e.target.value)}
                  placeholder="Descreva qualquer necessidade especial ou acessibilidade necessária"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dietary_restrictions">Restrições Alimentares</Label>
                <Textarea
                  id="dietary_restrictions"
                  value={formData.dietary_restrictions}
                  onChange={(e) => handleInputChange('dietary_restrictions', e.target.value)}
                  placeholder="Ex: Vegetariano, Alergias, etc."
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation and Terms */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              Confirmação e Termos
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Resumo da Inscrição</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Evento:</strong> {event.title}</p>
                <p><strong>Data:</strong> {formatDate(event.date)} às {event.event_time}</p>
                <p><strong>Local:</strong> {event.location}</p>
                <p><strong>Participante:</strong> {formData.participant_name}</p>
                <p><strong>Email:</strong> {formData.participant_email}</p>
                <p><strong>Telefone:</strong> {formData.participant_phone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agree_terms"
                  checked={formData.agree_terms}
                  onCheckedChange={(checked) => handleInputChange('agree_terms', checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="agree_terms" className="text-sm">
                    Concordo com os termos e condições *
                  </Label>
                  <p className="text-xs text-gray-600">
                    Li e aceito os termos de participação, política de privacidade e autorizo o tratamento dos meus dados pessoais.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agree_communications"
                  checked={formData.agree_communications}
                  onCheckedChange={(checked) => handleInputChange('agree_communications', checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="agree_communications" className="text-sm">
                    Aceito receber comunicações sobre o evento
                  </Label>
                  <p className="text-xs text-gray-600">
                    Autorizo o envio de informações sobre alterações, lembretes e materiais relacionados ao evento.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Informação Importante:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• A inscrição será confirmada por email</li>
                    <li>• Chegue 15 minutos antes do início do evento</li>
                    <li>• Traga um documento de identificação</li>
                    <li>• Em caso de cancelamento, contacte-nos com antecedência</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>
          
          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Próximo
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.agree_terms}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Inscrição...
                  </>
                ) : (
                  'Confirmar Inscrição'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationModal; 