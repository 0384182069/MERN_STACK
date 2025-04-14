import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <main className="w-full">
        <div>
         <SidebarTrigger/>
        </div>
        <div className="mx-16 mt-10">
         {children}
        </div>
      </main>
    </SidebarProvider>
  )
} 
