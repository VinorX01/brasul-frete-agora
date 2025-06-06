
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import FindFreight from "./pages/FindFreight";
import PublishFreight from "./pages/PublishFreight";
import BecomeAgent from "./pages/BecomeAgent";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import FreightDetail from "./pages/FreightDetail";
import News from "./pages/News";

const queryClient = new QueryClient();

// Component to track page views based on route changes
const RouteTracker = () => {
  const location = useLocation();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const path = location.pathname;
    let eventName = '';

    switch (path) {
      case '/':
        return; // Home page tracking is handled in the component itself
      case '/frete':
        eventName = 'page_view_find_freight';
        break;
      case '/publicar-frete':
        eventName = 'page_view_publish_freight';
        break;
      case '/agenciadores':
        eventName = 'page_view_become_agent';
        break;
      case '/sobre':
        eventName = 'page_view_about';
        break;
      case '/noticias':
        return; // News page tracking is handled in the component itself
      default:
        if (path.startsWith('/frete/')) {
          eventName = 'freight_details_open';
        }
        break;
    }

    if (eventName) {
      trackEvent(eventName);
    }
  }, [location.pathname, trackEvent]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteTracker />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="frete" element={<FindFreight />} />
              <Route path="publicar-frete" element={<PublishFreight />} />
              <Route path="agenciadores" element={<BecomeAgent />} />
              <Route path="sobre" element={<About />} />
              <Route path="noticias" element={<News />} />
              <Route path="frete/:id" element={<FreightDetail />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
