
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Check, ChevronDown, Filter } from "lucide-react";
import { 
  getUniqueOrigins, 
  getUniqueDestinations, 
  getUniqueCargoTypes, 
  getUniqueTruckTypes,
  getMunicipalities,
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
  minWeight: string;
  maxWeight: string;
  refrigerated: boolean;
  requiresMopp: boolean;
  tollIncluded: boolean;
}

const FreightFilter: React.FC<FreightFilterProps> = ({ onFilter }) => {
  const [origins, setOrigins] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [cargoTypes, setCargoTypes] = useState<string[]>(staticCargoTypes);
  const [truckTypes, setTruckTypes] = useState<string[]>(staticTruckTypes);
  const [loading, setLoading] = useState(true);
  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  
  const [filters, setFilters] = useState<FilterValues>({
    origin: "",
    destination: "",
    cargoType: "",
    truckType: "",
    minValue: "",
    maxValue: "",
    minWeight: "",
    maxWeight: "",
    refrigerated: false,
    requiresMopp: false,
    tollIncluded: false,
  });

  useEffect(() => {
    // Load filter options
    const loadFilterOptions = async () => {
      setLoading(true);
      try {
        const [cargoTypes, truckTypes] = await Promise.all([
          getUniqueCargoTypes(),
          getUniqueTruckTypes()
        ]);
        
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

  useEffect(() => {
    if (originSearch.length > 2) {
      const searchMunicipalities = async () => {
        const results = await getMunicipalities(originSearch);
        setOrigins(results.map(m => `${m.name}, ${m.state}`));
      };
      searchMunicipalities();
    }
  }, [originSearch]);

  useEffect(() => {
    if (destinationSearch.length > 2) {
      const searchMunicipalities = async () => {
        const results = await getMunicipalities(destinationSearch);
        setDestinations(results.map(m => `${m.name}, ${m.state}`));
      };
      searchMunicipalities();
    }
  }, [destinationSearch]);

  const handleFilterChange = (field: keyof FilterValues, value: string | boolean) => {
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
      minWeight: "",
      maxWeight: "",
      refrigerated: false,
      requiresMopp: false,
      tollIncluded: false,
    });
    onFilter({
      origin: "",
      destination: "",
      cargoType: "",
      truckType: "",
      minValue: "",
      maxValue: "",
      minWeight: "",
      maxWeight: "",
      refrigerated: false,
      requiresMopp: false,
      tollIncluded: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-primary">Filtrar Fretes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Origem</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {filters.origin || "Qualquer origem"}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-2">
                <Input 
                  placeholder="Digite para pesquisar municípios" 
                  value={originSearch} 
                  onChange={(e) => setOriginSearch(e.target.value)}
                />
              </div>
              <div className="max-h-72 overflow-y-auto">
                <div 
                  className="px-2 py-1 cursor-pointer hover:bg-gray-100 flex items-center"
                  onClick={() => {
                    handleFilterChange("origin", "");
                    setOriginSearch("");
                  }}
                >
                  {!filters.origin && <Check className="w-4 h-4 mr-2" />}
                  <span>Qualquer origem</span>
                </div>
                {origins.map((origin) => (
                  <div 
                    key={origin} 
                    className="px-2 py-1 cursor-pointer hover:bg-gray-100 flex items-center"
                    onClick={() => {
                      handleFilterChange("origin", origin);
                      setOriginSearch("");
                    }}
                  >
                    {filters.origin === origin && <Check className="w-4 h-4 mr-2" />}
                    <span>{origin}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Destino</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {filters.destination || "Qualquer destino"}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-2">
                <Input 
                  placeholder="Digite para pesquisar municípios" 
                  value={destinationSearch} 
                  onChange={(e) => setDestinationSearch(e.target.value)}
                />
              </div>
              <div className="max-h-72 overflow-y-auto">
                <div 
                  className="px-2 py-1 cursor-pointer hover:bg-gray-100 flex items-center"
                  onClick={() => {
                    handleFilterChange("destination", "");
                    setDestinationSearch("");
                  }}
                >
                  {!filters.destination && <Check className="w-4 h-4 mr-2" />}
                  <span>Qualquer destino</span>
                </div>
                {destinations.map((destination) => (
                  <div 
                    key={destination} 
                    className="px-2 py-1 cursor-pointer hover:bg-gray-100 flex items-center"
                    onClick={() => {
                      handleFilterChange("destination", destination);
                      setDestinationSearch("");
                    }}
                  >
                    {filters.destination === destination && <Check className="w-4 h-4 mr-2" />}
                    <span>{destination}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
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
          <label className="block text-sm font-medium mb-1">Valor (R$)</label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minValue}
              onChange={(e) => handleFilterChange("minValue", e.target.value)}
              className="w-1/2"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxValue}
              onChange={(e) => handleFilterChange("maxValue", e.target.value)}
              className="w-1/2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Peso (kg)</label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minWeight}
              onChange={(e) => handleFilterChange("minWeight", e.target.value)}
              className="w-1/2"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxWeight}
              onChange={(e) => handleFilterChange("maxWeight", e.target.value)}
              className="w-1/2"
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <label className="block text-sm font-medium mb-2">Requisitos Especiais</label>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="refrigerated" 
                checked={filters.refrigerated}
                onCheckedChange={(checked) => handleFilterChange("refrigerated", !!checked)} 
              />
              <Label htmlFor="refrigerated">Refrigerado</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="requiresMopp" 
                checked={filters.requiresMopp}
                onCheckedChange={(checked) => handleFilterChange("requiresMopp", !!checked)} 
              />
              <Label htmlFor="requiresMopp">Requer MOPP</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="tollIncluded" 
                checked={filters.tollIncluded}
                onCheckedChange={(checked) => handleFilterChange("tollIncluded", !!checked)} 
              />
              <Label htmlFor="tollIncluded">Pedágio Incluso</Label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={handleClear}>
          Limpar
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary-medium">
          <Filter className="mr-2 h-4 w-4" /> Filtrar Resultados
        </Button>
      </div>
    </form>
  );
};

export default FreightFilter;
