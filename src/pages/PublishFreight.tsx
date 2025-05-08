
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createFreight, staticCargoTypes, staticTruckTypes } from "@/lib/freightService";
import { toast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";

const PublishFreight = () => {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    cargo_type: "",
    truck_type: "",
    value: "",
    contact: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const cargoTypes = staticCargoTypes;
  const truckTypes = staticTruckTypes;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.origin.trim()) {
      toast({
        title: "Origem é obrigatória",
        description: "Por favor, informe a cidade de origem do frete.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.destination.trim()) {
      toast({
        title: "Destino é obrigatório",
        description: "Por favor, informe a cidade de destino do frete.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.cargo_type) {
      toast({
        title: "Tipo de carga é obrigatório",
        description: "Por favor, selecione o tipo de carga a ser transportada.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.truck_type) {
      toast({
        title: "Tipo de caminhão é obrigatório",
        description: "Por favor, selecione o tipo de caminhão necessário.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.contact.trim()) {
      toast({
        title: "Contato é obrigatório",
        description: "Por favor, informe um telefone para contato.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert value to number or null for "a combinar"
      const valueAsNumber = formData.value.trim() === "" ? null : parseFloat(formData.value);
      
      // Create the freight
      const result = await createFreight({
        origin: formData.origin,
        destination: formData.destination,
        cargo_type: formData.cargo_type,
        truck_type: formData.truck_type,
        value: valueAsNumber,
        contact: formData.contact
      });
      
      if (result) {
        // Reset form on success
        setFormData({
          origin: "",
          destination: "",
          cargo_type: "",
          truck_type: "",
          value: "",
          contact: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Error creating freight:", error);
      toast({
        title: "Erro ao publicar frete",
        description: "Ocorreu um erro ao publicar o frete. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Publicar Frete</h1>
          <p className="text-gray-600">
            Publique seu frete gratuitamente e encontre caminhoneiros qualificados para o transporte da sua carga.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="origin">Cidade de Origem *</Label>
                <Input
                  id="origin"
                  placeholder="Ex: São Paulo, SP"
                  value={formData.origin}
                  onChange={(e) => handleChange("origin", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="destination">Cidade de Destino *</Label>
                <Input
                  id="destination"
                  placeholder="Ex: Rio de Janeiro, RJ"
                  value={formData.destination}
                  onChange={(e) => handleChange("destination", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="cargo_type">Tipo de Carga *</Label>
                <Select
                  value={formData.cargo_type}
                  onValueChange={(value) => handleChange("cargo_type", value)}
                  required
                >
                  <SelectTrigger id="cargo_type">
                    <SelectValue placeholder="Selecione o tipo de carga" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargoTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="truck_type">Tipo de Caminhão/Carroceria *</Label>
                <Select
                  value={formData.truck_type}
                  onValueChange={(value) => handleChange("truck_type", value)}
                  required
                >
                  <SelectTrigger id="truck_type">
                    <SelectValue placeholder="Selecione o tipo de caminhão" />
                  </SelectTrigger>
                  <SelectContent>
                    {truckTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="value">Valor do Frete (R$)</Label>
                <Input
                  id="value"
                  type="number"
                  placeholder="Ex: 3500 (deixe em branco para 'A combinar')"
                  value={formData.value}
                  onChange={(e) => handleChange("value", e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Deixe em branco para "Valor a combinar"</p>
              </div>

              <div>
                <Label htmlFor="contact">Telefone para Contato *</Label>
                <Input
                  id="contact"
                  placeholder="Ex: (11) 98765-4321"
                  value={formData.contact}
                  onChange={(e) => handleChange("contact", e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Descrição da Carga (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva mais detalhes sobre a carga, como peso, dimensões, etc."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="text-center">
              <Button 
                type="submit" 
                className="px-8" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Publicando..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Publicar Frete
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Ao publicar um frete, você concorda com os termos de uso da plataforma.</p>
              <p className="mt-2">* Campos obrigatórios</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublishFreight;
