import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Cards } from "./cards"

export default function SemesterPlanPage() {
  return (
    
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 py-4 px-4 md:py-6 lg:px-6">
              <Cards />
            </div>
          </div>
        </div>
      
  )
}
