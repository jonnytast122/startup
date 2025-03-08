"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaFacebook, FaTiktok, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#003396] text-white py-12 px-6">
      {/* Top Section */}
      <div className="flex flex-col items-center text-center">
        {/* Header */}
        <h2 className="text-custom text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          Try ANAN
          <br /> today
        </h2>

        {/* Subtitle */}
        <p className="text-custom mt-6 text-sm sm:text-sm md:text-md lg:text-lg max-w-md">
          Get Started for free.
          <br />
          Add your whole team as your needs grow.
        </p>

        {/* Button */}
        <Button className="mt-6 px-10 py-6 text-sm font-semibold rounded-lg">
          Try for free
        </Button>
        <p className="text-custom mt-6 text-sm sm:text-sm md:text-md lg:text-lg max-w-md">
          On a big team? Contact Sales
        </p>
      </div>

      {/* Footer Content */}
      <div className="mt-24 px-6 flex flex-col md:flex-row justify-between items-start max-container mx-auto">
        {/* Left Side (40%) */}
        <div className="flex flex-col items-center md:items-start w-full md:w-[40%]">
          <div className="flex items-center space-x-4">
            <Image src="/images/white_logo.png" alt="ANAN Logo" width={90} height={90} />
            <h2 className="text-xl">ANAN</h2>
          </div>
          <p className="font-custom mt-4 text-lg text-center md:text-left">
            Effortlessly track employee attendance with real-time monitoring,
            automate payroll processing with precision, and securely manage your
            data. Whether you're a small business or a large enterprise, ANAN
            simplifies HR operations, ensuring that your files and information
            are always safe and accessible.
          </p>
        </div>

        {/* Spacer (20%) */}
        <div className="hidden md:block w-[20%]"></div>

        {/* Right Side (40%) */}
        <div className="grid grid-cols-4 gap-6 w-full md:w-[50%] text-sm mt-10 md:mt-0">
          {[
            {
              heading: "Product",
              features: ["Overview", "Pricing", "Custom stories"],
            },
            {
              heading: "Resources",
              features: ["Blog", "Guides & tutorials", "Help center"],
            },
            {
              heading: "Company",
              features: ["About us", "Careers", "Partnership"],
            },
            {
              heading: "Talk with sales",
              features: ["+855 123456789", "Available Date", "Available Time"],
            },
          ].map((section, index) => (
            <div key={index}>
              <h4 className="font-custom font-semibold text-lg mb-4">{section.heading}</h4>
              <ul className="font-custom space-y-4">
                {section.features.map((feature, i) => (
                  <li key={i} className="mt-2">
                    <a href="#" className="hover:underline">
                      {feature}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-12 px-6 mx-auto max-container flex flex-col md:flex-row justify-between items-center text-sm border-t border-white/30 pt-6">
        {/* Left: Terms & Privacy */}
        <p className="text-center md:text-left">
          English | <a href="#" className="hover:underline">Term & Privacy</a> | <a href="#" className="hover:underline">Security</a> | ©2024 ANAN.
        </p>

        {/* Right: Social Icons */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" aria-label="Facebook"><FaFacebook className="text-xl hover:text-gray-300" /></a>
          <a href="#" aria-label="TikTok"><FaTiktok className="text-xl hover:text-gray-300" /></a>
          <a href="#" aria-label="Instagram"><FaInstagram className="text-xl hover:text-gray-300" /></a>
          <a href="#" aria-label="YouTube"><FaYoutube className="text-xl hover:text-gray-300" /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
