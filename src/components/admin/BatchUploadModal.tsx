import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  FolderOpen, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  FileText,
  Image,
  Video,
  Trash2,
  Globe,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BatchUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
  userId: string;
}

const departments = [
  { value: 'gabinete', label: 'Gabinete do Administrador' },
  { value: 'educacao', label: 'Educação' },
  { value: 'saude', label: 'Saúde' },
  { value: 'agricultura', label: 'Agricultura' },
  { value: 'obras-publicas', label: 'Obras Públicas' },
  { value: 'turismo', label: 'Turismo e Cultura' },
  { value: 'comercio', label: 'Comércio e Indústria' },
  { value: 'recursos-humanos', label: 'Recursos Humanos' },
  { value: 'financas', label: 'Finanças' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'meio-ambiente', label: 'Meio Ambiente' },
  { value: 'seguranca', label: 'Segurança' }
];

export function BatchUploadModal({ open, onOpenChange, onUploadComplete, userId }: BatchUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [department, setDepartment] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'pending' | 'uploading' | 'success' | 'error' }>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para determinar tipo do arquivo
  const getFileType = (file: File): 'documento' | 'imagem' | 'video' => {
    const mimeType = file.type.toLowerCase();
    
    if (mimeType.startsWith('image/')) return 'imagem';
    if (mimeType.startsWith('video/')) return 'video';
    return 'documento';
  };

  // Função para upload de arquivo
  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('acervo-digital')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('acervo-digital')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  };

  // Função para selecionar arquivos
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
    
    // Inicializar status para novos arquivos
    const newStatus: { [key: string]: 'pending' } = {};
    selectedFiles.forEach(file => {
      newStatus[file.name] = 'pending';
    });
    setUploadStatus(newStatus);
    setUploadProgress({});
  };

  // Função para remover arquivo
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Função para upload em lote
  const handleBatchUpload = async () => {
    if (!department || files.length === 0) {
      toast.error('Selecione uma direcção e pelo menos um arquivo.');
      return;
    }

    setIsUploading(true);
    const results = [];

    try {
      for (const file of files) {
        const fileId = file.name;
        setUploadStatus(prev => ({ ...prev, [fileId]: 'uploading' }));
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        try {
          // Upload do arquivo
          const fileUrl = await handleFileUpload(file);

          if (fileUrl) {
            // Determinar tipo do arquivo
            const fileType = getFileType(file);
            
            // Criar entrada no acervo
            const { data, error } = await supabase
              .from('acervo_digital')
              .insert({
                title: file.name,
                description: `Arquivo carregado em lote para ${departments.find(d => d.value === department)?.label}`,
                type: fileType,
                department: department,
                file_url: fileUrl,
                file_size: file.size,
                mime_type: file.type,
                is_public: isPublic,
                author_id: userId
              })
              .select()
              .single();

            if (error) throw error;

            setUploadStatus(prev => ({ ...prev, [fileId]: 'success' }));
            setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
            results.push({ file: file.name, success: true });
          }
        } catch (error) {
          console.error(`Erro ao processar ${file.name}:`, error);
          setUploadStatus(prev => ({ ...prev, [fileId]: 'error' }));
          results.push({ file: file.name, success: false, error: error.message });
        }
      }

      // Mostrar resultado final
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.length - successCount;
      
      if (successCount > 0) {
        toast.success(`${successCount} arquivo(s) carregado(s) com sucesso! ${isPublic ? '(Públicos)' : '(Privados)'}`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} arquivo(s) falharam no carregamento.`);
      }

      // Limpar e fechar modal
      setFiles([]);
      setDepartment('');
      setIsPublic(false);
      setUploadProgress({});
      setUploadStatus({});
      onOpenChange(false);
      
      // Notificar componente pai
      onUploadComplete();
      
    } catch (error) {
      console.error('Erro no upload em lote:', error);
      toast.error('Erro no upload em lote. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  // Função para obter ícone do tipo de arquivo
  const getFileIcon = (file: File) => {
    const type = getFileType(file);
    switch (type) {
      case 'imagem': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'uploading': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'uploading': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Upload em Lote - Acervo Digital
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Carregue múltiplos arquivos de uma vez para uma direcção específica
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Seleção de Direcção */}
          <div className="space-y-2">
            <Label htmlFor="department">Direcção/Área</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a direcção para os arquivos" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(d => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Configuração de Visibilidade */}
          <div className="space-y-2">
            <Label>Visibilidade dos Arquivos</Label>
            <div className="flex items-center space-x-2 p-4 border rounded-lg bg-muted/30">
              <Switch 
                id="is-public" 
                checked={isPublic} 
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="is-public" className="flex items-center gap-2 cursor-pointer">
                {isPublic ? (
                  <>
                    <Globe className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-700">Público</span>
                    <span className="text-sm text-muted-foreground">
                      - Arquivos serão visíveis na página pública do acervo
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-700">Privado</span>
                    <span className="text-sm text-muted-foreground">
                      - Arquivos serão visíveis apenas na área administrativa
                    </span>
                  </>
                )}
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              {isPublic 
                ? "Os arquivos carregados aparecerão na página pública do acervo digital para todos os cidadãos."
                : "Os arquivos carregados ficarão restritos à área administrativa."
              }
            </p>
          </div>

          {/* Seleção de Arquivos */}
          <div className="space-y-2">
            <Label>Arquivos</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Selecionar Arquivos
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Formatos suportados: PDF, DOC, Imagem, Vídeo, Áudio
              </p>
            </div>
          </div>

          {/* Lista de Arquivos */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Arquivos Selecionados ({files.length})</Label>
              <ScrollArea className="h-64 border rounded-lg p-4">
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        {getFileIcon(file)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {getFileType(file)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {uploadStatus[file.name] && (
                          <Badge className={cn("text-xs", getStatusColor(uploadStatus[file.name]))}>
                            {getStatusIcon(uploadStatus[file.name])}
                            <span className="ml-1 capitalize">
                              {uploadStatus[file.name] === 'uploading' ? 'Carregando...' : 
                               uploadStatus[file.name] === 'success' ? 'Sucesso' :
                               uploadStatus[file.name] === 'error' ? 'Erro' : 'Pendente'}
                            </span>
                          </Badge>
                        )}
                        
                        {uploadProgress[file.name] !== undefined && uploadStatus[file.name] === 'uploading' && (
                          <div className="w-20">
                            <Progress value={uploadProgress[file.name]} className="h-2" />
                          </div>
                        )}
                        
                        {!isUploading && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {files.length} arquivo(s) selecionado(s)
            </p>
            <Badge className={cn(
              "text-xs",
              isPublic 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-800"
            )}>
              {isPublic ? (
                <>
                  <Globe className="w-3 h-3 mr-1" />
                  Público
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 mr-1" />
                  Privado
                </>
              )}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleBatchUpload}
              disabled={!department || files.length === 0 || isUploading}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Carregando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Carregar {files.length} Arquivo(s) {isPublic ? '(Públicos)' : '(Privados)'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 