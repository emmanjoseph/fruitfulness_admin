import { AdminSidebarWrapper } from "@/components/admin-sidebar-wrapper";
import AuthGuard from "@/components/auth-guard";
import { useAuthStore } from "@/store/authStore";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
   const token = useAuthStore.getState().token;
   console.log("Admin token", token);
   

  return (
   
      <div className="flex gap-2 font-sans">
      <AdminSidebarWrapper/>
      <div className="w-full p-5">
         <AuthGuard>
          {children}
         </AuthGuard>
        </div>
    </div>
   
    
  );
}