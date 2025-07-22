import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

/// <reference types="@types/google.maps" />

interface GoogleMapProps {
  height?: string;
  className?: string;
}

export const GoogleMap = ({ height = "400px", className = "" }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Coordenadas de Chipindo, Angola
  const chipindoLocation = { lat: -15.1167, lng: 12.9167 };

  const initializeMap = async (googleApiKey: string) => {
    if (!mapRef.current || !googleApiKey.trim()) return;

    setIsLoading(true);
    
    try {
      const loader = new Loader({
        apiKey: googleApiKey,
        version: 'weekly',
        libraries: ['places']
      });

      const google = await loader.load();
      
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: chipindoLocation,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      // Adicionar marcador para Chipindo
      new google.maps.Marker({
        position: chipindoLocation,
        map: mapInstance,
        title: 'Chipindo - Administração Municipal',
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#DC2626"/>
              <circle cx="20" cy="20" r="15" fill="#FFFFFF"/>
              <circle cx="20" cy="20" r="8" fill="#DC2626"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40),
        }
      });

      // InfoWindow com informações sobre Chipindo
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 300px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">Administração Municipal de Chipindo</h3>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">📍 Rua Principal, nº 123, Chipindo</p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">📞 +244 923 456 789</p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">✉️ geral@chipindo.gov.ao</p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">🕐 Segunda a Sexta: 08:00 - 16:00</p>
          </div>
        `
      });

      // Mostrar InfoWindow ao clicar no marcador
      const marker = new google.maps.Marker({
        position: chipindoLocation,
        map: mapInstance,
        title: 'Chipindo - Administração Municipal',
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
      });

      // Abrir InfoWindow por padrão
      infoWindow.open(mapInstance, marker);

      setMap(mapInstance);
      setShowApiKeyInput(false);
      
      // Salvar a API key no localStorage
      localStorage.setItem('google_maps_api_key', googleApiKey);
      
    } catch (error) {
      console.error('Erro ao carregar o Google Maps:', error);
      alert('Erro ao carregar o mapa. Verifique se a API key está correta.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Verificar se já existe uma API key salva
    const savedApiKey = localStorage.getItem('google_maps_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      initializeMap(savedApiKey);
    }
  }, []);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      initializeMap(apiKey);
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('google_maps_api_key');
    setApiKey('');
    setShowApiKeyInput(true);
    setMap(null);
  };

  if (showApiKeyInput) {
    return (
      <div className={`${className} border rounded-lg p-6 bg-muted/50`} style={{ height }}>
        <div className="h-full flex flex-col items-center justify-center space-y-4">
          <div className="text-center mb-4">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">API Key do Google Maps necessária</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Para visualizar o mapa de Chipindo, insira sua API key do Google Maps
            </p>
            <a 
              href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              Como obter uma API key →
            </a>
          </div>
          
          <form onSubmit={handleApiKeySubmit} className="w-full max-w-md space-y-3">
            <div>
              <Label htmlFor="apiKey">Google Maps API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Cole sua API key aqui..."
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
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {map && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearApiKey}
          className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm"
        >
          Alterar API Key
        </Button>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Carregando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
};