"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import type { Icon } from "@tabler/icons-react"
type NavItem = {
  title: string
  url: string
  icon: Icon
}

export function NavMain({ items }: { items: NavItem[] }) {

  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu>

        {items.map((item) => {
          const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
          return (
            <SidebarMenuItem key={item.title} >
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={cn( 
                  "mb-2 rounded-full",
                  isActive
                    ? "bg-red-600 text-white hover:bg-red-500 hover:text-white"
                    : "text-gray-600 "
                )}
              >

                <Link href={item.url} className="flex items-center gap-3">
                  <item.icon className="size-6" stroke={2} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}

      </SidebarMenu>
    </SidebarGroup>
  )
}