
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useIsMobile } from "@/hooks/useIsMobile";

const Layout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: isMobile ? '#f4f4fc' : undefined }}>
      {/* Mostrar Navbar apenas se não for mobile ou se for a página inicial */}
      {(!isMobile || isHomePage) && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {/* Footer apenas em desktop */}
      {!isMobile && <Footer />}
    </div>
  );
};

export default Layout;
