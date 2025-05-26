import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import FreightCard from "@/components/FreightCard";
import FreightFilter from "@/components/FreightFilter";
import FreightMap from "@/components/FreightMap";
import { Button } from "@/components/ui/button";
import { Settings, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFilteredFreights, getFreightCount } from "@/lib/freightService";
import { toast } from "@/components/ui/use-toast";
import MobilePageWrapper from "@/components/MobilePageWrapper";

interface Freight {
  id: string;
  title: string;
  origin: string;
  destination: string;
  price: number;
  date: string;
  description: string;
  vehicleType: string;
  weight: number;
  dimensions: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}

const ITEMS_PER_PAGE = 100;

interface FreightFilters {
  searchTerm: string;
  origin: string;
  destination: string;
  vehicleType: string;
  minPrice: number;
  maxPrice: number;
  minWeight: number;
  maxWeight: number;
}

const FindFreight = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FreightFilters>({
    searchTerm: searchParams.get("searchTerm") || "",
    origin: searchParams.get("origin") || "",
    destination: searchParams.get("destination") || "",
    vehicleType: searchParams.get("vehicleType") || "",
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 10000,
    minWeight: Number(searchParams.get("minWeight")) || 0,
    maxWeight: Number(searchParams.get("maxWeight")) || 10000,
  });

  const { data, isLoading, refetch } = useQuery(
    ["freights", filters, currentPage],
    () =>
      getFilteredFreights({
        ...filters,
        page: currentPage,
        itemsPerPage: ITEMS_PER_PAGE,
      })
  );

  const { data: totalFreights } = useQuery(
    ["freightsCount", filters],
    () => getFreightCount(filters)
  );

  useEffect(() => {
    if (totalFreights === undefined) return;
    if (data === undefined) return;

    if (data?.freights?.length === 0 && totalFreights > 0) {
      toast({
        title: "Nenhum frete encontrado com esses filtros.",
        description: "Tente ajustar os filtros para encontrar fretes.",
      });
    }
  }, [data, totalFreights]);

  const handleFiltersChange = (newFilters: Partial<FreightFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleApplyFilters = () => {
    setSearchParams(filters as any);
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <MobilePageWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Encontrar Fretes</h1>
            <p className="text-gray-600">
              Encontre as melhores oportunidades de frete para seu veículo
            </p>
          </div>

          {/* Mapa */}
          <div className="mb-6">
            <FreightMap 
              freights={data?.freights || []} 
              className="h-64 w-full rounded-lg shadow-sm"
            />
          </div>

          {/* Filtros com botão toggle */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                {data?.total || 0} fretes disponíveis
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className="bg-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
            
            {isFilterVisible && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <FreightFilter
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onApplyFilters={handleApplyFilters}
                />
              </div>
            )}
          </div>

          {/* Lista de fretes */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p>Carregando fretes...</p>
              </div>
            ) : data?.freights && data.freights.length > 0 ? (
              data.freights.map((freight) => (
                <FreightCard key={freight.id} freight={freight} />
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
          {data && data.total > ITEMS_PER_PAGE && (
            <div className="mt-8 flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {currentPage} de {Math.ceil(data.total / ITEMS_PER_PAGE)}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(data.total / ITEMS_PER_PAGE)}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      </div>
    </MobilePageWrapper>
  );
};

export default FindFreight;
