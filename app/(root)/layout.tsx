import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminSidebarWrapper } from "@/components/admin-sidebar-wrapper";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;

  if (!token) {
    redirect("/sign-in");
  }

  return (
    <div className="flex gap-2 font-sans">
      <AdminSidebarWrapper/>
      <div className="w-full p-5">{children}</div>
    </div>
  );
}