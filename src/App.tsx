
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import FindFreight from "./pages/FindFreight";
import PublishFreight from "./pages/PublishFreight";
import BecomeAgent from "./pages/BecomeAgent";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import FreightDetail from "./pages/FreightDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="buscar-frete" element={<FindFreight />} />
            <Route path="publicar-frete" element={<PublishFreight />} />
            <Route path="agenciadores" element={<BecomeAgent />} />
            <Route path="sobre" element={<About />} />
            <Route path="frete/:id" element={<FreightDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
