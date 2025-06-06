
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck, Search, Calendar, Send, Phone, Newspaper } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";
import LastFreightUpdate from "@/components/LastFreightUpdate";
import MascotPosts from "@/components/MascotPosts";
import PromotionalBanner from "@/components/PromotionalBanner";

const Home = () => {
  const isMobile = useIsMobile();
  const { trackEvent } = useAnalytics();

  // Track page view on component mount
  useEffect(() => {
    trackEvent('page_view_home');
  }, [trackEvent]);

  const handleQuickContact = () => {
    trackEvent('home_whatsapp_contact_click');
    window.open("https://wa.me/5538997353264", "_blank");
    toast({
      title: "Redireccionando para WhatsApp",
      description: "Você será atendido em breve por nossos especialistas."
    });
  };

  const handleNavClick = (eventName: string) => {
    trackEvent(eventName);
  };
  
  if (isMobile) {
    return <div className="min-h-screen flex flex-col" style={{
      backgroundColor: '#f4f4fc'
    }}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <img alt="Brasul Transportes Logo" className="h-8 w-auto mr-2" src="/lovable-uploads/a6bb16cf-d425-4129-8432-dd145542833e.png" />
              <div>
                <h1 className="text-lg font-bold text-primary leading-none">Brasul</h1>
                <p className="text-xs text-gray-600">TRANSPORTES</p>
              </div>
            </div>
            <button onClick={handleQuickContact} className="bg-white rounded-full p-3 shadow-sm flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </button>
          </div>

          {/* Bloco de boas-vindas */}
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <h1 className="text-lg mb-2 text-slate-800 font-semibold">Bem-vindo, Caminhoneiro!</h1>
            <p className="text-sm text-gray-600">
              Use nosso aplicativo para encontrar, agenciar e publicar fretes para todo o Brasil.
            </p>
          </div>
          
          <div className="grid grid-cols-5 gap-3 mb-6">
            <Link to="/frete" onClick={() => handleNavClick('home_buscar_frete_click')} className="flex flex-col items-center">
              <div className="bg-white rounded-xl p-3 shadow-sm mb-2 w-full aspect-square flex items-center justify-center">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-primary text-center">Buscar Frete</span>
            </Link>

            <Link to="/publicar-frete" onClick={() => handleNavClick('home_publicar_frete_click')} className="flex flex-col items-center">
              <div className="bg-white rounded-xl p-3 shadow-sm mb-2 w-full aspect-square flex items-center justify-center">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-primary text-center">Publicar Frete</span>
            </Link>

            <Link to="/agenciadores" onClick={() => handleNavClick('home_agenciadores_click')} className="flex flex-col items-center">
              <div className="bg-white rounded-xl p-3 shadow-sm mb-2 w-full aspect-square flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-primary text-center">Agenciadores</span>
            </Link>

            <Link to="/noticias" onClick={() => handleNavClick('home_noticias_click')} className="flex flex-col items-center">
              <div className="bg-white rounded-xl p-3 shadow-sm mb-2 w-full aspect-square flex items-center justify-center">
                <Newspaper className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-primary text-center">Notícias</span>
            </Link>

            <Link to="/sobre" onClick={() => handleNavClick('home_sobre_click')} className="flex flex-col items-center">
              <div className="bg-white rounded-xl p-3 shadow-sm mb-2 w-full aspect-square flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-primary text-center">Sobre</span>
            </Link>
          </div>

          {/* Bloco de última atualização de fretes */}
          <LastFreightUpdate />
          
          {/* Bloco de posts do mascote */}
          <MascotPosts />
          
          {/* Banner promocional */}
          <PromotionalBanner />
        </div>
      </div>;
  }
  return <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-primary-medium py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frete agora, embarque agora.
          </h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Plataforma brasileira que conecta caminhoneiros a fretes disponíveis sem complicação.
            Sem cadastro, sem taxa, só resultados.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/frete" onClick={() => handleNavClick('home_buscar_frete_click')}>
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 w-full md:w-auto">
                <Search className="mr-2 h-5 w-5" /> Buscar Frete
              </Button>
            </Link>
            <Link to="/publicar-frete" onClick={() => handleNavClick('home_publicar_frete_click')}>
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full md:w-auto">
                <Send className="mr-2 h-5 w-5" /> Publicar Frete
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-accent p-6 rounded-lg text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary">Encontre Fretes</h3>
              <p className="text-gray-700">
                Busque fretes disponíveis por origem, destino e tipo de carga para encontrar a melhor opção para você.
              </p>
            </div>

            <div className="bg-accent p-6 rounded-lg text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary">Agende seu Frete</h3>
              <p className="text-gray-700">
                Entre em contato com o embarcador diretamente e agende o transporte sem intermediários.
              </p>
            </div>

            <div className="bg-accent p-6 rounded-lg text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary">Transporte sem Complicações</h3>
              <p className="text-gray-700">
                Realize o transporte sem burocracias e receba seu pagamento conforme acordado com o contratante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-700">
            Junte-se a milhares de motoristas e empresas que já usam a Brasul Transportes para encontrar e publicar fretes.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/frete" onClick={() => handleNavClick('home_buscar_frete_click')}>
              <Button size="lg" className="w-full md:w-auto">
                Encontrar Fretes
              </Button>
            </Link>
            <Button onClick={handleQuickContact} variant="outline" size="lg" className="w-full md:w-auto">
              Falar com Suporte
            </Button>
          </div>
        </div>
      </section>
    </div>;
};

export default Home;
