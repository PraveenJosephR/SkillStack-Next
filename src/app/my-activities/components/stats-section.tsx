import { Card } from "@/components/ui/card";
import { ListChecks, Activity as ActivityIcon, CheckCircle2, TrendingUp } from "lucide-react";

export default function StatsSection({
  totalActivities,
  inProgressCount,
  completedTokens,
  pendingTokens,
}: {
  totalActivities: number;
  inProgressCount: number;
  completedTokens: number;
  pendingTokens: number;
}) {
  const stats = [
    {
      label: "Total Activities",
      value: totalActivities,
      sub: "all time",
      icon: <ListChecks className="h-5 w-5 text-primary" />,
      valueClass: "text-black",
      iconBg: "bg-primary/10",
    },
    {
      label: "In Progress",
      value: inProgressCount,
      sub: "active now",
      icon: <ActivityIcon className="h-5 w-5 text-primary" />,
      valueClass: "text-black",
      iconBg: "bg-primary/10",
    },
    {
      label: "Tokens Earned",
      value: completedTokens,
      sub: "from completed",
      icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
      valueClass: "text-black",
      iconBg: "bg-primary/10",
    },
    {
      label: "Tokens Pending",
      value: pendingTokens,
      sub: "at stake",
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      valueClass: "text-black",
      iconBg: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 @3xl/main:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="relative overflow-hidden p-5 gap-3 hover:shadow-sm transition-shadow duration-300"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </p>
            <div className={`rounded-lg p-2 ${stat.iconBg}`}>{stat.icon}</div>
          </div>
          <div>
            <p className={`text-4xl font-bold tabular-nums leading-none ${stat.valueClass}`}>
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />
        </Card>
      ))}
    </div>
  );
}
