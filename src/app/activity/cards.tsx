"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import StartActivityDialog from "./startActivityDialog";
import { X } from "lucide-react";
import { useAtom } from "jotai";
import { accessTokenAtom } from "@/store/atoms";

interface ActivityItem {
  id: number;
  activity_name: string;
  token: number;
  description?: string;
}

const ROWS_TO_SHOW = 2;
const COLS = 4;

export default function ActivityCards() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(ROWS_TO_SHOW * COLS);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortHighToLow, setSortHighToLow] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [accessToken] = useAtom(accessTokenAtom);

  // Fetch activities from backend
  useEffect(() => {
    if (!accessToken) return;

    async function fetchActivities() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/goals/activities`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setActivities(data);
          } else {
            setError("Unexpected response from server.");
          }
        } else {
          setError("Failed to load activities.");
        }
      } catch (err) {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [accessToken]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((prev) =>
              Math.min(prev + ROWS_TO_SHOW * COLS, filteredActivities.length)
            );
          }
        });
      },
      { rootMargin: "100px" }
    );

    observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, []);

  // Filtered + sorted activities
  const filteredActivities = useMemo(() => {
    const filtered = activities.filter((a) =>
      a.activity_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.sort((a, b) =>
      sortHighToLow ? b.token - a.token : a.token - b.token
    );
  }, [activities, searchTerm, sortHighToLow]);

  if (loading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-5">
          <Skeleton className="h-10 w-full sm:w-80" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <p className="text-destructive font-medium">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-5">
        <div className="relative w-full sm:w-64 md:w-80 lg:w-96">
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button
          onClick={() => setSortHighToLow(!sortHighToLow)}
          className="w-full sm:w-auto"
        >
          {sortHighToLow ? "High → Low" : "Low → High"}
        </Button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredActivities.map((activity) => (
          <Card
            key={activity.id}
            className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:bg-card hover:shadow-md"
          >
            {/* Top gradient bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 to-primary/80 group-hover:from-primary/60 group-hover:to-primary" />

            {/* Header */}
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {activity.activity_name}
              </CardTitle>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground min-h-[2.5rem]">
                {activity.description ?? "Complete this activity to earn tokens toward your semester goal."}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{activity.token} tokens</Badge>
                <StartActivityDialog
                  activityId={activity.id}
                  title={activity.activity_name}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <p className="text-center text-muted-foreground mt-5">
          No activities found.
        </p>
      )}
    </div>
  );
}