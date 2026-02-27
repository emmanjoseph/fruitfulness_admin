import { getCurrentAdmin } from "@/lib/api";
import { AdminSidebar } from "./Sidebar";


export async function AdminSidebarWrapper() {
  const admin = await getCurrentAdmin();
//   console.log(admin);
  
  
  return <AdminSidebar admin={admin} />;
}