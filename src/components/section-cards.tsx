"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { accessTokenAtom, userAtom } from "@/store/atoms";
import { IconTrendingUp, IconCoins, IconActivity, IconTarget } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TokenSummary {
  total_tokens: number;
  earned: number;
  spent: number;
  breakdown: {
    activity_completed: number;
    malpractice_deducted: number;
    malpractice_reversed: number;
  };
}

interface GoalSummary {
  total_goals: number;
  minimum_required: number;
  minimum_met: boolean;
  total_target_tokens: number;
  total_current_tokens: number;
  remaining_tokens: number;
}

export function SectionCards() {
  const [accessToken] = useAtom(accessTokenAtom);
  const [user] = useAtom(userAtom);
  const [tokenSummary, setTokenSummary] = useState<TokenSummary | null>(null);
  const [goalSummary, setGoalSummary] = useState<GoalSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    async function fetchData() {
      try {
        setLoading(true);
        const [tokRes, goalRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/tokens`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/goals/summary`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        if (tokRes.ok) setTokenSummary(await tokRes.json());
        if (goalRes.ok) setGoalSummary(await goalRes.json());
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [accessToken]);

  const minRequired = goalSummary?.minimum_required ?? 16;
  const earned = tokenSummary?.earned ?? 0;
  const progressPct = Math.min(Math.round((earned / minRequired) * 100), 100);
  const totalGoals = goalSummary?.total_goals ?? 0;
  const remainingTokens = Math.max(0, minRequired - earned);
  const isMet = goalSummary?.minimum_met ?? false;

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      {/* Total Earned Tokens */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Earned Tokens</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {earned}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCoins className="size-3 mr-1" />
              {progressPct}% of {minRequired}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isMet ? (
              <>Requirement met! <IconTrendingUp className="size-4 text-emerald-500" /></>
            ) : (
              <>{remainingTokens} more tokens needed</>
            )}
          </div>
          <div className="text-muted-foreground">
            Minimum requirement: {minRequired} tokens
          </div>
        </CardFooter>
      </Card>

      {/* Planned Activities */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Planned Activities</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalGoals}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconActivity className="size-3 mr-1" />
              {goalSummary?.total_target_tokens ?? 0} target pts
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {totalGoals === 0 ? "No semester plan yet" : `${totalGoals} activities in plan`}
          </div>
          <div className="text-muted-foreground">
            From your semester plan
          </div>
        </CardFooter>
      </Card>

      {/* Semester Target */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Semester Target</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {goalSummary?.total_target_tokens ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant={isMet ? "default" : "outline"}>
              <IconTarget className="size-3 mr-1" />
              {isMet ? "Met!" : `${remainingTokens} remaining`}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isMet ? "Target achieved" : "Target in progress"}
            {isMet && <IconTrendingUp className="size-4 text-emerald-500" />}
          </div>
          <div className="text-muted-foreground">
            Projected tokens in semester plan
          </div>
        </CardFooter>
      </Card>

      {/* Net Token Balance */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Net Token Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {tokenSummary?.total_tokens ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCoins className="size-3 mr-1" />
              {tokenSummary?.spent ? `-${Math.abs(tokenSummary.spent)} spent` : "No deductions"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {tokenSummary?.breakdown.malpractice_deducted
              ? `${Math.abs(tokenSummary.breakdown.malpractice_deducted)} deducted (malpractice)`
              : "No malpractice deductions"}
          </div>
          <div className="text-muted-foreground">
            Earned {earned} · Spent {Math.abs(tokenSummary?.spent ?? 0)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
