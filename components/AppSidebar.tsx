"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Package,
  FolderOpen,
  Settings,
  Bug,
  SquarePlus,
  Search,
  Pencil,
  Info,
  Heart,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const pluginDevItems = [
  { href: "/create/", label: "Create .phar", icon: Package },
  { href: "/extract/", label: "Extract .phar", icon: FolderOpen },
  { href: "/inject/", label: "Inject API Version", icon: Settings },
  { href: "/crashdump-parser/", label: "Parse Crashdump", icon: Bug },
  { href: "/generate/", label: "Generate Plugin Template", icon: SquarePlus },
];
const serverAdminItems = [
  { href: "/poggit-search/", label: "Search Poggit", icon: Search },
  { href: "/motd-generator/", label: "Generate MOTD", icon: Pencil },
  { href: "/ping/", label: "Ping Server", icon: Info },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/">
                <Image src="/static/logo-white.svg" alt="PMT" width={20} height={20} className="rounded invert dark:invert-0" />
                <span className="text-base font-semibold">PocketMine Tools</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Plugin Developers</SidebarGroupLabel>
          <SidebarMenu>
            {pluginDevItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} className="data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:hover:bg-sidebar-primary/90 data-active:hover:text-sidebar-primary-foreground">
                  <Link href={item.href}>
                    <item.icon className="mr-2 size-4" />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Server Admins</SidebarGroupLabel>
          <SidebarMenu>
            {serverAdminItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} className="data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:hover:bg-sidebar-primary/90 data-active:hover:text-sidebar-primary-foreground">
                  <Link href={item.href}>
                    <item.icon className="mr-2 size-4" />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <div className="mx-2 mb-2 flex aspect-[2/1] md:aspect-square flex-col items-center justify-center gap-3 rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
        Get your plugin in front of thousands of server owners. Starting at $1/day.
        <Button variant="outline" size="sm" asChild>
          <a href="mailto:nathan@fredericks.dev">Get in touch</a>
        </Button>
      </div>
      <SidebarFooter>
        <p className="px-2 text-xs text-muted-foreground">
          &copy; {year} Nathan Fredericks
          <br />
          Made with <Heart className="inline size-3 text-destructive" /> in Canada
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
