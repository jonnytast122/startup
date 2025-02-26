"use client";

import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { Link } from "react-scroll";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStick, setIsStick] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsStick(true);
      } else {
        setIsStick(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // navitems array
  const navItems = [
    { name: "Features", href: "feature" },
    { name: "Solutions", href: "solution" },
    { name: "Customers", href: "customer" },
    { name: "Pricing", href: "pricing" },
    { name: "About Us", href: "aboutus" },
  ];

  return (
    <header className="w-full fixed top-0 left-0 right-0">
      <div className="p-6">
        <nav
          className={`py-6 lg:px-14 px-6 bg-white border border-white rounded-full shadow-lg ${
            isStick ? "sticky top-0 left-0 right-0 border-b duration-300" : ""
          }`}
        >
          <div className="flex justify-between items-center text-base gap-8">
            <a
              href="/"
              className="font-custom font-semibold text-xl flex items-center space-x-1"
            >
              <img
                src="/images/logo_2.png"
                alt="logo"
                className="w-14 inline-block items-center"
              />
              <span className="text-light-blue">ANAN</span>
            </a>
            <ul
              className={`md:flex space-x-12 ${
                isMenuOpen ? "block" : "hidden"
              }`}
            >
              {navItems.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    spy={true}
                    smooth={true}
                    offset={-100}
                    duration={500}
                    className="block font-sans text-dark-blue hover:text-blue-300 transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="font-sans font=semibold space-x-12 hidden lg:flex items-center">
              <a href="" className="hidden lg:flex items-center text-dark-blue">
                Log In
              </a>
              <Button className="py-2 px-4 transition-all duration-300 bg-blue-400 text-white hover:bg-gray-200">
                Sign Up
              </Button>
            </div>
            {/* mobile menu */}
            <div className="md:hidden px-6">
              <button
                onClick={toggleMenu}
                className="focus:outline-none focus:text-blue-300"
              >
                {isMenuOpen ? (
                  <FaXmark className="h-6 w-6 text-light-blue" />
                ) : (
                  <FaBars className="h-6 w-6 text-light-blue" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
