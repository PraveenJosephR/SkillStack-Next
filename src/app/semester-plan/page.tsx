"use client"

import { useState } from "react"
import { ClipboardList, Plus, Minus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

// ─── Activity definitions ──────────────────────────────────────────
const ACTIVITIES = [
  { name: "NPTEL-Pass", tokensEach: 2 },
  { name: "NPTEL-Elite+Silver", tokensEach: 3 },
  { name: "NPTEL-Elite+Gold", tokensEach: 4 },
  { name: "Coursera", tokensEach: 4 },
  { name: "Udemy", tokensEach: 3 },
  { name: "Workshop", tokensEach: 2 },
  { name: "Hackathon-Participate", tokensEach: 3 },
  { name: "Hackathon(Internal)-Win", tokensEach: 4 },
  { name: "Hackathon(External)-Win", tokensEach: 6 },
  { name: "Other College Events", tokensEach: 3 },
  { name: "Organizing Events", tokensEach: 2 },
  { name: "Cultural", tokensEach: 3 },
  { name: "Sports/Music", tokensEach: 3 },
  { name: "NCC/NSS Activities", tokensEach: 3 },
  { name: "Volunteer Activities", tokensEach: 3 },
  { name: "Value Added Courses", tokensEach: 4 },
  { name: "Internship-Online", tokensEach: 4 },
  { name: "Internship-InOffice", tokensEach: 6 },
  { name: "Certification-Internal/Local", tokensEach: 4 },
  { name: "Certification-Global", tokensEach: 6 },
  { name: "Research Working Prototype", tokensEach: 6 },
  { name: "Coding-Contest-Participation", tokensEach: 3 },
  { name: "Coding-Contest-Winner", tokensEach: 5 },
  { name: "Research-paper", tokensEach: 4 },
  { name: "Best Paper Award", tokensEach: 6 },
  { name: "Research Resource Person(Internal)", tokensEach: 3 },
  { name: "Research Resource Person(External)", tokensEach: 5 },
  { name: "Study Abroad", tokensEach: 6 },
  { name: "Seed Funding Project", tokensEach: 8 },
  { name: "Startup", tokensEach: 12 },
  { name: "CGPA 8.5 And Above", tokensEach: 4 },
] as const

type ActivityCount = Record<string, number>

export default function SemesterPlanPage() {
  const [savedPlan, setSavedPlan] = useState<ActivityCount | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [counts, setCounts] = useState<ActivityCount>(() =>
    Object.fromEntries(ACTIVITIES.map((a) => [a.name, 0]))
  )

  // ─── Counter helpers ───────────────────────────────────────────────
  function increment(name: string) {
    setCounts((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + 1 }))
  }
  function decrement(name: string) {
    setCounts((prev) => ({
      ...prev,
      [name]: Math.max(0, (prev[name] ?? 0) - 1),
    }))
  }

  const totalTokens = ACTIVITIES.reduce(
    (sum, a) => sum + (counts[a.name] ?? 0) * a.tokensEach,
    0
  )

  // ─── Save handler ──────────────────────────────────────────────────
  function handleSavePlan() {
    // Only save activities with count > 0
    const plan: ActivityCount = {}
    for (const a of ACTIVITIES) {
      if ((counts[a.name] ?? 0) > 0) {
        plan[a.name] = counts[a.name]
      }
    }
    setSavedPlan(Object.keys(plan).length > 0 ? plan : null)
    setSheetOpen(false)
  }

  // ─── Open sheet (for editing existing plan too) ────────────────────
  function handleOpenSheet() {
    if (savedPlan) {
      // Pre-fill with saved plan
      setCounts(
        Object.fromEntries(
          ACTIVITIES.map((a) => [a.name, savedPlan[a.name] ?? 0])
        )
      )
    } else {
      setCounts(Object.fromEntries(ACTIVITIES.map((a) => [a.name, 0])))
    }
    setSheetOpen(true)
  }

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 py-4 px-4 md:py-6 lg:px-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Semester Plan</h1>
        <Button onClick={handleOpenSheet} className="gap-1.5">
          <Plus className="h-4 w-4" />
          {savedPlan ? "Edit Plan" : "Create Plan"}
        </Button>
      </div>

      {/* Content */}
      {!savedPlan ? (
        /* ── Empty state ──────────────────────────────────────────── */
        <Card className="flex flex-col items-center justify-center py-20">
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-muted p-4">
              <ClipboardList className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground max-w-sm">
              You haven&apos;t created a semester plan yet. Hit &quot;Create
              Plan&quot; to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        /* ── Saved plan cards ─────────────────────────────────────── */
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ACTIVITIES.filter((a) => (savedPlan[a.name] ?? 0) > 0).map((a) => (
              <Card 
                key={a.name} 
                className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:bg-card hover:shadow-md"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 to-primary/80 transition-all group-hover:from-primary/60 group-hover:to-primary" />
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold leading-tight text-foreground/90 group-hover:text-foreground">
                    {a.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-3xl font-bold tracking-tighter text-foreground">
                        {savedPlan[a.name]}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {savedPlan[a.name] > 1 ? "activities" : "activity"}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 shrink-0 shadow-none border-0">
                        {a.tokensEach} tokens each
                      </Badge>
                      <span className="text-sm font-semibold text-muted-foreground/80">
                        = {savedPlan[a.name] * a.tokensEach} pts
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Total tokens card */}
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-sm mt-4">
            <div className="absolute inset-0 bg-primary/5 pattern-diagonal-lines pattern-primary/10 pattern-size-1 mix-blend-overlay" />
            <div className="absolute inset-x-0 top-0 h-1 bg-primary shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between p-6">
              <div className="flex flex-col gap-1 mb-4 md:mb-0">
                <CardTitle className="text-lg font-medium text-primary/80 uppercase tracking-widest">
                  Total Projected
                </CardTitle>
                <span className="text-sm font-medium text-muted-foreground">
                  Minimum requirement: 16 tokens
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1">
                  <Badge className="bg-primary text-primary-foreground shadow-md px-3 py-1 text-sm">
                    {ACTIVITIES.reduce(
                      (sum, a) => sum + (savedPlan[a.name] ?? 0) * a.tokensEach,
                      0
                    ) >= 16 ? "Requirement Met" : "More Needed"}
                  </Badge>
                  <span className="text-xs font-medium text-primary/60">
                    Total Tokens
                  </span>
                </div>
                <span className="text-5xl font-extrabold tracking-tighter text-primary">
                  {ACTIVITIES.reduce(
                    (sum, a) => sum + (savedPlan[a.name] ?? 0) * a.tokensEach,
                    0
                  )}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Activity Sheet ──────────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex flex-col sm:max-w-lg p-0">
          <SheetHeader className="p-6 pb-4 pr-12">
            <SheetTitle className="text-xl">Plan Activities</SheetTitle>
            <SheetDescription>
              Select activities and set how many of each you plan to complete
              this semester.
            </SheetDescription>
          </SheetHeader>

          {/* Activity list (scrollable) */}
          <div className="flex-1 overflow-y-auto w-full">
            <div className="px-6 pb-2">
              {ACTIVITIES.map((activity, idx) => (
                <div key={activity.name}>
                  <div className="flex items-center justify-between py-4 gap-4">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-semibold text-sm">
                        {activity.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {activity.tokensEach} Tokens each
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => decrement(activity.name)}
                        disabled={counts[activity.name] === 0}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-6 text-center font-semibold tabular-nums">
                        {counts[activity.name]}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => increment(activity.name)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  {idx < ACTIVITIES.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </div>

          {/* Footer — total + save */}
          <div className="border-t px-6 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  Total: {totalTokens} Tokens
                </span>
                <Button 
                  onClick={handleSavePlan} 
                  size="lg"
                  disabled={totalTokens < 16}
                >
                  Save Plan
                </Button>
              </div>
              
              {totalTokens < 16 && (
                <div className="text-sm text-destructive bg-destructive/10 rounded-md p-2 text-center">
                  Minimum 16 tokens required. Add {16 - totalTokens} more tokens to save your plan.
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
