"use client";

import { useState } from "react";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateRange } from "react-day-picker";

const formSchema = z.object({
  organization: z.string().min(1, "Organization is required"),
  description: z.string().min(1, "Description is required"),
  date: z.object({
    from: z.date(),
    to: z.date()
  }).refine((range) => !!range.from && !!range.to, {
    message: "Date range is required"
  }),
  file: z.instanceof(File, { message: "Image is required" })
});

type FormData = z.infer<typeof formSchema>;

export default function StartActivityDialog({ title }: { title: string }) {
  const [date, setDate] = useState<DateRange | undefined>();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  // handle file
  const handleFile = (f: File) => {
    setFile(f);
    setValue("file", f);
  };

  // handle date
  const handleDate = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from && range?.to) {
      setValue("date", { from: range.from, to: range.to });
    }
  };

const onSubmit = (data: FormData) => {
  console.log(data);
  toast.success("Proof Submitted!", { position: "bottom-right" })
  setOpen(false); // closes dialog
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

          {/* Organization */}
          <div className="space-y-2">
            <Label>Organization</Label>
            <Input {...register("organization")} />
            {errors.organization && (
              <p className="text-sm text-red-500">{errors.organization.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from && date?.to
                    ? `${date.from.toDateString()} - ${date.to.toDateString()}`
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
              <p className="text-sm text-red-500">Date range is required</p>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload Image</Label>

            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition"
              onClick={() => document.getElementById("fileInput")?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) {
                  handleFile(e.dataTransfer.files[0]);
                }
              }}
            >
              <Upload className="mx-auto mb-2 h-5 w-5" />
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to upload
              </p>

              {file && (
                <p className="text-xs mt-2">{file.name}</p>
              )}
            </div>

            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            {errors.file && (
              <p className="text-sm text-red-500">{errors.file.message}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Start</Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}