"use client"

import * as React from "react"
import {
  IconHome,
  IconUser,
  IconCalendarMonth,
  IconTargetArrow,
  IconActivity,
  IconTrophy,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Feed",
      url: "/dashboard",
      icon: IconHome,
    },
    {
      title: "Semester Plan",
      url: "/semester-plan",
      icon: IconCalendarMonth,
    },
    {
      title: "Activity Center",
      url: "/activity",
      icon: IconTargetArrow,
    },
    {
      title: "My Current Activities",
      url: "/my-activities",
      icon: IconActivity,
    },
    {
      title: "Leaderboard",
      url: "/wip",
      icon: IconTrophy,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Sidebar Header — Branding */}
      <SidebarHeader className="px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div>
            <div className="px-2">
              <img
                src="/images/skill-stack-logo-full-light.png"
                alt="Logo"
                className="w-full h-auto object-contain dark:hidden"
              />
            </div>
            <div className="px-2">
              <img
                src="/images/skill-stack-logo-full-dark.png"
                alt="Logo"
                className="w-full h-auto object-contain hidden dark:block"
              />
            </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Sidebar Content — Nav Links */}
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <SidebarSeparator />
        <div className="p-2 text-xs text-muted-foreground text-center">
          © 2026 Sathyabama University
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
