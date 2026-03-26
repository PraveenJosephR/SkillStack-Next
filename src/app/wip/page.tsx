"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Hammer } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function WorkInProgressPage() {
    const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-lg w-full text-center shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-muted">
            <Hammer className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">Work in Progress</CardTitle>
          <CardDescription>
            This page is currently under construction. We&apos;re working hard to bring it to you soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild className="hover:cursor-pointer">
            <div onClick={()=>{router.push("/dashboard")}}>Go Back Home</div>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}