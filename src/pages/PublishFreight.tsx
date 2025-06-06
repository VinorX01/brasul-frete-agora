
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Truck, Phone } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { staticCargoTypes, staticTruckTypes } from "@/lib/freightService";
import MunicipalitySelect from "@/components/MunicipalitySelect";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";
import MobilePageWrapper from "@/components/MobilePageWrapper";

const PublishFreight = () => {
  const { trackEvent } = useAnalytics();

  // Track page view on component mount
  useEffect(() => {
    trackEvent('page_view_publish_freight');
  }, [trackEvent]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingDate, setLoadingDate] = useState<Date>();
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<Date>();
  
  // Form state
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    cargoType: "",
    truckType: "",
    value: "",
    weight: "",
    contact: "",
    senderCompany: "",
    cargoContent: "",
    description: "",
    observations: "",
    processingDate: "",
    refrigerated: false,
    requiresMopp: false,
    tollIncluded: false,
    tarpRequired: false,
    hasInsurance: false,
    hasTracker: false,
    liveCargo: false,
    dryCargo: false
  });

  const cargoTypes = staticCargoTypes;
  const truckTypes = staticTruckTypes;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.origin || !formData.destination || !formData.cargoType || !formData.truckType || !formData.contact) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      // Prepare data for submission
      const freightData = {
        origin: formData.origin,
        destination: formData.destination,
        cargo_type: formData.cargoType,
        truck_type: formData.truckType,
        value: formData.value ? parseFloat(formData.value) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        contact: formData.contact,
        sender_company: formData.senderCompany || null,
        cargo_content: formData.cargoContent || null,
        description: formData.description || null,
        observations: formData.observations || null,
        processing_date: formData.processingDate || null,
        loading_date: loadingDate?.toISOString() || null,
        expected_delivery_date: expectedDeliveryDate?.toISOString() || null,
        refrigerated: formData.refrigerated,
        requires_mopp: formData.requiresMopp,
        toll_included: formData.tollIncluded,
        tarp_required: formData.tarpRequired,
        has_insurance: formData.hasInsurance,
        has_tracker: formData.hasTracker,
        live_cargo: formData.liveCargo,
        dry_cargo: formData.dryCargo,
        status: 'available'
      };

      const { error } = await supabase
        .from('freights')
        .insert([freightData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Frete publicado com sucesso!",
        description: "Seu frete foi publicado e já está disponível para os caminhoneiros."
      });

      // Reset form
      setFormData({
        origin: "",
        destination: "",
        cargoType: "",
        truckType: "",
        value: "",
        weight: "",
        contact: "",
        senderCompany: "",
        cargoContent: "",
        description: "",
        observations: "",
        processingDate: "",
        refrigerated: false,
        requiresMopp: false,
        tollIncluded: false,
        tarpRequired: false,
        hasInsurance: false,
        hasTracker: false,
        liveCargo: false,
        dryCargo: false
      });
      setLoadingDate(undefined);
      setExpectedDeliveryDate(undefined);

    } catch (error) {
      console.error('Error publishing freight:', error);
      toast({
        title: "Erro ao publicar frete",
        description: "Ocorreu um erro ao publicar seu frete. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/5538997353264?text=Olá! Preciso de ajuda para publicar um frete.", "_blank");
    toast({
      title: "Redirecionando para WhatsApp",
      description: "Você será atendido em breve por nossos especialistas."
    });
  };

  return (
    <MobilePageWrapper>
      <div className="min-h-screen" style={{ backgroundColor: '#f4f4fc' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-4">Publicar Frete</h1>
              <p className="text-lg text-gray-600">
                Publique seu frete e conecte-se com caminhoneiros de confiança
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Informações do Frete
                </CardTitle>
                <CardDescription>
                  Preencha os dados do seu frete para conectar com caminhoneiros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Origem e Destino */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="origin">Origem *</Label>
                      <MunicipalitySelect
                        value={formData.origin}
                        onValueChange={(value) => handleInputChange("origin", value)}
                        placeholder="Selecione a origem"
                        allowAll={false}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="destination">Destino *</Label>
                      <MunicipalitySelect
                        value={formData.destination}
                        onValueChange={(value) => handleInputChange("destination", value)}
                        placeholder="Selecione o destino"
                        allowAll={false}
                      />
                    </div>
                  </div>

                  {/* Tipo de Carga e Caminhão */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cargoType">Tipo de Carga *</Label>
                      <Select value={formData.cargoType} onValueChange={(value) => handleInputChange("cargoType", value)}>
                        <SelectTrigger>
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
                      <Label htmlFor="truckType">Tipo de Caminhão *</Label>
                      <Select value={formData.truckType} onValueChange={(value) => handleInputChange("truckType", value)}>
                        <SelectTrigger>
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

                  {/* Valor e Peso */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="value">Valor do Frete (R$)</Label>
                      <Input
                        id="value"
                        type="number"
                        step="0.01"
                        placeholder="Ex: 1500.00"
                        value={formData.value}
                        onChange={(e) => handleInputChange("value", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="weight">Peso da Carga (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="Ex: 15000"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Datas */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Data de Carregamento</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {loadingDate ? format(loadingDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={loadingDate}
                            onSelect={setLoadingDate}
                            locale={ptBR}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Data Prevista de Entrega</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {expectedDeliveryDate ? format(expectedDeliveryDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={expectedDeliveryDate}
                            onSelect={setExpectedDeliveryDate}
                            locale={ptBR}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Empresa e Contato */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="senderCompany">Empresa Remetente</Label>
                      <Input
                        id="senderCompany"
                        placeholder="Nome da empresa"
                        value={formData.senderCompany}
                        onChange={(e) => handleInputChange("senderCompany", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact">Contato *</Label>
                      <Input
                        id="contact"
                        placeholder="Telefone/WhatsApp"
                        value={formData.contact}
                        onChange={(e) => handleInputChange("contact", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Conteúdo da Carga */}
                  <div>
                    <Label htmlFor="cargoContent">Conteúdo da Carga</Label>
                    <Input
                      id="cargoContent"
                      placeholder="Descreva o conteúdo da carga"
                      value={formData.cargoContent}
                      onChange={(e) => handleInputChange("cargoContent", e.target.value)}
                    />
                  </div>

                  {/* Descrição */}
                  <div>
                    <Label htmlFor="description">Descrição Adicional</Label>
                    <Textarea
                      id="description"
                      placeholder="Informações adicionais sobre o frete"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>

                  {/* Observações */}
                  <div>
                    <Label htmlFor="observations">Observações</Label>
                    <Textarea
                      id="observations"
                      placeholder="Observações importantes"
                      value={formData.observations}
                      onChange={(e) => handleInputChange("observations", e.target.value)}
                    />
                  </div>

                  {/* Data de Processamento */}
                  <div>
                    <Label htmlFor="processingDate">Data de Processamento</Label>
                    <Input
                      id="processingDate"
                      placeholder="Data de processamento do pedido"
                      value={formData.processingDate}
                      onChange={(e) => handleInputChange("processingDate", e.target.value)}
                    />
                  </div>

                  {/* Checkboxes para requisitos */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Requisitos Especiais</Label>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="refrigerated"
                          checked={formData.refrigerated}
                          onCheckedChange={(checked: boolean) => handleInputChange("refrigerated", checked)}
                        />
                        <Label htmlFor="refrigerated">Carga Refrigerada</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="requiresMopp"
                          checked={formData.requiresMopp}
                          onCheckedChange={(checked: boolean) => handleInputChange("requiresMopp", checked)}
                        />
                        <Label htmlFor="requiresMopp">Requer MOPP</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="tollIncluded"
                          checked={formData.tollIncluded}
                          onCheckedChange={(checked: boolean) => handleInputChange("tollIncluded", checked)}
                        />
                        <Label htmlFor="tollIncluded">Pedágio Incluso</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="tarpRequired"
                          checked={formData.tarpRequired}
                          onCheckedChange={(checked: boolean) => handleInputChange("tarpRequired", checked)}
                        />
                        <Label htmlFor="tarpRequired">Lona Obrigatória</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasInsurance"
                          checked={formData.hasInsurance}
                          onCheckedChange={(checked: boolean) => handleInputChange("hasInsurance", checked)}
                        />
                        <Label htmlFor="hasInsurance">Possui Seguro</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasTracker"
                          checked={formData.hasTracker}
                          onCheckedChange={(checked: boolean) => handleInputChange("hasTracker", checked)}
                        />
                        <Label htmlFor="hasTracker">Possui Rastreador</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="liveCargo"
                          checked={formData.liveCargo}
                          onCheckedChange={(checked: boolean) => handleInputChange("liveCargo", checked)}
                        />
                        <Label htmlFor="liveCargo">Carga Viva</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="dryCargo"
                          checked={formData.dryCargo}
                          onCheckedChange={(checked: boolean) => handleInputChange("dryCargo", checked)}
                        />
                        <Label htmlFor="dryCargo">Carga Seca</Label>
                      </div>
                    </div>
                  </div>

                  {/* Botões de ação */}
                  <div className="flex flex-col md:flex-row gap-4 pt-6">
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Publicando..." : "Publicar Frete"}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleWhatsAppClick}
                      className="flex-1"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Preciso de Ajuda
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Informações Importantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">
                  • A publicação de fretes é totalmente gratuita
                </p>
                <p className="text-sm text-gray-600">
                  • Seu frete ficará visível por 7 dias ou até ser removido
                </p>
                <p className="text-sm text-gray-600">
                  • Caminhoneiros entrarão em contato diretamente com você
                </p>
                <p className="text-sm text-gray-600">
                  • Recomendamos verificar documentação antes de fechar negócio
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MobilePageWrapper>
  );
};

export default PublishFreight;
