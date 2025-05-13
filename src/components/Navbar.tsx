
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Função para determinar se o link está ativo
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img alt="Brasul Transportes Logo" className="h-10 w-auto mr-2" src="/lovable-uploads/a6bb16cf-d425-4129-8432-dd145542833e.png" />
              <div>
                <h1 className="text-xl font-bold text-primary leading-none">Brasul</h1>
                <p className="text-xs text-gray-600">TRANSPORTES</p>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/">
              <Button variant={isActiveRoute("/") ? "default" : "ghost"}>Início</Button>
            </Link>
            <Link to="/frete">
              <Button 
                variant={isActiveRoute("/frete") ? "default" : "ghost"} 
                className={isActiveRoute("/frete") ? "bg-black text-white hover:bg-gray-800" : ""}
              >
                Encontrar Frete
              </Button>
            </Link>
            <Link to="/publicar-frete">
              <Button 
                variant={isActiveRoute("/publicar-frete") ? "default" : "ghost"}
                className={isActiveRoute("/publicar-frete") ? "bg-black text-white hover:bg-gray-800" : ""}
              >
                Publicar Frete
              </Button>
            </Link>
            <Link to="/agenciadores">
              <Button variant={isActiveRoute("/agenciadores") ? "default" : "ghost"}>Agenciadores</Button>
            </Link>
            <Link to="/sobre">
              <Button variant={isActiveRoute("/sobre") ? "default" : "ghost"}>Sobre</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="md:hidden mt-3 pb-3">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="px-4 py-2 text-primary hover:bg-gray-100 rounded" onClick={() => setIsMenuOpen(false)}>
                Início
              </Link>
              <Link to="/frete" className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded" onClick={() => setIsMenuOpen(false)}>
                Encontrar Frete
              </Link>
              <Link to="/publicar-frete" className="px-4 py-2 text-primary hover:bg-gray-100 rounded" onClick={() => setIsMenuOpen(false)}>
                Publicar Frete
              </Link>
              <Link to="/agenciadores" className="px-4 py-2 text-primary hover:bg-gray-100 rounded" onClick={() => setIsMenuOpen(false)}>
                Agenciadores
              </Link>
              <Link to="/sobre" className="px-4 py-2 text-primary hover:bg-gray-100 rounded" onClick={() => setIsMenuOpen(false)}>
                Sobre
              </Link>
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navbar;
