"use client"

import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"

import { userAtom } from "@/store/atoms"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [user, setUser] = useAtom(userAtom)
  const router = useRouter()

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
    <nav className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 lg:px-6">
      {/* Left side — Logo + College Name */}
      <div className="flex items-center gap-3">
        <img
          src="/images/sathyabama-logo.png"
          alt="Sathyabama Logo"
          className="h-8 w-8 rounded-full object-contain"
        />
        <span className="text-base font-semibold tracking-tight">
          Sathyabama University
        </span>
      </div>

      {/* Right side — Profile Avatar + Dropdown */}
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
    </nav>
  )
}
