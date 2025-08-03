import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HomeIcon, 
  BuildingIcon, 
  UsersIcon, 
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from 'lucide-react';

interface MobileNavigationProps {
  setor: any;
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  setor,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navigationItems = [
    {
      id: 'programas',
      label: 'Programas',
      icon: BuildingIcon,
      count: setor.programas?.length || 0,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'oportunidades',
      label: 'Oportunidades',
      icon: UsersIcon,
      count: setor.oportunidades?.length || 0,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'infraestruturas',
      label: 'Infraestruturas',
      icon: BuildingIcon,
      count: setor.infraestruturas?.length || 0,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'contactos',
      label: 'Contactos',
      icon: PhoneIcon,
      count: setor.contactos?.length || 0,
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  return (
    <div className={cn(
      'w-full',
      'bg-background/95 backdrop-blur-xl',
      'border-b border-border/50',
      'sticky top-0 z-50',
      className
    )}>
      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between p-4">
        {/* Sector Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <BuildingIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-foreground truncate">
              {setor.nome}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              Sector Estratégico
            </p>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0 ml-2 touch-target min-h-[44px] min-w-[44px]"
        >
          {isExpanded ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Expanded Navigation */}
      {isExpanded && (
        <div className="border-t border-border/50 bg-background/50">
          <div className="p-4 space-y-3">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  'w-full justify-between',
                  'h-14 px-4',
                  'rounded-xl',
                  'hover:bg-muted/50',
                  'transition-all duration-200',
                  'touch-target'
                )}
                onClick={() => {
                  // Scroll to section
                  const element = document.getElementById(item.id);
                  if (element) {
                    element.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                  setIsExpanded(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    item.color
                  )}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {item.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface MobileBottomNavigationProps {
  setor: any;
  className?: string;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  setor,
  className
}) => {
  const [activeTab, setActiveTab] = useState('programas');

  const tabs = [
    {
      id: 'programas',
      label: 'Programas',
      icon: BuildingIcon,
      count: setor.programas?.length || 0
    },
    {
      id: 'oportunidades',
      label: 'Oportunidades',
      icon: UsersIcon,
      count: setor.oportunidades?.length || 0
    },
    {
      id: 'infraestruturas',
      label: 'Infraestruturas',
      icon: BuildingIcon,
      count: setor.infraestruturas?.length || 0
    },
    {
      id: 'contactos',
      label: 'Contactos',
      icon: PhoneIcon,
      count: setor.contactos?.length || 0
    }
  ];

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0',
      'bg-background/95 backdrop-blur-xl',
      'border-t border-border/50',
      'z-50',
      'safe-area-inset-bottom',
      className
    )}>
      <div className="flex items-center justify-around p-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            className={cn(
              'flex flex-col items-center gap-1',
              'h-16 px-3',
              'rounded-xl',
              'transition-all duration-200',
              'touch-target min-h-[64px] min-w-[64px]',
              activeTab === tab.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => {
              setActiveTab(tab.id);
              const element = document.getElementById(tab.id);
              if (element) {
                element.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }}
          >
            <div className="relative">
              <tab.icon className="w-5 h-5" />
              {tab.count > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 w-4 h-4 p-0 text-xs"
                >
                  {tab.count}
                </Badge>
              )}
            </div>
            <span className="text-xs font-medium leading-tight">{tab.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}; 