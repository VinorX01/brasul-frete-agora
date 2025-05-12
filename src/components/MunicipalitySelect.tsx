
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getMunicipalities } from "@/lib/freightService";

type Municipality = {
  name: string;
  state: string;
};

type MunicipalitySelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  allowAll?: boolean;
};

const MunicipalitySelect = ({
  value,
  onValueChange,
  placeholder,
  allowAll = true,
}: MunicipalitySelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);

  useEffect(() => {
    // Only search if there's a search term and it's at least 2 characters
    if (searchTerm && searchTerm.length >= 2) {
      setLoading(true);
      const fetchMunicipalities = async () => {
        try {
          const results = await getMunicipalities(searchTerm);
          setMunicipalities(results);
        } catch (error) {
          console.error("Error fetching municipalities:", error);
          setMunicipalities([]);
        } finally {
          setLoading(false);
        }
      };

      const timer = setTimeout(() => {
        fetchMunicipalities();
      }, 300); // Add debounce

      return () => clearTimeout(timer);
    } else {
      setMunicipalities([]);
    }
  }, [searchTerm]);

  // Format the display value correctly
  const displayValue = value === "all" 
    ? allowAll ? (placeholder.includes("Origem") ? "Todas as origens" : "Todos os destinos") : ""
    : selectedMunicipality ? `${selectedMunicipality.name} - ${selectedMunicipality.state}` : value;

  // Find the selected municipality when value changes using only the City, State format
  useEffect(() => {
    if (value !== "all" && value) {
      // Parse the value which should be in format "City, State"
      const parts = value.split(", ");
      if (parts.length === 2) {
        const cityName = parts[0];
        const stateName = parts[1];
        
        // Find the municipality with matching city and state
        const found = municipalities.find(m => 
          m.name === cityName && m.state === stateName
        );
        
        if (found) {
          setSelectedMunicipality(found);
        }
      }
    } else {
      setSelectedMunicipality(null);
    }
  }, [value, municipalities]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {displayValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" sideOffset={5}>
        <Command>
          <CommandInput 
            placeholder={`Pesquisar ${placeholder.toLowerCase()}...`} 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {loading && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Carregando...
              </div>
            )}
            {!loading && searchTerm.length < 2 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Digite pelo menos 2 caracteres para pesquisar
              </div>
            )}
            {!loading && searchTerm.length >= 2 && (
              <>
                <CommandEmpty>Nenhum município encontrado</CommandEmpty>
                <CommandGroup>
                  {allowAll && (
                    <CommandItem
                      key="all"
                      value="all"
                      onSelect={() => {
                        onValueChange("all");
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === "all" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {placeholder.includes("Origem") ? "Todas as origens" : "Todos os destinos"}
                    </CommandItem>
                  )}
                  {municipalities.map((municipality) => (
                    <CommandItem
                      key={`${municipality.name}-${municipality.state}`}
                      value={municipality.name}
                      onSelect={() => {
                        // Format the value ONLY with comma (City, State) format
                        const formattedValue = `${municipality.name}, ${municipality.state}`;
                        setSelectedMunicipality(municipality);
                        onValueChange(formattedValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedMunicipality?.name === municipality.name && 
                          selectedMunicipality?.state === municipality.state 
                            ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {municipality.name} - {municipality.state}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MunicipalitySelect;
