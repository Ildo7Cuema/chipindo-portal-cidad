import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifyInterestRegistration } from "@/lib/notification-helpers";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface CandidaturaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setor?: string;
  oportunidade?: string;
  onSuccess?: () => void;
}

interface FormData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  profissao: string;
  areaInteresse: string;
  mensagem: string;
  aceiteTermos: boolean;
}

const areasInteresse = [
  "Administração Pública",
  "Agricultura",
  "Cultura",
  "Desenvolvimento Económico",
  "Educação",
  "Energia e Água",
  "Saúde",
  "Setor Mineiro",
  "Tecnologia",
  "Outros"
];

export function CandidaturaForm({ 
  open, 
  onOpenChange, 
  setor, 
  oportunidade, 
  onSuccess 
}: CandidaturaFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: "",
    email: "",
    telefone: "",
    profissao: "",
    areaInteresse: setor || "",
    mensagem: "",
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
    if (!formData.areaInteresse.trim()) {
      return "Área de interesse é obrigatória";
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
      // Salvar candidatura no banco de dados
      const { data, error: dbError } = await supabase
        .from('interest_registrations')
        .insert([{
          full_name: formData.nomeCompleto,
          email: formData.email,
          phone: formData.telefone || null,
          profession: formData.profissao || null,
          areas_of_interest: [formData.areaInteresse],
          additional_info: formData.mensagem || null,
          terms_accepted: formData.aceiteTermos
        }])
        .select()
        .single();

      if (dbError) {
        console.error('Erro ao salvar candidatura:', dbError);
        toast({
          title: "Erro ao enviar candidatura",
          description: "Ocorreu um erro ao enviar sua candidatura. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      // Notificar administrador
      await notifyInterestRegistration(
        formData.nomeCompleto,
        formData.email,
        [formData.areaInteresse],
        formData.telefone,
        formData.profissao,
        undefined,
        formData.mensagem
      );

      // Sucesso
      toast({
        title: "Candidatura enviada com sucesso!",
        description: "Sua candidatura foi registrada. Entraremos em contacto caso seja selecionado.",
      });

      // Reset form
      setFormData({
        nomeCompleto: "",
        email: "",
        telefone: "",
        profissao: "",
        areaInteresse: setor || "",
        mensagem: "",
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Candidatura
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para se candidatar a esta oportunidade.
            {setor && <span className="block mt-1 text-sm font-medium">Setor: {setor}</span>}
            {oportunidade && <span className="block text-sm font-medium">Oportunidade: {oportunidade}</span>}
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
              <Label htmlFor="profissao">Profissão</Label>
              <Input
                id="profissao"
                value={formData.profissao}
                onChange={(e) => handleInputChange("profissao", e.target.value)}
                placeholder="Sua profissão atual"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="areaInteresse">
              Área de Interesse <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.areaInteresse}
              onValueChange={(value) => handleInputChange("areaInteresse", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma área de interesse" />
              </SelectTrigger>
              <SelectContent>
                {areasInteresse.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem/Justificativa</Label>
            <Textarea
              id="mensagem"
              value={formData.mensagem}
              onChange={(e) => handleInputChange("mensagem", e.target.value)}
              placeholder="Conte-nos um pouco sobre você e por que se interessa por esta oportunidade..."
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
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Enviar Candidatura
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 