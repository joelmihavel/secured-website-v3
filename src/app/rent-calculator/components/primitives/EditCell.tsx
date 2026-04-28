import { useRef } from "react";
import { Pencil } from "lucide-react";

type EditCellProps = {
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  onCommit?: (newValue: number, previousValue: number) => void;
  onFocusChange?: (isFocused: boolean) => void;
  inputClassName?: string;
  variant?: "default" | "mobileFlat";
};

export function EditCell({
  value,
  onChange,
  suffix,
  onCommit,
  onFocusChange,
  inputClassName,
  variant = "default",
}: EditCellProps) {
  const focusedValueRef = useRef<number | null>(null);
  const isMobileFlat = variant === "mobileFlat";

  return (
    <span className="inline-flex items-center">
      <span className="group relative inline-flex items-center">
        <span
          className={`pointer-events-none absolute ${
            isMobileFlat
              ? "left-0 text-base font-bold text-text-main/80"
              : "left-2 text-base font-bold text-text-main/70"
          }`}
        >
          ₹
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          onFocus={() => {
            focusedValueRef.current = value;
            onFocusChange?.(true);
          }}
          onBlur={(e) => {
            const previousValue = focusedValueRef.current ?? value;
            const nextValue = Math.max(0, Number(e.target.value));
            if (onCommit && nextValue !== previousValue) {
              onCommit(nextValue, previousValue);
            }
            focusedValueRef.current = null;
            onFocusChange?.(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          className={`${
            isMobileFlat
              ? "h-8 w-auto min-w-[7ch] max-w-[12ch] rounded-none border-0 border-b border-border/40 bg-transparent pl-6 pr-7 text-center text-base font-bold text-text-main [field-sizing:content] focus:border-border"
              : "h-9 w-auto min-w-[7ch] max-w-[12ch] rounded-l-none rounded-r-xl border border-border/40 bg-bg-white px-7 text-center text-base font-bold text-text-main [field-sizing:content] focus:border-border"
          } outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${inputClassName ?? ""}`}
          step="500"
        />
        <Pencil
          aria-hidden="true"
          className={`pointer-events-none absolute right-1.5 size-3 transition-colors ${
            isMobileFlat
              ? "text-border/40 group-focus-within:text-border"
              : "text-text-main/20 group-focus-within:text-text-main/70"
          }`}
        />
      </span>
      {suffix ? (
        <span
          className={`ml-1.5 text-xs font-semibold ${
            isMobileFlat ? "text-text-main/70" : "text-text-main/60"
          }`}
        >
          {suffix}
        </span>
      ) : null}
    </span>
  );
}
