
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
import { getUniqueCargoTypes } from "@/lib/mockFreights";
import { toast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";

const PublishFreight = () => {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    cargoType: "",
    value: "",
    contact: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const cargoTypes = getUniqueCargoTypes();

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

    if (!formData.cargoType) {
      toast({
        title: "Tipo de carga é obrigatório",
        description: "Por favor, selecione o tipo de carga a ser transportada.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.value.trim()) {
      toast({
        title: "Valor é obrigatório",
        description: "Por favor, informe o valor do frete.",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Frete publicado com sucesso!",
        description: "Seu frete já está disponível para os caminhoneiros e agenciadores.",
      });
      
      // Reset form
      setFormData({
        origin: "",
        destination: "",
        cargoType: "",
        value: "",
        contact: "",
        description: "",
      });
      
      setIsSubmitting(false);
    }, 1000);
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
                <Label htmlFor="cargoType">Tipo de Carga *</Label>
                <Select
                  value={formData.cargoType}
                  onValueChange={(value) => handleChange("cargoType", value)}
                  required
                >
                  <SelectTrigger id="cargoType">
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
                <Label htmlFor="value">Valor do Frete (R$) *</Label>
                <Input
                  id="value"
                  type="number"
                  placeholder="Ex: 3500"
                  value={formData.value}
                  onChange={(e) => handleChange("value", e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2">
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
