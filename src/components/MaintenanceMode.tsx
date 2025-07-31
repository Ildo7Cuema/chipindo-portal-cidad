import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings, Shield } from 'lucide-react';

interface MaintenanceModeProps {
  children: React.ReactNode;
}

export const MaintenanceMode: React.FC<MaintenanceModeProps> = ({ children }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkMaintenanceMode();
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      // Get maintenance mode setting from database
      const { data, error } = await supabase
        .from('system_settings')
        .select('maintenance_mode')
        .limit(1)
        .single();

      if (error) {
        console.error('Error checking maintenance mode:', error);
        setMaintenanceMode(false);
      } else {
        setMaintenanceMode(data?.maintenance_mode || false);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
      setMaintenanceMode(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando status do sistema...</p>
        </div>
      </div>
    );
  }

  if (maintenanceMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Modo de Manutenção
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              O portal está temporariamente indisponível para manutenção.
              <br />
              Pedimos desculpas pelo inconveniente.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Shield className="h-4 w-4" />
              <span>Manutenção em andamento</span>
            </div>
            
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}; 