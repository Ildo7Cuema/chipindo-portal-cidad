import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { NewsSection } from "@/components/sections/NewsSection";
import { ConcursosSection } from "@/components/sections/ConcursosSection";
import { DigitalArchive } from "@/components/sections/DigitalArchive";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <NewsSection />
        <ConcursosSection />
        <DigitalArchive />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
