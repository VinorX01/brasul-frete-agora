
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Freight } from "@/lib/mockFreights";
import { toast } from "@/components/ui/use-toast";

interface FreightCardProps {
  freight: Freight;
}

const FreightCard: React.FC<FreightCardProps> = ({ freight }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [agentCode, setAgentCode] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleGenerateLink = () => {
    if (!agentCode) {
      toast({
        title: "Código obrigatório",
        description: "Por favor, insira seu código de agenciador.",
        variant: "destructive"
      });
      return;
    }

    // Generate the agent URL
    const url = `${window.location.origin}/frete/${freight.id}?ag=${agentCode}`;
    
    // Generate WhatsApp message URL
    const whatsappMsg = `Olá! Tenho interesse no frete ${freight.id} - Agenciador: ${agentCode}`;
    const whatsappUrl = `https://wa.me/5599999999999?text=${encodeURIComponent(whatsappMsg)}`;
    
    // Copy URL to clipboard
    navigator.clipboard.writeText(url);
    
    toast({
      title: "Link gerado com sucesso!",
      description: "O link foi copiado para sua área de transferência."
    });

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between mb-4">
          <div className="text-primary font-bold">
            {formatCurrency(freight.value)}
          </div>
          <div className="text-gray-500 text-sm">
            Publicado em: {formatDate(freight.date)}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          {freight.origin} → {freight.destination}
        </h3>
        
        <div className="mb-4">
          <p className="text-gray-700">
            <strong>Tipo de Carga:</strong> {freight.cargoType}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="outline" 
            className="text-sm"
            onClick={() => window.open(`https://wa.me/5599999999999?text=Olá! Tenho interesse no frete ${freight.id}`, "_blank")}
          >
            Contato Direto
          </Button>
          <Button 
            className="bg-primary hover:bg-primary-dark" 
            onClick={() => setIsDialogOpen(true)}
          >
            Agenciar Frete
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agenciar este frete</DialogTitle>
            <DialogDescription>
              Digite seu código de agenciador para gerar um link personalizado para este frete.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4 text-sm">
              <strong>Origem:</strong> {freight.origin}<br />
              <strong>Destino:</strong> {freight.destination}<br />
              <strong>Valor:</strong> {formatCurrency(freight.value)}
            </p>
            
            <Input
              placeholder="Digite seu código de agenciador"
              value={agentCode}
              onChange={(e) => setAgentCode(e.target.value)}
              className="mb-2"
            />
            
            <p className="text-xs text-gray-500 mt-2">
              Este código será usado para identificar você como agenciador deste frete.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleGenerateLink}>Gerar Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FreightCard;
