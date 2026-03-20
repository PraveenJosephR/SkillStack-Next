"use client"

import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { useState, useEffect } from "react"

import { userAtom } from "@/store/atoms"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const [user, setUser] = useAtom(userAtom)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  function handleSignOut() {
    setUser(null)
    router.push("/login")
  }

  // Get initials for the avatar fallback
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* Left side — Sidebar trigger + Logo + College Name */}
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-2">
          <img
            src="/images/sathyabama-logo.png"
            alt="Sathyabama Logo"
            className="h-7 w-7 rounded-full object-contain"
          />
          <span className="text-sm font-semibold tracking-tight hidden sm:inline">
            Sathyabama University
          </span>
        </div>

        {/* Right side — Theme Toggle + Profile Avatar Dropdown */}
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />

          {isMounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none ring-ring focus-visible:ring-2">
                  <Avatar size="default" className="cursor-pointer">
                    <AvatarImage src={user?.picture} alt={user?.name ?? "User"} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name ?? "User"}
                    </p>
                    <p className="text-xs text-muted-foreground leading-none">
                      {user?.email ?? ""}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Fallback skeleton while mounting to prevent hydration flashing
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          )}
        </div>
      </div>
    </header>
  )
}
