
export interface Freight {
  id: string;
  origin: string;
  destination: string;
  cargoType: string;
  truckType: string; // Adicionado tipo de caminhão/carroceria
  value: number | null; // Alterado para aceitar null quando valor é "a combinar"
  contact: string;
  date: string;
  status: 'available' | 'in_progress' | 'completed';
}

// Brazilian cities list
const cities = [
  "São Paulo, SP", 
  "Rio de Janeiro, RJ", 
  "Belo Horizonte, MG", 
  "Brasília, DF",
  "Salvador, BA", 
  "Fortaleza, CE", 
  "Recife, PE", 
  "Porto Alegre, RS", 
  "Curitiba, PR",
  "Manaus, AM", 
  "Belém, PA", 
  "Goiânia, GO", 
  "Guarulhos, SP", 
  "Campinas, SP",
  "São Luís, MA", 
  "São Gonçalo, RJ", 
  "Maceió, AL", 
  "Duque de Caxias, RJ",
  "Campo Grande, MS", 
  "Natal, RN", 
  "Teresina, PI", 
  "Florianópolis, SC",
  "Nova Iguaçu, RJ", 
  "Santos, SP", 
  "Joinville, SC", 
  "Ribeirão Preto, SP"
];

// Cargo types
const cargoTypes = [
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

// Truck/carroceria types
const truckTypes = [
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

// Phone numbers
const phones = [
  "(11) 98765-4321",
  "(21) 99876-5432",
  "(31) 97654-3210",
  "(41) 96543-2109",
  "(51) 95432-1098",
  "(61) 94321-0987",
  "(71) 93210-9876",
  "(81) 92109-8765",
  "(91) 90987-6543",
];

// Generate a random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Generate a random date in the last 7 days
const generateRecentDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 7));
  return date.toISOString().split('T')[0];
};

// Generate 30 random freight items
export const generateMockFreights = (count = 30): Freight[] => {
  const freights: Freight[] = [];
  
  for (let i = 0; i < count; i++) {
    // Ensure origin and destination are different
    let origin = cities[Math.floor(Math.random() * cities.length)];
    let destination;
    
    do {
      destination = cities[Math.floor(Math.random() * cities.length)];
    } while (destination === origin);

    // 20% chance of having null value (a combinar)
    const hasValue = Math.random() > 0.2;
    
    freights.push({
      id: generateId(),
      origin,
      destination,
      cargoType: cargoTypes[Math.floor(Math.random() * cargoTypes.length)],
      truckType: truckTypes[Math.floor(Math.random() * truckTypes.length)], // Adicionado tipo de caminhão
      value: hasValue ? Math.floor(Math.random() * 10000) + 1000 : null, // Pode ser null para "valor a combinar"
      contact: phones[Math.floor(Math.random() * phones.length)],
      date: generateRecentDate(),
      status: 'available',
    });
  }

  return freights;
};

export const mockFreights = generateMockFreights();

export const findFreightById = (id: string): Freight | undefined => {
  return mockFreights.find(freight => freight.id === id);
};

export const getFilteredFreights = (
  origin?: string,
  destination?: string,
  cargoType?: string,
  truckType?: string, // Adicionando novo parâmetro
  minValue?: number,
  maxValue?: number
): Freight[] => {
  return mockFreights.filter(freight => {
    // Filter conditions
    const matchesOrigin = !origin || freight.origin.toLowerCase().includes(origin.toLowerCase());
    const matchesDestination = !destination || freight.destination.toLowerCase().includes(destination.toLowerCase());
    const matchesCargoType = !cargoType || freight.cargoType === cargoType;
    const matchesTruckType = !truckType || freight.truckType === truckType; // Nova condição
    
    // Para value null (valor a combinar), só filtramos se o usuário especificou um valor mínimo ou máximo
    const matchesMinValue = !minValue || freight.value === null || freight.value >= minValue;
    const matchesMaxValue = !maxValue || freight.value === null || freight.value <= maxValue;

    return (
      matchesOrigin &&
      matchesDestination &&
      matchesCargoType &&
      matchesTruckType && // Adicionando na verificação
      matchesMinValue &&
      matchesMaxValue
    );
  });
};

export const getUniqueOrigins = (): string[] => {
  const origins = mockFreights.map(freight => freight.origin);
  return [...new Set(origins)].sort();
};

export const getUniqueDestinations = (): string[] => {
  const destinations = mockFreights.map(freight => freight.destination);
  return [...new Set(destinations)].sort();
};

export const getUniqueCargoTypes = (): string[] => {
  return [...new Set(cargoTypes)].sort();
};

// Nova função para obter tipos de caminhão/carroceria
export const getUniqueTruckTypes = (): string[] => {
  return [...new Set(truckTypes)].sort();
};
