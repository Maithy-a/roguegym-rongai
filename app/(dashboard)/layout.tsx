import { AppSidebar } from "@/components/AppSidebar"
import SiteHeader from "@/components/SiteHeader"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ToastContainer } from "react-toastify"
import Script from "next/script"

export default function DashboardLayout({ children, }: { children: React.ReactNode }) {
    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <SiteHeader />
                    <main className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gray-50">
                        {children}
                    </main>

                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={true}
                        closeOnClick
                        pauseOnFocusLoss
                        theme="light"
                        pauseOnHover
                        stacked
                    />
                    <Script src="https://js.paystack.co/v2/inline.js" strategy="afterInteractive" />
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}
