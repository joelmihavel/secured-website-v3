"use client";

export function HorizontalDivider() {
  return (
    <div className="w-full bg-[#131313]">
      <div className="mx-auto w-full px-[120px]">
        <img
          src="/assets/figma/horizontal-divider.svg"
          alt=""
          aria-hidden="true"
          className="h-px w-full"
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}
