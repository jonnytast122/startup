import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/constant";
import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <div className="bg-primary-blue w-full pt-1">
      <div className="px-4 sm:px-6 md:px-6 lg:px-12 xl:px-12">
        <nav className="bg-white border-2 border-gray-100 shadow-lg rounded-full px-6 sm:px-12 md:px-12 lg:px-12 py-8 mt-5 flex items-center justify-between w-full max-w-[1680px] mx-auto relative z-30">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-semibold text-gray-900"
            >
              <Image src="/images/logo_2.png" alt="logo" width={50} height={30} />
              <span className="text-xl font-custom text-light-blue">ANAN</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="hidden lg:flex h-full gap-12">
            {NAV_LINKS.map((link) => (
              <li key={link.key} className="text-lg">
                <Link
                  href={link.href}
                  className="regular-16 font-sans text-dark-blue cursor-pointer pb-1.5 transition-all hover:font-bold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Button inside the nav */}
          <div className="lg:flexCenter hidden">
            <Button className="bg-blue-500 text-white font-custom text-lg py-3 px-6">
              Get Started
            </Button>
          </div>

          <Image
            src="/menu.svg"
            alt="menu"
            width={30}
            height={30}
            className="inline-block cursor-pointer lg:hidden"
          />
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
