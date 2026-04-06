"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const notifications = [
  { id: 1, text: "AI Workshop completed" },
  { id: 2, text: "Hackathon started" },
  { id: 3, text: "New activity available" },
];

export default function NotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full focus-visible:ring-0 focus-visible:ring-offset-0">
          
          {/* Bell Icon */}
          <Bell className="h-5 w-5" />

          {/* Red Dot */}
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length > 0 ? (
          notifications.map((n) => (
            <DropdownMenuItem key={n.id}>
              {n.text}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}