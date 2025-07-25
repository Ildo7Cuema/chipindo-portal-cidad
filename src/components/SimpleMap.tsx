import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPinIcon, 
  ZoomInIcon, 
  ZoomOutIcon, 
  NavigationIcon,
  MaximizeIcon,
  BuildingIcon,
  PhoneIcon,
  ClockIcon,
  InfoIcon
} from 'lucide-react';
import { useMunicipalityLocations, type MunicipalityLocation } from '@/hooks/useMunicipalityLocations';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { cn } from '@/lib/utils';

interface SimpleMapProps {
  height?: string;
  className?: string;
}

export const SimpleMap = ({ height = "400px", className = "" }: SimpleMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<MunicipalityLocation | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const { locations } = useMunicipalityLocations();
  const { settings } = useSiteSettings();

  // Coordenadas de Chipindo como referência central
  const CHIPINDO_CENTER = { lat: -15.1167, lng: 12.9167 };
  
  // Função para converter coordenadas geográficas em coordenadas do canvas
  const coordsToCanvas = (lat: number, lng: number, canvasWidth: number, canvasHeight: number) => {
    // Calcular os limites baseado nas localizações disponíveis
    const allLats = locations.map(loc => Number(loc.latitude));
    const allLngs = locations.map(loc => Number(loc.longitude));
    
    // Adicionar coordenadas de Chipindo se não há localizações
    if (locations.length === 0) {
      allLats.push(CHIPINDO_CENTER.lat);
      allLngs.push(CHIPINDO_CENTER.lng);
    }
    
    const minLat = Math.min(...allLats) - 0.01; // Margem
    const maxLat = Math.max(...allLats) + 0.01;
    const minLng = Math.min(...allLngs) - 0.01;
    const maxLng = Math.max(...allLngs) + 0.01;
    
    // Converter para coordenadas do canvas
    const x = ((lng - minLng) / (maxLng - minLng)) * canvasWidth * zoom;
    const y = ((maxLat - lat) / (maxLat - minLat)) * canvasHeight * zoom; // Inverter Y
    
    return { x, y };
  };

  // Função para desenhar o mapa
  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    
    // Limpar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Desenhar fundo do mapa (gradiente)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#e0f2fe');
    gradient.addColorStop(1, '#f0f9ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Desenhar grid de coordenadas
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      const y = (height / 10) * i;
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
    
    // Desenhar marcador principal de Chipindo
    const chipindoCoords = coordsToCanvas(CHIPINDO_CENTER.lat, CHIPINDO_CENTER.lng, width, height);
    
    // Marcador principal (Administração)
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(chipindoCoords.x, chipindoCoords.y, 12, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Ícone da administração
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏛️', chipindoCoords.x, chipindoCoords.y);
    
    // Desenhar marcadores das localizações cadastradas
    locations.forEach((location, index) => {
      const coords = coordsToCanvas(Number(location.latitude), Number(location.longitude), width, height);
      
      // Cor baseada no tipo
      const getTypeColor = (type: string) => {
        switch (type) {
          case 'administrativo': return '#3b82f6';
          case 'saude': return '#ef4444';
          case 'educacao': return '#22c55e';
          case 'servicos': return '#f59e0b';
          case 'seguranca': return '#6b7280';
          default: return '#8b5cf6';
        }
      };
      
      const getTypeIcon = (type: string) => {
        switch (type) {
          case 'administrativo': return '🏢';
          case 'saude': return '🏥';
          case 'educacao': return '🏫';
          case 'servicos': return '🏪';
          case 'seguranca': return '👮';
          default: return '📍';
        }
      };
      
      const color = getTypeColor(location.type);
      const isSelected = selectedLocation?.id === location.id;
      
      // Marcador
      ctx.fillStyle = color;
      ctx.strokeStyle = isSelected ? '#fbbf24' : '#ffffff';
      ctx.lineWidth = isSelected ? 4 : 2;
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, isSelected ? 14 : 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Ícone
      ctx.fillStyle = '#ffffff';
      ctx.font = isSelected ? '14px Arial' : '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(getTypeIcon(location.type), coords.x, coords.y);
      
      // Pulso de seleção
      if (isSelected) {
        ctx.strokeStyle = color + '40';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, 20, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
    
    // Desenhar legenda de coordenadas
    ctx.fillStyle = '#374151';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Chipindo: ${CHIPINDO_CENTER.lat}°S, ${CHIPINDO_CENTER.lng}°E`, 10, height - 10);
  };

  // Handle canvas click para selecionar localizações
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Verificar se clique foi próximo a alguma localização
    locations.forEach((location) => {
      const coords = coordsToCanvas(Number(location.latitude), Number(location.longitude), canvas.width, canvas.height);
      const distance = Math.sqrt((clickX - coords.x) ** 2 + (clickY - coords.y) ** 2);
      
      if (distance <= 15) {
        setSelectedLocation(location);
      }
    });
  };

  // Redimensionar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        drawMap();
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Redesenhar quando dados mudarem
  useEffect(() => {
    drawMap();
  }, [locations, zoom, selectedLocation]);

  return (
    <div className={cn("relative border rounded-lg overflow-hidden bg-background", className)} style={{ height }}>
      {/* Canvas do mapa */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-pointer"
        style={{ display: 'block' }}
      />
      
      {/* Controles de zoom */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(Math.min(zoom + 0.5, 3))}
          className="w-8 h-8 p-0 bg-background/90 backdrop-blur-sm"
        >
          <ZoomInIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(Math.max(zoom - 0.5, 0.5))}
          className="w-8 h-8 p-0 bg-background/90 backdrop-blur-sm"
        >
          <ZoomOutIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(1)}
          className="w-8 h-8 p-0 bg-background/90 backdrop-blur-sm"
        >
          <MaximizeIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Toggle de informações */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowInfo(!showInfo)}
        className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm"
      >
        <InfoIcon className="w-4 h-4 mr-2" />
        {showInfo ? 'Ocultar' : 'Mostrar'} Info
      </Button>

      {/* Informações das localizações */}
      {showInfo && (
        <div className="absolute bottom-4 left-4 right-4">
          {selectedLocation ? (
            <Card className="bg-background/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPinIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{selectedLocation.name}</h4>
                      <Badge variant="outline" className="text-xs mt-1">
                        {selectedLocation.type}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLocation(null)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  {selectedLocation.address && (
                    <p>{selectedLocation.address}</p>
                  )}
                  <div className="flex items-center gap-1 font-mono">
                    <NavigationIcon className="w-3 h-3" />
                    <span>{Number(selectedLocation.latitude).toFixed(4)}°S, {Number(selectedLocation.longitude).toFixed(4)}°E</span>
                  </div>
                  {selectedLocation.phone && (
                    <div className="flex items-center gap-1">
                      <PhoneIcon className="w-3 h-3" />
                      <span>{selectedLocation.phone}</span>
                    </div>
                  )}
                  {selectedLocation.opening_hours && (
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      <span>{selectedLocation.opening_hours}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-background/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BuildingIcon className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-sm">Administração Municipal de Chipindo</h4>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>{settings?.contact_address || 'Rua Principal, Bairro Central, Chipindo'}</p>
                  <div className="flex items-center gap-1 font-mono">
                    <NavigationIcon className="w-3 h-3" />
                    <span>{CHIPINDO_CENTER.lat}°S, {CHIPINDO_CENTER.lng}°E</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span>{locations.length} localização{locations.length !== 1 ? 'ões' : ''} cadastrada{locations.length !== 1 ? 's' : ''}</span>
                    <span>Zoom: {zoom}x</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Legenda de tipos */}
      <div className="absolute top-16 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 text-xs">
        <h5 className="font-semibold mb-2">Legenda</h5>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white text-xs">🏛️</div>
            <span>Administração</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">🏢</div>
            <span>Administrativo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">🏥</div>
            <span>Saúde</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">🏫</div>
            <span>Educação</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs">🏪</div>
            <span>Serviços</span>
          </div>
        </div>
      </div>

      {/* Status do mapa */}
      <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-muted-foreground">
        Chipindo, Huíla • Coordenadas GPS
      </div>
    </div>
  );
}; 