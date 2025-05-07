import { Freight } from "@/lib/mockFreights";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleContactClick = () => {
    if (!freight) return;
    
    let whatsappText = `Olá! Tenho interesse no frete ${freight.id}`;
    
    // Add agent code if present
    if (agentCode) {
      whatsappText += ` - Agenciador: ${agentCode}`;
    }
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/5538997353264?text=${encodeURIComponent(whatsappText)}`, "_blank");
  };

  if (!freight) return null;

  // Mock additional freight details
  const extendedDetails = {
    codigo: freight.id,
    dataCarregamento: "10/05/2023",
    dataEntregaPrevista: "15/05/2023",
    dataEntregaReal: "",
    localizacaoTransportador: "São Paulo, SP",
    transportador: "Transportes Brasil LTDA",
    empresaRemetente: "Indústrias Reunidas S.A.",
    empresaDestinataria: "Comércio Geral LTDA",
    conteudoCarga: "Materiais eletrônicos",
    especieCarga: "Produtos industrializados",
    pesoCarga: "1.200 kg",
    dimensoesCarga: "2,5m x 1,8m x 2,0m",
    refrigerado: "Não",
    cargaViva: "Não",
    cargaSeca: "Sim",
    quantidade: "Fixa",
    notaFiscal: "DANFe disponível",
    documentosAdicionais: "Não necessário",
    necessarioMOPP: "Não",
    complemento: "Completo",
    carregamento: "Livre",
    descarregamento: "Chapa",
    statusFrete: "Disponível",
    tipoVeiculo: "Truck",
    placaVeiculo: "",
    pedagio: "Incluso - Tag",
    rotaEspecifica: "Não",
    nomeCaminhoneiro: "",
    fiscalizacao: "Normal",
    enderecoEmbarque: "Av. Industrial, 1500, São Paulo - SP",
    enderecoEntrega: "Rod. BR-101, km 120, Rio de Janeiro - RJ",
    distanciaFrete: "430 km",
    seguro: "Sim",
    rastreador: "Recomendado",
    observacoes: "Carga frágil, manuseio cuidadoso",
    obrigatorioLona: "Sim"
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-primary mb-2">Informações Básicas</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Código do Frete:</span>
                <span className="font-medium">{extendedDetails.codigo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data de Carregamento:</span>
                <span className="font-medium">{extendedDetails.dataCarregamento}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data de Entrega Prevista:</span>
                <span className="font-medium">{extendedDetails.dataEntregaPrevista}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status do Frete:</span>
                <span className="font-medium">{extendedDetails.statusFrete}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-primary mb-2">Empresas</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Empresa Remetente:</span>
                <span className="font-medium">{extendedDetails.empresaRemetente}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Empresa Destinatária:</span>
                <span className="font-medium">{extendedDetails.empresaDestinataria}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transportador:</span>
                <span className="font-medium">{extendedDetails.transportador}</span>
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
                <span className="font-medium">{freight.cargoType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conteúdo:</span>
                <span className="font-medium">{extendedDetails.conteudoCarga}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Espécie:</span>
                <span className="font-medium">{extendedDetails.especieCarga}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Peso:</span>
                <span className="font-medium">{extendedDetails.pesoCarga}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dimensões:</span>
                <span className="font-medium">{extendedDetails.dimensoesCarga}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Refrigerado:</span>
                <span className="font-medium">{extendedDetails.refrigerado}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Carga Viva:</span>
                <span className="font-medium">{extendedDetails.cargaViva}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Carga Seca:</span>
                <span className="font-medium">{extendedDetails.cargaSeca}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantidade:</span>
                <span className="font-medium">{extendedDetails.quantidade}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-primary mb-2">Documentação e Requisitos</h4>
            <div className="bg-gray-50 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nota Fiscal:</span>
                <span className="font-medium">{extendedDetails.notaFiscal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Docs Adicionais:</span>
                <span className="font-medium">{extendedDetails.documentosAdicionais}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Necessário MOPP:</span>
                <span className="font-medium">{extendedDetails.necessarioMOPP}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Complemento:</span>
                <span className="font-medium">{extendedDetails.complemento}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Obrigatório Lona:</span>
                <span className="font-medium">{extendedDetails.obrigatorioLona}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-primary mb-2">Logística</h4>
            <div className="bg-gray-50 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Carregamento:</span>
                <span className="font-medium">{extendedDetails.carregamento}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Descarregamento:</span>
                <span className="font-medium">{extendedDetails.descarregamento}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo de Veículo:</span>
                <span className="font-medium">{extendedDetails.tipoVeiculo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pedágio:</span>
                <span className="font-medium">{extendedDetails.pedagio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rota Específica:</span>
                <span className="font-medium">{extendedDetails.rotaEspecifica}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distância:</span>
                <span className="font-medium">{extendedDetails.distanciaFrete}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seguro:</span>
                <span className="font-medium">{extendedDetails.seguro}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rastreador:</span>
                <span className="font-medium">{extendedDetails.rastreador}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-primary mb-2">Endereços</h4>
            <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Endereço de Embarque:</span>
                <p className="font-medium">{extendedDetails.enderecoEmbarque}</p>
              </div>
              <div>
                <span className="text-gray-600">Endereço de Entrega:</span>
                <p className="font-medium">{extendedDetails.enderecoEntrega}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-primary mb-2">Observações</h4>
            <div className="bg-gray-50 p-4 rounded-md text-sm">
              <p>{extendedDetails.observacoes}</p>
            </div>
          </div>
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
