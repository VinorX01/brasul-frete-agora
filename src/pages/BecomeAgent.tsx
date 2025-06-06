
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, DollarSign, Users, TrendingUp, Phone } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";
import MobilePageWrapper from "@/components/MobilePageWrapper";

const BecomeAgent = () => {
  const { trackEvent } = useAnalytics();

  // Track page view on component mount
  useEffect(() => {
    trackEvent('page_view_become_agent');
  }, [trackEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Cadastro enviado com sucesso!",
      description: "Entraremos em contato em breve para finalizar seu cadastro como agenciador."
    });
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/5538997353264?text=Olá! Tenho interesse em me tornar um agenciador.", "_blank");
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
              <h1 className="text-3xl font-bold text-primary mb-4">Torne-se um Agenciador</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ganhe dinheiro agenciando fretes! Conecte caminhoneiros a cargas disponíveis e receba comissão por cada frete intermediado.
              </p>
            </div>

            {/* Benefits Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader className="text-center">
                  <DollarSign className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle className="text-xl">Renda Extra</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Receba até 10% de comissão sobre o valor de cada frete que você agenciar com sucesso.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle className="text-xl">Rede de Contatos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Expanda sua rede profissional conectando-se com caminhoneiros e empresas de todo o Brasil.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle className="text-xl">Flexibilidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Trabalhe no seu próprio ritmo, quando e onde quiser. Ideal para complementar sua renda.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* How it Works */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-center mb-8">Como Funciona</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Cadastre-se</h3>
                  <p className="text-gray-600">
                    Preencha o formulário abaixo com suas informações e aguarde nossa aprovação.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Agencie Fretes</h3>
                  <p className="text-gray-600">
                    Use nossa plataforma para encontrar fretes e conectar com caminhoneiros interessados.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Receba Comissão</h3>
                  <p className="text-gray-600">
                    Ganhe até 10% de comissão sobre cada frete que você intermediar com sucesso.
                  </p>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Cadastro de Agenciador</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input id="name" type="text" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input id="email" type="email" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                    <Input id="phone" type="tel" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input id="city" type="text" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience">Experiência no Setor de Transportes</Label>
                  <Textarea 
                    id="experience" 
                    placeholder="Conte-nos sobre sua experiência no setor de transportes, logística ou vendas..."
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="motivation">Por que quer ser um agenciador?</Label>
                  <Textarea 
                    id="motivation" 
                    placeholder="Explique suas motivações para se tornar um agenciador de fretes..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Ao se cadastrar, você concorda em seguir nossas políticas de agenciamento e código de conduta profissional.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <Button type="submit" className="flex-1">
                    Enviar Cadastro
                  </Button>
                  
                  <Button type="button" variant="outline" onClick={handleWhatsAppClick} className="flex-1">
                    <Phone className="mr-2 h-4 w-4" />
                    Falar no WhatsApp
                  </Button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                Tem dúvidas sobre o programa de agenciadores?
              </p>
              <Button variant="outline" onClick={handleWhatsAppClick}>
                <Phone className="mr-2 h-4 w-4" />
                Entre em Contato
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MobilePageWrapper>
  );
};

export default BecomeAgent;
