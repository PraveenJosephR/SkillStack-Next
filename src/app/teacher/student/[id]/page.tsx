"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { accessTokenAtom } from "@/store/atoms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  X,
  Mail,
  User,
  Hash,
  GraduationCap,
  Calendar,
  AlertCircle,
  Briefcase,
} from "lucide-react";

// --- Types from backend API ---
interface StudentProfile {
  id: number;
  name: string;
  email_id: string;
  role_id: number;
  is_active: number;
  // extended fields (from leaderboard entry)
  register_no?: number | null;
  department?: string | null;
  year?: string | null;
  section?: string | null;
  total_tokens?: number;
}

interface TokenSummary {
  total_tokens: number;
  earned: number;
  spent: number;
  breakdown: Record<string, number>;
}

// Stage ID → display status mapping (based on DB stage table)
// 1: permission_upload, 2: ai_permission_verification, 3: manual_permission_verification
// 4: event_progress, 5: ai_proof_verification, 6: manual_proof_verification, 7: activity_completed
// Status IDs: 1=Yet To Start, 2=In Progress, 3=Completed, 4=Failure
function deriveDisplayStatus(statusId: number, stageId: number): string {
  if (statusId === 3 || stageId === 7) return "Completed";
  if (statusId === 4) return "Rejected";
  if (stageId === 6 || stageId === 3) return "Awaiting Faculty Approval";
  if (stageId === 5 || stageId === 2) return "Pending AI Verification";
  return "In Progress";
}

function deriveProgress(stageId: number, statusId: number): number {
  if (statusId === 3 || stageId === 7) return 100;
  if (statusId === 4) return 100; // completed but rejected
  const stageProgress: Record<number, number> = {
    1: 15, 2: 30, 3: 50, 4: 65, 5: 80, 6: 90, 7: 100,
  };
  return stageProgress[stageId] ?? 10;
}

interface ActivityRow {
  id: number;
  title: string;
  activity_name?: string;
  activity_details?: string | null;
  stage_id: number;
  status: number;
  permission_score?: number;
  proof_score?: number;
  activity_start_date?: string | null;
  activity_end_date?: string | null;
  token?: number;
  category_name?: string | null;
}

const TARGET_TOKENS = 16;

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const studentId = parseInt(resolvedParams.id, 10);
  const [accessToken] = useAtom(accessTokenAtom);

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [tokenSummary, setTokenSummary] = useState<TokenSummary | null>(null);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || isNaN(studentId)) return;

    async function fetchStudentData() {
      try {
        setLoading(true);

        const [tokenRes, actRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/students/${studentId}/tokens`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/my-activities/teacher/students/${studentId}/activities`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          ),
        ]);

        if (tokenRes.ok) {
          setTokenSummary(await tokenRes.json());
        }

        if (actRes.ok) {
          const actData = await actRes.json();
          setActivities(Array.isArray(actData) ? actData : actData.activities ?? []);
          // Try to extract profile info from first activity if student profile endpoint isn't available
          if (actData?.student) {
            setProfile(actData.student);
          }
        } else if (actRes.status === 403) {
          setError("You don't have permission to view this student's activities.");
        }

        // Fetch student leaderboard entry for profile info
        const lbRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/my-activities/teacher/students`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (lbRes.ok) {
          const lbData = await lbRes.json();
          const studentEntry = lbData.find(
            (s: any) => s.id === studentId
          );
          if (studentEntry) {
            setProfile({
              id: studentEntry.id,
              name: studentEntry.name,
              email_id: studentEntry.email_id || "",
              role_id: 1,
              is_active: 1,
              register_no: studentEntry.register_no,
              department: studentEntry.department,
              year: studentEntry.year,
              section: studentEntry.section,
              total_tokens: studentEntry.total_tokens,
            });
          }
        }
      } catch (err) {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    }

    fetchStudentData();
  }, [accessToken, studentId]);

  const earnedTokens = tokenSummary?.earned ?? profile?.total_tokens ?? 0;
  const hasMetTarget = earnedTokens >= TARGET_TOKENS;
  const progressPct = Math.min((earnedTokens / TARGET_TOKENS) * 100, 100);

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-5xl mx-auto w-full">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6 grid-cols-1 md:grid-cols-5">
            <Skeleton className="md:col-span-2 h-64 rounded-xl" />
            <Skeleton className="md:col-span-3 h-64 rounded-xl" />
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center min-h-[60vh] gap-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Error Loading Student</h2>
        <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
        <Button onClick={() => router.push("/teacher/dashboard")} className="font-semibold gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Student Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          This student is not assigned to you or does not exist.
        </p>
        <Button onClick={() => router.push("/teacher/dashboard")} className="font-semibold gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-5xl mx-auto w-full">

        {/* Navigation & Header */}
        <div className="flex flex-col gap-3">
          <Button
            variant="ghost"
            onClick={() => router.push("/teacher/dashboard")}
            className="w-fit p-0 h-auto hover:bg-transparent text-sm font-semibold text-muted-foreground hover:text-foreground gap-2 flex items-center transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Student List
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{profile.name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Student profile — points and activity overview.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {hasMetTarget ? (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-bold rounded-full px-3.5 py-1 flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="h-4 w-4" /> Requirement Met
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 text-xs font-bold rounded-full px-3.5 py-1 flex items-center gap-1.5 shadow-sm">
                  <Clock3 className="h-4 w-4" /> In Progress
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-5">

          {/* Personal Info Card */}
          <div className="md:col-span-2 rounded-xl border border-border/40 bg-card/40 backdrop-blur-md p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-4 border-b border-border/20 pb-4">
              <div className="rounded-full bg-primary/10 text-primary p-3">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Personal Information</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Registered Student Profile</p>
              </div>
            </div>

            <div className="space-y-3.5 text-sm">
              {profile.register_no && (
                <div className="flex items-start gap-2.5">
                  <Hash className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">Register Number</span>
                    <span className="font-semibold text-foreground">{profile.register_no}</span>
                  </div>
                </div>
              )}

              {profile.department && (
                <div className="flex items-start gap-2.5">
                  <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">Department</span>
                    <span className="font-semibold text-foreground">{profile.department}</span>
                  </div>
                </div>
              )}

              {profile.email_id && (
                <div className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">Email Address</span>
                    <a href={`mailto:${profile.email_id}`} className="font-semibold text-primary hover:underline transition-all">
                      {profile.email_id}
                    </a>
                  </div>
                </div>
              )}

              {(profile.year || profile.section) && (
                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">Year & Section</span>
                    <span className="font-semibold text-foreground">
                      {profile.year ? `Year ${profile.year}` : ""}
                      {profile.section ? ` · Section ${profile.section}` : ""}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Points Progress Card */}
          <div className="md:col-span-3 rounded-xl border border-border/40 bg-card/40 backdrop-blur-md p-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/20 pb-4">
                <div>
                  <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Token Summary</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Semester Point Accumulation</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-foreground tabular-nums block">
                    {earnedTokens}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    earned points
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                  <span>Current Completion Status</span>
                  <span>{earnedTokens} / {TARGET_TOKENS} points</span>
                </div>
                <Progress value={progressPct} className="h-3" />
                <p className="text-xs text-muted-foreground leading-normal mt-1">
                  Students are required to accumulate a minimum of{" "}
                  <strong className="text-foreground">{TARGET_TOKENS} points</strong> to satisfy semester requirements.
                </p>
              </div>

              {tokenSummary && (
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="rounded-lg bg-muted/30 border border-border/20 p-3 text-center">
                    <p className="text-lg font-black tabular-nums text-foreground">{tokenSummary.earned}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">Earned</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 border border-border/20 p-3 text-center">
                    <p className="text-lg font-black tabular-nums text-foreground">{Math.abs(tokenSummary.spent)}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">Deducted</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 border border-border/20 p-3 text-center">
                    <p className="text-lg font-black tabular-nums text-foreground">{tokenSummary.total_tokens}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">Net Balance</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mt-4 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="text-xs leading-normal">
                <span className="font-bold text-primary block mb-0.5">Faculty Action Item</span>
                <span className="text-muted-foreground">
                  If activities are <strong className="text-foreground">Awaiting Faculty Approval</strong>, visit Student Approvals to review and credit points.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Registered Activities Table */}
        <div className="rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-border/25 bg-muted/20 flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">
              Activity Log
            </h3>
            <Badge variant="secondary" className="ml-auto text-xs font-bold">
              {activities.length} {activities.length === 1 ? "activity" : "activities"}
            </Badge>
          </div>

          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="font-semibold text-foreground px-6 py-3.5">Activity</TableHead>
                <TableHead className="font-semibold text-foreground px-6 py-3.5">Stage Progress</TableHead>
                <TableHead className="font-semibold text-foreground px-6 py-3.5">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length > 0 ? (
                activities.map((activity) => {
                  const displayStatus = deriveDisplayStatus(activity.status, activity.stage_id);
                  const progress = deriveProgress(activity.stage_id, activity.status);

                  return (
                    <TableRow key={activity.id} className="hover:bg-muted/5 transition-colors">
                      {/* Activity Title */}
                      <TableCell className="px-6 py-4 max-w-[280px]">
                        <div>
                          <p className="font-semibold text-foreground text-sm truncate">{activity.title}</p>
                          {activity.activity_name && (
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">{activity.activity_name}</p>
                          )}
                          {activity.activity_details && (
                            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{activity.activity_details}</p>
                          )}
                          {activity.activity_start_date && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {activity.activity_start_date} → {activity.activity_end_date ?? "Ongoing"}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Progress */}
                      <TableCell className="px-6 py-4 max-w-[160px]">
                        <div className="flex items-center gap-2">
                          <Progress value={progress} className="h-1.5 flex-1" />
                          <span className="text-[10px] font-bold text-muted-foreground shrink-0">{progress}%</span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-6 py-4">
                        {displayStatus === "Completed" && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] font-bold rounded-full px-2.5 py-0.5 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="h-3 w-3" /> Completed
                          </Badge>
                        )}
                        {displayStatus === "Awaiting Faculty Approval" && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold rounded-full px-2.5 py-0.5 flex items-center gap-1 w-fit">
                            <AlertCircle className="h-3 w-3" /> Awaiting Faculty
                          </Badge>
                        )}
                        {displayStatus === "Pending AI Verification" && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold rounded-full px-2.5 py-0.5 flex items-center gap-1 w-fit">
                            <Clock3 className="h-3 w-3 animate-pulse" /> Verifying (AI)
                          </Badge>
                        )}
                        {displayStatus === "Rejected" && (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-bold rounded-full px-2.5 py-0.5 flex items-center gap-1 w-fit">
                            <X className="h-3 w-3" /> Rejected
                          </Badge>
                        )}
                        {displayStatus === "In Progress" && (
                          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 text-[10px] font-bold rounded-full px-2.5 py-0.5 flex items-center gap-1 w-fit">
                            <Clock3 className="h-3 w-3" /> In Progress
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground font-medium">
                    No activities recorded for this student yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

      </div>
    </div>
  );
}
