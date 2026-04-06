"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CustomTooltipProps = {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
};

export default function CustomTooltip({
  content,
  position = "top",
  children,
}: CustomTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side={position}>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}