"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StartActivityDialog from "./startActivityDialog"
import { X } from "lucide-react";
// Import JSON data
import activitiesData from "./data.json";

const ROWS_TO_SHOW = 2;
const COLS = 4;

export default function ActivityCards() {
    const [visibleCount, setVisibleCount] = useState(ROWS_TO_SHOW * COLS);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortHighToLow, setSortHighToLow] = useState(true);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleCount((prev) => Math.min(prev + ROWS_TO_SHOW * COLS, filteredActivities.length));
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
        const filtered = activitiesData.filter(
            (a: { name: string; description: string; tokens: number }) =>
                a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered.sort((a, b) => (sortHighToLow ? b.tokens - a.tokens : a.tokens - b.tokens));
    }, [searchTerm, sortHighToLow]);

    return (
        <div>

            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-5">
                <div className="relative w-full sm:w-64 md:w-80 lg:w-96">
                    <Input
                        placeholder="Search activities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10" // space for the clear button
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
                <Button onClick={() => setSortHighToLow(!sortHighToLow)} className="w-full sm:w-auto">
                    {sortHighToLow ? "High → Low" : "Low → High"}
                </Button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredActivities.slice(0, visibleCount).map((activity) => (
                    <Card
                        key={activity.name}
                        className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:bg-card hover:shadow-md"
                    >
                        {/* Top gradient bar */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 to-primary/80 group-hover:from-primary/60 group-hover:to-primary" />

                        {/* Header */}
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">{activity.name}</CardTitle>
                        </CardHeader>

                        {/* Content */}
                        <CardContent className="flex flex-col gap-4">
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            <div className="flex items-center justify-between">
                                <Badge variant="secondary">{activity.tokens} tokens</Badge>
                                <StartActivityDialog title={activity.name}/>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Lazy load trigger */}
                <div ref={loadMoreRef}></div>
            </div>

            {filteredActivities.length === 0 && (
                <p className="text-center text-muted-foreground mt-5">No activities found.</p>
            )}
        </div>
    );
}