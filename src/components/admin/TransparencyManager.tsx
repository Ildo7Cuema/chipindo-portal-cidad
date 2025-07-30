// Mock component to avoid build errors with missing tables
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function TransparencyManager() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Transparência</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Este módulo está temporariamente desabilitado devido a configurações de banco de dados.
              Por favor, contacte o administrador do sistema.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}