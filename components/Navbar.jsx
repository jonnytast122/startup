import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/constants";
import { Button } from "@/components/ui/button";
import { User, Menu, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function Navbar() {
  return (
    <div className="bg-primary-blue w-full pt-1">
      <div className="px-4 sm:px-6 md:px-6 lg:px-12 xl:px-12">
        <nav className="bg-white border-2 border-gray-100 shadow-lg rounded-full px-6 sm:px-12 md:px-12 lg:px-12 py-4 mt-5 flex items-center justify-between w-full max-w-[1680px] mx-auto relative z-30">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-semibold text-gray-900"
            >
              <Image
                src="/images/logo_2.png"
                alt="logo"
                width={70}
                height={50}
              />
              <span className="text-2xl font-custom text-light-blue">ANAN</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden xl:flex h-full gap-12">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="text-xl font-custom text-dark-blue cursor-pointer pb-1.5 transition-all hover:font-bold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side: Login & Button */}
          <div className="hidden xl:flex items-center gap-6">
            <Link
              href="/signin"
              className="flex items-center gap-2 cursor-pointer group"
            >
              <User className="h-6 w-4 text-gray-700 group-hover:font-semibold" />
              <span className="text-dark-blue text-xl font-custom group-hover:font-semibold">
                Log In
              </span>
            </Link>

            <Link href="/signup">
              <Button className="bg-blue-500 text-white font-custom text-lg py-3 px-4">
                Get Started
              </Button>
            </Link>

            <Select>
              <SelectTrigger className="w-[85px] font-custom border-none shadow-none focus:ring-0 focus:outline-none flex items-center gap-1">
                <Globe className="w-4 h-4 text-dark-blue" />
                <SelectValue placeholder="EN" />
              </SelectTrigger>
              <SelectContent className="font-custom">
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="kh">KH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Image
                src="/menu.svg"
                alt="menu"
                width={30}
                height={30}
                className="xl:hidden cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white shadow-md rounded-md w-48"
            >
              {NAV_LINKS.map((link) => (
                <DropdownMenuItem key={link.key}>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
