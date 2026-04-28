"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PanelState = "flent" | "trad" | null;

type MobileComparisonCardProps = {
  label: string;
  labelAccessory?: ReactNode;
  sub?: string;
  flent: ReactNode;
  trad: ReactNode;
  activePanel?: PanelState;
  flentInteractive?: boolean;
  tradInteractive?: boolean;
  className?: string;
};

function panelClassName(isInteractive: boolean, isActive: boolean) {
  if (!isInteractive) {
    return "text-text-main";
  }

  return isActive ? "text-text-main" : "text-text-main/70";
}

export function MobileComparisonCard({
  label,
  labelAccessory,
  sub,
  flent,
  trad,
  activePanel = null,
  flentInteractive = false,
  tradInteractive = false,
  className,
}: MobileComparisonCardProps) {
  const flentIsActive = activePanel === "flent";
  const tradIsActive = activePanel === "trad";

  return (
    <div className={cn("rounded-lg border-2 border-border bg-bg-white px-4 py-4", className)}>
      <div className="mb-3.5 text-center">
        <div
          className={cn(
            "flex items-center gap-1.5",
            labelAccessory ? "flex-col justify-center" : "justify-center"
          )}
        >
          <div className="text-sm font-semibold text-text-main">{label}</div>
          {labelAccessory ? <div className="flex justify-center">{labelAccessory}</div> : null}
        </div>
        {sub ? <div className="mt-1 text-xs text-muted-foreground">{sub}</div> : null}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div
          className={cn(
            "flex min-w-0 justify-center px-3 py-2.5 text-center",
            panelClassName(flentInteractive, flentIsActive)
          )}
        >
          <div className="flex w-full justify-center">{flent}</div>
        </div>

        <div
          className={cn(
            "flex min-w-0 justify-center px-3 py-2.5 text-center",
            panelClassName(tradInteractive, tradIsActive)
          )}
        >
          <div className="flex w-full justify-center">{trad}</div>
        </div>
      </div>
    </div>
  );
}
