
import React, { useEffect, useRef, useState } from 'react';
import { type Freight } from "@/lib/supabase";
import { supabase } from '@/lib/supabase';

interface FreightMapProps {
  freights: Freight[];
}

declare global {
  interface Window {
    google: any;
    initFreightMap: () => void;
  }
}

const FreightMap: React.FC<FreightMapProps> = ({ freights }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapApiKey, setMapApiKey] = useState<string | null>(null);

  // Fetch Google Maps API key from our edge function
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-maps-api-key');
        
        if (error) {
          console.error('Error fetching Maps API key:', error);
          setError('Erro ao carregar configuração do mapa');
          setIsLoading(false);
          return;
        }
        
        if (data?.apiKey) {
          setMapApiKey(data.apiKey);
        } else {
          setError('Chave da API não configurada');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching API key:', err);
        setError('Erro ao carregar configuração do mapa');
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  // Initialize Google Maps when API key is available
  useEffect(() => {
    if (!mapApiKey) return;

    if (window.google) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    // Load Google Maps API with the secure key
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapApiKey}&libraries=marker&loading=async&callback=initFreightMap`;
    script.async = true;
    script.defer = true;

    window.initFreightMap = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };

    script.onerror = () => {
      setError('Erro ao carregar Google Maps API');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window.initFreightMap;
    };
  }, [mapApiKey]);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || error) return;

    try {
      // Initialize map centered on Brazil
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 4,
        center: { lat: -14.235, lng: -51.9253 }, // Center of Brazil
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapId: 'FREIGHT_MAP', // Required for AdvancedMarkerElement
      });
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Erro ao inicializar o mapa');
    }
  }, [isLoaded, error]);

  // Update markers when freights change
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !freights.length || error) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker.map) {
        marker.map = null;
      }
    });
    markersRef.current = [];

    // Get unique origins to avoid duplicate markers
    const uniqueOrigins = [...new Set(freights.map(freight => freight.origin))];
    
    // Fetch coordinates using our Edge Function
    const fetchCoordinatesAndAddMarkers = async () => {
      try {
        const { data, error: funcError } = await supabase.functions.invoke('get-municipality-coordinates', {
          body: { cities: uniqueOrigins }
        });

        if (funcError) {
          console.error('Error fetching coordinates:', funcError);
          setError('Erro ao buscar coordenadas das cidades');
          return;
        }

        const municipalities = data?.municipalities || [];

        if (municipalities.length === 0) {
          setError('Nenhuma coordenada encontrada para as cidades');
          return;
        }

        // Create markers for each municipality
        municipalities.forEach((municipality: any) => {
          const lat = parseFloat(municipality.lat);
          const lng = parseFloat(municipality.lng);

          if (isNaN(lat) || isNaN(lng)) return;

          // Count freights from this origin
          const matchingFreights = freights.filter(freight => {
            const freightOrigin = freight.origin.includes(',') 
              ? freight.origin.split(',')[0].trim() 
              : freight.origin;
            return freightOrigin.toLowerCase() === municipality.name.toLowerCase();
          });

          if (matchingFreights.length === 0) return;

          try {
            // Create a simple marker using the standard Marker class
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstanceRef.current,
              title: `${municipality.name}, ${municipality.state} (${matchingFreights.length} frete${matchingFreights.length > 1 ? 's' : ''})`,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#3B82F6',
                fillOpacity: 0.8,
                strokeColor: '#1E40AF',
                strokeWeight: 2,
              },
              label: {
                text: matchingFreights.length.toString(),
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }
            });

            // Add info window
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h4 style="margin: 0 0 8px 0; font-weight: bold;">${municipality.name}, ${municipality.state}</h4>
                  <p style="margin: 0; color: #666;">${matchingFreights.length} frete${matchingFreights.length > 1 ? 's' : ''} disponível${matchingFreights.length > 1 ? 'is' : ''}</p>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstanceRef.current, marker);
            });

            markersRef.current.push(marker);
          } catch (markerError) {
            console.error('Error creating marker:', markerError);
          }
        });

        // Adjust map bounds to show all markers
        if (markersRef.current.length > 0) {
          const bounds = new window.google.maps.LatLngBounds();
          markersRef.current.forEach(marker => {
            const position = marker.getPosition();
            if (position) {
              bounds.extend(position);
            }
          });
          mapInstanceRef.current.fitBounds(bounds);
          
          // Ensure minimum zoom level
          const listener = window.google.maps.event.addListener(mapInstanceRef.current, 'idle', () => {
            if (mapInstanceRef.current.getZoom() > 6) {
              mapInstanceRef.current.setZoom(6);
            }
            window.google.maps.event.removeListener(listener);
          });
        }

      } catch (error) {
        console.error('Error creating map markers:', error);
        setError('Erro ao criar marcadores no mapa');
      }
    };

    fetchCoordinatesAndAddMarkers();
  }, [isLoaded, freights, error]);

  if (isLoading) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-blue-600 hover:text-blue-800 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
};

export default FreightMap;
