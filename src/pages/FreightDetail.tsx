
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck, ArrowLeft, Phone, RefrigeratorIcon, BadgeCheck, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { findFreightById, recordFreightAgentReferral } from "@/lib/freightService";
import { type Freight } from "@/lib/supabase";

const FreightDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [freight, setFreight] = useState<Freight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [agentCode, setAgentCode] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    // Extract agent code from query parameters if present
    const searchParams = new URLSearchParams(location.search);
    const ag = searchParams.get('ag');
    if (ag) {
      setAgentCode(ag);
    } else {
      // Check if the path has "ag" format (brasultransportes.com/frete/ag?12345&freightId)
      const pathParts = location.pathname.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      
      if (lastPart === 'ag') {
        // This is an agent link, parse the query string
        const queryParts = location.search.substring(1).split('&');
        if (queryParts.length >= 2) {
          const agCode = queryParts[0]; // Agent code
          const freightId = queryParts[1]; // Freight ID
          
          setAgentCode(agCode);
          
          // If we have a freight ID from the URL, use it for finding the freight
          if (freightId) {
            loadFreight(freightId);
            return; // Skip the rest of the effect
          }
        }
      }
    }
    
    // Standard freight ID lookup
    if (id) {
      loadFreight(id);
    } else {
      setIsLoading(false);
    }
  }, [id, location]);

  const loadFreight = async (freightId: string) => {
    try {
      const freight = await findFreightById(freightId);
      setFreight(freight);
    } catch (error) {
      console.error("Error fetching freight:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    if (freight) {
      let message = `Olá! Tenho interesse no frete ${freight.id}`;
      if (agentCode) {
        message += ` Agenciador: ${agentCode}`;
        
        // Record referral in database
        await recordFreightAgentReferral(freight.id, agentCode);
      }
      
      window.open(`https://wa.me/5538997353264?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <Truck size={48} className="text-primary animate-pulse mb-4" />
          <p className="text-lg">Carregando informações do frete...</p>
        </div>
      </div>
    );
  }

  if (!freight) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Frete não encontrado</h1>
          <p className="mb-6">O frete que você está procurando não existe ou foi removido.</p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para busca
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="outline" onClick={handleGoBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>

        {agentCode && (
          <div className="bg-accent p-4 rounded-lg mb-6 border border-primary-light">
            <p className="text-sm text-center font-medium">
              Você está visualizando este frete através do agenciador código: <strong>{agentCode}</strong>
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4 pb-4 border-b">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {freight.origin} → {freight.destination}
              </h1>
              <p className="text-gray-500 text-sm">
                ID: {freight.id} • Publicado em: {formatDate(freight.date)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">
                {formatCurrency(freight.value)}
              </div>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded mt-1">
                {freight.status === 'available' ? 'Disponível' : freight.status}
              </span>
            </div>
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
                <BadgeCheck size={12} className="mr-1" /> Requer MOPP
              </span>
            )}
            {freight.toll_included && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                <DollarSign size={12} className="mr-1" /> Pedágio Incluso
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="font-semibold mb-2">Detalhes do Frete</h2>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Origem:</span>
                  <span className="font-medium">{freight.origin}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Destino:</span>
                  <span className="font-medium">{freight.destination}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Tipo de Carga:</span>
                  <span className="font-medium">{freight.cargo_type}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Tipo de Caminhão:</span>
                  <span className="font-medium">{freight.truck_type}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-medium">{formatCurrency(freight.value)}</span>
                </li>
                {freight.weight && (
                  <li className="flex justify-between">
                    <span className="text-gray-600">Peso:</span>
                    <span className="font-medium">{freight.weight} kg</span>
                  </li>
                )}
                {freight.loading_date && (
                  <li className="flex justify-between">
                    <span className="text-gray-600">Data de Carregamento:</span>
                    <span className="font-medium">{formatDate(freight.loading_date)}</span>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Informações de Contato</h2>
              <p className="mb-4">
                Entre em contato com o embarcador para negociar este frete:
              </p>
              <Button 
                onClick={handleContactClick} 
                className="w-full flex items-center justify-center"
              >
                <Phone className="mr-2 h-5 w-5" />
                Contato via WhatsApp
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Mencione o ID do frete ao entrar em contato
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            <h3 className="font-semibold mb-2">Aviso importante</h3>
            <p>
              A Brasul Transportes apenas disponibiliza a plataforma para conexão entre embarcadores e transportadores. 
              Recomendamos que verifique a documentação e informações necessárias antes de fechar negócio.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="mb-4">Procurando mais fretes nesta rota?</p>
          <Button onClick={() => navigate('/frete')}>
            Ver todos os fretes disponíveis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FreightDetail;
