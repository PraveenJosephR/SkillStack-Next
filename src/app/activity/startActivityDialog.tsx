"use client";

import { useState } from "react";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { useAtom } from "jotai";
import { accessTokenAtom } from "@/store/atoms";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  activity_details: z.string().optional(),
  event_type: z.string().optional(), // "1" = Internal, "2" = External
  date: z.object({
    from: z.date(),
    to: z.date(),
  }).refine((r) => !!r.from && !!r.to, { message: "Date range is required" }),
});

type FormData = z.infer<typeof formSchema>;

interface StartActivityDialogProps {
  activityId: number;
  title: string;
}

export default function StartActivityDialog({ activityId, title }: StartActivityDialogProps) {
  const [date, setDate] = useState<DateRange | undefined>();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [accessToken] = useAtom(accessTokenAtom);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleDate = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from && range?.to) {
      setValue("date", { from: range.from, to: range.to });
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!accessToken) {
      toast.error("You must be logged in to start an activity.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: data.title,
        activity_details: data.activity_details || null,
        event_type: data.event_type ? parseInt(data.event_type) : null,
        activity_start_date: format(data.date.from, "yyyy-MM-dd"),
        activity_end_date: format(data.date.to, "yyyy-MM-dd"),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/my-activities/${activityId}/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        toast.success("Activity started successfully!", { position: "bottom-right" });
        reset();
        setDate(undefined);
        setOpen(false);
      } else {
        const err = await res.json();
        toast.error(err.detail || "Failed to start activity. Please try again.", { position: "bottom-right" });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { position: "bottom-right" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Start</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start Activity</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Title */}
          <div className="space-y-2">
            <Label>Title <span className="text-destructive">*</span></Label>
            <Input
              {...register("title")}
              placeholder="e.g. NPTEL Cloud Computing Course"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Activity Details */}
          <div className="space-y-2">
            <Label>Details / Description</Label>
            <Textarea
              {...register("activity_details")}
              placeholder="Brief description of the activity..."
              rows={3}
            />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Controller
              name="event_type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select event type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Internal</SelectItem>
                    <SelectItem value="2">External</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range <span className="text-destructive">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from && date?.to
                    ? `${format(date.from, "MMM d, yyyy")} – ${format(date.to, "MMM d, yyyy")}`
                    : "Pick a date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={handleDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive">Date range is required</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Starting..." : "Start Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}