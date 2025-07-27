import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MaintenanceMode } from "@/components/MaintenanceMode";
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
import Services from "./pages/Services";
import ConcursosHistory from "./pages/ConcursosHistory";
import RegisterInterest from "./pages/RegisterInterest";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import Acessibilidade from "./pages/Acessibilidade";
import Sitemap from "./pages/Sitemap";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
            <Route path="/services" element={<Services />} />
            <Route path="/contactos" element={<Contactos />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/acessibilidade" element={<Acessibilidade />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MaintenanceMode>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
