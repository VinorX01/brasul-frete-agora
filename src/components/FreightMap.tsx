
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

  // Initialize Google Maps
  useEffect(() => {
    if (window.google) {
      setIsLoaded(true);
      return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBdVl-cGnaq0C3-pyFleYfIFgJCu4fKiXM&callback=initFreightMap`;
    script.async = true;
    script.defer = true;

    window.initFreightMap = () => {
      setIsLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window.initFreightMap;
    };
  }, []);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    // Initialize map centered on Brazil
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 4,
      center: { lat: -14.235, lng: -51.9253 }, // Center of Brazil
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    });
  }, [isLoaded]);

  // Update markers when freights change
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !freights.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Get unique origins to avoid duplicate markers
    const uniqueOrigins = [...new Set(freights.map(freight => freight.origin))];
    
    // Fetch coordinates for origins
    const fetchCoordinatesAndAddMarkers = async () => {
      try {
        const { data: municipalities, error } = await supabase
          .from('municipalities')
          .select('name, state, lat, lng')
          .in('name', uniqueOrigins.map(origin => {
            // Extract city name (before comma if present)
            return origin.includes(',') ? origin.split(',')[0].trim() : origin;
          }));

        if (error) {
          console.error('Error fetching municipalities:', error);
          return;
        }

        if (!municipalities || municipalities.length === 0) return;

        // Create markers for each municipality
        municipalities.forEach(municipality => {
          if (!municipality.lat || !municipality.lng) return;

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

          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current,
            title: `${municipality.name}, ${municipality.state} (${matchingFreights.length} frete${matchingFreights.length > 1 ? 's' : ''})`,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#3B82F6', // Blue color
              fillOpacity: 0.8,
              strokeColor: '#1E40AF',
              strokeWeight: 2,
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
        });

        // Adjust map bounds to show all markers
        if (markersRef.current.length > 0) {
          const bounds = new window.google.maps.LatLngBounds();
          markersRef.current.forEach(marker => {
            bounds.extend(marker.getPosition());
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
      }
    };

    fetchCoordinatesAndAddMarkers();
  }, [isLoaded, freights]);

  if (!isLoaded) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Carregando mapa...</p>
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
