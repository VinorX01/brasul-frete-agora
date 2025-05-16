
import { useState, useEffect } from "react";
import FreightFilter, { FilterValues } from "@/components/FreightFilter";
import FreightCard from "@/components/FreightCard";
import FreightDetails from "@/components/FreightDetails";
import { Truck } from "lucide-react";
import { getFilteredFreights, getFreightCount } from "@/lib/freightService";
import { type Freight } from "@/lib/supabase";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const FindFreight = () => {
  const [filteredFreights, setFilteredFreights] = useState<Freight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [selectedFreight, setSelectedFreight] = useState<Freight | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [freightCount, setFreightCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<FilterValues | null>(null);
  const ITEMS_PER_PAGE = 50;

  // Load freights with the current filters and page
  const loadFreights = async (filters: FilterValues | null = null, page = 0) => {
    setIsLoading(true);
    
    try {
      // If we have filters, use them, otherwise use empty values
      const originFilter = filters?.origin === "all" ? "" : filters?.origin || "";
      const destinationFilter = filters?.destination === "all" ? "" : filters?.destination || "";
      const cargoTypeFilter = filters?.cargoType === "all" ? "" : filters?.cargoType || "";
      const truckTypeFilter = filters?.truckType === "all" ? "" : filters?.truckType || "";
      const minValueNum = filters?.minValue ? parseInt(filters.minValue) : undefined;
      const maxValueNum = filters?.maxValue ? parseInt(filters.maxValue) : undefined;
      const minWeightNum = filters?.minWeight ? parseInt(filters.minWeight) : undefined;
      const maxWeightNum = filters?.maxWeight ? parseInt(filters.maxWeight) : undefined;

      // Get total count first (without pagination)
      const count = await getFreightCount(
        originFilter,
        destinationFilter,
        cargoTypeFilter,
        truckTypeFilter,
        minValueNum,
        maxValueNum,
        minWeightNum,
        maxWeightNum,
        filters?.refrigerated,
        filters?.requiresMopp,
        filters?.tollIncluded
      );
      setFreightCount(count);

      // Then get paginated results
      const freights = await getFilteredFreights(
        originFilter,
        destinationFilter,
        cargoTypeFilter,
        truckTypeFilter,
        minValueNum,
        maxValueNum,
        minWeightNum,
        maxWeightNum,
        filters?.refrigerated,
        filters?.requiresMopp,
        filters?.tollIncluded,
        ITEMS_PER_PAGE,
        page
      );
      setFilteredFreights(freights);
    } catch (error) {
      console.error("Error loading freights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load all freights initially
    loadFreights();
  }, []);

  const handleFilter = async (filters: FilterValues) => {
    setHasFiltered(true);
    setCurrentFilters(filters);
    setCurrentPage(0); // Reset to first page on new filter
    
    await loadFreights(filters, 0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadFreights(currentFilters, page);
  };

  const handleViewDetails = (freight: Freight) => {
    setSelectedFreight(freight);
    setIsDetailOpen(true);
  };

  // Calculate total pages
  const totalPages = Math.ceil(freightCount / ITEMS_PER_PAGE);

  return <div className="bg-[#f4f4fc] min-h-screen">
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

        {isLoading ? <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <Truck size={48} className="text-primary mb-4" />
              <p className="text-lg font-medium">Carregando fretes disponíveis...</p>
            </div>
          </div> : filteredFreights.length > 0 ? <div>
            <h2 className="text-xl font-semibold mb-4">
              {hasFiltered 
                ? `${freightCount} fretes encontrados`
                : `${freightCount} fretes disponíveis`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFreights.map(freight => <FreightCard key={freight.id} freight={freight} onViewDetails={handleViewDetails} />)}
            </div>
            
            {/* Show pagination if we have more than one page */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  {currentPage > 0 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage - 1);
                        }} 
                      />
                    </PaginationItem>
                  )}
                  
                  {/* Show current page and neighbors */}
                  {[...Array(totalPages)].map((_, i) => {
                    // Only show a few pages to avoid cluttering
                    if (
                      i === 0 || // First page
                      i === totalPages - 1 || // Last page
                      (i >= currentPage - 1 && i <= currentPage + 1) // Neighbors
                    ) {
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === i}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(i);
                            }}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    // Add ellipsis for skipped pages (but don't duplicate them)
                    else if (
                      (i === currentPage - 2 && currentPage > 2) ||
                      (i === currentPage + 2 && currentPage < totalPages - 3)
                    ) {
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink disabled>...</PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  {currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }} 
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </div> : <div className="text-center py-12">
            <Truck size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Nenhum frete encontrado</h2>
            <p className="text-gray-600">
              Não encontramos fretes com os filtros selecionados. Tente outros critérios de busca.
            </p>
          </div>}
        
        <FreightDetails freight={selectedFreight} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
      </div>
    </div>;
};

export default FindFreight;
