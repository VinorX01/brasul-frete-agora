
import { useState, useEffect } from "react";
import FreightFilter, { FilterValues } from "@/components/FreightFilter";
import FreightCard from "@/components/FreightCard";
import FreightDetails from "@/components/FreightDetails";
import { Freight, getFilteredFreights } from "@/lib/mockFreights";
import { Truck } from "lucide-react";

const FindFreight = () => {
  const [filteredFreights, setFilteredFreights] = useState<Freight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [selectedFreight, setSelectedFreight] = useState<Freight | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setFilteredFreights(getFilteredFreights());
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleFilter = (filters: FilterValues) => {
    setIsLoading(true);
    setHasFiltered(true);

    // Convert "all" values to empty string for the backend filter
    const originFilter = filters.origin === "all" ? "" : filters.origin;
    const destinationFilter = filters.destination === "all" ? "" : filters.destination;
    const cargoTypeFilter = filters.cargoType === "all" ? "" : filters.cargoType;
    const truckTypeFilter = filters.truckType === "all" ? "" : filters.truckType;

    // Simulate API call delay
    setTimeout(() => {
      const results = getFilteredFreights(
        originFilter,
        destinationFilter,
        cargoTypeFilter,
        truckTypeFilter,
        filters.minValue ? parseInt(filters.minValue) : undefined,
        filters.maxValue ? parseInt(filters.maxValue) : undefined
      );
      setFilteredFreights(results);
      setIsLoading(false);
    }, 500);
  };

  const handleViewDetails = (freight: Freight) => {
    setSelectedFreight(freight);
    setIsDetailOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Encontrar Fretes Disponíveis</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Utilize os filtros abaixo para encontrar os melhores fretes para seu veículo. 
          Todos os fretes são disponibilizados diretamente pelos embarcadores.
        </p>
      </div>

      <div className="mb-8">
        <FreightFilter onFilter={handleFilter} />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <Truck size={48} className="text-primary mb-4" />
            <p className="text-lg font-medium">Carregando fretes disponíveis...</p>
          </div>
        </div>
      ) : filteredFreights.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {hasFiltered ? 'Resultados da busca' : 'Todos os fretes disponíveis'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFreights.map((freight) => (
              <FreightCard 
                key={freight.id} 
                freight={freight} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Truck size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">Nenhum frete encontrado</h2>
          <p className="text-gray-600">
            Não encontramos fretes com os filtros selecionados. Tente outros critérios de busca.
          </p>
        </div>
      )}
      
      <FreightDetails 
        freight={selectedFreight} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
      />
    </div>
  );
};

export default FindFreight;
