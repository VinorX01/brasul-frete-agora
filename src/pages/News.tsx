
import { Newspaper } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobilePageWrapper from "@/components/MobilePageWrapper";
import { Navigate } from "react-router-dom";

const News = () => {
  const isMobile = useIsMobile();

  // Redireciona para home se não for mobile
  if (!isMobile) {
    return <Navigate to="/" replace />;
  }

  return (
    <MobilePageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Newspaper className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-4">Notícias</h1>
          <p className="text-gray-600 leading-relaxed">
            Estamos preparando algo incrível para você caminhoneiro, fique de olho!
          </p>
        </div>
      </div>
    </MobilePageWrapper>
  );
};

export default News;
