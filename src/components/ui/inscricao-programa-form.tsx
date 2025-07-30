import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifyInterestRegistration } from "@/lib/notification-helpers";
import { Loader2, CheckCircle, BookOpen } from "lucide-react";

interface InscricaoProgramaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setor?: string;
  programa?: string;
  onSuccess?: () => void;
}

interface FormData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  idade: string;
  escolaridade: string;
  experiencia: string;
  motivacao: string;
  aceiteTermos: boolean;
}

const niveisEscolaridade = [
  "Ensino Primário",
  "Ensino Secundário",
  "Ensino Médio",
  "Licenciatura",
  "Mestrado",
  "Doutoramento",
  "Outros"
];

export function InscricaoProgramaForm({ 
  open, 
  onOpenChange, 
  setor, 
  programa, 
  onSuccess 
}: InscricaoProgramaFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: "",
    email: "",
    telefone: "",
    idade: "",
    escolaridade: "",
    experiencia: "",
    motivacao: "",
    aceiteTermos: false
  });

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.nomeCompleto.trim()) {
      return "Nome completo é obrigatório";
    }
    if (!formData.email.trim()) {
      return "Email é obrigatório";
    }
    if (!formData.email.includes("@")) {
      return "Email inválido";
    }
    if (!formData.idade.trim()) {
      return "Idade é obrigatória";
    }
    if (!formData.escolaridade.trim()) {
      return "Nível de escolaridade é obrigatório";
    }
    if (!formData.aceiteTermos) {
      return "Deve aceitar os termos e condições";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      toast({
        title: "Erro de validação",
        description: error,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Salvar inscrição no banco de dados
      const { data, error: dbError } = await supabase
        .from('interest_registrations')
        .insert([{
          full_name: formData.nomeCompleto,
          email: formData.email,
          phone: formData.telefone || null,
          profession: formData.escolaridade,
          areas_of_interest: [setor || "Programa"],
          additional_info: `Programa: ${programa}\nIdade: ${formData.idade}\nEscolaridade: ${formData.escolaridade}\nExperiência: ${formData.experiencia}\nMotivação: ${formData.motivacao}`,
          terms_accepted: formData.aceiteTermos
        }])
        .select()
        .single();

      if (dbError) {
        console.error('Erro ao salvar inscrição:', dbError);
        toast({
          title: "Erro ao enviar inscrição",
          description: "Ocorreu um erro ao enviar sua inscrição. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      // Notificar administrador
      await notifyInterestRegistration(
        formData.nomeCompleto,
        formData.email,
        [setor || "Programa"],
        formData.telefone,
        formData.escolaridade,
        undefined,
        `Inscrição no programa: ${programa}\nIdade: ${formData.idade}\nExperiência: ${formData.experiencia}\nMotivação: ${formData.motivacao}`
      );

      // Sucesso
      toast({
        title: "Inscrição enviada com sucesso!",
        description: "Sua inscrição foi registrada. Entraremos em contacto em breve.",
      });

      // Reset form
      setFormData({
        nomeCompleto: "",
        email: "",
        telefone: "",
        idade: "",
        escolaridade: "",
        experiencia: "",
        motivacao: "",
        aceiteTermos: false
      });

      // Fechar modal e chamar callback
      onOpenChange(false);
      onSuccess?.();

    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Inscrição em Programa
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para se inscrever neste programa.
            {setor && <span className="block mt-1 text-sm font-medium">Setor: {setor}</span>}
            {programa && <span className="block text-sm font-medium">Programa: {programa}</span>}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomeCompleto">
                Nome Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
                placeholder="Digite seu nome completo"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange("telefone", e.target.value)}
                placeholder="+244 XXX XXX XXX"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idade">
                Idade <span className="text-red-500">*</span>
              </Label>
              <Input
                id="idade"
                type="number"
                min="16"
                max="100"
                value={formData.idade}
                onChange={(e) => handleInputChange("idade", e.target.value)}
                placeholder="Sua idade"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="escolaridade">
              Nível de Escolaridade <span className="text-red-500">*</span>
            </Label>
            <select
              id="escolaridade"
              value={formData.escolaridade}
              onChange={(e) => handleInputChange("escolaridade", e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecione seu nível de escolaridade</option>
              {niveisEscolaridade.map((nivel) => (
                <option key={nivel} value={nivel}>
                  {nivel}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experiencia">Experiência Profissional</Label>
            <Textarea
              id="experiencia"
              value={formData.experiencia}
              onChange={(e) => handleInputChange("experiencia", e.target.value)}
              placeholder="Descreva brevemente sua experiência profissional (se houver)..."
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivacao">
              Motivação <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="motivacao"
              value={formData.motivacao}
              onChange={(e) => handleInputChange("motivacao", e.target.value)}
              placeholder="Conte-nos por que se interessa por este programa e o que espera aprender..."
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="aceiteTermos"
              checked={formData.aceiteTermos}
              onCheckedChange={(checked) => handleInputChange("aceiteTermos", checked as boolean)}
              disabled={loading}
            />
            <Label htmlFor="aceiteTermos" className="text-sm">
              Aceito os termos e condições <span className="text-red-500">*</span>
            </Label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Inscrever-se
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 