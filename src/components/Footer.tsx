
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">Brasul Transportes</h3>
            <p className="text-sm opacity-80">
              Frete agora, embarque agora. Conectando caminhoneiros e cargas em toda a rede brasileira.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/buscar-frete" className="text-sm opacity-80 hover:opacity-100 transition">
                  Buscar Frete
                </Link>
              </li>
              <li>
                <Link to="/publicar-frete" className="text-sm opacity-80 hover:opacity-100 transition">
                  Publicar Frete
                </Link>
              </li>
              <li>
                <Link to="/agenciadores" className="text-sm opacity-80 hover:opacity-100 transition">
                  Programa de Agenciadores
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">Contato</h3>
            <p className="text-sm opacity-80">
              Suporte via WhatsApp: <br />
              <a 
                href="https://wa.me/5599999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                (99) 99999-9999
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-white/20 mt-6 pt-6 text-center text-sm opacity-80">
          &copy; {currentYear} Brasul Transportes. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
