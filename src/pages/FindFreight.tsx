import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import FreightCard from "@/components/FreightCard";
import FreightFilter from "@/components/FreightFilter";
import FreightMap from "@/components/FreightMap";
import FreightDetails from "@/components/FreightDetails";
import { Button } from "@/components/ui/button";
import { Settings, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFilteredFreights, getFreightCount, getUniqueOriginCities } from "@/lib/freightService";
import { toast } from "@/components/ui/use-toast";
import MobilePageWrapper from "@/components/MobilePageWrapper";
import { type Freight } from "@/lib/supabase";
import { type FilterValues } from "@/components/FreightFilter";
import { useAnalytics } from "@/hooks/useAnalytics";

const ITEMS_PER_PAGE = 100;

const FindFreight = () => {
  const { trackEvent } = useAnalytics();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFreight, setSelectedFreight] = useState<Freight | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    origin: searchParams.get("origin") || "all",
    destination: searchParams.get("destination") || "all",
    originState: searchParams.get("originState") || "all",
    cargoType: searchParams.get("cargoType") || "all",
    truckType: searchParams.get("truckType") || "all",
    minValue: searchParams.get("minValue") || "",
    maxValue: searchParams.get("maxValue") || "",
    minWeight: searchParams.get("minWeight") || "",
    maxWeight: searchParams.get("maxWeight") || "",
    refrigerated: searchParams.get("refrigerated") === "true",
    requiresMopp: searchParams.get("requiresMopp") === "true",
    tollIncluded: searchParams.get("tollIncluded") === "true",
    showPerKmRate: searchParams.get("showPerKmRate") === "true"
  });

  // Track page view on component mount
  useEffect(() => {
    trackEvent('page_view_find_freight');
  }, [trackEvent]);

  // Check if any filters are applied
  useEffect(() => {
    const hasFilters = filters.origin !== "all" || 
                      filters.destination !== "all" || 
                      filters.originState !== "all" || 
                      filters.cargoType !== "all" || 
                      filters.truckType !== "all" || 
                      filters.minValue !== "" || 
                      filters.maxValue !== "" || 
                      filters.minWeight !== "" || 
                      filters.maxWeight !== "" || 
                      filters.refrigerated || 
                      filters.requiresMopp || 
                      filters.tollIncluded;
    setHasAppliedFilters(hasFilters);
  }, [filters]);

  // Query for unique cities (used for map when no filters applied)
  const {
    data: uniqueCitiesData,
    isLoading: isLoadingUniqueCities
  } = useQuery({
    queryKey: ["uniqueOriginCities"],
    queryFn: () => getUniqueOriginCities(100),
    enabled: !hasAppliedFilters
  });

  // Query for filtered freights (used for list and map when filters applied)
  const {
    data,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["freights", filters, currentPage],
    queryFn: () => getFilteredFreights(filters.origin, filters.destination, filters.cargoType, filters.truckType, filters.minValue ? Number(filters.minValue) : undefined, filters.maxValue ? Number(filters.maxValue) : undefined, filters.minWeight ? Number(filters.minWeight) : undefined, filters.maxWeight ? Number(filters.maxWeight) : undefined, filters.refrigerated, filters.requiresMopp, filters.tollIncluded, filters.originState, ITEMS_PER_PAGE, currentPage - 1)
  });

  const {
    data: totalFreights
  } = useQuery({
    queryKey: ["freightsCount", filters],
    queryFn: () => getFreightCount(filters.origin, filters.destination, filters.cargoType, filters.truckType, filters.minValue ? Number(filters.minValue) : undefined, filters.maxValue ? Number(filters.maxValue) : undefined, filters.minWeight ? Number(filters.minWeight) : undefined, filters.maxWeight ? Number(filters.maxWeight) : undefined, filters.refrigerated, filters.requiresMopp, filters.tollIncluded, filters.originState)
  });

  useEffect(() => {
    if (totalFreights === undefined) return;
    if (data === undefined) return;
    if (data?.length === 0 && totalFreights > 0) {
      toast({
        title: "Nenhum frete encontrado com esses filtros.",
        description: "Tente ajustar os filtros para encontrar fretes."
      });
    }
  }, [data, totalFreights]);

  const handleFilter = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setSearchParams(newFilters as any);
    refetch();

    // Close filter panel after applying filters
    setIsFilterVisible(false);
  };

  const handleFilterToggle = () => {
    if (!isFilterVisible) {
      trackEvent('freight_filters_open');
    }
    setIsFilterVisible(!isFilterVisible);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleViewDetails = (freight: Freight) => {
    setSelectedFreight(freight);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedFreight(null);
  };

  // Determine which data to use for map and loading state
  const mapData = hasAppliedFilters ? (data || []) : (uniqueCitiesData || []);
  const isMapLoading = hasAppliedFilters ? isLoading : isLoadingUniqueCities;

  return (
    <MobilePageWrapper>
      <div className="min-h-screen" style={{ backgroundColor: '#f4f4fc' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="font-bold mb-2 text-xl">Encontrar Fretes</h1>
            <p className="text-gray-600">
              Encontre as melhores oportunidades de frete para seu veículo
            </p>
          </div>

          {/* Mapa */}
          <div className="mb-6">
            <FreightMap freights={mapData} />
          </div>

          {/* Filtros com botão toggle */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold text-slate-900 text-base">
                {totalFreights || 0} fretes disponíveis
              </p>
              <Button variant="outline" size="sm" onClick={handleFilterToggle} className="bg-black text-white border-black hover:bg-gray-800">
                <Settings className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
            
            {isFilterVisible && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <FreightFilter onFilter={handleFilter} />
              </div>
            )}
          </div>

          {/* Lista de fretes */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p>Carregando fretes...</p>
              </div>
            ) : data && data.length > 0 ? (
              data.map(freight => (
                <FreightCard 
                  key={freight.id} 
                  freight={freight} 
                  onViewDetails={handleViewDetails} 
                  showPerKmRate={filters.showPerKmRate} 
                />
              ))
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum frete encontrado
                </h3>
                <p className="text-gray-500">
                  Tente ajustar os filtros para encontrar mais opções
                </p>
              </div>
            )}
          </div>

          {/* Paginação */}
          {data && totalFreights && totalFreights > ITEMS_PER_PAGE && (
            <div className="mt-8 flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage <= 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {currentPage} de {Math.ceil(totalFreights / ITEMS_PER_PAGE)}
              </span>
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage >= Math.ceil(totalFreights / ITEMS_PER_PAGE)}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>

        {/* FreightDetails Component */}
        <FreightDetails 
          freight={selectedFreight}
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
        />
      </div>
    </MobilePageWrapper>
  );
};

export default FindFreight;
