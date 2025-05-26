
import { supabase, type Freight } from './supabase';
import { toast } from '@/components/ui/use-toast';

// Get filtered freights with pagination
export const getFilteredFreights = async (
  origin?: string,
  destination?: string,
  cargoType?: string,
  truckType?: string,
  minValue?: number,
  maxValue?: number,
  minWeight?: number,
  maxWeight?: number,
  refrigerated?: boolean,
  requiresMopp?: boolean,
  tollIncluded?: boolean,
  originState?: string, // New parameter for state filtering
  limit: number = 50,
  page: number = 0
): Promise<Freight[]> => {
  // First, run the cleanup function to remove old freights
  await cleanupOldFreights();
  
  let query = supabase
    .from('freights')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply filters if provided
  if (origin && origin !== 'all') {
    query = query.ilike('origin', `%${origin}%`);
  }
  
  if (destination && destination !== 'all') {
    query = query.ilike('destination', `%${destination}%`);
  }
  
  // Filter by state if provided
  if (originState && originState !== 'all') {
    query = query.ilike('origin', `%, ${originState}`);
  }
  
  if (cargoType && cargoType !== 'all') {
    query = query.eq('cargo_type', cargoType);
  }
  
  if (truckType && truckType !== 'all') {
    query = query.eq('truck_type', truckType);
  }
  
  if (minValue !== undefined) {
    query = query.gte('value', minValue);
  }
  
  if (maxValue !== undefined) {
    query = query.lte('value', maxValue);
  }
  
  // Add new filters
  if (minWeight !== undefined) {
    query = query.gte('weight', minWeight);
  }
  
  if (maxWeight !== undefined) {
    query = query.lte('weight', maxWeight);
  }
  
  if (refrigerated !== undefined) {
    query = query.eq('refrigerated', refrigerated);
  }
  
  if (requiresMopp !== undefined) {
    query = query.eq('requires_mopp', requiresMopp);
  }
  
  if (tollIncluded !== undefined) {
    query = query.eq('toll_included', tollIncluded);
  }
  
  // Add pagination
  if (limit > 0) {
    query = query.range(page * limit, (page * limit) + limit - 1);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching freights:', error);
    toast({
      title: "Erro ao buscar fretes",
      description: "Ocorreu um erro ao buscar os fretes. Tente novamente.",
      variant: "destructive",
    });
    return [];
  }
  
  return data as Freight[];
};

// Get freight count
export const getFreightCount = async (
  origin?: string,
  destination?: string,
  cargoType?: string,
  truckType?: string,
  minValue?: number,
  maxValue?: number,
  minWeight?: number,
  maxWeight?: number,
  refrigerated?: boolean,
  requiresMopp?: boolean,
  tollIncluded?: boolean,
  originState?: string // New parameter for state filtering
): Promise<number> => {
  let query = supabase
    .from('freights')
    .select('*', { count: 'exact', head: true });
  
  // Apply the same filters as getFilteredFreights for consistent counting
  if (origin && origin !== 'all') {
    query = query.ilike('origin', `%${origin}%`);
  }
  
  if (destination && destination !== 'all') {
    query = query.ilike('destination', `%${destination}%`);
  }
  
  // Filter by state if provided
  if (originState && originState !== 'all') {
    query = query.ilike('origin', `%, ${originState}`);
  }
  
  if (cargoType && cargoType !== 'all') {
    query = query.eq('cargo_type', cargoType);
  }
  
  if (truckType && truckType !== 'all') {
    query = query.eq('truck_type', truckType);
  }
  
  if (minValue !== undefined) {
    query = query.gte('value', minValue);
  }
  
  if (maxValue !== undefined) {
    query = query.lte('value', maxValue);
  }
  
  if (minWeight !== undefined) {
    query = query.gte('weight', minWeight);
  }
  
  if (maxWeight !== undefined) {
    query = query.lte('weight', maxWeight);
  }
  
  if (refrigerated !== undefined) {
    query = query.eq('refrigerated', refrigerated);
  }
  
  if (requiresMopp !== undefined) {
    query = query.eq('requires_mopp', requiresMopp);
  }
  
  if (tollIncluded !== undefined) {
    query = query.eq('toll_included', tollIncluded);
  }
  
  const { count, error } = await query;
  
  if (error) {
    console.error('Error counting freights:', error);
    return 0;
  }
  
  return count || 0;
};

// Clean up old freights
export const cleanupOldFreights = async (): Promise<void> => {
  const { error } = await supabase.rpc('cleanup_old_freights');
  
  if (error) {
    console.error('Error cleaning up old freights:', error);
  } else {
    console.log('Successfully cleaned up old freights');
  }
};

// Find a freight by ID
export const findFreightById = async (id: string): Promise<Freight | null> => {
  const { data, error } = await supabase
    .from('freights')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching freight:', error);
    return null;
  }
  
  return data as Freight;
};

// Create a new freight
export const createFreight = async (
  freight: Omit<Freight, 'id' | 'created_at' | 'updated_at' | 'status' | 'date'>
): Promise<Freight | null> => {
  try {
    console.log('Creating freight with data:', freight);
    
    // Set current date for the freight
    const currentDate = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('freights')
      .insert({
        ...freight,
        status: 'available',
        date: currentDate,
      })
      .select();
      
    if (error) {
      console.error('Error creating freight (Supabase error):', error);
      toast({
        title: "Erro ao publicar frete",
        description: `Ocorreu um erro ao publicar o frete: ${error.message}. Código: ${error.code}`,
        variant: "destructive",
      });
      return null;
    }
    
    if (!data || data.length === 0) {
      console.error('No data returned after freight creation');
      toast({
        title: "Erro ao publicar frete",
        description: "Ocorreu um erro ao publicar o frete. Nenhum dado foi retornado.",
        variant: "destructive",
      });
      return null;
    }
    
    console.log('Freight created successfully:', data[0]);
    toast({
      title: "Frete publicado com sucesso!",
      description: "Seu frete já está disponível para os caminhoneiros e agenciadores.",
    });
    
    return data[0] as Freight;
  } catch (e) {
    console.error('Unexpected error creating freight:', e);
    toast({
      title: "Erro ao publicar frete",
      description: "Ocorreu um erro inesperado ao publicar o frete. Tente novamente.",
      variant: "destructive",
    });
    return null;
  }
};

// Record a freight agent referral
export const recordFreightAgentReferral = async (freightId: string, agentCode: string): Promise<boolean> => {
  const { error } = await supabase.rpc('record_freight_agent_referral', {
    _freight_id: freightId,
    _agent_code: agentCode
  });
  
  if (error) {
    console.error('Error recording freight agent referral:', error);
    return false;
  }
  
  return true;
};

// Get municipalities
export const getMunicipalities = async (search?: string, limit: number = 10): Promise<{name: string, state: string}[]> => {
  let query = supabase
    .from('municipalities')
    .select('name, state');
  
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  
  const { data, error } = await query.limit(limit);
  
  if (error) {
    console.error('Error fetching municipalities:', error);
    return [];
  }
  
  return data as {name: string, state: string}[];
};

// Get unique values for different freight attributes
export const getUniqueOrigins = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('freights')
    .select('origin');
    
  if (error || !data) {
    return [];
  }
  
  const uniqueOrigins = [...new Set(data.map(item => item.origin))].sort();
  return uniqueOrigins;
};

export const getUniqueDestinations = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('freights')
    .select('destination');
    
  if (error || !data) {
    return [];
  }
  
  const uniqueDestinations = [...new Set(data.map(item => item.destination))].sort();
  return uniqueDestinations;
};

export const getUniqueCargoTypes = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('freights')
    .select('cargo_type');
    
  if (error || !data) {
    return [];
  }
  
  const uniqueCargoTypes = [...new Set(data.map(item => item.cargo_type))].sort();
  return uniqueCargoTypes;
};

export const getUniqueTruckTypes = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('freights')
    .select('truck_type');
    
  if (error || !data) {
    return [];
  }
  
  const uniqueTruckTypes = [...new Set(data.map(item => item.truck_type))].sort();
  return uniqueTruckTypes;
};

// Static cargo and truck type lists for when database is empty
export const staticCargoTypes = [
  "Grãos",
  "Madeira",
  "Materiais de Construção",
  "Alimentos",
  "Eletrônicos",
  "Móveis",
  "Produtos Agrícolas",
  "Carga Geral",
  "Veículos",
  "Combustível",
  "Congelados",
  "Carga Perigosa",
  "Produtos Químicos",
  "Têxteis",
  "Bebidas"
];

export const staticTruckTypes = [
  "Truck",
  "Bi-Truck",
  "Carreta",
  "Grade Baixa",
  "Grade Alta",
  "Baú",
  "Refrigerado",
  "Caçamba",
  "Tanque",
  "Porta Container",
  "Sider",
  "Cegonha",
  "Prancha"
];

// Adding the missing static arrays
export const staticOrigins = [
  "São Paulo",
  "Rio de Janeiro",
  "Belo Horizonte",
  "Curitiba",
  "Porto Alegre",
  "Recife",
  "Salvador",
  "Fortaleza",
  "Brasília",
  "Manaus",
  "Belém",
  "Goiânia"
];

export const staticDestinations = [
  "São Paulo",
  "Rio de Janeiro",
  "Belo Horizonte",
  "Curitiba",
  "Porto Alegre",
  "Recife",
  "Salvador",
  "Fortaleza",
  "Brasília",
  "Manaus",
  "Belém",
  "Goiânia"
];
