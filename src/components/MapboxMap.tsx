import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Layers, Mountain, Map as MapIcon } from 'lucide-react';
import { useMunicipalityLocations } from '@/hooks/useMunicipalityLocations';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface MapboxMapProps {
  height?: string;
  className?: string;
}

export const MapboxMap = ({ height = "400px", className = "" }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStyle, setCurrentStyle] = useState<string>('streets');
  const [is3D, setIs3D] = useState<boolean>(false);
  const { locations } = useMunicipalityLocations();
  const { settings } = useSiteSettings();
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Função para obter coordenadas do centro baseado nas localizações cadastradas
  const getMapCenter = (): [number, number] => {
    if (locations.length === 0) {
      return [12.9167, -15.1167]; // Default Chipindo coordinates
    }
    
    // Use a primeira localização como centro, ou calcule a média se múltiplas localizações
    if (locations.length === 1) {
      return [Number(locations[0].longitude), Number(locations[0].latitude)];
    }
    
    // Calcule coordenadas médias para múltiplas localizações
    const avgLng = locations.reduce((sum, loc) => sum + Number(loc.longitude), 0) / locations.length;
    const avgLat = locations.reduce((sum, loc) => sum + Number(loc.latitude), 0) / locations.length;
    return [avgLng, avgLat];
  };

  const chipindoLocation = getMapCenter();

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  const addLocationMarkers = () => {
    if (!map.current) return;

    clearMarkers();

    // Adicionar marcadores das localizações cadastradas
    locations.forEach((location) => {
      const el = document.createElement('div');
      el.className = 'location-marker';
      el.style.cssText = `
        background-color: #dc2626;
        color: white;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        cursor: pointer;
      `;
      
      // Ícone baseado no tipo de localização
      const getLocationIcon = (type: string) => {
        switch (type) {
          case 'office': return '🏛️';
          case 'school': return '🏫';
          case 'hospital': return '🏥';
          case 'park': return '🌳';
          case 'market': return '🏪';
          case 'cultural': return '🎭';
          case 'sports': return '⚽';
          default: return '📍';
        }
      };

      el.innerHTML = getLocationIcon(location.type);

      // Criar popup para a localização
      const popupContent = `
        <div style="max-width: 280px; font-family: system-ui;">
          <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
            ${getLocationIcon(location.type)} ${location.name}
          </h3>
          ${location.description ? `
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
              ${location.description}
            </p>
          ` : ''}
          <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb;">
            <p style="margin: 3px 0; color: #6b7280; font-size: 14px;">
              🌍 <strong>Coordenadas:</strong> ${location.latitude}°S, ${location.longitude}°E
            </p>
          </div>
          <div style="margin-bottom: 10px;">
            ${location.address ? `
              <p style="margin: 3px 0; color: #374151; font-size: 14px;">
                📍 ${location.address}
              </p>
            ` : ''}
            ${location.phone ? `
              <p style="margin: 3px 0; color: #374151; font-size: 14px;">
                📞 ${location.phone}
              </p>
            ` : ''}
            ${location.email ? `
              <p style="margin: 3px 0; color: #374151; font-size: 14px;">
                📧 ${location.email}
              </p>
            ` : ''}
          </div>
          ${location.opening_hours ? `
            <div style="background: #f3f4f6; padding: 8px; border-radius: 6px; margin-top: 10px;">
              <p style="margin: 0; color: #6b7280; font-size: 13px;">
                🕐 <strong>Horário de Funcionamento:</strong><br>
                ${location.opening_hours}
              </p>
            </div>
          ` : ''}
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  };

  const mapStyles = {
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    terrain: 'mapbox://styles/mapbox/outdoors-v12'
  };

  const initializeMap = async (mapboxApiKey: string) => {
    if (!mapContainer.current || !mapboxApiKey.trim()) return;

    setIsLoading(true);
    
    try {
      mapboxgl.accessToken = mapboxApiKey;
      
      // Calcular centro baseado nas localizações disponíveis
      const mapCenter = getMapCenter();
      const mapZoom = locations.length > 1 ? 10 : 12;
      
      console.log('Initializing map with center:', mapCenter, 'and zoom:', mapZoom);
      console.log('Available locations:', locations);
      
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyles.streets,
        center: mapCenter,
        zoom: mapZoom,
        pitch: 0,
        bearing: 0,
        antialias: true
      });

      // Aguardar o mapa carregar
      mapInstance.on('load', () => {
        // Adicionar controles de navegação
        mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Adicionar controle de tela cheia
        mapInstance.addControl(new mapboxgl.FullscreenControl(), 'top-right');
        
        // Adicionar controle de localização
        mapInstance.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
          }),
          'top-right'
        );

        // Adicionar marcador customizado para Chipindo
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.cssText = `
          background-color: #dc2626;
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
          border: 4px solid white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          cursor: pointer;
        `;
        el.innerHTML = '🏛️';

        // Criar popup usando dados reais das configurações
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="max-width: 280px; font-family: system-ui;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
              🏛️ Administração Municipal de Chipindo
            </h3>
            <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb;">
              <p style="margin: 3px 0; color: #6b7280; font-size: 14px;">
                📍 <strong>Localização:</strong> Chipindo, Huíla, Angola
              </p>
              <p style="margin: 3px 0; color: #6b7280; font-size: 14px;">
                🌍 <strong>Coordenadas:</strong> ${chipindoLocation[1]}°S, ${chipindoLocation[0]}°E
              </p>
            </div>
            <div style="margin-bottom: 10px;">
              <p style="margin: 3px 0; color: #374151; font-size: 14px;">
                📧 ${settings?.contact_email || 'geral@chipindo.gov.ao'}
              </p>
              <p style="margin: 3px 0; color: #374151; font-size: 14px;">
                📞 ${settings?.contact_phone || '+244 926 123 456'}
              </p>
              <p style="margin: 3px 0; color: #374151; font-size: 14px;">
                📍 ${settings?.contact_address || 'Administração Municipal de Chipindo, Chipindo, Província de Huíla, Angola'}
              </p>
            </div>
            <div style="background: #f3f4f6; padding: 8px; border-radius: 6px; margin-top: 10px;">
              <p style="margin: 0; color: #6b7280; font-size: 13px;">
                🕐 <strong>Horário de Funcionamento:</strong><br>
                ${settings?.opening_hours_weekdays || 'Segunda a Sexta: 08:00 - 16:00'}<br>
                ${settings?.opening_hours_saturday || 'Sábado: 08:00 - 12:00'}
              </p>
            </div>
          </div>
        `);

        // Adicionar marcador ao mapa
        new mapboxgl.Marker(el)
          .setLngLat(chipindoLocation)
          .setPopup(popup)
          .addTo(mapInstance);

        // Adicionar marcadores das localizações quando o mapa carregar
        addLocationMarkers();

        setIsLoading(false);
      });

      map.current = mapInstance;
      setShowApiKeyInput(false);
      
      // Salvar a API key no localStorage
      localStorage.setItem('mapbox_api_key', mapboxApiKey);
      
    } catch (error) {
      console.error('Erro ao carregar o Mapbox:', error);
      alert('Erro ao carregar o mapa. Verifique se a API key está correta.');
      setIsLoading(false);
    }
  };

  const changeMapStyle = (style: string) => {
    if (!map.current) return;
    
    map.current.setStyle(mapStyles[style as keyof typeof mapStyles]);
    setCurrentStyle(style);
    
    // Re-adicionar marcadores após mudança de estilo
    map.current.once('styledata', () => {
      addLocationMarkers();
    });
  };

  const toggle3D = () => {
    if (!map.current) return;
    
    const newPitch = is3D ? 0 : 60;
    const newBearing = is3D ? 0 : -17.6;
    
    map.current.easeTo({
      pitch: newPitch,
      bearing: newBearing,
      duration: 1000
    });
    
    setIs3D(!is3D);
  };

  useEffect(() => {
    // Verificar se já existe uma API key salva
    const savedApiKey = localStorage.getItem('mapbox_api_key');
    if (savedApiKey && locations.length > 0) {
      setApiKey(savedApiKey);
      initializeMap(savedApiKey);
    }

    return () => {
      clearMarkers();
      if (map.current) {
        map.current.remove();
      }
    };
  }, [locations]); // Incluir locations como dependência

  // Re-inicializar mapa quando API key é salva e localizações estão disponíveis
  useEffect(() => {
    const savedApiKey = localStorage.getItem('mapbox_api_key');
    if (savedApiKey && !map.current && locations.length > 0 && !showApiKeyInput) {
      setApiKey(savedApiKey);
      initializeMap(savedApiKey);
    }
  }, [locations, showApiKeyInput]);

  // Atualizar marcadores quando as localizações mudarem
  useEffect(() => {
    if (map.current && locations.length > 0) {
      addLocationMarkers();
    }
  }, [locations]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      initializeMap(apiKey);
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('mapbox_api_key');
    setApiKey('');
    setShowApiKeyInput(true);
    clearMarkers();
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
  };

  if (showApiKeyInput) {
    return (
      <div className={`${className} border rounded-lg p-6 bg-muted/50`} style={{ height }}>
        <div className="h-full flex flex-col items-center justify-center space-y-4">
          <div className="text-center mb-4">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">API Key do Mapbox necessária</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Para visualizar o mapa 3D e satélite de Chipindo, insira sua API key do Mapbox
            </p>
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              Obter API key gratuita →
            </a>
          </div>
          
          <form onSubmit={handleApiKeySubmit} className="w-full max-w-md space-y-3">
            <div>
              <Label htmlFor="mapboxApiKey">Mapbox API Key (Gratuita)</Label>
              <Input
                id="mapboxApiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwi..."
                className="mt-1"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!apiKey.trim() || isLoading}
            >
              {isLoading ? 'Carregando...' : 'Carregar Mapa'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`} style={{ height }}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Controles de visualização */}
      {map.current && (
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {/* Botões de estilo do mapa */}
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 border flex gap-1">
            <Button
              variant={currentStyle === 'streets' ? 'default' : 'outline'}
              size="sm"
              onClick={() => changeMapStyle('streets')}
              className="h-8 px-2"
            >
              <MapIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={currentStyle === 'satellite' ? 'default' : 'outline'}
              size="sm"
              onClick={() => changeMapStyle('satellite')}
              className="h-8 px-2"
            >
              <Layers className="w-4 h-4" />
            </Button>
            <Button
              variant={currentStyle === 'terrain' ? 'default' : 'outline'}
              size="sm"
              onClick={() => changeMapStyle('terrain')}
              className="h-8 px-2"
            >
              <Mountain className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Botão 3D */}
          <Button
            variant={is3D ? 'default' : 'outline'}
            size="sm"
            onClick={toggle3D}
            className="bg-background/90 backdrop-blur-sm border"
          >
            {is3D ? '2D' : '3D'}
          </Button>
        </div>
      )}

      {/* Botão para alterar API key */}
      {map.current && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearApiKey}
          className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm"
        >
          Alterar API Key
        </Button>
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Carregando mapa...</p>
          </div>
        </div>
      )}

      {/* Informações sobre o mapa */}
      <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-muted-foreground border">
        Chipindo, Huíla, Angola • {currentStyle === 'streets' ? 'Ruas' : currentStyle === 'satellite' ? 'Satélite' : 'Terreno'} {is3D ? '• 3D' : ''}
      </div>
    </div>
  );
};