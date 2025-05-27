
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, RotateCcw } from "lucide-react";
import { staticCargoTypes, staticTruckTypes } from "@/lib/freightService";
import MunicipalitySelect from "./MunicipalitySelect";
import { Switch } from "@/components/ui/switch";

export type FilterValues = {
  origin: string;
  destination: string;
  originState: string; // New field for state filter
  cargoType: string;
  truckType: string;
  minValue: string;
  maxValue: string;
  minWeight: string;
  maxWeight: string;
  refrigerated: boolean;
  requiresMopp: boolean;
  tollIncluded: boolean;
  showPerKmRate: boolean;
};

type FreightFilterProps = {
  onFilter: (values: FilterValues) => void;
};

// Brazilian states list
const brazilianStates = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const FreightFilter = ({ onFilter }: FreightFilterProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    origin: "all",
    destination: "all",
    originState: "all", // Initialize new state filter
    cargoType: "all",
    truckType: "all",
    minValue: "",
    maxValue: "",
    minWeight: "",
    maxWeight: "",
    refrigerated: false,
    requiresMopp: false,
    tollIncluded: false,
    showPerKmRate: false,
  });

  const cargoTypes = staticCargoTypes;
  const truckTypes = staticTruckTypes;

  const handleChange = (field: keyof FilterValues, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Immediately apply filter change for the rate display toggle
    if (field === "showPerKmRate") {
      onFilter({
        ...filters,
        showPerKmRate: value as boolean
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    const defaultFilters = {
      origin: "all",
      destination: "all",
      originState: "all", // Reset state filter
      cargoType: "all",
      truckType: "all",
      minValue: "",
      maxValue: "",
      minWeight: "",
      maxWeight: "",
      refrigerated: false,
      requiresMopp: false,
      tollIncluded: false,
      showPerKmRate: false,
    };
    
    setFilters(defaultFilters);
    onFilter(defaultFilters);
  };

  return (
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="origin">Origem</Label>
            <MunicipalitySelect
              value={filters.origin}
              onValueChange={(value) => handleChange("origin", value)}
              placeholder="Origem"
              allowAll={true}
            />
          </div>
          <div>
            <Label htmlFor="originState">Estado de Origem</Label>
            <Select
              value={filters.originState}
              onValueChange={(value) => handleChange("originState", value)}
            >
              <SelectTrigger id="originState">
                <SelectValue placeholder="Todos os estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                {brazilianStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="destination">Destino</Label>
            <MunicipalitySelect
              value={filters.destination}
              onValueChange={(value) => handleChange("destination", value)}
              placeholder="Destino"
              allowAll={true}
            />
          </div>

          
          <div>
            <Label htmlFor="cargoType">Tipo de Carga</Label>
            <Select
              value={filters.cargoType}
              onValueChange={(value) => handleChange("cargoType", value)}
            >
              <SelectTrigger id="cargoType">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {cargoTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="truckType">Tipo de Caminhão</Label>
            <Select
              value={filters.truckType}
              onValueChange={(value) => handleChange("truckType", value)}
            >
              <SelectTrigger id="truckType">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {truckTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="minValue">Valor Mínimo (R$)</Label>
            <Input
              type="number"
              id="minValue"
              placeholder="Valor mínimo"
              value={filters.minValue}
              onChange={(e) => handleChange("minValue", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="maxValue">Valor Máximo (R$)</Label>
            <Input
              type="number"
              id="maxValue"
              placeholder="Valor máximo"
              value={filters.maxValue}
              onChange={(e) => handleChange("maxValue", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="minWeight">Peso Mínimo (kg)</Label>
            <Input
              type="number"
              id="minWeight"
              placeholder="Peso mínimo"
              value={filters.minWeight}
              onChange={(e) => handleChange("minWeight", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="maxWeight">Peso Máximo (kg)</Label>
            <Input
              type="number"
              id="maxWeight"
              placeholder="Peso máximo"
              value={filters.maxWeight}
              onChange={(e) => handleChange("maxWeight", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="refrigerated"
              checked={filters.refrigerated}
              onCheckedChange={(checked) =>
                handleChange("refrigerated", !!checked)
              }
            />
            <Label htmlFor="refrigerated">Refrigerado</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="requiresMopp"
              checked={filters.requiresMopp}
              onCheckedChange={(checked) =>
                handleChange("requiresMopp", !!checked)
              }
            />
            <Label htmlFor="requiresMopp">Requer MOPP</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="tollIncluded"
              checked={filters.tollIncluded}
              onCheckedChange={(checked) =>
                handleChange("tollIncluded", !!checked)
              }
            />
            <Label htmlFor="tollIncluded">Pedágio Incluso</Label>
          </div>
        </div>
        
        {/* Rate comparison toggle */}
        <div className="flex items-center justify-center mt-6 space-x-2 pb-4 border-b border-gray-200">
          <span className="text-sm font-medium">Comparativo por ton/km</span>
          <Switch 
            checked={filters.showPerKmRate}
            onCheckedChange={(checked) => handleChange("showPerKmRate", checked)}
          />
          <span className="text-sm font-medium">Comparativo por km</span>
        </div>
        
        <div className="mt-6 flex justify-center gap-4">
          <Button 
            type="submit" 
            className="bg-black text-white hover:bg-gray-800"
          >
            <Search className="mr-2 h-4 w-4" /> Filtrar Resultados
          </Button>
          
          <Button 
            type="button"
            variant="outline"
            onClick={handleClear}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Limpar
          </Button>
        </div>
      </form>
  );
};

export default FreightFilter;
