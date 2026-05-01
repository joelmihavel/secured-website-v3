function sanitizeWhatsappNumber(value: string | undefined): string {
  return (value || "").replace(/\D/g, "");
}

export function getWhatsAppNumber(): string {
  return sanitizeWhatsappNumber(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER
  );
}

// Dedicated landlord-team WhatsApp number used for callback CTAs on
// /secured/landlord. Separate from the main flent.in number (NEXT_PUBLIC_WHATSAPP_NUMBER).
const LANDLORD_WHATSAPP_NUMBER = "919422639236";

export function buildWhatsAppWaMeLink(message: string, phoneOverride?: string): string {
  const phone = phoneOverride
    ? sanitizeWhatsappNumber(phoneOverride)
    : getWhatsAppNumber();
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppApiLink(message: string, phoneOverride?: string): string {
  const phone = phoneOverride
    ? sanitizeWhatsappNumber(phoneOverride)
    : getWhatsAppNumber();
  return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(
    message
  )}&type=phone_number&app_absent=0`;
}

export function buildLandlordWhatsAppApiLink(message: string): string {
  return buildWhatsAppApiLink(message, LANDLORD_WHATSAPP_NUMBER);
}
