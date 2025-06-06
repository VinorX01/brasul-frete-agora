
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { type Freight } from "@/lib/supabase";
import { recordFreightAgentReferral } from "@/lib/freightService";
import { BadgeCheck, Truck, RefrigeratorIcon, PackageCheck, DollarSign, Copy, CheckCircle2, Shield, Tent } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

interface FreightCardProps {
  freight: Freight;
  onViewDetails: (freight: Freight) => void;
  showPerKmRate?: boolean;
}

const FreightCard: React.FC<FreightCardProps> = ({
  freight,
  onViewDetails,
  showPerKmRate = false
}) => {
  const { trackEvent } = useAnalytics();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [agentCode, setAgentCode] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [shareableText, setShareableText] = useState("");
  const [copied, setCopied] = useState(false);

  // Check for agent code in URL parameters
  const [currentAgentCode, setCurrentAgentCode] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if URL has agent code parameter
    const urlParams = new URLSearchParams(window.location.search);
    const agParam = urlParams.get('ag');
    if (agParam) {
      setCurrentAgentCode(agParam);
    }
  }, []);

  const formatCurrency = (value: number | null) => {
    // Return "Valor a combinar" for null or zero values
    if (value === null || value === 0 || value === 0.00) {
      return "A combinar";
    }
    
    // Format as currency
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateAgentCommission = (value: number | null) => {
    if (value === null) return null;
    return value * 0.1; // 10% commission
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Calculate distance between origin and destination
  const calculateDistance = (): number | null => {
    // This would ideally use a real distance calculation API
    // For now, we'll use the freight_distance field if available
    return freight.freight_distance || null;
  };

  // Calculate the rate comparisons
  const calculateFreightRate = () => {
    const distance = calculateDistance();
    const weight = freight.weight ? freight.weight / 1000 : null; // Convert kg to tons
    const value = freight.value;

    // If distance or value is missing, we can't calculate the rate
    if (!distance || !value) return null;

    // Check if we're dealing with a per-ton price (less than R$1,000)
    const isPerTonValue = value < 1000;
    
    if (showPerKmRate) {
      // Comparison per km requires weight for both cases
      if (!weight) return null;
      
      // Comparison per km: (value per ton * weight in tons / distance in km) or (total freight value / distance in km)
      if (isPerTonValue) {
        return (value * weight) / distance;
      } else {
        return value / distance;
      }
    } else {
      // Per ton/km comparison
      if (isPerTonValue) {
        // For per-ton pricing (less than R$1,000), we don't need weight
        return value / distance; // Just divide the per-ton value by distance
      } else {
        // For total pricing (R$1,000 or more), we do need weight to calculate the per-ton rate
        if (!weight) return null;
        return value / (weight * distance);
      }
    }
  };

  // Format the rate for display
  const getFormattedRate = () => {
    const rate = calculateFreightRate();
    if (rate === null) return null;

    const formattedRate = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(rate);

    return showPerKmRate ? `${formattedRate} /km` : `${formattedRate} /ton/km`;
  };

  const handleGenerateLink = async () => {
    if (!agentCode) {
      toast({
        title: "Código obrigatório",
        description: "Por favor, insira seu código de agenciador.",
        variant: "destructive"
      });
      return;
    }

    // Track analytics event
    trackEvent('freight_card_agenciar_click');

    // Generate the agent URL with the new domain
    const domain = "https://brasultransportes.com";
    const url = `${domain}/frete/ag?${agentCode}&${freight.id}`;
    
    // Record referral in database
    await recordFreightAgentReferral(freight.id, agentCode);

    // Criar o texto completo para compartilhamento
    const formattedWeight = freight.weight ? `${freight.weight} kg` : "Não informado";
    const cargoContent = freight.cargo_content || "Não informado";
    
    const text = `Origem: ${freight.origin}
Destino: ${freight.destination}
Valor: ${formatCurrency(freight.value)}
Peso: ${formattedWeight}
Conteúdo da carga: ${cargoContent}
Link: ${url}`;

    // Armazenar o link e o texto completo
    setGeneratedLink(url);
    setShareableText(text);
    
    // Copiar para área de transferência
    navigator.clipboard.writeText(text);
    setCopied(true);
    
    toast({
      title: "Texto gerado com sucesso!",
      description: "As informações foram copiadas para sua área de transferência."
    });
    
    // Reset copied status after 3 seconds
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(shareableText);
    setCopied(true);
    
    toast({
      title: "Copiado!",
      description: "As informações foram copiadas para sua área de transferência."
    });
    
    // Reset copied status after 3 seconds
    setTimeout(() => setCopied(false), 3000);
  };

  const handleContactClick = async () => {
    // Track analytics event
    trackEvent('freight_card_quero_este_click');

    let whatsappText = `Olá! Tenho interesse no frete ${freight.id}`;
    
    // Add agent code if present
    if (currentAgentCode) {
      whatsappText += ` Agenciador: ${currentAgentCode}`;
      
      // Record referral in database
      await recordFreightAgentReferral(freight.id, currentAgentCode);
    }
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/5538997353264?text=${encodeURIComponent(whatsappText)}`, "_blank");
  };

  const handleViewDetails = () => {
    // Track analytics event
    trackEvent('freight_details_open');
    onViewDetails(freight);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between mb-4">
          <div className="text-primary font-bold">
            {formatCurrency(freight.value)}
            {/* Display the freight rate comparison if available */}
            {getFormattedRate() && (
              <div className="text-green-600 text-sm font-normal">
                {getFormattedRate()}
              </div>
            )}
          </div>
          <div className="text-gray-500 text-sm">
            <p>Publicado em: {formatDate(freight.date)}</p>  
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          {freight.origin} → {freight.destination}
        </h3>
        
        <div className="mb-4">
          <p className="text-gray-700">
            <strong>Tipo de Carga:</strong> {freight.cargo_type}
          </p>
          <p className="text-gray-700">
            <strong>Tipo de Caminhão:</strong> {freight.truck_type}
          </p>
          {freight.loading_date && (
            <p className="text-gray-700">
              <strong>Data de Carregamento:</strong> {formatDate(freight.loading_date)}
            </p>
          )}
          {freight.weight && (
            <p className="text-gray-700">
              <strong>Peso:</strong> {freight.weight} kg
            </p>
          )}
        </div>
        
        {/* Requirements badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {freight.refrigerated && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              <RefrigeratorIcon size={12} className="mr-1" /> Refrigerado
            </span>
          )}
          {freight.requires_mopp && (
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              <BadgeCheck size={12} className="mr-1" /> MOPP
            </span>
          )}
          {freight.toll_included && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              <DollarSign size={12} className="mr-1" /> Pedágio Incluso
            </span>
          )}
          {freight.tarp_required && (
            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
              <Tent size={12} className="mr-1" /> Lona Obrigatória
            </span>
          )}
          {freight.has_insurance && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              <Shield size={12} className="mr-1" /> Seguro
            </span>
          )}
          
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button variant="default" className="text-sm" onClick={handleContactClick}>
            <Truck className="mr-2 h-4 w-4" /> Quero Este
          </Button>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            Agenciar Frete
          </Button>
        </div>
        
        <div className="text-right mt-3">
          <Button variant="ghost" className="text-xs text-primary" onClick={handleViewDetails}>
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
              {freight.value !== null && (
                <span className="block mt-2 text-green-600 font-medium">
                  *Você pode receber até {formatCurrency(calculateAgentCommission(freight.value))}
                </span>
              )}
              <span className="block mt-1 text-xs text-gray-500">
                *Valor máximo caso seja o único intermediário.
              </span>
            </p>
            
            <Input placeholder="Digite seu código de agenciador" value={agentCode} onChange={e => setAgentCode(e.target.value)} className="mb-2" />
            
            <p className="text-xs text-gray-500 mt-2">
              Este código será usado para identificar você como agenciador deste frete.
            </p>
            
            {shareableText && (
              <div className="mt-4 p-3 bg-gray-100 rounded-md relative">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium">Seu texto para compartilhamento:</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleCopyClick}
                    className="h-6 w-6"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                  </Button>
                </div>
                <pre 
                  className="text-xs break-all whitespace-pre-wrap font-normal text-blue-600 cursor-pointer" 
                  onClick={handleCopyClick}
                >
                  {shareableText}
                </pre>
              </div>
            )}
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
