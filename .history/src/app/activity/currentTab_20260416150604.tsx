"use client";

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

const activities = await fetch(
  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/my_activities/activities`,
  {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Include cookies for authentication
  },
)
  .then((res) => res.json())
  .then((data) => data.activities)
  .catch(() => []); // Fallback to empty array on error

type Activity = {
  name: string;
  description: string;
  organization: string;
  tokens: number;
  endDate: string;
  progress: number;
  status: string;
};

const activities: Activity[] = [
  {
    name: "AI Workshop",
    description: "Hands-on AI tools and models",
    organization: "Tech Club",
    tokens: 4,
    endDate: "Apr 10, 2026",
    progress: 80,
    status: "AI Proof Verification",
  },
  {
    name: "Hackathon",
    description: "24-hour coding challenge",
    organization: "Coding Society",
    tokens: 6,
    endDate: "May 2, 2026",
    progress: 40,
    status: "Event in Progress",
  },
  {
    name: "Startup Seminar",
    description: "Entrepreneurship and pitching",
    organization: "Business Club",
    tokens: 3,
    endDate: "Apr 5, 2026",
    progress: 5,
    status: "Permission Approval",
  },
];

export default function CurrentActivities() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Current Activities</h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <Card
            key={activity.name}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4"
          >
            {/* Left Content */}
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
                {/* <span>• {activity.tokens} tokens</span> */}
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

            <div className="w-32 flex flex-col items-center justify-center rounded-xl px-4 py-3">
              {/* Tokens */}
              <div className="text-center">
                <p className="text-5xl font-bold tracking-tight">
                  {activity.tokens}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  tokens
                </p>
              </div>

              {/* Divider */}
              <div className="my-2 h-px w-full bg-border" />

              {/* Status */}
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
