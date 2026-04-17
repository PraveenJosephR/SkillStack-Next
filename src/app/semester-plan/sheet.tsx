"use client";

import { DraftedActivity, draftedActivitiesAtom, selectedActivityAtom, selectedMonthAtom, savedPlanAtom } from "@/store/atoms";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { semPlanDrawerOpen, monthsAtom } from "@/store/atoms";
import { Badge } from "@/components/ui/badge";
import { useAtom } from "jotai";
import {

  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { accessTokenAtom } from "@/store/atoms";

async function getActivities() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/goals/activities`);
  const data = await res.json();
  return data.map((a: any) => ({ name: a.activity_name, tokensEach: a.token }));
}

export function Sidebar() {
  // Total tokens
     const [open, setOpen] = useAtom(semPlanDrawerOpen)
  const [months] = useAtom(monthsAtom)
  const [draftedActivities, setDraftedActivities] = useAtom(draftedActivitiesAtom)
  const [selectedActivity, setSelectedActivity] = useAtom(selectedActivityAtom)
  const [selectedMonth, setSelectedMonth] = useAtom(selectedMonthAtom)
  const [savedPlan, setSavedPlan] = useAtom(savedPlanAtom)
  const totalTokens = draftedActivities.reduce((sum, a) => sum + a.tokensEach, 0);

  // ─── Get Activities ─────────────────────────────────────────────
  const [activities, setActivities] = useState<{ id: number; name: string; tokensEach: number }[]>([]);

  // access token for authenticated API requests
  const [accessToken] = useAtom(accessTokenAtom);
  

  useEffect(() => {
    if (!accessToken) return;

    async function fetchActivities() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/goals/activities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });
      const data = await res.json();
      setActivities(data.map((a: any) => ({ id: a.id, name: a.activity_name, tokensEach: a.token })));
    }
    fetchActivities();
  }, [accessToken]);

  // ─── Handlers ─────────────────────────────────────────────
  function handleAddActivity() {
    if (!selectedActivity || selectedMonth == null) return;

    const activityDef = activities.find(a => a.name === selectedActivity);
    if (!activityDef) return;

    const newActivity: DraftedActivity = {
      id: crypto.randomUUID(),
      activityName: selectedActivity,
      month: selectedMonth as number,
      tokensEach: activityDef.tokensEach,
    };

    setDraftedActivities(prev => [...prev, newActivity]);
    setSelectedActivity("");
    setSelectedMonth(null);
  }

  function handleRemoveActivity(id: string) {
    setDraftedActivities(prev => prev.filter(a => a.id !== id));
  }

  async function handleSavePlan() {
    if (!accessToken || draftedActivities.length === 0) return;

    try {
      // Get existing goals from backend
      const getRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/goals/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const existingGoals = getRes.ok ? await getRes.json() : [];

      // Build payload from drafted activities
      const activitiesPayload = draftedActivities.map(draft => {
        const activity = activities.find(a => a.name === draft.activityName);
        return {
          activity_id: activity?.id,
          activity_name: draft.activityName,
          tokens: draft.tokensEach,
          target_month: draft.month
        };
      });

      // Get existing activity IDs
      const existingActivityIds = new Set(existingGoals.map((g: any) => g.activity_id));

      // Identify activities to ADD (not in existing goals)
      const activitiesToAdd = activitiesPayload.filter(
        a => a.activity_id && !existingActivityIds.has(a.activity_id)
      );

      // Identify goals to DELETE (in existing but not in drafted)
      const draftedActivityIds = new Set(activitiesPayload.map(a => a.activity_id));
      const goalIdsToDelete = existingGoals
        .filter((g: any) => g.activity_id && !draftedActivityIds.has(g.activity_id))
        .map((g: any) => g.id);

      // ADD new activities
      if (activitiesToAdd.length > 0) {
        const postRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/goals/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
          body: JSON.stringify({ 
            activities: activitiesToAdd,
            deadline: null 
          })
        });

        if (!postRes.ok) {
          const err = await postRes.json();
          console.error("Failed to add activities:", err);
          alert(err.detail?.error || err.detail || "Failed to add activities");
          return;
        }
      }

      // DELETE removed goals
      if (goalIdsToDelete.length > 0) {
        const delRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/goals/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
          body: JSON.stringify({ 
            goal_ids: goalIdsToDelete,
            new_activities: activitiesPayload
          })
        });

        if (!delRes.ok) {
          const err = await delRes.json();
          console.error("Failed to delete goals:", err);
          alert(err.detail?.error || err.detail || "Failed to delete goals");
          return;
        }
      }

      // Refresh the saved plan from backend
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/goals/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const transformed = data.map((g: any) => ({
          id: g.id.toString(),
          activityName: g.activity_name,
          month: g.target_month,
          tokensEach: g.token
        }));
        setSavedPlan(transformed);
      }

      setOpen(false);
      console.log("Plan saved successfully");
    } catch (err) {
      console.error("Error saving plan:", err);
      alert("Something went wrong. Please try again.");
    }
  }

  // ─── Render ──────────────────────────────────────────────
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col sm:max-w-lg p-0">
        <SheetHeader className="p-6 pb-4 pr-12">
          <SheetTitle className="text-xl">Plan Activities</SheetTitle>
          <SheetDescription>
            Select activities and set how many of each you plan to complete this semester.
          </SheetDescription>
        </SheetHeader>

        {/* Form */}
        <div className="flex flex-col sm:flex-row items-center gap-3 border-b px-6 pb-6">
          <Select value={selectedActivity} onValueChange={setSelectedActivity}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Activity..." />
            </SelectTrigger>
            <SelectContent>
              {activities.map(a => (
                <SelectItem key={a.name} value={a.name}>
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="truncate">{a.name}</span>
                    <span className="text-muted-foreground text-xs">{a.tokensEach} tokens</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

            <Select value={selectedMonth != null ? String(selectedMonth) : ""} onValueChange={(v) => setSelectedMonth(Number(v))}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="Month..." />
            </SelectTrigger>
            <SelectContent>
              {months.map(m => (
                <SelectItem key={m.value} value={String(m.value)}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-full sm:w-auto gap-1.5"
            disabled={!selectedActivity || selectedMonth == null}
            onClick={handleAddActivity}
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        {/* Draft list */}
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
              draftedActivities.map(draft => (
                <div
                  key={draft.id}
                  className="flex items-center justify-between p-3 bg-card border rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="font-semibold text-sm truncate">{draft.activityName}</span>
                    <Badge variant="secondary" className="px-1.5 py-0 shadow-none text-[10px]">
                      {months.find(x => x.value === draft.month)?.name || String(draft.month)}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto shrink-0">
                      {draft.tokensEach} tokens
                    </span>
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

        {/* Footer */}
        <div className="border-t px-6 py-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total: {totalTokens} Tokens</span>
              <Button onClick={handleSavePlan} size="lg" disabled={totalTokens < 16}>
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
  );
}