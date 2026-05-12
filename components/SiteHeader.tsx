import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppBreadcrumbs } from "./AppBreadcrumbs"
import { NavUser } from "./NavUser"
import { getCurrentEmployee } from "@/lib/auth";

export default async function SiteHeader() {
    const user = await getCurrentEmployee();
    if (!user) return null

    return (
        <header className="sticky top-0 z-50 flex h-15 shrink-0 items-center justify-between gap-2 bg-background px-4 md:px-6 border border-b border-x-0 border-t-0 border-dashed">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 my-3 h-4 self-center"
                />
                <div className="hidden md:block">
                    <AppBreadcrumbs />
                </div>
            </div>
            
            <div className="flex gap-2 items-center">
                <NavUser />
                <p className="text-xs text-primary capitalize">
                    {user.role}
                </p>
            </div>
        </header>
    )
}