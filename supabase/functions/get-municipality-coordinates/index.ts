
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract city names (before comma if present)
    const cityNames = cities.map(city => 
      city.includes(',') ? city.split(',')[0].trim() : city
    );

    // Fetch coordinates from database
    const { data: municipalities, error } = await supabase
      .from('municipalities')
      .select('name, state, lat, lng')
      .in('name', cityNames);

    if (error) {
      console.error('Error fetching municipalities:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch coordinates' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Filter out municipalities without coordinates
    const validMunicipalities = municipalities?.filter(m => m.lat && m.lng) || [];

    return new Response(
      JSON.stringify({ municipalities: validMunicipalities }),
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
