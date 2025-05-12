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
import { Search } from "lucide-react";
import { staticOrigins, staticDestinations, staticCargoTypes, staticTruckTypes } from "@/lib/freightService";

export type FilterValues = {
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
};

type FreightFilterProps = {
  onFilter: (values: FilterValues) => void;
};

const FreightFilter = ({ onFilter }: FreightFilterProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    origin: "all",
    destination: "all",
    cargoType: "all",
    truckType: "all",
    minValue: "",
    maxValue: "",
    minWeight: "",
    maxWeight: "",
    refrigerated: false,
    requiresMopp: false,
    tollIncluded: false,
  });

  const origins = staticOrigins;
  const destinations = staticDestinations;
  const cargoTypes = staticCargoTypes;
  const truckTypes = staticTruckTypes;

  const handleChange = (field: keyof FilterValues, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  // Change the button style from primary to black
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="origin">Origem</Label>
            <Select
              value={filters.origin}
              onValueChange={(value) => handleChange("origin", value)}
            >
              <SelectTrigger id="origin">
                <SelectValue placeholder="Todas as origens" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as origens</SelectItem>
                {origins.map((origin) => (
                  <SelectItem key={origin} value={origin}>
                    {origin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="destination">Destino</Label>
            <Select
              value={filters.destination}
              onValueChange={(value) => handleChange("destination", value)}
            >
              <SelectTrigger id="destination">
                <SelectValue placeholder="Todos os destinos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os destinos</SelectItem>
                {destinations.map((destination) => (
                  <SelectItem key={destination} value={destination}>
                    {destination}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        
        <div className="mt-6 flex justify-center">
          <Button 
            type="submit" 
            className="bg-black text-white hover:bg-gray-800"
          >
            <Search className="mr-2 h-4 w-4" /> Filtrar Resultados
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FreightFilter;
