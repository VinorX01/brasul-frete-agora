
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck, Search, Calendar, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/useIsMobile";

const Home = () => {
  const isMobile = useIsMobile();

  const handleQuickContact = () => {
    window.open("https://wa.me/5538997353264", "_blank");
    toast({
      title: "Redireccionando para WhatsApp",
      description: "Você será atendido em breve por nossos especialistas."
    });
  };

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f4f4fc' }}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-left mb-8 text-primary">Bem-vindo!</h1>
          
          <div className="grid grid-cols-2 gap-6">
            <Link to="/frete" className="flex flex-col items-center">
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-2 w-full aspect-square flex items-center justify-center">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary text-center">Buscar Frete</span>
            </Link>

            <Link to="/publicar-frete" className="flex flex-col items-center">
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-2 w-full aspect-square flex items-center justify-center">
                <Send className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary text-center">Publicar Frete</span>
            </Link>

            <Link to="/agenciadores" className="flex flex-col items-center">
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-2 w-full aspect-square flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary text-center">Agenciadores</span>
            </Link>

            <button onClick={handleQuickContact} className="flex flex-col items-center">
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-2 w-full aspect-square flex items-center justify-center">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary text-center">Suporte</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
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
            <Link to="/frete">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 w-full md:w-auto">
                <Search className="mr-2 h-5 w-5" /> Buscar Frete
              </Button>
            </Link>
            <Link to="/publicar-frete">
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
            <Link to="/frete">
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
    </div>
  );
};

export default Home;
