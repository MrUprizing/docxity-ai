import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@clerk/nextjs/server";
import { forbidden, unauthorized } from "next/navigation";

//Pending improvements
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgId } = await auth();
  // Verify user session
  if (!userId) {
    unauthorized();
  }
  // Verify user membership
  if (!orgId) {
    forbidden();
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
