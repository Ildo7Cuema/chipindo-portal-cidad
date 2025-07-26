import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Building2, 
  Star, 
  FileText, 
  Trophy, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Users,
  Shield,
  Zap,
  Download,
  Info,
  Phone,
  MessageSquare
} from "lucide-react";

interface NotificationData {
  [key: string]: any;
}

interface NotificationDetailsProps {
  type: string;
  data: NotificationData;
}

export const NotificationDetails = ({ type, data }: NotificationDetailsProps) => {
  if (!data || Object.keys(data).length === 0) return null;

  // Interest Registration Details - Most detailed formatting
  if (type === 'interest_registration') {
    return (
      <div className="space-y-3 text-sm">
        {data.fullName && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-muted-foreground">Nome:</span>
            <span className="text-foreground font-medium">{data.fullName}</span>
          </div>
        )}
        
        {data.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-green-600" />
            <span className="font-medium text-muted-foreground">Email:</span>
            <span className="text-foreground">{data.email}</span>
          </div>
        )}
        
        {data.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-muted-foreground">Telemóvel:</span>
            <span className="text-foreground">{data.phone}</span>
          </div>
        )}
        
        {data.profession && (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-muted-foreground">Profissão:</span>
            <span className="text-foreground">{data.profession}</span>
          </div>
        )}
        
        {data.areasOfInterest && Array.isArray(data.areasOfInterest) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-muted-foreground">Áreas de Interesse:</span>
            </div>
            <div className="flex flex-wrap gap-2 ml-6">
              {data.areasOfInterest.map((area: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {data.experience_years && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="font-medium text-muted-foreground">Experiência:</span>
            <span className="text-foreground">{data.experience_years} anos</span>
          </div>
        )}

        {data.additional_info && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span className="font-medium text-muted-foreground">Informações Adicionais:</span>
            </div>
            <div className="ml-6 p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-foreground leading-relaxed">
                {data.additional_info}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // News Published Details
  if (type === 'news_published') {
    return (
      <div className="space-y-2 text-sm">
        {data.author && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Autor:</span>
            <span className="text-foreground">{data.author}</span>
          </div>
        )}
        {data.category && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Categoria:</span>
            <Badge variant="outline" className="text-xs">{data.category}</Badge>
          </div>
        )}
        {data.newsId && (
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">ID:</span>
            <span className="text-xs text-muted-foreground font-mono">{data.newsId}</span>
          </div>
        )}
      </div>
    );
  }

  // Contest Created Details
  if (type === 'concurso_created') {
    return (
      <div className="space-y-2 text-sm">
        {data.author && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Criado por:</span>
            <span className="text-foreground">{data.author}</span>
          </div>
        )}
        {data.area && (
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Área:</span>
            <Badge variant="outline" className="text-xs">{data.area}</Badge>
          </div>
        )}
        {data.vagas && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Vagas:</span>
            <span className="text-foreground">{data.vagas}</span>
          </div>
        )}
      </div>
    );
  }

  // New User Details
  if (type === 'new_user') {
    return (
      <div className="space-y-2 text-sm">
        {data.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Email:</span>
            <span className="text-foreground">{data.email}</span>
          </div>
        )}
        {data.role && (
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Papel:</span>
            <Badge variant="outline" className="text-xs">{data.role}</Badge>
          </div>
        )}
      </div>
    );
  }

  // System Update Details
  if (type === 'system_update') {
    return (
      <div className="space-y-2 text-sm">
        {data.version && (
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Versão:</span>
            <Badge variant="outline" className="text-xs">{data.version}</Badge>
          </div>
        )}
        {data.features && Array.isArray(data.features) && (
          <div className="flex items-start gap-2">
            <Star className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="font-medium">Novas Funcionalidades:</span>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {data.features.map((feature: string, index: number) => (
                  <li key={index} className="text-xs text-muted-foreground">{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Maintenance Details
  if (type === 'maintenance') {
    return (
      <div className="space-y-2 text-sm">
        {data.scheduledDate && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Data Agendada:</span>
            <span className="text-foreground">
              {new Date(data.scheduledDate).toLocaleString('pt-AO')}
            </span>
          </div>
        )}
        {data.duration && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Duração:</span>
            <span className="text-foreground">{data.duration}</span>
          </div>
        )}
        {data.affectedServices && Array.isArray(data.affectedServices) && (
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="font-medium">Serviços Afetados:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.affectedServices.map((service: string, index: number) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Urgent Notification Details
  if (type === 'urgent') {
    return (
      <div className="space-y-2 text-sm">
        {data.severity && (
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="font-medium">Severidade:</span>
            <Badge 
              variant={data.severity === 'high' ? 'destructive' : data.severity === 'medium' ? 'default' : 'secondary'} 
              className="text-xs"
            >
              {data.severity === 'high' ? 'Alta' : data.severity === 'medium' ? 'Média' : 'Baixa'}
            </Badge>
          </div>
        )}
        {data.affectedUsers && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Utilizadores Afetados:</span>
            <span className="text-foreground">{data.affectedUsers}</span>
          </div>
        )}
        {data.estimatedResolution && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Resolução Estimada:</span>
            <span className="text-foreground">{data.estimatedResolution}</span>
          </div>
        )}
      </div>
    );
  }

  // Info Notification Details
  if (type === 'info') {
    return (
      <div className="space-y-2 text-sm">
        {data.reportType && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Tipo:</span>
            <Badge variant="outline" className="text-xs">{data.reportType}</Badge>
          </div>
        )}
        {data.period && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Período:</span>
            <span className="text-foreground">{data.period}</span>
          </div>
        )}
        {data.totalPages && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Páginas:</span>
            <span className="text-foreground">{data.totalPages}</span>
          </div>
        )}
        {data.downloadUrl && (
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-500" />
            <span className="font-medium">Download:</span>
            <a 
              href={data.downloadUrl} 
              className="text-blue-500 hover:text-blue-700 text-xs underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Clique para baixar
            </a>
          </div>
        )}
      </div>
    );
  }

  // Default: show other data in a clean format (excluding timestamps)
  return (
    <div className="space-y-1 text-xs">
      {Object.entries(data)
        .filter(([key]) => !['timestamp', 'created_at', 'updated_at'].includes(key))
        .map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <span className="font-medium text-muted-foreground capitalize">
              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
            </span>
            <span className="text-foreground">
              {Array.isArray(value) ? value.join(', ') : String(value)}
            </span>
          </div>
        ))}
    </div>
  );
}; 