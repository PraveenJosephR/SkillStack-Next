"use client";

import { useEffect } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { userAtom, authLoadingAtom,semPlanDrawerOpen, monthsAtom, draftedActivitiesAtom, selectedActivityAtom, selectedMonthAtom, savedPlanAtom, DraftedActivity, accessTokenAtom } from "@/store/atoms";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Sidebar } from "./sheet";


// ─── Component ──────────────────────────────────────────────────────
export function Cards() {
   const [user, setUser] = useAtom(userAtom)
   const [open, setOpen] = useAtom(semPlanDrawerOpen)
   const [months] = useAtom(monthsAtom)
   const [draftedActivities, setDraftedActivities] = useAtom(draftedActivitiesAtom)
   const [selectedActivity, setSelectedActivity] = useAtom(selectedActivityAtom)
   const [selectedMonth, setSelectedMonth] = useAtom(selectedMonthAtom)
   const [savedPlan, setSavedPlan] = useAtom(savedPlanAtom)
   const [accessToken] = useAtom(accessTokenAtom);

   useEffect(() => {
     console.log("user:",user)
   },[])

   useEffect(() => {
     if (!accessToken) return;

     async function fetchGoals() {
       try {
         const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/goals/`, {
           headers: { Authorization: `Bearer ${accessToken}` }
         });
         
         if (res.ok) {
           const data = await res.json();
           
           const transformed = data.map((g: any) => ({
             id: g.id.toString(),
             activityName: g.activity_name,
             month: g.target_month,
             tokensEach: g.token
           }));
           setSavedPlan(transformed);
         }
       } catch (err) {
         console.error("Failed to fetch goals:", err);
       }
     }

     fetchGoals();
   }, [accessToken, setSavedPlan]);

  // ─── Derived values ───────────────────────────────────────────────
  const savedTotalTokens =
    savedPlan?.reduce((sum, a) => sum + a.tokensEach, 0) || 0;

  // ─── Actions ─────────────────────────────────────────────────────
  function openSheet() {
    setDraftedActivities(savedPlan ? [...savedPlan] : [])
    setSelectedActivity("")
    setSelectedMonth(null)
    setOpen(prev=>!prev);
  }


  // ─── Grouped data for UI ──────────────────────────────────────────
  const groupedSavedPlan = savedPlan?.reduce((acc, curr) => {
      if (!acc[curr.activityName]) {
        acc[curr.activityName] = {
          count: 0,
          tokensEach: curr.tokensEach,
          months: [] as number[],
        };
      }
      acc[curr.activityName].count += 1;
      acc[curr.activityName].months.push(curr.month);
      return acc;
      }, {} as Record<string, { count: number; tokensEach: number; months: number[] }>) ||
    {};

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Semester Plan
        </h1>

        <Button onClick={openSheet} className="gap-1.5">
          <Plus className="h-4 w-4" />
          {savedPlan ? "Edit Plan" : "Create Plan"}
        </Button>
      </div>

      {/* Content */}
      {!savedPlan ? (
        <Card className="flex flex-col items-center justify-center py-20">
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-muted p-4">
              <ClipboardList className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground max-w-sm">
              You haven&apos;t created a semester plan yet. Hit
              &quot;Create Plan&quot; to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Cards grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Object.entries(groupedSavedPlan).map(
              ([activityName, data]) => (
                <Card
                  key={activityName}
                  className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:bg-card hover:shadow-md"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 to-primary/80 group-hover:from-primary/60 group-hover:to-primary" />

                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold leading-tight">
                      {activityName}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-3xl font-bold tracking-tighter">
                          {data.count}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase">
                          {data.count > 1 ? "activities" : "activity"}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <Badge variant="secondary">
                          {data.tokensEach} tokens each
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                         {data.count * data.tokensEach} pts
                        </span>
                      </div>
                    </div>

                    {data.months.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {data.months.map((m, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-full bg-muted/50 px-2.5 py-0.5 border"
                          >
                            {months.find(x => x.value === m)?.name || "Unscheduled"}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            )}
          </div>

          {/* Total card */}
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-sm mt-4">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between p-6">
              <div className="flex flex-col gap-1 mb-4 md:mb-0">
                <CardTitle className="text-lg text-primary/80 uppercase tracking-widest">
                  Total Projected
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  Minimum requirement: 16 tokens
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1">
                  <Badge>
                    {savedTotalTokens >= 16
                      ? "Requirement Met"
                      : "More Needed"}
                  </Badge>
                  <span className="text-xs text-primary/60">
                    Total Tokens
                  </span>
                </div>

                <span className="text-5xl font-extrabold text-primary">
                  {savedTotalTokens}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

    </>
  );
}