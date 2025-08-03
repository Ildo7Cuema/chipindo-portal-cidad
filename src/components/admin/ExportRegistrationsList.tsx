import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useInterestAreas } from "@/hooks/useInterestAreas";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileSpreadsheet, FileDown, FileText, Users, Filter } from "lucide-react";

interface ExportRegistrationsListProps {
  onExportComplete?: () => void;
}

interface InterestRegistration {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  profession: string | null;
  experience_years: number | null;
  areas_of_interest: string[];
  additional_info: string | null;
  terms_accepted: boolean;
  created_at: string;
  updated_at: string;
}

export const ExportRegistrationsList = ({ onExportComplete }: ExportRegistrationsListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [filters, setFilters] = useState({
    area: 'all',
    dateFrom: '',
    dateTo: '',
    hasPhone: false,
    hasProfession: false,
    termsAccepted: false
  });
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    email: true,
    phone: true,
    profession: true,
    experience: true,
    areas: true,
    additionalInfo: true,
    termsAccepted: true,
    createdAt: true
  });

  // Usar hook para buscar áreas dinamicamente
  const { areaOptions, loading: areasLoading } = useInterestAreas();

  const fieldOptions = [
    { key: 'name', label: 'Nome Completo' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Telefone' },
    { key: 'profession', label: 'Profissão' },
    { key: 'experience', label: 'Anos de Experiência' },
    { key: 'areas', label: 'Áreas de Interesse' },
    { key: 'additionalInfo', label: 'Informações Adicionais' },
    { key: 'termsAccepted', label: 'Termos Aceites' },
    { key: 'createdAt', label: 'Data de Registro' }
  ];

  const handleExport = async () => {
    setLoading(true);
    try {
      console.log('🚀 Iniciando exportação...');
      console.log('📋 Filtros selecionados:', filters);
      console.log('📊 Campos selecionados:', selectedFields);

      // Buscar todos os registros primeiro
      const { data: allData, error: allError } = await supabase
        .from('interest_registrations' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (allError) {
        console.error('❌ Erro ao buscar dados:', allError);
        throw allError;
      }

      const allRegistrations = allData as InterestRegistration[];
      console.log(`📊 Total de registros no banco: ${allRegistrations.length}`);

      // Aplicar filtros no frontend (mesma lógica do componente principal)
      let filteredRegistrations = allRegistrations.filter(registration => {
        // Filtro por área
        if (filters.area !== 'all') {
          const matchesArea = registration.areas_of_interest && 
                             registration.areas_of_interest.some(area => {
                               // Normalizar strings para comparação
                               const normalizedArea = area.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                               const normalizedFilter = filters.area.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                               
                               // Verificar se contém a palavra-chave
                               const containsKeyword = normalizedArea.includes(normalizedFilter);
                               
                               console.log(`🔍 Comparando: "${area}" (${normalizedArea}) com "${filters.area}" (${normalizedFilter}) = ${containsKeyword}`);
                               
                               return containsKeyword;
                             });
          if (!matchesArea) {
            console.log(`❌ Registro ${registration.full_name} não corresponde à área ${filters.area}`);
            return false;
          }
        }

        // Filtro por data
        if (filters.dateFrom) {
          const registrationDate = new Date(registration.created_at);
          const fromDate = new Date(filters.dateFrom);
          console.log(`📅 Comparando data: ${registrationDate.toISOString()} >= ${fromDate.toISOString()}`);
          if (registrationDate < fromDate) {
            console.log(`❌ Registro ${registration.full_name} fora do período (antes de ${filters.dateFrom})`);
            return false;
          }
        }

        if (filters.dateTo) {
          const registrationDate = new Date(registration.created_at);
          const toDate = new Date(filters.dateTo);
          console.log(`📅 Comparando data: ${registrationDate.toISOString()} <= ${toDate.toISOString()}`);
          if (registrationDate > toDate) {
            console.log(`❌ Registro ${registration.full_name} fora do período (depois de ${filters.dateTo})`);
            return false;
          }
        }

        // Filtro por telefone
        if (filters.hasPhone && !registration.phone) return false;

        // Filtro por profissão
        if (filters.hasProfession && !registration.profession) return false;

        // Filtro por termos aceites
        if (filters.termsAccepted && !registration.terms_accepted) return false;

        return true;
      });

      const registrations = filteredRegistrations;
      console.log(`✅ Registros após filtros: ${registrations.length}`);

      if (registrations.length === 0) {
        console.log('❌ Nenhum registro encontrado com os filtros aplicados');
        console.log('🔍 Verificando áreas disponíveis...');
        
        // Mostrar áreas disponíveis para debug
        const availableAreas = new Set();
        allRegistrations.forEach(reg => {
          if (reg.areas_of_interest && Array.isArray(reg.areas_of_interest)) {
            reg.areas_of_interest.forEach(area => availableAreas.add(area));
          }
        });
        console.log('📋 Áreas disponíveis:', Array.from(availableAreas));

        toast({
          title: "Nenhum registro encontrado",
          description: `Filtros: Área=${filters.area}, Data=${filters.dateFrom || 'N/A'} a ${filters.dateTo || 'N/A'}. Verifique o console para mais detalhes.`,
          variant: "destructive"
        });
        return;
      }

      // Preparar dados para exportação
      const exportData = registrations.map(reg => {
        const row: any = {};
        
        if (selectedFields.name) row['Nome Completo'] = reg.full_name;
        if (selectedFields.email) row['Email'] = reg.email;
        if (selectedFields.phone) row['Telefone'] = reg.phone || '';
        if (selectedFields.profession) row['Profissão'] = reg.profession || '';
        if (selectedFields.experience) row['Anos de Experiência'] = reg.experience_years || '';
        if (selectedFields.areas) row['Áreas de Interesse'] = reg.areas_of_interest.join(', ');
        if (selectedFields.additionalInfo) row['Informações Adicionais'] = reg.additional_info || '';
        if (selectedFields.termsAccepted) row['Termos Aceites'] = reg.terms_accepted ? 'Sim' : 'Não';
        if (selectedFields.createdAt) row['Data de Registro'] = new Date(reg.created_at).toLocaleDateString('pt-BR');

        return row;
      });

      // Gerar nome do arquivo
      const timestamp = new Date().toISOString().split('T')[0];
      const areaSuffix = filters.area !== 'all' ? `-${filters.area}` : '';
      const filename = `registros-interesse${areaSuffix}-${timestamp}`;

      // Exportar baseado no formato
      switch (exportFormat) {
        case 'csv':
          await exportToCSV(exportData, filename);
          break;
        case 'excel':
          await exportToExcel(exportData, filename);
          break;
        case 'pdf':
          await exportToPDF(exportData, filename);
          break;
      }

      toast({
        title: "Exportação concluída",
        description: `${registrations.length} registros exportados com sucesso em ${exportFormat.toUpperCase()}.`
      });

      setIsOpen(false);
      onExportComplete?.();

    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async (data: any[], filename: string) => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const exportToExcel = async (data: any[], filename: string) => {
    // Implementação básica - em produção seria melhor usar uma biblioteca como xlsx
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join('\t'),
      ...data.map(row => headers.map(header => row[header]).join('\t'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.xls`;
    link.click();
  };

  const exportToPDF = async (data: any[], filename: string) => {
    // Implementação básica - em produção seria melhor usar uma biblioteca como jsPDF
    const headers = Object.keys(data[0]);
    let pdfContent = `Registros de Interesse\n\n`;
    
    data.forEach((row, index) => {
      pdfContent += `Registro ${index + 1}:\n`;
      headers.forEach(header => {
        pdfContent += `${header}: ${row[header]}\n`;
      });
      pdfContent += '\n';
    });

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.txt`;
    link.click();
  };

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Lista
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exportar Lista de Registros</DialogTitle>
          <DialogDescription>
            Configure os filtros e campos para exportar uma lista organizada de registros de interesse.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formato de Exportação */}
          <div>
            <Label>Formato de Exportação</Label>
            <Select value={exportFormat} onValueChange={(value: 'csv' | 'excel' | 'pdf') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    CSV
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center">
                    <FileDown className="h-4 w-4 mr-2" />
                    Excel
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Área de Interesse</Label>
                  <Select value={filters.area} onValueChange={(value) => setFilters(prev => ({ ...prev, area: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {areaOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Data de Fim</Label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasPhone"
                    checked={filters.hasPhone}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasPhone: !!checked }))}
                  />
                  <Label htmlFor="hasPhone">Apenas registros com telefone</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasProfession"
                    checked={filters.hasProfession}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasProfession: !!checked }))}
                  />
                  <Label htmlFor="hasProfession">Apenas registros com profissão</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="termsAccepted"
                    checked={filters.termsAccepted}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, termsAccepted: !!checked }))}
                  />
                  <Label htmlFor="termsAccepted">Apenas registros com termos aceites</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campos a Exportar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campos a Exportar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {fieldOptions.map(field => (
                  <div key={field.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.key}
                      checked={selectedFields[field.key as keyof typeof selectedFields]}
                      onCheckedChange={() => handleFieldToggle(field.key)}
                    />
                    <Label htmlFor={field.key}>{field.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={async () => {
                console.log('🧪 Testando filtros...');
                console.log('Filtros atuais:', filters);
                
                // Testar busca rápida
                const { data, error } = await supabase
                  .from('interest_registrations' as any)
                  .select('*')
                  .limit(5);
                
                if (error) {
                  console.error('Erro no teste:', error);
                } else {
                  console.log('Primeiros 5 registros:', data);
                  if (data && data.length > 0) {
                    console.log('Áreas do primeiro registro:', data[0].areas_of_interest);
                    
                    // Testar filtro específico
                    console.log('🧪 Testando filtro "Saúde"...');
                    const filtered = data.filter(reg => 
                      reg.areas_of_interest && 
                      reg.areas_of_interest.some(area => 
                        area.toLowerCase().includes('saúde'.toLowerCase())
                      )
                    );
                    console.log('Registros com "Saúde":', filtered.length);
                    console.log('Detalhes:', filtered.map(f => ({ name: f.full_name, areas: f.areas_of_interest })));
                  }
                }
              }}
            >
              Testar
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExport} disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 