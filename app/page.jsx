import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Feature from "@/components/Feature";
import Solution from "@/components/Solution";
import Customer from "@/components/Customer";
import Pricing from "@/components/Pricing";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

import ComingSoon from "@/components/ComingSoon";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Feature />
      <Solution />
      <Pricing />
      <Features />
      <Customer />
      <Footer />
      {/* <ComingSoon /> */}
    </div>
  );
}
