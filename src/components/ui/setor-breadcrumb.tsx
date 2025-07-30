import React from "react";
import { Link } from "react-router-dom";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { HomeIcon, BuildingIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SetorBreadcrumbProps {
  setorName: string;
  setorSlug: string;
  className?: string;
}

const setorIcons: { [key: string]: React.ComponentType<any> } = {
  educacao: BuildingIcon,
  saude: BuildingIcon,
  agricultura: BuildingIcon,
  'sector-mineiro': BuildingIcon,
  'desenvolvimento-economico': BuildingIcon,
  cultura: BuildingIcon,
  tecnologia: BuildingIcon,
  'energia-agua': BuildingIcon,
};

export const SetorBreadcrumb = ({ setorName, setorSlug, className }: SetorBreadcrumbProps) => {
  const SetorIcon = setorIcons[setorSlug] || BuildingIcon;

  return (
    <Breadcrumb className={cn("mb-6", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link 
              to="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
              Início
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link 
              to="/services" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <BuildingIcon className="w-4 h-4" />
              Setores
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-2">
            <SetorIcon className="w-4 h-4" />
            {setorName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}; 