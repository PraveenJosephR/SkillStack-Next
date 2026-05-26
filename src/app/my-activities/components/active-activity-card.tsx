import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  XCircle,
  Trophy,
} from "lucide-react";
import CompleteActivityDialog from "@/app/activity/completeActivityDialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Activity } from "../types";
import {
  diagnosticsConfig,
  defaultDiagnosticConfig,
  getStatusIcon,
  getDiagnosticReport,
} from "../diagnosticsConfig";

export default function ActiveActivityCard({
  activity,
  onUploadComplete,
}: {
  activity: Activity;
  onUploadComplete: () => void;
}) {
  const cfg = diagnosticsConfig[activity.status] || defaultDiagnosticConfig;
  const statusIcon = getStatusIcon(cfg.iconName);

  return (
    <Dialog key={activity.name}>
      {/* Card is the trigger area (header + content), footer stays outside */}
      <Card className="@container/card relative flex flex-col gap-0 p-0 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
        <div className={`h-1 w-full bg-gradient-to-r ${cfg.accentClass}`} />

        {/* Clickable card body triggers the dialog */}
        <DialogTrigger asChild>
          <div className="flex flex-col text-left w-full focus:outline-none">
            <CardHeader className="px-6 pt-5 pb-3">
              <CardTitle className="text-base font-semibold leading-snug">
                {activity.name}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5 font-medium">
                {activity.activityType}
                <span className="text-muted-foreground/40 mx-1.5">·</span>
                {activity.organization}
              </CardDescription>
              <CardAction>
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1.5 text-[11px] font-semibold shrink-0 px-2.5 py-1 ${cfg.badgeClass}`}
                >
                  {statusIcon}
                  {cfg.label}
                </Badge>
              </CardAction>
            </CardHeader>

            <CardContent className="px-6 pb-5 space-y-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                <span className="font-medium">{activity.startDate}</span>
                <span className="text-muted-foreground/40">→</span>
                <span className="font-medium">{activity.endDate}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Progress</span>
                  <span className="tabular-nums font-bold">{activity.progress}%</span>
                </div>
                <Progress value={activity.progress} className="h-2" />
              </div>

              {activity.feedback && (
                <div className="flex gap-2.5 rounded-lg bg-destructive/8 border border-destructive/20 p-3.5">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold text-destructive mb-0.5">
                      Action Required
                    </p>
                    <p className="text-xs text-destructive/80 leading-relaxed">
                      {activity.feedback}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        </DialogTrigger>

        {/* Footer stays outside trigger to avoid accidentally opening dialog on button click */}
        <CardFooter
          className="px-6 py-4 border-t bg-muted/20 flex items-center justify-between gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black tabular-nums leading-none">
              {activity.tokens}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              tokens
            </span>
          </div>
          <div className="flex items-center gap-2">
            {cfg.actionType === "upload" && (
              <CompleteActivityDialog
                title={activity.name}
                buttonText="Upload Proof"
                onComplete={onUploadComplete}
              />
            )}
            {cfg.actionType === "reupload" && (
              <CompleteActivityDialog
                title={activity.name}
                buttonText="Re-upload Proof"
                onComplete={onUploadComplete}
              />
            )}
            {cfg.actionType === "awaiting" && (
              <Button size="sm" variant="ghost" disabled className="text-xs text-muted-foreground">
                Awaiting Review
              </Button>
            )}
            {cfg.actionType === "completed" && (
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border border-green-500/20 hover:bg-green-500/10 text-xs px-3 py-1.5 font-semibold flex items-center gap-1.5 rounded-full">
                <Trophy className="h-3 w-3" /> Approved & Credited
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* ── Dialog Popup ── */}
      {(() => {
        const diag = getDiagnosticReport(activity);
        return (
          <DialogContent className="sm:max-w-2xl border-border/50 bg-card/95 backdrop-blur-md rounded-xl shadow-xl p-6">
            <DialogHeader className="pb-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <DialogTitle className="text-lg font-bold text-foreground">
                    {activity.organization}
                  </DialogTitle>
                  <DialogDescription className="text-sm font-semibold text-muted-foreground mt-0.5">
                    {activity.activityType}
                  </DialogDescription>
                </div>
                <Badge
                  variant="outline"
                  className={`w-fit text-xs font-semibold px-3 py-1 flex items-center gap-1.5 ${cfg.badgeClass}`}
                >
                  {statusIcon}
                  {cfg.label}
                </Badge>
              </div>
            </DialogHeader>

            {/* Main Diagnosis Content */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 my-4 max-h-[60vh] overflow-y-auto pr-1.5">
              {/* Left Side: Summary & Details */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Activity Metadata
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Category</span>
                      <span className="font-semibold text-foreground">
                        {activity.activityType}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Organization</span>
                      <span className="font-semibold text-foreground">
                        {activity.organization}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Target Tokens</span>
                      <span className="font-bold text-primary">
                        {activity.tokens} tokens
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Current Progress</span>
                      <span className="font-bold text-foreground">
                        {activity.progress}% completed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Status Diagnostics
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {diag.remainingSteps > 0 ? (
                      <>
                        Currently in{" "}
                        <strong className="text-foreground">
                          {diag.currentPhase}
                        </strong>{" "}
                        phase. There are{" "}
                        <strong className="text-foreground">
                          {diag.remainingSteps} remaining step(s)
                        </strong>{" "}
                        to completely verify and credit tokens.
                      </>
                    ) : (
                      <>
                        Activity is{" "}
                        <strong className="text-foreground">Fully Completed</strong>.
                        All approval checks passed and {activity.tokens} tokens are
                        credited.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Right Side: Visual Diagnosis Stepper/Timeline */}
              <div className="md:col-span-3 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Verification Workflow Checklist
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                  {diag.steps.map((step, idx) => {
                    let nodeBg =
                      "bg-muted text-muted-foreground border-muted-foreground/35";
                    let icon = <Clock3 className="h-3.5 w-3.5" />;

                    if (step.status === "completed") {
                      nodeBg = "bg-green-500/10 text-green-500 border-green-500/35";
                      icon = <CheckCircle2 className="h-3.5 w-3.5" />;
                    } else if (step.status === "active") {
                      nodeBg =
                        "bg-primary/10 text-primary border-primary/35 animate-pulse";
                      icon = <Loader2 className="h-3.5 w-3.5 animate-spin" />;
                    } else if (step.status === "error") {
                      nodeBg =
                        "bg-destructive/10 text-destructive border-destructive/35";
                      icon = <XCircle className="h-3.5 w-3.5" />;
                    }

                    return (
                      <div key={idx} className="relative flex items-start gap-4">
                        {/* Stepper Node */}
                        <div
                          className={`absolute -left-[27px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border bg-card font-medium ${nodeBg}`}
                        >
                          {icon}
                        </div>

                        {/* Step Text Info */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-semibold text-foreground leading-none">
                              {step.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0.5 shrink-0 ${
                                step.status === "completed"
                                  ? "bg-green-500/5 text-green-500 border-green-500/20"
                                  : step.status === "active"
                                  ? "bg-primary/5 text-primary border-primary/20"
                                  : step.status === "error"
                                  ? "bg-destructive/5 text-destructive border-destructive/20"
                                  : "bg-muted/50 text-muted-foreground border-border"
                              }`}
                            >
                              {step.statusText}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed pr-2">
                            {step.details}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter className="border-t pt-4 sm:justify-end">
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 rounded-md shadow-sm"
                >
                  Got it
                </Button>
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        );
      })()}
    </Dialog>
  );
}
