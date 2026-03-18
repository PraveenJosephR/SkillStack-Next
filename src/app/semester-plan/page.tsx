"use client"

import { useState } from "react"
import { ClipboardList, Plus, Minus, X, Trash2 } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
] as const

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
type ActivityMonths = Record<string, string[]>

type DraftedActivity = {
  id: string; // unique id for removal
  activityName: string;
  month: string;
  tokensEach: number;
}

export default function SemesterPlanPage() {
  const [savedPlan, setSavedPlan] = useState<DraftedActivity[] | null>(null)
  
  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false)
  const [draftedActivities, setDraftedActivities] = useState<DraftedActivity[]>([])
  
  // Form state
  const [selectedActivity, setSelectedActivity] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")

  // Calculate tokens
  const totalTokens = draftedActivities.reduce((sum, a) => sum + a.tokensEach, 0)
  const savedTotalTokens = savedPlan?.reduce((sum, a) => sum + a.tokensEach, 0) || 0

  // ─── Draft Add / Remove ───────────────────────────────────────────────
  function handleAddActivity() {
    if (!selectedActivity || !selectedMonth) return
    
    const activityDef = ACTIVITIES.find(a => a.name === selectedActivity)
    if (!activityDef) return

    const newActivity: DraftedActivity = {
      id: crypto.randomUUID(),
      activityName: selectedActivity,
      month: selectedMonth,
      tokensEach: activityDef.tokensEach
    }

    setDraftedActivities((prev) => [...prev, newActivity])
    setSelectedActivity("")
    setSelectedMonth("")
  }

  function handleRemoveActivity(id: string) {
    setDraftedActivities((prev) => prev.filter(a => a.id !== id))
  }

  // ─── Save handler ──────────────────────────────────────────────────
  function handleSavePlan() {
    if (draftedActivities.length > 0) {
      setSavedPlan([...draftedActivities])
    } else {
      setSavedPlan(null)
    }
    setSheetOpen(false)
  }

  // ─── Open sheet ────────────────────────────────────────────────────
  function handleOpenSheet() {
    if (savedPlan) {
      // Load saved activities into draft
      setDraftedActivities([...savedPlan])
    } else {
      setDraftedActivities([])
    }
    setSelectedActivity("")
    setSelectedMonth("")
    setSheetOpen(true)
  }
  
  // Helper to group saved plan by activity name for the dashboard view
  const groupedSavedPlan = savedPlan?.reduce((acc, curr) => {
    if (!acc[curr.activityName]) {
      acc[curr.activityName] = { 
        count: 0, 
        tokensEach: curr.tokensEach, 
        months: [] 
      };
    }
    acc[curr.activityName].count += 1;
    acc[curr.activityName].months.push(curr.month);
    return acc;
  }, {} as Record<string, { count: number, tokensEach: number, months: string[] }>) || {};

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
            {Object.entries(groupedSavedPlan).map(([activityName, data]) => (
              <Card 
                key={activityName} 
                className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:bg-card hover:shadow-md"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 to-primary/80 transition-all group-hover:from-primary/60 group-hover:to-primary" />
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold leading-tight text-foreground/90 group-hover:text-foreground">
                    {activityName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-3xl font-bold tracking-tighter text-foreground">
                        {data.count}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {data.count > 1 ? "activities" : "activity"}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 shrink-0 shadow-none border-0">
                        {data.tokensEach} tokens each
                      </Badge>
                      <span className="text-sm font-semibold text-muted-foreground/80">
                        = {data.count * data.tokensEach} pts
                      </span>
                    </div>
                  </div>
                  {data.months.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {data.months.map((m, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-muted/50 px-2.5 py-0.5 border border-border/50">
                          {m || "Unscheduled"}
                        </span>
                      ))}
                    </div>
                  )}
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
                    {savedTotalTokens >= 16 ? "Requirement Met" : "More Needed"}
                  </Badge>
                  <span className="text-xs font-medium text-primary/60">
                    Total Tokens
                  </span>
                </div>
                <span className="text-5xl font-extrabold tracking-tighter text-primary">
                  {savedTotalTokens}
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

          {/* Activity Form */}
          <div className="flex flex-col sm:flex-row items-center gap-3 border-b px-6 pb-6">
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Activity..." />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITIES.map((a) => (
                  <SelectItem key={a.name} value={a.name}>
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="truncate">{a.name}</span>
                      <span className="text-muted-foreground font-normal shrink-0">{a.tokensEach} tokens</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-[130px]">
                <SelectValue placeholder="Month..." />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              className="w-full sm:w-auto shrink-0 gap-1.5"
              disabled={!selectedActivity || !selectedMonth}
              onClick={handleAddActivity}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          {/* Drafted list (scrollable) */}
          <div className="flex-1 overflow-y-auto w-full bg-muted/20">
            <div className="px-6 py-4 flex flex-col gap-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                Added Activities
              </h3>
              
              {draftedActivities.length === 0 ? (
                <div className="text-sm text-center text-muted-foreground py-8 border border-dashed rounded-lg">
                  No activities added yet.
                </div>
              ) : (
                draftedActivities.map((draft) => (
                  <div 
                    key={draft.id} 
                    className="flex items-center justify-between p-3 bg-card border rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="font-semibold text-sm truncate">{draft.activityName}</span>
                      <Badge variant="secondary" className="px-1.5 py-0 shadow-none font-normal text-[10px] shrink-0">
                        {draft.month}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-auto shrink-0">{draft.tokensEach} tokens</span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveActivity(draft.id)}
                      className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
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
