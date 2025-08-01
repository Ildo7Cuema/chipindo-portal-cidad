import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MenuIcon, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
  category?: string;
}

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navigationItems: NavigationItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  profile: any;
  role: string;
  onSignOut: () => void;
  getRoleLabel: (role: string) => string;
  getRoleBadgeVariant: (role: string) => string;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  open,
  onOpenChange,
  navigationItems,
  activeTab,
  onTabChange,
  profile,
  role,
  onSignOut,
  getRoleLabel,
  getRoleBadgeVariant
}) => {
  // Agrupar itens por categoria
  const groupedItems = navigationItems.reduce((acc, item) => {
    const category = item.category || 'Geral';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="w-[85vw] max-w-sm p-0 flex flex-col h-full"
        style={{ height: '100vh' }}
      >
        {/* Header fixo */}
        <SheetHeader className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5 flex-shrink-0">
          <SheetTitle className="text-left flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Portal Administrativo</div>
              <div className="text-xs text-muted-foreground">Município de Chipindo</div>
            </div>
          </SheetTitle>
        </SheetHeader>
        
        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto min-h-0" style={{ height: 'calc(100vh - 140px)' }}>
          <div className="py-2">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="px-4 pb-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                  {category}
                </div>
                
                <div className="space-y-2">
                  {items.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onTabChange(item.id);
                          onOpenChange(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 text-left p-3 rounded-xl transition-all duration-200",
                          isActive 
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "text-foreground hover:bg-muted/50 hover:text-primary"
                        )}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.label}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                        </div>
                        {isActive && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer fixo */}
        <div className="p-4 border-t border-border/50 flex-shrink-0 bg-background">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
              <AvatarFallback>
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{profile?.full_name || profile?.email}</div>
              <Badge variant={getRoleBadgeVariant(role) as any} className="text-xs">
                {getRoleLabel(role)}
              </Badge>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              onSignOut();
              onOpenChange(false);
            }}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}; 