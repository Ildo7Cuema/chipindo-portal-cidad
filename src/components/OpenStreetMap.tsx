import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface OpenStreetMapProps {
  height?: string;
  className?: string;
}

export const OpenStreetMap = ({ height = "400px", className = "" }: OpenStreetMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Coordenadas exatas de Chipindo, Huíla, Angola
    const chipindoCoords: [number, number] = [-15.1167, 12.9167];

    // Inicializar o mapa
    const map = L.map(mapRef.current).setView(chipindoCoords, 12);

    // Adicionar camada do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Criar ícone personalizado para Chipindo
    const chipindoIcon = L.divIcon({
      html: `
        <div style="
          background-color: #dc2626;
          color: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        ">
          C
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    // Adicionar marcador para Chipindo
    const marker = L.marker(chipindoCoords, { icon: chipindoIcon }).addTo(map);

    // Popup com informações sobre Chipindo
    marker.bindPopup(`
      <div style="max-width: 250px; font-family: system-ui;">
        <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
          🏛️ Administração Municipal de Chipindo
        </h3>
        <div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
          <p style="margin: 2px 0; color: #6b7280; font-size: 13px;">
            📍 <strong>Localização:</strong> Chipindo, Huíla, Angola
          </p>
          <p style="margin: 2px 0; color: #6b7280; font-size: 13px;">
            🌍 <strong>Coordenadas:</strong> ${chipindoCoords[0]}°, ${chipindoCoords[1]}°
          </p>
        </div>
        <div style="margin-bottom: 8px;">
          <p style="margin: 2px 0; color: #374151; font-size: 13px;">
            📧 geral@chipindo.gov.ao
          </p>
          <p style="margin: 2px 0; color: #374151; font-size: 13px;">
            📞 +244 923 456 789
          </p>
        </div>
        <div style="background: #f3f4f6; padding: 6px; border-radius: 4px; margin-top: 8px;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            🕐 <strong>Horário:</strong><br>
            Segunda a Sexta: 08:00 - 16:00
          </p>
        </div>
      </div>
    `).openPopup();

    // Adicionar controles de zoom
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    // Adicionar escala
    L.control.scale({
      position: 'bottomleft',
      imperial: false
    }).addTo(map);

    // Destacar a área do município com um círculo
    L.circle(chipindoCoords, {
      color: '#dc2626',
      fillColor: '#dc2626',
      fillOpacity: 0.1,
      radius: 5000, // 5km de raio
      weight: 2,
      dashArray: '5, 5'
    }).addTo(map).bindTooltip('Área Municipal de Chipindo', {
      permanent: false,
      direction: 'top'
    });

    // Adicionar marcadores para pontos de referência próximos
    const landmarks = [
      { coords: [-15.12, 12.92] as [number, number], name: 'Hospital Municipal', icon: '🏥' },
      { coords: [-15.115, 12.915] as [number, number], name: 'Mercado Central', icon: '🏪' },
      { coords: [-15.118, 12.918] as [number, number], name: 'Escola Primária', icon: '🏫' },
    ];

    landmarks.forEach(landmark => {
      const landmarkIcon = L.divIcon({
        html: `
          <div style="
            background-color: white;
            color: #374151;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            border: 2px solid #dc2626;
            box-shadow: 0 1px 5px rgba(0,0,0,0.2);
          ">
            ${landmark.icon}
          </div>
        `,
        className: 'landmark-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker(landmark.coords, { icon: landmarkIcon })
        .addTo(map)
        .bindTooltip(landmark.name, { direction: 'top' });
    });

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`${className} relative overflow-hidden rounded-lg border`} style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Informações sobre o mapa */}
      <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-muted-foreground border">
        Chipindo, Huíla, Angola
      </div>
      
      {/* Legenda */}
      <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded p-2 text-xs border">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
          <span>Sede Municipal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border border-red-600 rounded-full bg-red-600/10"></div>
          <span>Área Municipal</span>
        </div>
      </div>
    </div>
  );
};