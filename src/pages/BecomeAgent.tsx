import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";
const BecomeAgent = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e telefone.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Solicitação enviada com sucesso!",
        description: "Entraremos em contato com você em breve para fornecer seu código de agenciador."
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: ""
      });
      setIsSubmitting(false);
    }, 1000);
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Torne-se um Agenciador</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Seja um agenciador de fretes da Brasul Transportes e ganhe comissões por cada frete intermediado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-primary">
              Solicitar Código de Agenciador
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input id="name" placeholder="Seu nome completo" value={formData.name} onChange={e => handleChange("name", e.target.value)} required />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input id="phone" placeholder="(99) 99999-9999" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} required />
                </div>

                <div>
                  <Label htmlFor="email">E-mail (opcional)</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={e => handleChange("email", e.target.value)} />
                </div>

                <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Solicitar Código"}
                </Button>
                
                <p className="text-xs text-gray-500 mt-2">
                  * Campos obrigatórios
                </p>
              </div>
            </form>
          </div>

          <div className="bg-accent rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-primary">
              Como funciona o programa de agenciadores?
            </h2>
            
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Solicite seu código</h3>
                  <p className="text-gray-600 text-sm">
                    Preencha o formulário e receba seu código único de agenciador.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Compartilhe fretes</h3>
                  <p className="text-gray-600 text-sm">
                    Use seu código para gerar links personalizados para os fretes disponíveis em nossa plataforma.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Ganhe comissões</h3>
                  <p className="text-gray-600 text-sm">
                    Receba uma comissão por cada frete que for finalizado por meio do seu link.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Acompanhe seus resultados</h3>
                  <p className="text-gray-600 text-sm">
                    Receba relatórios sobre os fretes agenciados e suas comissões.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white rounded-lg border border-primary-light">
              <p className="text-sm text-center font-medium text-primary">A comissão média dos agenciadores varia de R$ 50 até a 10% do valor do frete, dependendo do tipo e distância da carga.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-center">Perguntas Frequentes</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-primary mb-2">Como recebo minhas comissões?</h3>
              <p className="text-gray-600 text-sm">
                As comissões são pagas mensalmente via PIX ou transferência bancária, após a confirmação da entrega dos fretes agenciados.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-primary mb-2">Posso agenciar quantos fretes?</h3>
              <p className="text-gray-600 text-sm">
                Sim, não há limite para a quantidade de fretes que você pode agenciar.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-primary mb-2">Preciso ter experiência?</h3>
              <p className="text-gray-600 text-sm">
                Não é necessário ter experiência prévia, mas conhecimento no setor de transportes é um diferencial.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-primary mb-2">Quanto tempo leva para receber meu código?</h3>
              <p className="text-gray-600 text-sm">
                Normalmente, enviamos os códigos em até 48 horas úteis após a solicitação ser aprovada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default BecomeAgent;