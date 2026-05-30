"use client"

import * as React from "react"
import { useAtom } from "jotai"
import { userAtom } from "@/store/atoms"
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user] = useAtom(userAtom)
  const isStaff = user?.role_id == 2 || user?.role === "staff" || user?.role === "admin"

  const navItems = isStaff
    ? [
        {
          title: "Feed",
          url: "/dashboard",
          icon: IconHome,
        },
        {
          title: "Teacher Dashboard",
          url: "/teacher/dashboard",
          icon: IconUser,
        },
        {
          title: "Student Approvals",
          url: "/teacher/approvals",
          icon: IconActivity,
        },
      ]
    : [
        {
          title: "Feed",
          url: "/dashboard",
          icon: IconHome,
          iconActive: true,
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
      ]

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
        <NavMain items={navItems} />
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
