import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ComparisonRowProps = {
  label: string;
  sub?: string;
  flent: ReactNode;
  trad: ReactNode;
  divider?: boolean;
  rowClassName?: string;
};

export function ComparisonRow({
  label,
  sub,
  flent,
  trad,
  divider = false,
  rowClassName,
}: ComparisonRowProps) {
  const dividerClassName = divider ? "border-t border-border/10" : "";

  return (
    <TableRow className={cn(divider ? "bg-secondary-background" : "", rowClassName)}>
      <TableCell className={cn("px-4 py-3 text-xs text-foreground md:text-base", dividerClassName)}>
        <div className="text-sm font-medium text-text-main md:text-base">{label}</div>
        {sub ? <div className="mt-0.5 text-xs text-muted-foreground md:text-sm">{sub}</div> : null}
      </TableCell>
      <TableCell
        className={cn("px-2.5 py-3 text-center text-xs text-foreground md:text-base", dividerClassName)}
      >
        {flent}
      </TableCell>
      <TableCell
        className={cn("px-2.5 py-3 text-center text-xs text-foreground md:text-base", dividerClassName)}
      >
        {trad}
      </TableCell>
    </TableRow>
  );
}
