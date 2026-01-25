import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MaintenanceMode } from "@/components/MaintenanceMode";
import { ErrorBoundary, DOMErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Noticias from "./pages/Noticias";
import Concursos from "./pages/Concursos";
import AcervoDigital from "./pages/AcervoDigital";
import Organigrama from "./pages/Organigrama";
import Servicos from "./pages/Servicos";
import Contactos from "./pages/Contactos";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import AllNews from "./pages/AllNews";

import ConcursosHistory from "./pages/ConcursosHistory";
import RegisterInterest from "./pages/RegisterInterest";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import Acessibilidade from "./pages/Acessibilidade";
import Sitemap from "./pages/Sitemap";
import Transparencia from "./pages/Transparencia";
import Ouvidoria from "./pages/Ouvidoria";
import Educacao from "./pages/Educacao";
import Saude from "./pages/Saude";
import Agricultura from "./pages/Agricultura";
import SetorMineiro from "./pages/SetorMineiro";
import DesenvolvimentoEconomico from "./pages/DesenvolvimentoEconomico";
import Cultura from "./pages/Cultura";
import Tecnologia from "./pages/Tecnologia";
import EnergiaAgua from "./pages/EnergiaAgua";
import TurismoMeioAmbiente from "./pages/TurismoMeioAmbiente";
import TestPage from "./pages/TestPage";
import EducacaoSimple from "./pages/EducacaoSimple";
import Events from "./pages/Events";
import { usePageTracking } from "./hooks/usePageTracking";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

const PageTracker = () => {
  usePageTracking();
  return null;
};

const App = () => (
  <ErrorBoundary>
    <DOMErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageTracker />
            <MaintenanceMode>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/noticias" element={<Noticias />} />
                <Route path="/all-news" element={<AllNews />} />
                <Route path="/concursos" element={<Concursos />} />
                <Route path="/concursos-history" element={<ConcursosHistory />} />
                <Route path="/register-interest" element={<RegisterInterest />} />
                <Route path="/acervo" element={<AcervoDigital />} />
                <Route path="/organigrama" element={<Organigrama />} />
                <Route path="/servicos" element={<Servicos />} />

                <Route path="/contactos" element={<Contactos />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/privacidade" element={<Privacidade />} />
                <Route path="/termos" element={<Termos />} />
                <Route path="/acessibilidade" element={<Acessibilidade />} />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route path="/transparencia" element={<Transparencia />} />
                <Route path="/ouvidoria" element={<Ouvidoria />} />
                <Route path="/educacao" element={<Educacao />} />
                <Route path="/saude" element={<Saude />} />
                <Route path="/agricultura" element={<Agricultura />} />
                <Route path="/setor-mineiro" element={<SetorMineiro />} />
                <Route path="/desenvolvimento-economico" element={<DesenvolvimentoEconomico />} />
                <Route path="/cultura" element={<Cultura />} />
                <Route path="/tecnologia" element={<Tecnologia />} />
                <Route path="/energia-agua" element={<EnergiaAgua />} />
                <Route path="/turismo-meio-ambiente" element={<TurismoMeioAmbiente />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/educacao-simple" element={<EducacaoSimple />} />
                <Route path="/eventos" element={<Events />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MaintenanceMode>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </DOMErrorBoundary>
  </ErrorBoundary>
);

export default App;
