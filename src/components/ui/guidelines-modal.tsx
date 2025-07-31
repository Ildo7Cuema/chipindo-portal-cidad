import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

interface GuidelinesModalProps {
  trigger?: React.ReactNode;
}

export const GuidelinesModal = ({ trigger }: GuidelinesModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    const guidelines = `# Diretrizes para Promoção de Eventos em Chipindo

## 1. Critérios de Elegibilidade
- Eventos devem ser de interesse público
- Organizadores devem ter sede ou representação no município
- Eventos devem respeitar a legislação local

## 2. Informações Obrigatórias
- Título e descrição do evento
- Data, hora e local
- Organizador e contactos
- Número esperado de participantes
- Medidas de segurança

## 3. Processo de Submissão
1. Contactar a administração municipal
2. Preencher formulário de solicitação
3. Aguardar aprovação (até 5 dias úteis)
4. Fornecer materiais promocionais

## 4. Responsabilidades
- Organizador é responsável pela execução do evento
- Município fornece suporte promocional
- Cumprimento de normas de segurança obrigatório

## 5. Contactos
- Email: eventos@chipindo.gov.ao
- Telefone: +244 123 456 789
- Horário: Segunda a Sexta, 8h-17h`;

    const blob = new Blob([guidelines], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diretrizes-eventos-chipindo.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleContact = () => {
    const email = 'eventos@chipindo.gov.ao';
    const subject = 'Informações sobre Promoção de Eventos';
    const body = `Olá,\n\nGostaria de obter informações sobre como promover um evento na plataforma do município de Chipindo.\n\nAguardo o vosso contacto.\n\nObrigado.`;
    
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Ver Diretrizes
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Diretrizes para Promoção de Eventos
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Critérios de Elegibilidade */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              1. Critérios de Elegibilidade
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Eventos devem ser de interesse público</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Organizadores devem ter sede ou representação no município</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Eventos devem respeitar a legislação local</span>
              </li>
            </ul>
          </div>

          {/* Informações Obrigatórias */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              2. Informações Obrigatórias
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Título e descrição do evento</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Data, hora e local</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Organizador e contactos</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Número esperado de participantes</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Medidas de segurança</span>
              </li>
            </ul>
          </div>

          {/* Processo de Submissão */}
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              3. Processo de Submissão
            </h3>
            <ol className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">1</Badge>
                <span>Contactar a administração municipal</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">2</Badge>
                <span>Preencher formulário de solicitação</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">3</Badge>
                <span>Aguardar aprovação (até 5 dias úteis)</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">4</Badge>
                <span>Fornecer materiais promocionais</span>
              </li>
            </ol>
          </div>

          {/* Responsabilidades */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              4. Responsabilidades
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Organizador é responsável pela execução do evento</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Município fornece suporte promocional</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Cumprimento de normas de segurança obrigatório</span>
              </li>
            </ul>
          </div>

          {/* Contactos */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              5. Contactos
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-sm">eventos@chipindo.gov.ao</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-sm">+244 123 456 789</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Segunda a Sexta, 8h-17h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button onClick={handleDownload} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Baixar Diretrizes
          </Button>
          <Button variant="outline" onClick={handleContact}>
            <Mail className="w-4 h-4 mr-2" />
            Contactar Administração
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 