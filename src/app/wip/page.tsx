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
      <Card className="max-w-lg w-full text-center rounded-2xl border-0 shadow-lg bg-background/70 backdrop-blur-md">
        <CardHeader className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-muted">
            <Hammer className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">Work in Progress</CardTitle>
          <CardDescription>
            This page is currently under construction. We&apos;re working hard to bring it to you soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row gap-4 items-center justify-center">
          <Button asChild className="hover:cursor-pointer w-36">
            <div onClick={()=>{router.push("/dashboard")}}>Go Back Home</div>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}