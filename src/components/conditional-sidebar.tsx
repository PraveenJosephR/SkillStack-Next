"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

export function ConditionalSidebar({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  const pathname = usePathname() ?? ""

  // Hide the sidebar for the login page and for the root path where
  // you may be showing the login UI (e.g. `/` -> login).
  const hideSidebar = !pathname || pathname === "/" || pathname.startsWith("/login")

  if (hideSidebar) {
    return <>{children}</>
  }

  return (
    <SidebarProvider style={style}>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default ConditionalSidebar
