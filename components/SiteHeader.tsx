import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppBreadcrumbs } from "./AppBreadcrumbs"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { NavUser } from "./NavUser"


export default function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 flex h-15 shrink-0 items-center justify-between gap-2 bg-background px-4 md:px-6 border border-b border-dashed">
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

            <div className="flex items-center gap-2">
                <NavUser />
            </div>
        </header>
    )
}