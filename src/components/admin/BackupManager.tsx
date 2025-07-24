import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, Upload, Archive, RefreshCw } from "lucide-react";

export const BackupManager = () => {
  const [loading, setLoading] = useState(false);

  const exportData = async (table: 'news' | 'concursos' | 'profiles') => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*');

      if (error) {
        throw error;
      }

      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${table}_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup criado",
        description: `Dados de ${table} exportados com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro no backup",
        description: `Não foi possível criar o backup de ${table}.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportAllData = async () => {
    setLoading(true);
    try {
      const tables: ('news' | 'concursos' | 'profiles')[] = ['news', 'concursos', 'profiles'];
      const backupData: any = {};

      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*');
        
        if (error) {
          throw error;
        }
        
        backupData[table] = data;
      }

      backupData.metadata = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        tables: tables
      };

      const jsonData = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `portal_chipindo_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup completo criado",
        description: "Todos os dados foram exportados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no backup",
        description: "Não foi possível criar o backup completo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="h-4 w-4" />
          Backup e Restauração
        </CardTitle>
        <CardDescription>
          Gerencie backups dos dados do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Backup Individual</h4>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => exportData('news')}
                disabled={loading}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Notícias
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => exportData('concursos')}
                disabled={loading}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Concursos
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => exportData('profiles')}
                disabled={loading}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Usuários
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Backup Completo</h4>
            <Button 
              className="w-full"
              onClick={exportAllData}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Archive className="h-4 w-4 mr-2" />
              )}
              {loading ? "Criando Backup..." : "Criar Backup Completo"}
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Inclui todos os dados do sistema em um único arquivo
            </p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Restauração</h4>
              <p className="text-sm text-muted-foreground">
                Funcionalidade disponível em breve
              </p>
            </div>
            <Button variant="outline" disabled>
              <Upload className="h-4 w-4 mr-2" />
              Restaurar Backup
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Nota:</strong> Os backups incluem todos os dados visíveis para sua conta.</p>
          <p>Recomenda-se criar backups regulares antes de realizar grandes alterações.</p>
        </div>
      </CardContent>
    </Card>
  );
};