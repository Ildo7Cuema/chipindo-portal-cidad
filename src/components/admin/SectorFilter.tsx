import { useState, useEffect } from 'react';
import { ResponsiveCard, ResponsiveText } from "@/components/layout/ResponsiveLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Filter, Eye, EyeOff } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { getSectorName } from "@/hooks/useUserRole";

interface SectorFilterProps {
  onFilterChange?: (sectorId: string | null) => void;
  showFilter?: boolean;
  className?: string;
}

export const SectorFilter = ({ 
  onFilterChange, 
  showFilter = true,
  className = "" 
}: SectorFilterProps) => {
  const { profile, isAdmin, isSectorUser, role } = useUserRole(null);
  const [currentSector, setCurrentSector] = useState<string | null>(null);

  useEffect(() => {
    if (isSectorUser && profile?.setor_id) {
      setCurrentSector(profile.setor_id);
      onFilterChange?.(profile.setor_id);
    } else if (isAdmin) {
      setCurrentSector(null);
      onFilterChange?.(null);
    }
  }, [isAdmin, isSectorUser, profile?.setor_id, onFilterChange]);

  if (!showFilter) return null;

  return (
    <ResponsiveCard className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Filter className="w-4 h-4 text-primary" />
          </div>
          <div>
            <ResponsiveText variant="body" className="font-medium">
              Filtro de Setor
            </ResponsiveText>
            <ResponsiveText variant="small" className="text-muted-foreground">
              {isAdmin ? "Visualizando todos os setores" : `Limitado ao setor: ${getSectorName(role)}`}
            </ResponsiveText>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isSectorUser && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {getSectorName(role)}
            </Badge>
          )}
          
          {isAdmin && (
            <Badge variant="default" className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Todos os Setores
            </Badge>
          )}
        </div>
      </div>
      
      {isSectorUser && (
        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
          <ResponsiveText variant="small" className="text-muted-foreground">
            <strong>Nota:</strong> Como utilizador do setor <strong>{getSectorName(role)}</strong>, 
            apenas pode visualizar e gerir informações relacionadas com este setor.
          </ResponsiveText>
        </div>
      )}
    </ResponsiveCard>
  );
}; 