"use client";

import { DraftedActivity } from "./cards";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

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
] as const;

type SemesterPlanClientProps = {
  state: {
    open: boolean;
    draftedActivities: DraftedActivity[];
    selectedActivity: string;
    selectedMonth: string;
    savedPlan: DraftedActivity[] | null;
  };
  setOpen: (open: boolean) => void;
  setDraftedActivities: (updater: (prev: DraftedActivity[]) => DraftedActivity[]) => void;
  setSelectedActivity: (value: string) => void;
  setSelectedMonth: (value: string) => void;
  setSavedPlan: (plan: DraftedActivity[] | null) => void;
};

export function Sidebar({
  state,
  setOpen,
  setDraftedActivities,
  setSelectedActivity,
  setSelectedMonth,
  setSavedPlan,
}: SemesterPlanClientProps) {
  // Total tokens
  const totalTokens = state.draftedActivities.reduce((sum, a) => sum + a.tokensEach, 0);

  // ─── Handlers ─────────────────────────────────────────────
  function handleAddActivity() {
    if (!state.selectedActivity || !state.selectedMonth) return;

    const activityDef = ACTIVITIES.find(a => a.name === state.selectedActivity);
    if (!activityDef) return;

    const newActivity: DraftedActivity = {
      id: crypto.randomUUID(),
      activityName: state.selectedActivity,
      month: state.selectedMonth,
      tokensEach: activityDef.tokensEach,
    };

    setDraftedActivities(prev => [...prev, newActivity]);
    setSelectedActivity("");
    setSelectedMonth("");
  }

  function handleRemoveActivity(id: string) {
    setDraftedActivities(prev => prev.filter(a => a.id !== id));
  }

  function handleSavePlan() {
    setSavedPlan(state.draftedActivities.length > 0 ? [...state.draftedActivities] : null);
    setOpen(false);
  }

  // ─── Render ──────────────────────────────────────────────
  return (
    <Sheet open={state.open} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col sm:max-w-lg p-0">
        <SheetHeader className="p-6 pb-4 pr-12">
          <SheetTitle className="text-xl">Plan Activities</SheetTitle>
          <SheetDescription>
            Select activities and set how many of each you plan to complete this semester.
          </SheetDescription>
        </SheetHeader>

        {/* Form */}
        <div className="flex flex-col sm:flex-row items-center gap-3 border-b px-6 pb-6">
          <Select value={state.selectedActivity} onValueChange={setSelectedActivity}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Activity..." />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITIES.map(a => (
                <SelectItem key={a.name} value={a.name}>
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="truncate">{a.name}</span>
                    <span className="text-muted-foreground text-xs">{a.tokensEach} tokens</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={state.selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="Month..." />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-full sm:w-auto gap-1.5"
            disabled={!state.selectedActivity || !state.selectedMonth}
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

            {state.draftedActivities.length === 0 ? (
              <div className="text-sm text-center text-muted-foreground py-8 border border-dashed rounded-lg">
                No activities added yet.
              </div>
            ) : (
              state.draftedActivities.map(draft => (
                <div
                  key={draft.id}
                  className="flex items-center justify-between p-3 bg-card border rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="font-semibold text-sm truncate">{draft.activityName}</span>
                    <Badge variant="secondary" className="px-1.5 py-0 shadow-none text-[10px]">
                      {draft.month}
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