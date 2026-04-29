import { AppSidebar } from "@/components/AppSidebar"
import SiteHeader from "@/components/SiteHeader"

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function DashboardLayout({ children, }: { children: React.ReactNode }) {
    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-accent">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}
