"use client"

import * as React from "react"

import Link from "next/link"
import { NavMain } from "@/components/NavMain"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { sidebarLinks } from "@/constants"

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader className="border-b border-dashed">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="shadow-xs bg-white border border-gray-200 p-1 flex aspect-square size-8 items-center justify-center rounded-full">
                  <Image
                    src='/icons/logo.jpg'
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                    alt="Rogue Gym Logo"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none justify-center">
                  <span className="font-semibold tracking-tight">Rogue Gym Rongai</span>
                  <span className="text-muted-foreground text-xs">Gym Management Sys.</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="lg:pt-6">
        <NavMain items={sidebarLinks.navMain} />
      </SidebarContent>

    </Sidebar>
  )
}
