
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-primary">404</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Página não encontrada</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          
          <Link to="/">
            <Button className="w-full sm:w-auto flex items-center">
              <Home className="mr-2 h-4 w-4" /> Ir para a Página Inicial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
