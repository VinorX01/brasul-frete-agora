import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FreightCard from "@/components/FreightCard";
import FreightFilter, { type FilterValues } from "@/components/FreightFilter";
import FreightDetails from "@/components/FreightDetails";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { type Freight } from "@/lib/supabase";
import { getFreights } from "@/lib/freightService";
import { useAnalytics } from "@/hooks/useAnalytics";

const FindFreight = () => {
  const { trackEvent } = useAnalytics();

  // Track page view on component mount
  useEffect(() => {
    trackEvent('page_view_find_freight');
  }, [trackEvent]);

  const [freights, setFreights] = useState<Freight[]>([]);
  const [filteredFreights, setFilteredFreights] = useState<Freight[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [freightDetails, setFreightDetails] = useState<Freight | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPerKmRate, setShowPerKmRate] = useState(false); // State for rate comparison

  useEffect(() => {
    const initialShowPerKmRate = searchParams.get('rate') === 'km';
    setShowPerKmRate(initialShowPerKmRate);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      const initialFreights = await getFreights();
      setFreights(initialFreights);
      setFilteredFreights(initialFreights);
    };

    fetchData();
  }, []);

  const handleFilter = (values: FilterValues) => {
    const filtered = freights.filter((freight) => {
      const originMatch =
        values.origin === "all" || freight.origin.toLowerCase().includes(values.origin.toLowerCase());
      
      const originStateMatch =
        values.originState === "all" || freight.origin_state === values.originState;

      const destinationMatch =
        values.destination === "all" || freight.destination.toLowerCase().includes(values.destination.toLowerCase());
      const cargoTypeMatch =
        values.cargoType === "all" || freight.cargo_type === values.cargoType;
      const truckTypeMatch =
        values.truckType === "all" || freight.truck_type === values.truckType;

      const valueInRange =
        (values.minValue === "" || (freight.value !== null && freight.value >= Number(values.minValue))) &&
        (values.maxValue === "" || (freight.value !== null && freight.value <= Number(values.maxValue)));

      const weightInRange =
        (values.minWeight === "" || (freight.weight !== null && freight.weight >= Number(values.minWeight))) &&
        (values.maxWeight === "" || (freight.weight !== null && freight.weight <= Number(values.maxWeight)));

      const refrigeratedMatch = !values.refrigerated || freight.refrigerated === values.refrigerated;
      const requiresMoppMatch = !values.requiresMopp || freight.requires_mopp === values.requiresMopp;
      const tollIncludedMatch = !values.tollIncluded || freight.toll_included === values.tollIncluded;
      
      return (
        originMatch &&
        originStateMatch &&
        destinationMatch &&
        cargoTypeMatch &&
        truckTypeMatch &&
        valueInRange &&
        weightInRange &&
        refrigeratedMatch &&
        requiresMoppMatch &&
        tollIncludedMatch
      );
    });

    setFilteredFreights(filtered);
  };

  const handleViewDetails = (freight: Freight) => {
    setFreightDetails(freight);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Function to toggle rate comparison and update URL
  const toggleRateComparison = (showPerKm: boolean) => {
    setShowPerKmRate(showPerKm);
    const newParams = new URLSearchParams(searchParams);
    if (showPerKm) {
      newParams.set('rate', 'km');
    } else {
      newParams.delete('rate');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Encontre seu Frete Ideal</h1>

      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={toggleFilter}>
          <Filter className="mr-2 h-4 w-4" /> {isFilterOpen ? 'Fechar Filtro' : 'Abrir Filtro'}
        </Button>
        {/* Rate comparison toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Comparativo por ton/km</span>
          <input
            type="checkbox"
            id="rateComparison"
            className="h-5 w-5 rounded-full bg-gray-200 appearance-none checked:bg-primary focus:outline-none cursor-pointer"
            checked={showPerKmRate}
            onChange={(e) => toggleRateComparison(e.target.checked)}
          />
          <label htmlFor="rateComparison" className="w-12 h-6 bg-gray-200 rounded-full peer cursor-pointer"></label>
          <span className="text-sm font-medium">Comparativo por km</span>
        </div>
      </div>

      {isFilterOpen && (
        <FreightFilter onFilter={handleFilter} showPerKmRate={showPerKmRate} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredFreights.map((freight) => (
          <FreightCard
            key={freight.id}
            freight={freight}
            onViewDetails={handleViewDetails}
            showPerKmRate={showPerKmRate}
          />
        ))}
      </div>

      <FreightDetails
        freight={freightDetails}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default FindFreight;
