"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconBook2,
  IconBrandTabler,
  IconMap2,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import {  LogOutIcon, MonitorCog, SettingsIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { logout } from "@/lib/api";

interface AdminSidebarProps {
  admin: {
    id: string;
    email: string;
    // add other admin properties as needed
  };
}

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Journeys",
      href: "/journeys",
      icon: <IconMap2 className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Bookings",
      href: "/bookings",
      icon: <IconBook2 className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: <MonitorCog className="h-5 w-5 shrink-0" />,
    },
  ];

  return (
    <div className="h-screen">
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto">
            <Logo />

            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              
                <div className="w-full">
            <div className="flex items-center gap-2 p-2 rounded-xl cursor-pointer bg-gray-700/5 dark:bg-gray-200/10 backdrop-blur-2xl">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-semibold  ">
                  {admin.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-gray-900/90 dark:text-gray-200">{admin.email}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
          </div>
          
            </DropdownMenuTrigger>

            <DropdownMenuContent className="rounded-3xl max-w-20">
        <DropdownMenuItem className="rounded-3xl" asChild>
          <Link href={"/settings"}>
          <SettingsIcon />
          Settings
          </Link>
          
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} variant="destructive" className="rounded-3xl ">
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
          </DropdownMenu>

          
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

// Logo components remain the same
export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre text-black dark:text-white font-semibold"
      >
        Tour Admin
      </motion.span>
    </Link>
  );
};

