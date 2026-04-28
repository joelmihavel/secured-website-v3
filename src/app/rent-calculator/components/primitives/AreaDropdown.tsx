"use client";

import { useMemo, useState } from "react";
import { IconChevronDown as ChevronDown } from "@tabler/icons-react";
import { AREA_DEFAULTS } from "../../constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type AreaDropdownProps = {
  area: string;
  setArea: (area: string) => void;
};

export function AreaDropdown({ area, setArea }: AreaDropdownProps) {
  const [open, setOpen] = useState(false);
  const areaOptions = useMemo(() => Object.keys(AREA_DEFAULTS), []);

  return (
    <div className="mx-auto mt-4 w-full max-w-sm text-left md:max-w-md">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="relative w-full rounded-full border border-border bg-bg-white px-4 py-3 text-left text-base font-medium text-text-main shadow-sm"
          >
            <span className="block truncate">{area}</span>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-main/60"
              size={18}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          avoidCollisions={false}
          className="w-[var(--radix-popover-trigger-width)] rounded-xl border border-border bg-bg-white p-1"
        >
          <div className="max-h-72 overflow-y-auto">
            {areaOptions.map((option) => {
              const isSelected = option === area;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setArea(option);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left transition-colors",
                    isSelected ? "bg-secondary-background" : "hover:bg-secondary-background/60"
                  )}
                >
                  <span
                    className={cn(
                      "h-4 w-4 shrink-0 rounded-full border border-text-main/30",
                      isSelected && "border-night-violet"
                    )}
                  >
                    {isSelected ? (
                      <span className="ml-0.5 mt-0.5 block h-2 w-2 rounded-full bg-night-violet" />
                    ) : null}
                  </span>
                  <span className="text-sm text-text-main">{option}</span>
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      <p className="mt-2 text-center text-subtitle-sm text-text-main/60">
        Traditional rental defaults use average market rates from multiple sources.
      </p>
    </div>
  );
}
