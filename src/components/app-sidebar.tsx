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
      title: "Profile",
      url: "/dashboard/profile",
      icon: IconUser,
    },
    {
      title: "Semester Plan",
      url: "/semester-plan",
      icon: IconCalendarMonth,
    },
    {
      title: "Activity Center",
      url: "/dashboard/activity-center",
      icon: IconTargetArrow,
    },
    {
      title: "My Current Activities",
      url: "/dashboard/my-activities",
      icon: IconActivity,
    },
    {
      title: "Leaderboard",
      url: "/dashboard/leaderboard",
      icon: IconTrophy,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Sidebar Header — Branding */}
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:!p-2"
            >
              <a href="/dashboard" className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                  <img
                    src="/images/sathyabama-logo.png"
                    alt="Sathyabama Logo"
                    className="size-6 rounded object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-sm">SkillStack</span>
                  <span className="text-xs text-muted-foreground">Sathyabama University</span>
                </div>
              </a>
            </SidebarMenuButton>
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
