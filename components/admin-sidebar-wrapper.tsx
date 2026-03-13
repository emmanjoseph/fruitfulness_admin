"use client";
import { useAuthStore } from "@/store/authStore";
import { AdminSidebar } from "./Sidebar";


export  function AdminSidebarWrapper() {
  const admin = useAuthStore((state)=> state.admin)
  console.log(admin);
  
  if (!admin) {
    return null;
  }
  
  return <AdminSidebar admin={admin} />;
}