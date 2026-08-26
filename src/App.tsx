import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ScrollStorytelling from '@/components/ScrollStorytelling';
import ShowroomToScreen from '@/components/ShowroomToScreen';
import InteractiveShowroom from '@/components/InteractiveShowroom';
import ProductsSection from '@/components/ProductsSection';
import EgyptMapSection from '@/components/EgyptMapSection';
import DashboardSection from '@/components/DashboardSection';
import AISection from '@/components/AISection';
import ProblemSolution from '@/components/ProblemSolution';
import PricingSection from '@/components/PricingSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import ShowroomGridBackground from '@/components/ShowroomGridBackground';

export default function App() {
  useSmoothScroll();

  return (
    <div className="relative min-h-screen bg-bg text-ink overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <ScrollStorytelling />
        <ShowroomToScreen />
        <InteractiveShowroom />
        <ProductsSection />
        <EgyptMapSection />
        <DashboardSection />
        <AISection />
        <div className="relative">
          <ShowroomGridBackground />
          <ProblemSolution />
          <PricingSection />
        </div>
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}