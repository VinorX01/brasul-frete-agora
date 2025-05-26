
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para validar e normalizar coordenadas
function normalizeCoordinate(coord: string | null): number | null {
  if (!coord) return null;
  
  try {
    // Remove espaços e substitui vírgulas por pontos
    let normalized = coord.trim().replace(',', '.');
    
    // Se tem mais de um ponto, pode estar em formato incorreto (ex: -119.291.869)
    const dotCount = (normalized.match(/\./g) || []).length;
    if (dotCount > 1) {
      // Remove pontos extras, mantendo apenas o último como separador decimal
      const parts = normalized.split('.');
      if (parts.length > 2) {
        normalized = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
      }
    }
    
    const num = parseFloat(normalized);
    
    // Se o número é muito grande, pode precisar ser dividido por 1000000
    if (Math.abs(num) > 1000) {
      return num / 1000000;
    }
    
    return isNaN(num) ? null : num;
  } catch (error) {
    console.error('Error normalizing coordinate:', coord, error);
    return null;
  }
}

// Função para validar se as coordenadas estão dentro dos limites do Brasil
function isValidBrazilianCoordinate(lat: number, lng: number): boolean {
  return lat >= -35 && lat <= 6 && lng >= -75 && lng <= -30;
}

// Função para buscar municípios com diferentes estratégias
async function searchMunicipalities(supabase: any, cityNames: string[]) {
  const results = [];
  
  for (const cityName of cityNames) {
    console.log(`Searching for city: ${cityName}`);
    
    // Estratégia 1: Busca exata (case-insensitive)
    let { data: municipalities } = await supabase
      .from('municipalities')
      .select('name, state, lat, lng')
      .ilike('name', cityName);

    if (!municipalities || municipalities.length === 0) {
      // Estratégia 2: Busca por similaridade (remove acentos e espaços extras)
      const normalizedSearch = cityName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/\s+/g, ' ')
        .trim();

      ({ data: municipalities } = await supabase
        .from('municipalities')
        .select('name, state, lat, lng')
        .ilike('name', `%${normalizedSearch}%`));
    }

    if (!municipalities || municipalities.length === 0) {
      // Estratégia 3: Busca por palavras individuais
      const words = cityName.split(/\s+/);
      if (words.length > 1) {
        const mainWord = words[0];
        ({ data: municipalities } = await supabase
          .from('municipalities')
          .select('name, state, lat, lng')
          .ilike('name', `%${mainWord}%`));
      }
    }

    if (municipalities && municipalities.length > 0) {
      for (const municipality of municipalities) {
        const lat = normalizeCoordinate(municipality.lat);
        const lng = normalizeCoordinate(municipality.lng);
        
        console.log(`Found municipality: ${municipality.name}, ${municipality.state}`);
        console.log(`Original coords: lat=${municipality.lat}, lng=${municipality.lng}`);
        console.log(`Normalized coords: lat=${lat}, lng=${lng}`);
        
        if (lat !== null && lng !== null && isValidBrazilianCoordinate(lat, lng)) {
          results.push({
            name: municipality.name,
            state: municipality.state,
            lat: lat.toString(),
            lng: lng.toString()
          });
          console.log(`Added valid municipality: ${municipality.name}, ${municipality.state} (${lat}, ${lng})`);
          break; // Pega apenas o primeiro resultado válido por cidade
        } else {
          console.log(`Invalid coordinates for ${municipality.name}: lat=${lat}, lng=${lng}`);
        }
      }
    } else {
      console.log(`No municipalities found for: ${cityName}`);
    }
  }
  
  return results;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cities } = await req.json();
    
    if (!cities || !Array.isArray(cities)) {
      return new Response(
        JSON.stringify({ error: 'Cities array is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Received cities for coordinate lookup:', cities);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract city names (before comma if present)
    const cityNames = cities.map(city => 
      city.includes(',') ? city.split(',')[0].trim() : city
    );

    console.log('Processed city names:', cityNames);

    // Search municipalities with improved strategy
    const municipalities = await searchMunicipalities(supabase, cityNames);

    console.log(`Found ${municipalities.length} valid municipalities with coordinates`);

    return new Response(
      JSON.stringify({ municipalities }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in get-municipality-coordinates:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
