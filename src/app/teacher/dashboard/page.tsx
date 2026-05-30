"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAtom } from "jotai";
import { accessTokenAtom } from "@/store/atoms";
import {
  Users,
  Search,
  CheckCircle2,
  Clock3,
  TrendingUp,
  Award,
  ChevronRight,
  Filter,
  AlertCircle,
} from "lucide-react";

interface StudentEntry {
  student_id: number;
  name: string;
  register_no: number | null;
  section: string | null;
  department: string | null;
  year: string | null;
  total_tokens: number;
  rank?: number;
}

const TARGET_TOKENS = 16;

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [accessToken] = useAtom(accessTokenAtom);
  const [students, setStudents] = useState<StudentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Fetch students assigned to this teacher
  useEffect(() => {
    if (!accessToken) return;

    async function fetchStudents() {
      try {
        setLoading(true);

        const studRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/my-activities/teacher/students`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (studRes.ok) {
          const data = await studRes.json();
          // The API returns an array of students. Map it to the expected StudentEntry format.
          const formattedStudents = data.map((student: any) => ({
            student_id: student.id,
            name: student.name,
            register_no: student.register_no ?? null,
            section: student.section ?? null,
            department: student.department ?? null,
            year: student.year ?? null,
            total_tokens: student.total_tokens ?? 0,
          }));
          setStudents(formattedStudents);
        } else {
          const text = await studRes.text();
          console.error("Failed to load student list:", text);
          setError("Failed to load student list.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [accessToken]);

  // Stats
  const totalStudents = students.length;
  const metTargetCount = students.filter((s) => s.total_tokens >= TARGET_TOKENS).length;
  const avgEarnedTokens =
    totalStudents > 0
      ? Math.round(students.reduce((sum, s) => sum + s.total_tokens, 0) / totalStudents)
      : 0;
  const avgCompletionRate =
    totalStudents > 0
      ? Math.round(
          (students.reduce((sum, s) => sum + Math.min(s.total_tokens / TARGET_TOKENS, 1), 0) /
            totalStudents) *
            100
        )
      : 0;

  // Filtering
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(student.register_no ?? "").includes(searchQuery);

    const hasMetTarget = student.total_tokens >= TARGET_TOKENS;
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Met Target" && hasMetTarget) ||
      (selectedStatus === "In Progress" && !hasMetTarget && student.total_tokens > 0) ||
      (selectedStatus === "Not Started" && student.total_tokens === 0);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-6 py-6 px-4 lg:px-6">

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Faculty Overview Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor student engagement, check semester plan progress, and verify point accumulations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              {avgCompletionRate}% Target Completion Rate
            </Badge>
          </div>
        </div>

        {/* Analytics Grid */}
        {loading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-md p-5 flex items-center gap-4 shadow-xs">
              <div className="rounded-lg p-2.5 bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">My Students</p>
                <h4 className="text-2xl font-bold mt-0.5 tabular-nums text-foreground">{totalStudents}</h4>
              </div>
            </div>

            <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-md p-5 flex items-center gap-4 shadow-xs">
              <div className="rounded-lg p-2.5 bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Met (16+ pts)</p>
                <h4 className="text-2xl font-bold mt-0.5 tabular-nums text-foreground">{metTargetCount}</h4>
              </div>
            </div>

            <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-md p-5 flex items-center gap-4 shadow-xs">
              <div className="rounded-lg p-2.5 bg-indigo-500/10 text-indigo-500">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Earned Tokens</p>
                <h4 className="text-2xl font-bold mt-0.5 tabular-nums text-foreground">{avgEarnedTokens} pts</h4>
              </div>
            </div>

            <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-md p-5 flex items-center gap-4 shadow-xs">
              <div className="rounded-lg p-2.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completion Rate</p>
                <h4 className="text-2xl font-bold mt-0.5 tabular-nums text-foreground">{avgCompletionRate}%</h4>
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Filter Controls & Search */}
        {!loading && !error && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/20 pb-4">
              <div className="flex items-center gap-3 w-full max-w-sm">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 border-border/40 bg-card/40 focus-visible:ring-primary/40 focus-visible:ring-1"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Filter className="h-3 w-3" /> Status:
                  </span>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="rounded-md border border-border/40 bg-card/40 px-3 py-1.5 text-xs font-medium text-foreground focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:outline-none"
                  >
                    <option value="All">All Progress</option>
                    <option value="Met Target">Target Met (16+)</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Associated Students Table */}
            <div className="rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden shadow-xs">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-semibold text-foreground px-6 py-4">Student Info</TableHead>
                    <TableHead className="font-semibold text-foreground px-6 py-4 hidden md:table-cell">Dept / Year</TableHead>
                    <TableHead className="font-semibold text-foreground px-6 py-4 text-center">Earned Points</TableHead>
                    <TableHead className="font-semibold text-foreground px-6 py-4">Target Progress ({TARGET_TOKENS} pts)</TableHead>
                    <TableHead className="font-semibold text-foreground px-6 py-4">Status</TableHead>
                    <TableHead className="font-semibold text-foreground px-6 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => {
                      const hasMetTarget = student.total_tokens >= TARGET_TOKENS;
                      const progressPct = Math.min((student.total_tokens / TARGET_TOKENS) * 100, 100);

                      return (
                        <TableRow
                          key={student.student_id}
                          className="hover:bg-muted/10 transition-colors cursor-pointer"
                          onClick={() => router.push(`/teacher/student/${student.student_id}`)}
                        >
                          {/* Student Info */}
                          <TableCell className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-foreground text-sm">{student.name}</p>
                              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                {student.register_no ?? "No Reg No"}
                                {student.section ? ` · Section ${student.section}` : ""}
                              </p>
                            </div>
                          </TableCell>

                          {/* Dept / Year */}
                          <TableCell className="px-6 py-4 hidden md:table-cell">
                            <div>
                              <p className="text-xs font-medium text-foreground truncate max-w-[180px]">
                                {student.department ?? "—"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {student.year ? `Year ${student.year}` : "—"}
                              </p>
                            </div>
                          </TableCell>

                          {/* Earned Points */}
                          <TableCell className="px-6 py-4 text-center">
                            <span className="text-base font-black text-foreground tabular-nums">
                              {student.total_tokens}
                            </span>
                          </TableCell>

                          {/* Progress Bar */}
                          <TableCell className="px-6 py-4 max-w-[240px]">
                            <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                                <span>{Math.round(progressPct)}%</span>
                                <span>{student.total_tokens} / {TARGET_TOKENS} pts</span>
                              </div>
                              <Progress value={progressPct} className="h-2" />
                            </div>
                          </TableCell>

                          {/* Target Status Badge */}
                          <TableCell className="px-6 py-4">
                            {hasMetTarget ? (
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 text-[10px] font-bold rounded-full px-2.5 py-0.5 flex items-center gap-1.5 w-fit">
                                <CheckCircle2 className="h-3 w-3" /> Target Met
                              </Badge>
                            ) : student.total_tokens > 0 ? (
                              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 hover:bg-indigo-500/10 text-[10px] font-bold rounded-full px-2.5 py-0.5 flex items-center gap-1.5 w-fit">
                                <Clock3 className="h-3 w-3" /> In Progress
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border hover:bg-muted/50 text-[10px] font-bold rounded-full px-2.5 py-0.5 flex items-center gap-1.5 w-fit">
                                Not Started
                              </Badge>
                            )}
                          </TableCell>

                          {/* Action */}
                          <TableCell className="px-6 py-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border/40 bg-card hover:bg-muted/40 font-semibold h-8 rounded-md text-xs px-3 shadow-xs inline-flex items-center gap-1.5"
                            >
                              View Info <ChevronRight className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-medium">
                        {totalStudents === 0
                          ? "No students are currently assigned to you."
                          : "No students found matching your filters."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
