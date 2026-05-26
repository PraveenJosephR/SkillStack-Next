import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Trophy } from "lucide-react";
import { Activity } from "../types";

export default function CompletedActivitiesSection({
  completedActivities,
  completedTokens,
}: {
  completedActivities: Activity[];
  completedTokens: number;
}) {
  if (completedActivities.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          Completed
        </h2>
        <Badge className="text-xs tabular-nums bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10">
          {completedActivities.length}
        </Badge>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground tabular-nums">
          +{completedTokens} tokens earned
        </span>
      </div>

      {/* Completed cards — compact horizontal layout */}
      <div className="flex flex-col gap-2">
        {completedActivities.map((activity) => (
          <div
            key={activity.name}
            className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 transition-shadow hover:shadow-sm"
          >
            {/* Check icon */}
            <div className="shrink-0 rounded-full bg-primary/10 p-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight truncate">{activity.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activity.activityType}
                <span className="mx-1.5 text-muted-foreground/40">·</span>
                {activity.organization}
                <span className="mx-1.5 text-muted-foreground/40">·</span>
                {activity.endDate}
              </p>
            </div>

            {/* Trophy + Tokens */}
            <div className="shrink-0 flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                <Trophy className="h-3 w-3" />
                {activity.tokens} tokens
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
