import { ActivityStatus } from "./diagnosticsConfig";

export type Activity = {
  name: string;
  activityType: string;
  description: string;
  organization: string;
  tokens: number;
  startDate: string;
  endDate: string;
  progress: number;
  status: ActivityStatus;
  feedback?: string;
};
