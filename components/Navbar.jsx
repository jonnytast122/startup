import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/constants";
import { Button } from "@/components/ui/button";
import { User, Globe, Menu } from "lucide-react";
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
  // Reorder NAV_LINKS to insert "Features" and "Customers" before "Pricing"
  const updatedLinks = [];
  NAV_LINKS.forEach((link) => {
    updatedLinks.push(link);
  });

  return (
    <div className="bg-primary-blue w-full pt-1">
      <nav className="bg-white border-2 border-gray-100 shadow-lg rounded-full flex items-center justify-between w-full max-w-full px-4 z-30 min-h-[64px]">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-semibold text-gray-900"
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/ANAN%20logo%20FA-05.png?alt=media&token=5f602bd2-1068-40a4-a35b-740cd896a22c"
              alt="sub logo"
              className="h-9 w-auto md:h-10"
            />

            {/* Beta badge */}
            <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-gray-900">
              BETA
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex h-full gap-12">
          {updatedLinks.map((link) => (
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
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/signin"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <User className="h-6 w-4 text-gray-700 group-hover:font-semibold" />
            <span className="text-dark-blue text-xl font-custom group-hover:font-semibold">
              Login
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
            <button className="lg:hidden flex items-center justify-center rounded-md p-2 hover:bg-gray-100 transition">
              <Menu className="h-6 w-4 text-gray-700" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="bg-white shadow-lg rounded-xl w-56 p-2 space-y-2"
          >
            {updatedLinks.map((link) => (
              <DropdownMenuItem
                key={link.key}
                className="p-3 rounded-lg hover:bg-blue-50 text-dark-blue text-lg font-custom"
              >
                <Link href={link.href} className="block w-full">
                  {link.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <hr className="my-2 " />

            <DropdownMenuItem className="p-3">
              <Link
                href="/signin"
                className="text-dark-blue text-lg font-custom hover:font-semibold"
              >
                Login
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="p-3">
              <Link href="/signup">
                <Button className="w-full bg-blue-500 text-white font-custom text-lg py-2">
                  Get Started
                </Button>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="p-3">
              <Select>
                <SelectTrigger className="w-1/2 border rounded-md font-custom">
                  <Globe className="w-4 h-4 text-dark-blue mr-2" />
                  <SelectValue placeholder="EN" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="kh">KH</SelectItem>
                </SelectContent>
              </Select>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );
}

export default Navbar;
