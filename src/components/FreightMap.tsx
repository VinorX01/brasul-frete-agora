import React, { useEffect, useRef, useState } from 'react';
import { type Freight } from "@/lib/supabase";
import { supabase } from '@/lib/supabase';
import { Locate } from "lucide-react";

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
    if (!isLoaded || !mapRef.current) return;

    try {
      // Initialize map centered on Brazil
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 4,
        center: { lat: -14.235, lng: -51.9253 }, // Center of Brazil
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        streetViewControl: false, // Disable Street View control
        fullscreenControl: false, // Optional: also disable fullscreen for cleaner UI
      });
      
      console.log('Map initialized successfully');
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Erro ao inicializar o mapa');
    }
  }, [isLoaded]);

  // Update markers when freights change - Fixed dependency array
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !freights.length) return;

    console.log(`Processing ${freights.length} freights for map markers`);

    // Clear existing markers first
    markersRef.current.forEach(marker => {
      if (marker.setMap) {
        marker.setMap(null);
      }
    });
    markersRef.current = [];

    // Reset any previous errors when processing new freights
    setError(null);

    // Get unique origins to avoid duplicate markers
    const uniqueOrigins = [...new Set(freights.map(freight => freight.origin))];
    console.log('Unique origins:', uniqueOrigins);
    
    // Fetch coordinates using our Edge Function
    const fetchCoordinatesAndAddMarkers = async () => {
      try {
        console.log('Fetching coordinates for cities:', uniqueOrigins);
        
        const { data, error: funcError } = await supabase.functions.invoke('get-municipality-coordinates', {
          body: { cities: uniqueOrigins }
        });

        if (funcError) {
          console.error('Error fetching coordinates:', funcError);
          setError('Erro ao buscar coordenadas das cidades');
          return;
        }

        const municipalities = data?.municipalities || [];
        console.log(`Received ${municipalities.length} municipalities with coordinates:`, municipalities);

        if (municipalities.length === 0) {
          console.warn('Nenhuma coordenada válida encontrada para as cidades');
          setError('Nenhuma coordenada encontrada para as cidades dos fretes');
          return;
        }

        // Clear any previous error when we have valid data
        setError(null);

        // Create markers for each municipality
        municipalities.forEach((municipality: any) => {
          const lat = parseFloat(municipality.lat);
          const lng = parseFloat(municipality.lng);

          console.log(`Processing municipality: ${municipality.name}, ${municipality.state} - Coords: ${lat}, ${lng}`);

          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`Invalid coordinates for ${municipality.name}: lat=${lat}, lng=${lng}`);
            return;
          }

          // Count freights from this origin
          const matchingFreights = freights.filter(freight => {
            const freightOrigin = freight.origin.includes(',') 
              ? freight.origin.split(',')[0].trim() 
              : freight.origin;
            const cityMatch = freightOrigin.toLowerCase() === municipality.name.toLowerCase();
            return cityMatch;
          });

          console.log(`Found ${matchingFreights.length} freights for ${municipality.name}`);

          if (matchingFreights.length === 0) return;

          try {
            // Create a marker using the standard Marker class
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstanceRef.current,
              title: `${municipality.name}, ${municipality.state} (${matchingFreights.length} frete${matchingFreights.length > 1 ? 's' : ''})`,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#3B82F6',
                fillOpacity: 0.9,
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
                <div style="padding: 8px; min-width: 200px;">
                  <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #1E40AF;">${municipality.name}, ${municipality.state}</h4>
                  <p style="margin: 0; color: #666; font-size: 14px;">${matchingFreights.length} frete${matchingFreights.length > 1 ? 's' : ''} disponível${matchingFreights.length > 1 ? 'is' : ''}</p>
                  <div style="margin-top: 8px; font-size: 12px; color: #888;">
                    Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}
                  </div>
                </div>
              `
            });

            marker.addListener('click', () => {
              // Close any open info windows
              markersRef.current.forEach(m => {
                if (m.infoWindow) {
                  m.infoWindow.close();
                }
              });
              
              infoWindow.open(mapInstanceRef.current, marker);
            });

            // Store reference with info window for cleanup
            marker.infoWindow = infoWindow;
            markersRef.current.push(marker);
            
            console.log(`Successfully created marker for ${municipality.name} at ${lat}, ${lng}`);
          } catch (markerError) {
            console.error('Error creating marker for', municipality.name, ':', markerError);
          }
        });

        console.log(`Successfully created ${markersRef.current.length} markers`);

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
          
          // Ensure minimum and maximum zoom levels
          const listener = window.google.maps.event.addListener(mapInstanceRef.current, 'idle', () => {
            const currentZoom = mapInstanceRef.current.getZoom();
            if (currentZoom > 8) {
              mapInstanceRef.current.setZoom(8);
            } else if (currentZoom < 4) {
              mapInstanceRef.current.setZoom(4);
            }
            window.google.maps.event.removeListener(listener);
          });
        } else {
          console.warn('No markers were created');
        }

      } catch (error) {
        console.error('Error creating map markers:', error);
        setError('Erro ao criar marcadores no mapa');
      }
    };

    fetchCoordinatesAndAddMarkers();
  }, [isLoaded, freights]); // Removed 'error' from dependencies to allow updates after errors

  // Function to get user location and center map
  const centerOnUserLocation = () => {
    if (!mapInstanceRef.current) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          mapInstanceRef.current.setCenter(userLocation);
          mapInstanceRef.current.setZoom(10);
          
          // Add a marker at user's location
          new window.google.maps.Marker({
            position: userLocation,
            map: mapInstanceRef.current,
            title: 'Sua localização',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
          setError('Não foi possível obter sua localização');
        }
      );
    } else {
      setError('Geolocalização não é suportada pelo seu navegador');
    }
  };

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
          <p className="text-gray-600 text-sm">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              window.location.reload();
            }} 
            className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200 relative">
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Custom location button */}
      {isLoaded && (
        <button
          onClick={centerOnUserLocation}
          className="absolute top-2 right-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-md p-2 shadow-sm transition-colors"
          title="Centralizar na minha localização"
        >
          <Locate size={16} className="text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default FreightMap;
