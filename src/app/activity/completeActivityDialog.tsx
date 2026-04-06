"use client";

import { useState } from "react";
import { toast } from "sonner"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { CircleCheckBig } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import CustomTooltip from "@/components/custom-tool-tip"

export default function CompleteActivityDialog({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
  };

  const handleUpload = () => {
    if (!file) {
      setError("Please upload an image");
      return;
    }

    toast.success("Activity Started", { position: "bottom-right" })

    setFile(null);
    setPreview(null);
    setError("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        
        <Button size="xs" variant="outline">
          <CircleCheckBig strokeWidth={3.5}/>
        </Button>
        
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete {title}?</DialogTitle>
          <DialogDescription>
            Upload proof to complete this activity
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          
          {/* Upload Area */}
          <div
            className="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition"
            onClick={() => document.getElementById(`file-${title}`)?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
          >
            {!preview ? (
              <>
                <Upload className="mx-auto mb-2 h-5 w-5" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop or click to upload
                </p>
              </>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="preview"
                  className="mx-auto max-h-40 rounded-md object-cover"
                />

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="absolute top-2 right-2 rounded-full bg-background p-1 shadow"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Hidden Input */}
          <input
            id={`file-${title}`}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleUpload}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}