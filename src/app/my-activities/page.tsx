"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { initialActivities } from "./activitiesData";
import { Activity } from "./types";
import StatsSection from "./components/stats-section";
import ActiveActivityCard from "./components/active-activity-card";
import CompletedActivitiesSection from "./components/completed-activities-section";

export default function MyCurrentActivitiesPage() {
  const [activityList, setActivityList] = useState<Activity[]>(initialActivities);

  const activeActivities = activityList.filter((a) => a.status !== "Completed");
  const completedActivities = activityList.filter((a) => a.status === "Completed");

  const completedTokens = completedActivities.reduce((sum, a) => sum + a.tokens, 0);
  const pendingTokens = activeActivities
    .filter((a) => a.status !== "Rejected")
    .reduce((sum, a) => sum + a.tokens, 0);
  const inProgressCount = activityList.filter((a) => a.status === "In Progress").length;

  const handleUploadComplete = (activityName: string) => {
    setActivityList((prev) =>
      prev.map((a) => {
        if (a.name === activityName) {
          return {
            ...a,
            status: "Pending AI Verification",
            feedback: undefined,
            progress: 100, // Mark progress as 100% since proof is uploaded
          };
        }
        return a;
      })
    );
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <div className="flex flex-col gap-8 py-6 px-4 lg:px-6">

          {/* ── Page Header ── */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">My Current Activities</h1>
            <Badge
              variant="outline"
              className="text-sm px-4 py-1.5 tabular-nums font-semibold border-primary/30 text-primary bg-primary/5"
            >
              <Coins className="h-3.5 w-3.5 mr-1.5" />
              {completedTokens + pendingTokens} total tokens
            </Badge>
          </div>

          {/* ── Summary Stats ── */}
          <StatsSection
            totalActivities={activityList.length}
            inProgressCount={inProgressCount}
            completedTokens={completedTokens}
            pendingTokens={pendingTokens}
          />

          {/* ── Tabs for Active vs Completed ── */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList variant="line" className="relative ![&_[data-state=active]]:bg-primary mb-6 h-auto">
              <TabsTrigger value="active" className="text-base px-4 py-1.5 font-semibold">Active ({activeActivities.length})</TabsTrigger>
              <TabsTrigger value="completed" className="text-base px-4 py-1.5 font-semibold">Completed ({completedActivities.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-0">
              {activeActivities.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {activeActivities.map((activity) => (
                    <ActiveActivityCard
                      key={activity.name}
                      activity={activity}
                      onUploadComplete={() => handleUploadComplete(activity.name)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No active activities.</p>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <CompletedActivitiesSection
                completedActivities={completedActivities}
                completedTokens={completedTokens}
              />
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
}
