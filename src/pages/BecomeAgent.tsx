import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, DollarSign, Users, Clock, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";

const BecomeAgent = () => {
  const { trackEvent } = useAnalytics();

  // Track page view on component mount
  useEffect(() => {
    trackEvent('page_view_become_agent');
  }, [trackEvent]);

  const handleWhatsAppContact = () => {
    trackEvent('home_whatsapp_contact_click');
    window.open("https://wa.me/5538997353264", "_blank");
    toast({
      title: "Redirecionando para WhatsApp",
      description: "Você será atendido em breve por nossos especialistas."
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f4fc] py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Seja um Agenciador Brasul</CardTitle>
            <CardDescription className="text-center">
              Ganhe comissão indicando fretes e caminhoneiros!
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-accent rounded-lg p-4 flex items-center space-x-4">
                <Phone className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Contato Rápido</h3>
                  <p className="text-sm text-gray-600">Tire suas dúvidas pelo WhatsApp</p>
                </div>
              </div>

              <div className="bg-accent rounded-lg p-4 flex items-center space-x-4">
                <DollarSign className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Comissão</h3>
                  <p className="text-sm text-gray-600">Ganhe até 10% por frete indicado</p>
                </div>
              </div>

              <div className="bg-accent rounded-lg p-4 flex items-center space-x-4">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Rede de Contatos</h3>
                  <p className="text-sm text-gray-600">Amplie sua rede no setor de transportes</p>
                </div>
              </div>

              <div className="bg-accent rounded-lg p-4 flex items-center space-x-4">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Flexibilidade</h3>
                  <p className="text-sm text-gray-600">Trabalhe de onde estiver, no seu tempo</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input type="text" id="name" placeholder="Seu nome completo" />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input type="email" id="email" placeholder="Seu endereço de e-mail" />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input type="tel" id="phone" placeholder="Seu número de telefone" />
              </div>

              <div>
                <Label htmlFor="experience">Sua Experiência</Label>
                <Textarea id="experience" placeholder="Conte-nos sobre sua experiência no setor de transportes" />
              </div>

              <Button className="w-full" onClick={handleWhatsAppContact}>
                <CheckCircle className="mr-2 h-4 w-4" /> Enviar Solicitação
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Dúvidas? Entre em contato pelo WhatsApp:
          </p>
          <Button variant="link" className="text-primary" onClick={handleWhatsAppContact}>
            (38) 99735-3264
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BecomeAgent;
