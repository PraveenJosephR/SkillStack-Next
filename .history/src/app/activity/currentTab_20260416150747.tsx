"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import CompleteActivityDialog from "./completeActivityDialog";
import { Badge } from "@/components/ui/badge";
import CustomTooltip from "@/components/custom-tool-tip";

type Activity = {
  name: string;
  description: string;
  organization: string;
  tokens: number;
  endDate: string;
  progress: number;
  status: string;
};

export default function CurrentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/my-activities/activities`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // if using cookies
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch activities");
        }

        const data = await res.json();

        // Adjust mapping if backend fields differ
        const formatted = (data.activities || []).map((item: any) => ({
          name: item.name,
          description: item.description,
          organization: item.organization,
          tokens: item.tokens,
          endDate: item.end_date,
          progress: item.progress,
          status: item.status,
        }));

        setActivities(formatted);
      } catch (err) {
        console.error(err);
        setError("Unable to load activities");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  // 🔄 Loading UI
  if (loading) {
    return <p className="text-muted-foreground">Loading activities...</p>;
  }

  // ❌ Error UI
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // 📭 Empty state
  if (activities.length === 0) {
    return <p className="text-muted-foreground">No activities found</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Current Activities</h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <Card
            key={activity.name}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4"
          >
            {/* Left */}
            <div className="flex-1 space-y-2">
              <CardHeader className="p-0">
                {activity.status === "Event in Progress" ? (
                  <div className="flex gap-2">
                    <CardTitle className="text-base">{activity.name}</CardTitle>
                    <CustomTooltip content="Complete activity?" position="top">
                      <span>
                        <CompleteActivityDialog title={activity.name} />
                      </span>
                    </CustomTooltip>
                  </div>
                ) : (
                  <CardTitle className="text-base">{activity.name}</CardTitle>
                )}

                <CardDescription>{activity.description}</CardDescription>
              </CardHeader>

              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span>{activity.organization}</span>
                <span>• Ends: {activity.endDate}</span>
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <Progress value={activity.progress} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{activity.progress}%</span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="w-32 flex flex-col items-center justify-center rounded-xl px-4 py-3">
              <div className="text-center">
                <p className="text-5xl font-bold">{activity.tokens}</p>
                <p className="text-[10px] uppercase text-muted-foreground">
                  tokens
                </p>
              </div>

              <div className="my-2 h-px w-full bg-border" />

              <Badge variant="secondary" className="text-xs text-center">
                {activity.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
