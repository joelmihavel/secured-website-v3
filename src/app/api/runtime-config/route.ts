import { NextResponse } from "next/server";
import { getWhatsAppNumber } from "@/lib/whatsapp";

export async function GET() {
  const whatsappNumber = getWhatsAppNumber();

  return NextResponse.json(
    { whatsappNumber },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
