
import { supabase, type Freight } from './supabase';
import { toast } from '@/components/ui/use-toast';

// Get filtered freights
export const getFilteredFreights = async (
  origin?: string,
  destination?: string,
  cargoType?: string,
  truckType?: string,
  minValue?: number,
  maxValue?: number
): Promise<Freight[]> => {
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
export const createFreight = async (freight: Omit<Freight, 'id' | 'created_at' | 'updated_at' | 'status' | 'date'>): Promise<Freight | null> => {
  const { data, error } = await supabase
    .from('freights')
    .insert({
      ...freight,
      status: 'available',
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating freight:', error);
    toast({
      title: "Erro ao publicar frete",
      description: "Ocorreu um erro ao publicar o frete. Tente novamente.",
      variant: "destructive",
    });
    return null;
  }
  
  toast({
    title: "Frete publicado com sucesso!",
    description: "Seu frete já está disponível para os caminhoneiros e agenciadores.",
  });
  
  return data as Freight;
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
