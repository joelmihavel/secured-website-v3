"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/base/tooltip/tooltip";
import { cn } from "@/lib/utils";

type GuidedNavigationTooltipProps = {
  ariaLabel: string;
  content: ReactNode;
  children: ReactNode;
  forceOpen?: boolean;
  autoOpenOnVisible?: boolean;
  autoOpenThreshold?: number;
  autoCloseDelayMs?: number;
  wrapperClassName?: string;
  contentClassName?: string;
};

export function GuidedNavigationTooltip({
  ariaLabel,
  content,
  children,
  forceOpen = false,
  autoOpenOnVisible = false,
  autoOpenThreshold = 0.55,
  autoCloseDelayMs = 2600,
  wrapperClassName,
  contentClassName,
}: GuidedNavigationTooltipProps) {
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const hasAutoOpenedRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const resolvedOpen = forceOpen ? true : open;

  useEffect(() => {
    if (!autoOpenOnVisible) return;

    const element = wrapperRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasAutoOpenedRef.current) return;

        hasAutoOpenedRef.current = true;
        setOpen(true);
        closeTimerRef.current = window.setTimeout(() => setOpen(false), autoCloseDelayMs);
      },
      { threshold: autoOpenThreshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, [autoCloseDelayMs, autoOpenOnVisible, autoOpenThreshold]);

  return (
    <TooltipProvider>
      <Tooltip open={resolvedOpen} onOpenChange={(nextOpen) => !forceOpen && setOpen(nextOpen)}>
        <TooltipTrigger asChild>
          <span
            ref={wrapperRef}
            aria-label={ariaLabel}
            aria-describedby={tooltipId}
            className={cn("inline-flex", wrapperClassName)}
          >
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent id={tooltipId} side="top" align="start" className={contentClassName}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
