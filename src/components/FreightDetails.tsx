
import { type Freight } from "@/lib/supabase";
import { recordFreightAgentReferral } from "@/lib/freightService";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface FreightDetailsProps {
  freight: Freight | null;
  isOpen: boolean;
  onClose: () => void;
}

const FreightDetails: React.FC<FreightDetailsProps> = ({ 
  freight, 
  isOpen, 
  onClose 
}) => {
  // Check for agent code in URL parameters
  const [agentCode, setAgentCode] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if URL has agent code parameter
    const urlParams = new URLSearchParams(window.location.search);
    const agParam = urlParams.get('ag');
    if (agParam) {
      setAgentCode(agParam);
    } else {
      // Check if path has ag format
      const pathParts = window.location.pathname.split('/');
      if (pathParts.includes('ag')) {
        const searchParams = window.location.search.substring(1).split('&');
        if (searchParams.length > 0) {
          setAgentCode(searchParams[0]);
        }
      }
    }
  }, []);

  const formatCurrency = (value: number | null) => {
    // Return "Valor a combinar" for null values
    if (value === null) {
      return "Valor a combinar";
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não informado";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleContactClick = async () => {
    if (!freight) return;
    
    let whatsappText = `Olá! Tenho interesse no frete ${freight.id}`;
    
    // Add agent code if present
    if (agentCode) {
      whatsappText += ` Agenciador: ${agentCode}`;
      
      // Record referral in database
      await recordFreightAgentReferral(freight.id, agentCode);
    }
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/5538997353264?text=${encodeURIComponent(whatsappText)}`, "_blank");
  };

  if (!freight) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold text-primary">
            {freight.origin} → {freight.destination}
          </SheetTitle>
          <SheetDescription>
            <span className="text-lg font-semibold text-primary">{formatCurrency(freight.value)}</span>
            <span className="text-sm text-gray-500 ml-2">• Publicado em: {formatDate(freight.date)}</span>
          </SheetDescription>
        </SheetHeader>

        {agentCode && (
          <div className="bg-accent p-3 rounded-md mb-4 border border-primary-light">
            <p className="text-sm text-center font-medium">
              Visualizando via agenciador: <strong>{agentCode}</strong>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-primary mb-2">Informações Básicas</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Código do Frete:</span>
                <span className="font-medium">{freight.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data de Carregamento:</span>
                <span className="font-medium">{formatDate(freight.loading_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status do Frete:</span>
                <span className="font-medium">{freight.status === 'available' ? 'Disponível' : freight.status}</span>
              </div>
              {freight.expected_delivery_date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Data de Entrega Prevista:</span>
                  <span className="font-medium">{formatDate(freight.expected_delivery_date)}</span>
                </div>
              )}
              {freight.sender_company && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Empresa Remetente:</span>
                  <span className="font-medium">{freight.sender_company}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-primary mb-2">Peso e Requisitos</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Peso:</span>
                <span className="font-medium">{freight.weight ? `${freight.weight} kg` : 'Não informado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Refrigerado:</span>
                <span className="font-medium">{freight.refrigerated ? 'Sim' : 'Não'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Requer MOPP:</span>
                <span className="font-medium">{freight.requires_mopp ? 'Sim' : 'Não'}</span>
              </div>
              {freight.freight_distance && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Distância:</span>
                  <span className="font-medium">{freight.freight_distance} km</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Lona Obrigatória:</span>
                <span className="font-medium">{freight.tarp_required ? 'Sim' : 'Não'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-primary mb-2">Detalhes da Carga</h4>
            <div className="bg-gray-50 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo de Carga:</span>
                <span className="font-medium">{freight.cargo_type}</span>
              </div>
              {freight.cargo_content && (
                <div className="flex justify-between md:col-span-2">
                  <span className="text-gray-600">Conteúdo da Carga:</span>
                  <span className="font-medium">{freight.cargo_content}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo de Caminhão:</span>
                <span className="font-medium">{freight.truck_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pedágio Incluso:</span>
                <span className="font-medium">{freight.toll_included ? 'Sim' : 'Não'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valor:</span>
                <span className="font-medium">{formatCurrency(freight.value)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Carga Viva:</span>
                <span className="font-medium">{freight.live_cargo ? 'Sim' : 'Não'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Carga Seca:</span>
                <span className="font-medium">{freight.dry_cargo ? 'Sim' : 'Não'}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-primary mb-2">Segurança e Rastreamento</h4>
            <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Seguro:</span>
                <span className="font-medium">{freight.has_insurance ? 'Sim' : 'Não'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rastreador:</span>
                <span className="font-medium">{freight.has_tracker ? 'Sim' : 'Não'}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-primary mb-2">Endereços</h4>
            <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Endereço de Embarque:</span>
                <p className="font-medium">{freight.origin}</p>
              </div>
              <div>
                <span className="text-gray-600">Endereço de Entrega:</span>
                <p className="font-medium">{freight.destination}</p>
              </div>
            </div>
          </div>

          {freight.observations && (
            <div>
              <h4 className="font-medium text-primary mb-2">Observações</h4>
              <div className="bg-gray-50 p-4 rounded-md text-sm">
                <p>{freight.observations}</p>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button className="w-full sm:w-auto" onClick={handleContactClick}>
            Quero Este Frete
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto" 
            onClick={onClose}
          >
            Fechar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FreightDetails;
