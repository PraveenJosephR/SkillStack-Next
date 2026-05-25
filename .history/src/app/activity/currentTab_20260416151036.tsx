"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Activity = {
  id: number;
  title: string;
  description: string;
  tokens: number;
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortHighToLow, setSortHighToLow] = useState(true);

  // 🔥 Fetch from backend
  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/my-activities/activities`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        const formatted = (data.activities || []).map((item: any) => ({
          id: item.id,
          title: item.title || item.name,
          description: item.description,
          tokens: item.tokens,
        }));

        setActivities(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  // 🔥 Start activity
  const handleStart = async (activityId: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/my-activities/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ activity_id: activityId }),
        },
      );

      if (!res.ok) throw new Error("Failed to start activity");

      alert("Activity started 🚀");
    } catch (err) {
      console.error(err);
      alert("Error starting activity");
    }
  };

  // 🔥 Filter + Sort
  const filteredActivities = activities
    .filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortHighToLow ? b.tokens - a.tokens : a.tokens - b.tokens,
    );

  // 🔄 Loading
  if (loading) {
    return <p className="p-6 text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* 🔍 Search + Sort */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search activities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-md px-3 py-2 outline-none"
        />

        <button
          onClick={() => setSortHighToLow(!sortHighToLow)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          {sortHighToLow ? "High → Low" : "Low → High"}
        </button>
      </div>

      {/* 🧱 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredActivities.map((activity) => (
          <Card
            key={activity.id}
            className="rounded-xl border p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition"
          >
            {/* Top */}
            <div className="space-y-2">
              <CardTitle className="text-lg font-semibold">
                {activity.title}
              </CardTitle>

              <CardDescription className="text-sm text-muted-foreground">
                {activity.description}
              </CardDescription>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs px-3 py-1 rounded-full bg-muted">
                {activity.tokens} tokens
              </span>

              <button
                onClick={() => handleStart(activity.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
              >
                Start
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* 📭 Empty */}
      {filteredActivities.length === 0 && (
        <p className="text-center text-muted-foreground">No activities found</p>
      )}
    </div>
  );
}
