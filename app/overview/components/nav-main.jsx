"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";

export function NavMain({ items, isOpen = true }) {
  const pathname = usePathname();

  if (!items || !Array.isArray(items)) return null;

  return (
    <>
      {items.map((section, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel className="text-xs text-gray-500 uppercase tracking-wide px-3">
            {section.title}
          </SidebarGroupLabel>

          <SidebarMenu>
            {section.items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={`flex items-center ${isOpen ? "gap-3 px-3" : "justify-center "
                      } rounded-md text-sm font-custom transition-colors ${pathname === item.url
                        ? "bg-[#5494DA33] text-dark-gray"
                        : "text-dark-gray hover:bg-[#5494DA33]"
                      }`}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    {isOpen && <span>{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          {index !== items.length - 1 && <Separator className="mt-2" />}
        </SidebarGroup>
      ))}
    </>
  );
}

