import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface BookMedicalAppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  especialidade: string;
  onSuccess?: () => void;
}

export function BookMedicalAppointmentForm({ open, onOpenChange, especialidade, onSuccess }: BookMedicalAppointmentFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    data: "",
    observacoes: "",
    aceiteTermos: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) return "Nome completo é obrigatório";
    if (!formData.email.trim()) return "Email é obrigatório";
    if (!formData.email.includes("@")) return "Email inválido";
    if (!formData.telefone.trim()) return "Telefone é obrigatório";
    if (!formData.data.trim()) return "Data preferencial é obrigatória";
    if (!formData.aceiteTermos) return "É necessário aceitar os termos";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast({ title: "Erro de validação", description: error, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Aqui você pode integrar com o backend ou supabase para salvar a marcação
      // Exemplo fictício:
      // await supabase.from('medical_appointments').insert({...})
      await new Promise(res => setTimeout(res, 800)); // Simula requisição
      toast({ title: "Consulta marcada com sucesso!", description: "Você receberá confirmação por email." });
      setFormData({ nome: "", email: "", telefone: "", data: "", observacoes: "", aceiteTermos: false });
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast({ title: "Erro inesperado", description: "Ocorreu um erro ao marcar a consulta.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Marcar Consulta Médica</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para solicitar uma consulta em <b>{especialidade}</b>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome completo</Label>
            <Input value={formData.nome} onChange={e => handleInputChange("nome", e.target.value)} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} required />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input value={formData.telefone} onChange={e => handleInputChange("telefone", e.target.value)} required />
          </div>
          <div>
            <Label>Especialidade</Label>
            <Input value={especialidade} readOnly className="bg-muted" />
          </div>
          <div>
            <Label>Data preferencial</Label>
            <Input type="date" value={formData.data} onChange={e => handleInputChange("data", e.target.value)} required />
          </div>
          <div>
            <Label>Observações</Label>
            <Textarea value={formData.observacoes} onChange={e => handleInputChange("observacoes", e.target.value)} placeholder="Descreva sintomas, preferências, etc." />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="aceite" checked={formData.aceiteTermos} onCheckedChange={v => handleInputChange("aceiteTermos", !!v)} />
            <Label htmlFor="aceite" className="text-xs">Li e aceito os termos de privacidade e uso de dados.</Label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Enviando..." : "Marcar Consulta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}