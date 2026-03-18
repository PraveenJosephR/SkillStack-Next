"use client"

import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { tokenAtom } from "@/store/atoms"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Newspaper } from "lucide-react"
import * as React from "react"

interface NewsItem {
  id: string
  title: string
  description: string
}

interface Milestone {
  id: string
  title: string
  subtext: string
  imageUrl: string
}

interface FeedData {
  milestones: Milestone[]
  news: NewsItem[]
}

const mockFeedData: FeedData = {
  milestones: [
    {
      id: "m1",
      title: "Global Certification Milestone",
      subtext: "50+ students completed international certifications.",
      imageUrl: "/images/graduation_handshake.png",
    },
    {
      id: "m2",
      title: "Tech Workshop series 2026",
      subtext: "Exploring AI, Cloud, and Web3 technologies with industry experts.",
      imageUrl: "/images/tech_workshop.png",
    },
    {
      id: "m3",
      title: "Campus Library Renovated",
      subtext: "New collaborative study zones open for the upcoming semester.",
      imageUrl: "/images/students_studying.png",
    }
  ],
  news: [
    {
      id: "1",
      title: "Placement Eligibility Reminder",
      description: "Students must complete 16 tokens before final semester.",
    },
    {
      id: "2",
      title: "New Internship Opportunities",
      description: "Summer internship portal now open for applications.",
    },
    {
      id: "3",
      title: "Startup Pitch Event",
      description: "Register for the upcoming campus startup showcase.",
    },
  ],
}

export default function FeedPage() {
  const token = useAtomValue(tokenAtom)
  const [feedData, setFeedData] = useState<FeedData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeed() {
      try {
        setLoading(true)
        // Ensure proper state management for fetching from the backend
        const response = await fetch("http://127.0.0.1:8000/api/v1/feed", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch feed")
        }

        const data = await response.json()
        setFeedData(data)
      } catch (err) {
        console.error("Backend fetch failed, falling back to mock data", err)
        setFeedData(mockFeedData)
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()
  }, [token])

  if (loading || !feedData) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading feed updates...</div>
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-6xl mx-auto w-full">
      {/* Hero Banner Section */}
      <Carousel 
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="w-full relative rounded-2xl overflow-hidden group"
      >
        <CarouselContent>
          {feedData.milestones.map((milestone) => (
            <CarouselItem key={milestone.id}>
              <Card className="relative overflow-hidden border-0 bg-black h-[300px] md:h-[400px] rounded-none">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 transition-transform duration-700 hover:scale-105"
                  style={{ backgroundImage: `url('${milestone.imageUrl}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                <CardContent className="relative h-full flex flex-col justify-end p-6 md:p-10">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                    {milestone.title}
                  </h1>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl">
                    {milestone.subtext}
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-4 right-16 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
           <CarouselPrevious className="static translate-y-0 mr-2 border-white/20 hover:bg-white/20 text-white bg-black/40 backdrop-blur-sm" />
           <CarouselNext className="static translate-y-0 border-white/20 hover:bg-white/20 text-white bg-black/40 backdrop-blur-sm" />
        </div>
      </Carousel>

      {/* Campus News Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2 text-primary">
          <Newspaper className="w-6 h-6 outline outline-1 outline-primary/30 rounded-sm fill-primary/10" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Campus News</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feedData.news.map((item) => (
            <Card key={item.id} className="border border-border/50 shadow-sm hover:shadow-md transition-shadow bg-card/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-base mb-2 text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
