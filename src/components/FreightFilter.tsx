
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  getUniqueOrigins, 
  getUniqueDestinations, 
  getUniqueCargoTypes, 
  getUniqueTruckTypes,
  staticCargoTypes,
  staticTruckTypes
} from "@/lib/freightService";

interface FreightFilterProps {
  onFilter: (filters: FilterValues) => void;
}

export interface FilterValues {
  origin: string;
  destination: string;
  cargoType: string;
  truckType: string;
  minValue: string;
  maxValue: string;
}

const FreightFilter: React.FC<FreightFilterProps> = ({ onFilter }) => {
  const [origins, setOrigins] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [cargoTypes, setCargoTypes] = useState<string[]>(staticCargoTypes);
  const [truckTypes, setTruckTypes] = useState<string[]>(staticTruckTypes);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState<FilterValues>({
    origin: "",
    destination: "",
    cargoType: "",
    truckType: "",
    minValue: "",
    maxValue: "",
  });

  useEffect(() => {
    // Load filter options
    const loadFilterOptions = async () => {
      setLoading(true);
      try {
        const [origins, destinations, cargoTypes, truckTypes] = await Promise.all([
          getUniqueOrigins(),
          getUniqueDestinations(),
          getUniqueCargoTypes(),
          getUniqueTruckTypes()
        ]);
        
        setOrigins(origins.length > 0 ? origins : []);
        setDestinations(destinations.length > 0 ? destinations : []);
        
        // Only use database values if they exist, otherwise use static lists
        if (cargoTypes.length > 0) {
          setCargoTypes(cargoTypes);
        }
        
        if (truckTypes.length > 0) {
          setTruckTypes(truckTypes);
        }
      } catch (error) {
        console.error("Error loading filter options:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  const handleFilterChange = (field: keyof FilterValues, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    setFilters({
      origin: "",
      destination: "",
      cargoType: "",
      truckType: "",
      minValue: "",
      maxValue: "",
    });
    onFilter({
      origin: "",
      destination: "",
      cargoType: "",
      truckType: "",
      minValue: "",
      maxValue: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-primary">Filtrar Fretes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Origem</label>
          <Select
            value={filters.origin}
            onValueChange={(value) => handleFilterChange("origin", value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Qualquer origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer origem</SelectItem>
              {origins.map((origin) => (
                <SelectItem key={origin} value={origin}>
                  {origin}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Destino</label>
          <Select
            value={filters.destination}
            onValueChange={(value) => handleFilterChange("destination", value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Qualquer destino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer destino</SelectItem>
              {destinations.map((destination) => (
                <SelectItem key={destination} value={destination}>
                  {destination}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Carga</label>
          <Select
            value={filters.cargoType}
            onValueChange={(value) => handleFilterChange("cargoType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Qualquer tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer tipo</SelectItem>
              {cargoTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Caminhão/Carroceria</label>
          <Select
            value={filters.truckType}
            onValueChange={(value) => handleFilterChange("truckType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Qualquer tipo de caminhão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer tipo de caminhão</SelectItem>
              {truckTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Valor Mínimo (R$)</label>
          <Input
            type="number"
            placeholder="Mínimo"
            value={filters.minValue}
            onChange={(e) => handleFilterChange("minValue", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Valor Máximo (R$)</label>
          <Input
            type="number"
            placeholder="Máximo"
            value={filters.maxValue}
            onChange={(e) => handleFilterChange("maxValue", e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={handleClear}>
          Limpar
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary-medium">
          Filtrar Resultados
        </Button>
      </div>
    </form>
  );
};

export default FreightFilter;
