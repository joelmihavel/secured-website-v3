import { describe, it, expect } from "vitest";
import { composeWhatsAppLink } from "./whatsapp";

const NUMBER = "919999999999";

describe("composeWhatsAppLink", () => {
  describe("format", () => {
    it("builds a wa.me URL with the message in the text query parameter", () => {
      const url = composeWhatsAppLink({
        message: "Hello there",
        format: "wa.me",
        number: NUMBER,
      });
      expect(url).toBe(`https://wa.me/${NUMBER}?text=Hello%20there`);
    });

    it("builds an api.whatsapp.com URL with phone, text, and the type/app_absent params", () => {
      const url = composeWhatsAppLink({
        message: "Hello there",
        format: "api.whatsapp.com",
        number: NUMBER,
      });
      expect(url).toBe(
        `https://api.whatsapp.com/send/?phone=${NUMBER}&text=Hello%20there&type=phone_number&app_absent=0`
      );
    });
  });

  describe("WAX injection", () => {
    it("appends the WAX marker to the message text when waxCode is present (wa.me)", () => {
      const url = composeWhatsAppLink({
        message: "Hi",
        format: "wa.me",
        number: NUMBER,
        waxCode: "WAX-AB12",
      });
      const text = new URL(url).searchParams.get("text");
      expect(text).toBe("Hi [WAX-AB12]");
    });

    it("appends the WAX marker to the message text when waxCode is present (api.whatsapp.com)", () => {
      const url = composeWhatsAppLink({
        message: "Hi",
        format: "api.whatsapp.com",
        number: NUMBER,
        waxCode: "WAX-AB12",
      });
      const parsed = new URL(url);
      expect(parsed.searchParams.get("text")).toBe("Hi [WAX-AB12]");
      expect(parsed.searchParams.get("phone")).toBe(NUMBER);
      expect(parsed.searchParams.get("type")).toBe("phone_number");
      expect(parsed.searchParams.get("app_absent")).toBe("0");
    });

    it("appends just the marker when the message is empty (no leading space)", () => {
      const url = composeWhatsAppLink({
        message: "",
        format: "wa.me",
        number: NUMBER,
        waxCode: "WAX-AB12",
      });
      expect(new URL(url).searchParams.get("text")).toBe("[WAX-AB12]");
    });

    it("does not append when waxCode is empty", () => {
      const url = composeWhatsAppLink({
        message: "Hi",
        format: "wa.me",
        number: NUMBER,
        waxCode: "",
      });
      expect(url).toBe(`https://wa.me/${NUMBER}?text=Hi`);
    });

    it("does not append when waxCode is undefined", () => {
      const url = composeWhatsAppLink({
        message: "Hi",
        format: "wa.me",
        number: NUMBER,
      });
      expect(url).toBe(`https://wa.me/${NUMBER}?text=Hi`);
    });

    it("does not double-inject when the message already contains a [WAX-...] marker", () => {
      const url = composeWhatsAppLink({
        message: "Hi [WAX-EXISTING]",
        format: "wa.me",
        number: NUMBER,
        waxCode: "WAX-NEW",
      });
      expect(new URL(url).searchParams.get("text")).toBe("Hi [WAX-EXISTING]");
    });
  });

  describe("edge cases", () => {
    it("returns the base URL unchanged if the number is empty", () => {
      const url = composeWhatsAppLink({
        message: "Hi",
        format: "wa.me",
        number: "",
        waxCode: "WAX-AB12",
      });
      expect(url).toContain("https://wa.me/?");
      expect(new URL(url).searchParams.get("text")).toBe("Hi [WAX-AB12]");
    });
  });
});
