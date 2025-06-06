import { Button } from "@/components/ui/button";
import { Truck, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";
import MobilePageWrapper from "@/components/MobilePageWrapper";

const About = () => {
  const { trackEvent } = useAnalytics();

  // Track page view on component mount
  useEffect(() => {
    trackEvent('page_view_about');
  }, [trackEvent]);

  const handleWhatsAppClick = () => {
    trackEvent('home_whatsapp_contact_click');
    window.open("https://wa.me/5538997353264", "_blank");
    toast({
      title: "Redirecionando para WhatsApp",
      description: "Você será atendido em breve por nossos especialistas."
    });
  };

  return <MobilePageWrapper>
      <div className="bg-[#f4f4fc] min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="font-bold mb-2 text-xl text-left">Sobre a Brasul Transportes</h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-left">
                Conectando caminhoneiros e fretes em toda a rede viária brasileira, com transparência e eficiência.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold mb-4 flex items-center text-primary">
                  <Truck className="mr-2 h-5 w-5" /> Nossa Missão
                </h2>
                <p className="text-gray-700 mb-4">
                  A Brasul Transportes nasceu da necessidade de criar uma plataforma simples e eficiente para conectar caminhoneiros e embarcadores de carga em todo o Brasil.
                </p>
                <p className="text-gray-700 mb-4">
                  Nossa missão é eliminar intermediários desnecessários, reduzir custos e aumentar a eficiência no transporte de cargas, beneficiando tanto motoristas quanto empresas.
                </p>
                <p className="text-gray-700">
                  Acreditamos no poder da tecnologia para revolucionar o setor de transportes, tornando-o mais transparente, acessível e justo para todos os envolvidos.
                </p>
              </div>

              <div className="bg-accent rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold mb-4 flex items-center text-primary">
                  <Phone className="mr-2 h-5 w-5" /> Contato
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold">WhatsApp</h3>
                      <p className="text-gray-700">
                        <Button variant="link" className="p-0 h-auto text-primary" onClick={handleWhatsAppClick}>
                          (38) 99735-3264
                        </Button>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold">E-mail</h3>
                      <p className="text-gray-700">
                        <a href="mailto:contato@brasultransportes.com.br" className="text-primary hover:underline">
                          contato@brasultransportes.com.br
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Horário de Atendimento</h3>
                      <p className="text-gray-700">Segunda a Sexta: 8h às 18h</p>
                      <p className="text-gray-700">Sábados: 8h às 12h</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-6" onClick={handleWhatsAppClick}>
                  Falar com Suporte via WhatsApp
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-12">
              <h2 className="text-xl font-bold mb-6 text-center">Perguntas Frequentes</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-primary mb-2">É necessário fazer cadastro para usar a plataforma?</h3>
                  <p className="text-gray-700">
                    Não, nossa plataforma foi projetada para ser usada sem exigir cadastro. Caminhoneiros podem buscar fretes e embarcadores podem publicar cargas livremente.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-primary mb-2">Como garantir a segurança das cargas?</h3>
                  <p className="text-gray-700">
                    Recomendamos que embarcadores verifiquem documentação e histórico dos transportadores antes de fechar negócio. Nossa plataforma apenas conecta as partes, sem intermediar o contrato.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-primary mb-2">Quanto custa publicar um frete?</h3>
                  <p className="text-gray-700">
                    A publicação de fretes é totalmente gratuita. Não cobramos comissões ou taxas de embarcadores ou caminhoneiros.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-primary mb-2">Como funciona o sistema de agenciadores?</h3>
                  <p className="text-gray-700">
                    Agenciadores são parceiros que recebem comissão ao intermediar fretes através da plataforma. Para se tornar um agenciador, visite nossa página "Agenciadores".
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-medium mb-4">
                Ainda tem dúvidas? Entre em contato conosco!
              </p>
              <Button size="lg" onClick={handleWhatsAppClick}>
                <Phone className="mr-2 h-5 w-5" /> Falar com um Atendente
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MobilePageWrapper>;
};

export default About;
