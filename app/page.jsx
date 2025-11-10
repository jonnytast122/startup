import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import PricingPlan from "@/components/PricingPlan";
import AboutUs from "@/components/AboutUs";

export default function Home() {
  return (
    <div className="font-custom scroll-smooth">
      <Navbar />

      <section id="hero">
        <Hero />
      </section>

      <section id="feature">
        <Features />
      </section>

      <section id="pricing">
        <PricingPlan />
      </section>

      <section id="about_us">
        <AboutUs />
      </section>

      <Footer />
    </div>
  );
}
