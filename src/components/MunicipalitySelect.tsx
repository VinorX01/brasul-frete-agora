
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

  const displayValue = value === "all" 
    ? allowAll ? (placeholder.includes("Origem") ? "Todas as origens" : "Todos os destinos") : ""
    : value;

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
                      onValueChange(municipality.name);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === municipality.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {municipality.name} - {municipality.state}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MunicipalitySelect;
