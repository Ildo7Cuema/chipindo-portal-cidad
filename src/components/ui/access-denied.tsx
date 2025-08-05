import { Lock, Shield, AlertTriangle } from "lucide-react";
import { ResponsiveCard, ResponsiveText } from "@/components/layout/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AccessDeniedProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  icon?: "lock" | "shield" | "warning";
}

export const AccessDenied = ({ 
  title = "Acesso Negado", 
  message = "Não tem permissão para aceder a esta área.",
  showBackButton = true,
  icon = "lock"
}: AccessDeniedProps) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (icon) {
      case "shield":
        return <Shield className="w-12 h-12 text-muted-foreground" />;
      case "warning":
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
      default:
        return <Lock className="w-12 h-12 text-muted-foreground" />;
    }
  };

  return (
    <ResponsiveCard className="text-center py-16">
      <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
        {getIcon()}
      </div>
      
      <ResponsiveText variant="h4" className="font-bold mb-3">
        {title}
      </ResponsiveText>
      
      <ResponsiveText variant="body" className="text-muted-foreground mb-6 max-w-md mx-auto">
        {message}
      </ResponsiveText>
      
      {showBackButton && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="min-w-[120px]"
          >
            Voltar
          </Button>
          <Button 
            onClick={() => navigate("/admin")}
            className="min-w-[120px]"
          >
            Dashboard
          </Button>
        </div>
      )}
    </ResponsiveCard>
  );
}; 