import { Loader2, Clock3, XCircle, CheckCircle2 } from "lucide-react";
import React from "react";
import { Activity } from "./types";

export type DiagnosticStep = {
  name: string;
  status: "completed" | "active" | "error" | "upcoming";
  statusText: string;
  detailsTemplate: string;
};

export type DiagnosticConfig = {
  label: string;
  iconName: "loader" | "clock" | "x" | "check";
  badgeClass: string;
  accentClass: string;
  actionType: "upload" | "reupload" | "awaiting" | "completed";
  currentPhase: string;
  summaryStatus: string;
  summaryBadgeClass: string;
  steps: DiagnosticStep[];
};

export const diagnosticsConfig = {
  "In Progress": {
    label: "In Progress",
    iconName: "loader",
    badgeClass: "bg-primary/10 text-primary border-primary/25",
    accentClass: "from-primary to-primary/40",
    actionType: "upload",
    currentPhase: "Proof Submission",
    summaryStatus: "Needs Upload",
    summaryBadgeClass: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/10",
    steps: [
      {
        name: "Activity Initiated",
        status: "completed",
        statusText: "Completed",
        detailsTemplate: "Commenced on {startDate}",
      },
      {
        name: "AI Proof Verification",
        status: "upcoming",
        statusText: "Pending Upload",
        detailsTemplate: "Awaiting certificate/proof upload.",
      },
      {
        name: "Faculty Endorsement",
        status: "upcoming",
        statusText: "Locked",
        detailsTemplate: "Waiting for AI verification to complete first.",
      },
      {
        name: "Token Disbursement",
        status: "upcoming",
        statusText: "Locked",
        detailsTemplate: "Will credit {tokens} tokens upon approval.",
      },
    ],
  },
  "Pending AI Verification": {
    label: "AI Verification",
    iconName: "clock",
    badgeClass: "bg-primary/10 text-primary border-primary/25",
    accentClass: "from-primary to-primary/40",
    actionType: "awaiting",
    currentPhase: "AI Verification",
    summaryStatus: "Processing",
    summaryBadgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/10",
    steps: [
      {
        name: "Activity Initiated",
        status: "completed",
        statusText: "Completed",
        detailsTemplate: "Commenced on {startDate}",
      },
      {
        name: "AI Proof Verification",
        status: "active",
        statusText: "In Progress",
        detailsTemplate: "AI is currently verifying credentials and certificate authenticity.",
      },
      {
        name: "Faculty Endorsement",
        status: "upcoming",
        statusText: "Locked",
        detailsTemplate: "Waiting for AI verification to complete first.",
      },
      {
        name: "Token Disbursement",
        status: "upcoming",
        statusText: "Locked",
        detailsTemplate: "Will credit {tokens} tokens upon approval.",
      },
    ],
  },
  "Awaiting Faculty Approval": {
    label: "Faculty Approval",
    iconName: "clock",
    badgeClass: "bg-primary/10 text-primary border-primary/25",
    accentClass: "from-primary to-primary/40",
    actionType: "awaiting",
    currentPhase: "Faculty Endorsement",
    summaryStatus: "Awaiting Approval",
    summaryBadgeClass: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/10",
    steps: [
      {
        name: "Activity Initiated",
        status: "completed",
        statusText: "Completed",
        detailsTemplate: "Commenced on {startDate}",
      },
      {
        name: "AI Proof Verification",
        status: "completed",
        statusText: "Passed",
        detailsTemplate: "AI verified the proof successfully.",
      },
      {
        name: "Faculty Endorsement",
        status: "active",
        statusText: "Pending Review",
        detailsTemplate: "Awaiting final review and signature from Faculty coordinator.",
      },
      {
        name: "Token Disbursement",
        status: "upcoming",
        statusText: "Locked",
        detailsTemplate: "Will credit {tokens} tokens upon approval.",
      },
    ],
  },
  Rejected: {
    label: "Rejected",
    iconName: "x",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/25",
    accentClass: "from-destructive to-destructive/40",
    actionType: "reupload",
    currentPhase: "Proof Re-submission",
    summaryStatus: "Action Required",
    summaryBadgeClass: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10",
    steps: [
      {
        name: "Activity Initiated",
        status: "completed",
        statusText: "Completed",
        detailsTemplate: "Commenced on {startDate}",
      },
      {
        name: "AI Proof Verification",
        status: "error",
        statusText: "Verification Failed",
        detailsTemplate: "{feedback}",
      },
      {
        name: "Faculty Endorsement",
        status: "upcoming",
        statusText: "Locked",
        detailsTemplate: "Waiting for AI verification to complete first.",
      },
      {
        name: "Token Disbursement",
        status: "upcoming",
        statusText: "Locked",
        detailsTemplate: "Will credit {tokens} tokens upon approval.",
      },
    ],
  },
  Completed: {
    label: "Completed",
    iconName: "check",
    badgeClass: "bg-green-500/10 text-green-600 border-green-500/25",
    accentClass: "from-green-500 to-green-500/40",
    actionType: "completed",
    currentPhase: "Fully Approved",
    summaryStatus: "Completed",
    summaryBadgeClass: "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/10",
    steps: [
      {
        name: "Activity Initiated",
        status: "completed",
        statusText: "Completed",
        detailsTemplate: "Commenced on {startDate}",
      },
      {
        name: "AI Proof Verification",
        status: "completed",
        statusText: "Passed",
        detailsTemplate: "AI verification completed successfully.",
      },
      {
        name: "Faculty Endorsement",
        status: "completed",
        statusText: "Approved",
        detailsTemplate: "Approved by Faculty coordinator.",
      },
      {
        name: "Token Disbursement",
        status: "completed",
        statusText: "Credited",
        detailsTemplate: "Successfully credited {tokens} tokens.",
      },
    ],
  },
} satisfies Record<string, DiagnosticConfig>;

export type ActivityStatus = keyof typeof diagnosticsConfig;

export const defaultDiagnosticConfig: DiagnosticConfig = {
  label: "Initiated",
  iconName: "clock",
  badgeClass: "bg-muted text-muted-foreground border-border",
  accentClass: "from-muted-foreground/40 to-transparent",
  actionType: "awaiting",
  currentPhase: "Initiation",
  summaryStatus: "Healthy",
  summaryBadgeClass: "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/10",
  steps: [
    {
      name: "Activity Initiated",
      status: "completed",
      statusText: "Completed",
      detailsTemplate: "Commenced on {startDate}",
    },
    {
      name: "AI Proof Verification",
      status: "upcoming",
      statusText: "Pending Upload",
      detailsTemplate: "Awaiting certificate/proof upload.",
    },
    {
      name: "Faculty Endorsement",
      status: "upcoming",
      statusText: "Locked",
      detailsTemplate: "Waiting for AI verification to complete first.",
    },
    {
      name: "Token Disbursement",
      status: "upcoming",
      statusText: "Locked",
      detailsTemplate: "Will credit {tokens} tokens upon approval.",
    },
  ],
};

export const activeStatusesOrder = [
  "In Progress",
  "Pending AI Verification",
  "Awaiting Faculty Approval",
  "Completed",
];

export const statusMapping: Record<string, string> = {
  Rejected: "In Progress",
};

export const iconMap: Record<string, (className?: string) => React.ReactNode> = {
  loader: (cls = "h-3 w-3") => React.createElement(Loader2, { className: `${cls} animate-spin` }),
  clock: (cls = "h-3 w-3") => React.createElement(Clock3, { className: cls }),
  x: (cls = "h-3 w-3") => React.createElement(XCircle, { className: cls }),
  check: (cls = "h-3 w-3") => React.createElement(CheckCircle2, { className: cls }),
};

export const getStatusIcon = (iconName: string, className?: string) => {
  const renderIcon = iconMap[iconName] || iconMap.clock;
  return renderIcon(className);
};

export const interpolate = (template: string, activity: Activity) => {
  return template
    .replace("{startDate}", activity.startDate)
    .replace("{endDate}", activity.endDate)
    .replace("{tokens}", String(activity.tokens))
    .replace("{feedback}", activity.feedback || "The uploaded proof is blurry or invalid.");
};

export const getDiagnosticReport = (activity: Activity) => {
  const config = diagnosticsConfig[activity.status as ActivityStatus] || defaultDiagnosticConfig;

  const steps = config.steps.map((step) => ({
    name: step.name,
    status: step.status,
    statusText: step.statusText,
    details: interpolate(step.detailsTemplate, activity),
  }));

  const baseStatus = statusMapping[activity.status] || activity.status;
  const currentIndex = activeStatusesOrder.indexOf(baseStatus);

  const remainingSteps = currentIndex !== -1
    ? Math.max(0, activeStatusesOrder.length - 1 - currentIndex)
    : 0;

  return {
    steps,
    currentPhase: config.currentPhase,
    remainingSteps,
    summaryStatus: config.summaryStatus,
    summaryBadgeClass: config.summaryBadgeClass,
  };
};
