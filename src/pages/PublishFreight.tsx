import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";
import MunicipalitySelect from "@/components/MunicipalitySelect";
import { staticCargoTypes, staticTruckTypes } from "@/lib/freightService";

const PublishFreight = () => {
  const { trackEvent } = useAnalytics();

  // Track page view on component mount
  useEffect(() => {
    trackEvent('page_view_publish_freight');
  }, [trackEvent]);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [truckType, setTruckType] = useState("");
  const [value, setValue] = useState("");
  const [weight, setWeight] = useState("");
  const [loadingDate, setLoadingDate] = useState("");
  const [refrigerated, setRefrigerated] = useState(false);
  const [requiresMopp, setRequiresMopp] = useState(false);
  const [tollIncluded, setTollIncluded] = useState(false);
  const [observations, setObservations] = useState("");
  const [senderCompany, setSenderCompany] = useState("");
  const [cargoContent, setCargoContent] = useState("");
  const [liveCargo, setLiveCargo] = useState(false);
  const [dryCargo, setDryCargo] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [hasTracker, setHasTracker] = useState(false);
  const [tarpRequired, setTarpRequired] = useState(false);

  const cargoTypes = staticCargoTypes;
  const truckTypes = staticTruckTypes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('publish_freight_submit');

    // Simulate successful submission
    toast({
      title: "Frete publicado com sucesso!",
      description: "Seu frete foi adicionado à lista de fretes disponíveis."
    });

    // Clear form fields
    setOrigin("");
    setDestination("");
    setCargoType("");
    setTruckType("");
    setValue("");
    setWeight("");
    setLoadingDate("");
    setRefrigerated(false);
    setRequiresMopp(false);
    setTollIncluded(false);
    setObservations("");
    setSenderCompany("");
    setCargoContent("");
    setLiveCargo(false);
    setDryCargo(false);
    setHasInsurance(false);
    setHasTracker(false);
    setTarpRequired(false);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Publicar um Frete</CardTitle>
          <CardDescription>
            Preencha os detalhes do frete para que os caminhoneiros possam encontrá-lo.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origin">Origem</Label>
                <MunicipalitySelect
                  value={origin}
                  onValueChange={setOrigin}
                  placeholder="Cidade de Origem"
                />
              </div>
              <div>
                <Label htmlFor="destination">Destino</Label>
                <MunicipalitySelect
                  value={destination}
                  onValueChange={setDestination}
                  placeholder="Cidade de Destino"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cargoType">Tipo de Carga</Label>
                <Select value={cargoType} onValueChange={setCargoType}>
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
                <Label htmlFor="truckType">Tipo de Caminhão</Label>
                <Select value={truckType} onValueChange={setTruckType}>
                  <SelectTrigger id="truckType">
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
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">Valor do Frete (R$)</Label>
                <Input
                  type="number"
                  id="value"
                  placeholder="Valor do frete"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="weight">Peso da Carga (kg)</Label>
                <Input
                  type="number"
                  id="weight"
                  placeholder="Peso da carga"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="loadingDate">Data de Carregamento</Label>
              <Input
                type="date"
                id="loadingDate"
                value={loadingDate}
                onChange={(e) => setLoadingDate(e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="senderCompany">Empresa Remetente</Label>
                <Input
                  type="text"
                  id="senderCompany"
                  placeholder="Nome da empresa remetente"
                  value={senderCompany}
                  onChange={(e) => setSenderCompany(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cargoContent">Conteúdo da Carga</Label>
                <Input
                  type="text"
                  id="cargoContent"
                  placeholder="Descrição do conteúdo da carga"
                  value={cargoContent}
                  onChange={(e) => setCargoContent(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                placeholder="Observações adicionais"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="refrigerated"
                checked={refrigerated}
                onCheckedChange={setRefrigerated}
              />
              <Label htmlFor="refrigerated">Refrigerado</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresMopp"
                checked={requiresMopp}
                onCheckedChange={setRequiresMopp}
              />
              <Label htmlFor="requiresMopp">Requer MOPP</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="tollIncluded"
                checked={tollIncluded}
                onCheckedChange={setTollIncluded}
              />
              <Label htmlFor="tollIncluded">Pedágio Incluso</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="liveCargo"
                checked={liveCargo}
                onCheckedChange={setLiveCargo}
              />
              <Label htmlFor="liveCargo">Carga Viva</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dryCargo"
                checked={dryCargo}
                onCheckedChange={setDryCargo}
              />
              <Label htmlFor="dryCargo">Carga Seca</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasInsurance"
                checked={hasInsurance}
                onCheckedChange={setHasInsurance}
              />
              <Label htmlFor="hasInsurance">Possui Seguro</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasTracker"
                checked={hasTracker}
                onCheckedChange={setHasTracker}
              />
              <Label htmlFor="hasTracker">Possui Rastreador</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="tarpRequired"
                checked={tarpRequired}
                onCheckedChange={setTarpRequired}
              />
              <Label htmlFor="tarpRequired">Lona Obrigatória</Label>
            </div>

            <Button type="submit">
              <Send className="mr-2 h-4 w-4" /> Publicar Frete
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublishFreight;
