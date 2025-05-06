
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/0346d88c-fbb2-4575-9b01-9f91a3c4357a.png" 
                alt="Brasul Transportes Logo" 
                className="h-10 w-auto mr-2"
              />
              <div>
                <h1 className="text-xl font-bold text-primary leading-none">Brasul</h1>
                <p className="text-xs text-gray-600">TRANSPORTES</p>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost">Início</Button>
            </Link>
            <Link to="/buscar-frete">
              <Button 
                className="bg-[#FEF7CD] text-primary hover:bg-[#FEF7CD]/90"
              >
                Encontrar Frete
              </Button>
            </Link>
            <Link to="/publicar-frete">
              <Button variant="ghost">Publicar Frete</Button>
            </Link>
            <Link to="/agenciadores">
              <Button variant="ghost">Agenciadores</Button>
            </Link>
            <Link to="/sobre">
              <Button variant="ghost">Sobre</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="px-4 py-2 text-primary hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/buscar-frete" 
                className="px-4 py-2 bg-[#FEF7CD] text-primary hover:bg-[#FEF7CD]/90 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Encontrar Frete
              </Link>
              <Link 
                to="/publicar-frete" 
                className="px-4 py-2 text-primary hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Publicar Frete
              </Link>
              <Link 
                to="/agenciadores" 
                className="px-4 py-2 text-primary hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Agenciadores
              </Link>
              <Link 
                to="/sobre" 
                className="px-4 py-2 text-primary hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
