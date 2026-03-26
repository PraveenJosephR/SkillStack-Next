"use client"

import { usePathname } from "next/navigation"
import { type Icon } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname()
    const router = useRouter()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  isActive={isActive}
                  tooltip={item.title}
                  onClick={()=>router.push(item.url)}
                >
                  <div className="flex">
                    {item.icon && <item.icon className="!size-5" />}
                    <span className="text-sm font-medium">{item.title}</span>
                    </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
