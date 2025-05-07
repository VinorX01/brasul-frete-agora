
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Freight } from "@/lib/mockFreights";
import { toast } from "@/components/ui/use-toast";

interface FreightCardProps {
  freight: Freight;
  onViewDetails: (freight: Freight) => void;
}

const FreightCard: React.FC<FreightCardProps> = ({
  freight,
  onViewDetails
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [agentCode, setAgentCode] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const formatCurrency = (value: number | null) => {
    // Se o valor for nulo, retorna "Valor a combinar"
    if (value === null) {
      return "Valor a combinar";
    }
    
    // Caso contrário, formata como moeda
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
    const url = `https://brasul.com/frete/ag?${agentCode}&${freight.id}`;

    // Copy URL to clipboard
    navigator.clipboard.writeText(url);
    setGeneratedLink(url);
    toast({
      title: "Link gerado com sucesso!",
      description: "O link foi copiado para sua área de transferência."
    });
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
          <p className="text-gray-700">
            <strong>Tipo de Caminhão:</strong> {freight.truckType}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button variant="default" className="text-sm" onClick={() => window.open(`https://wa.me/5599999999999?text=Olá! Tenho interesse no frete ${freight.id}`, "_blank")}>
            Quero Este
          </Button>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            Agenciar Frete
          </Button>
        </div>
        
        <div className="text-right mt-3">
          <Button variant="ghost" className="text-xs text-primary" onClick={() => onViewDetails(freight)}>
            Ver detalhes completos
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
            
            <Input placeholder="Digite seu código de agenciador" value={agentCode} onChange={e => setAgentCode(e.target.value)} className="mb-2" />
            
            <p className="text-xs text-gray-500 mt-2">
              Este código será usado para identificar você como agenciador deste frete.
            </p>
            
            {generatedLink && <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <p className="text-sm font-medium">Seu link único:</p>
                <p className="text-xs break-all mt-1 text-[#0095ff] font-normal">{generatedLink}</p>
              </div>}
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
