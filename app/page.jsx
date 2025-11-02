import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import PricingPlan from "@/components/PricingPlan";
import AboutUs from "@/components/AboutUs";
export default function Home() {
  return (
    <div className="font-custom">
      <Navbar />
      <Hero />
      <Features />
      <PricingPlan />
      <AboutUs />
      <Footer />
    </div>
  );
}
