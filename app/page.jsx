import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import PricingPlan from "@/components/PricingPlan";
import AboutUs from "@/components/AboutUs";
export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <PricingPlan />
      <AboutUs />
      <Footer />
    </div>
  );
}
