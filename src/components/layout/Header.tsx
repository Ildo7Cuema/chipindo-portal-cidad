import { Navigation } from "@/components/ui/navigation";
import { Badge } from "@/components/ui/badge";
import insigniaAngola from "@/assets/insignia-angola.png";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-elegant border border-border p-1">
                <img 
                  src={insigniaAngola} 
                  alt="Insígnia da República de Angola" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Portal de Chipindo</h1>
                <p className="text-sm text-muted-foreground">Administração Municipal</p>
              </div>
            </div>
            <Badge variant="outline" className="hidden md:inline-flex">
              Oficial
            </Badge>
          </div>

          {/* Navigation */}
          <Navigation />
        </div>
      </div>
    </header>
  );
};