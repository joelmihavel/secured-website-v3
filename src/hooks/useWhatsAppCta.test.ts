import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { MouseEvent } from "react";

vi.mock("@/lib/wax", () => ({
  getWaxSessionCode: vi.fn(() => ""),
}));

vi.mock("@/lib/posthog-tracking", () => ({
  trackWhatsAppCtaClicked: vi.fn(),
}));

import { getWaxSessionCode } from "@/lib/wax";
import { trackWhatsAppCtaClicked } from "@/lib/posthog-tracking";
import { useWhatsAppCta } from "./useWhatsAppCta";

const mockedGetWax = vi.mocked(getWaxSessionCode);
const mockedTrack = vi.mocked(trackWhatsAppCtaClicked);

function fakeAnchorEvent(): {
  event: MouseEvent<HTMLAnchorElement>;
  anchor: HTMLAnchorElement;
} {
  const anchor = document.createElement("a");
  anchor.href = "about:blank";
  return {
    anchor,
    event: { currentTarget: anchor } as unknown as MouseEvent<HTMLAnchorElement>,
  };
}

describe("useWhatsAppCta", () => {
  beforeEach(() => {
    mockedGetWax.mockReset();
    mockedTrack.mockReset();
    mockedGetWax.mockReturnValue("");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders href without a WAX marker when localStorage is empty", () => {
    const { result } = renderHook(() =>
      useWhatsAppCta("Hello", { format: "wa.me" })
    );
    expect(result.current.href).toContain("text=Hello");
    expect(result.current.href).not.toContain("WAX");
    expect(result.current.target).toBe("_blank");
    expect(result.current.rel).toBe("noopener noreferrer");
  });

  it("renders href with the WAX marker once localStorage has a session code on mount", () => {
    mockedGetWax.mockReturnValue("WAX-ABCD");
    const { result } = renderHook(() =>
      useWhatsAppCta("Hello", { format: "wa.me" })
    );
    expect(result.current.href).toContain("WAX-ABCD");
  });

  it("re-renders the href when a wax:ready event fires after mount", () => {
    mockedGetWax.mockReturnValue("");
    const { result } = renderHook(() =>
      useWhatsAppCta("Hello", { format: "wa.me" })
    );
    expect(result.current.href).not.toContain("WAX");

    mockedGetWax.mockReturnValue("WAX-LATE");
    act(() => {
      window.dispatchEvent(new CustomEvent("wax:ready"));
    });

    expect(result.current.href).toContain("WAX-LATE");
  });

  it("rewrites e.currentTarget.href on click using the freshest WAX value", () => {
    mockedGetWax.mockReturnValue("WAX-INITIAL");
    const { result } = renderHook(() =>
      useWhatsAppCta("Hi", { format: "wa.me" })
    );
    const { event, anchor } = fakeAnchorEvent();

    mockedGetWax.mockReturnValue("WAX-FRESH");
    act(() => {
      result.current.onClick(event);
    });

    expect(anchor.href).toContain("WAX-FRESH");
    expect(anchor.href).not.toContain("WAX-INITIAL");
  });

  it("does not call preventDefault, so native navigation runs after the click handler", () => {
    mockedGetWax.mockReturnValue("WAX-A");
    const { result } = renderHook(() =>
      useWhatsAppCta("Hi", { format: "wa.me" })
    );
    const preventDefault = vi.fn();
    const { anchor } = fakeAnchorEvent();
    const event = {
      currentTarget: anchor,
      preventDefault,
    } as unknown as MouseEvent<HTMLAnchorElement>;

    act(() => {
      result.current.onClick(event);
    });

    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("emits trackWhatsAppCtaClicked with the tracking context on click", () => {
    const { result } = renderHook(() =>
      useWhatsAppCta("Hi", {
        format: "wa.me",
        tracking: {
          source: "lightbox",
          propertyName: "Sunshine Villa",
          propertySlug: "sunshine-villa",
        },
      })
    );
    const { event } = fakeAnchorEvent();

    act(() => {
      result.current.onClick(event);
    });

    expect(mockedTrack).toHaveBeenCalledTimes(1);
    expect(mockedTrack).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "lightbox",
        property_name: "Sunshine Villa",
        property_slug: "sunshine-villa",
      })
    );
  });

  it("does not emit tracking when no tracking context is provided", () => {
    const { result } = renderHook(() =>
      useWhatsAppCta("Hi", { format: "wa.me" })
    );
    const { event } = fakeAnchorEvent();

    act(() => {
      result.current.onClick(event);
    });

    expect(mockedTrack).not.toHaveBeenCalled();
  });
});
