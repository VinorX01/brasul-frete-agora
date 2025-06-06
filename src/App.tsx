
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

    // Only track specific routes that don't handle their own tracking
    switch (path) {
      case '/':
        // Home page tracking is handled in the component itself
        return;
      case '/frete':
        // Find freight tracking is handled in the component itself
        return;
      case '/publicar-frete':
        // Publish freight tracking is handled in the component itself
        return;
      case '/agenciadores':
        // Become agent tracking is handled in the component itself
        return;
      case '/sobre':
        // About tracking is handled in the component itself
        return;
      case '/noticias':
        // News page tracking is handled in the component itself
        return;
      default:
        if (path.startsWith('/frete/')) {
          eventName = 'freight_details_open';
        }
        break;
    }

    if (eventName) {
      console.log(`RouteTracker: tracking event ${eventName} for path ${path}`);
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
