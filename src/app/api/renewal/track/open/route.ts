import { NextRequest } from "next/server";
import { getTenantByToken, logEvent } from "@/lib/renewal/db";
import { fireRenewalEvent } from "@/lib/renewal/hubspot";

// 1x1 transparent GIF — embedded in renewal emails as a tracking pixel.
const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);

export async function GET(req: NextRequest) {
  const t = req.nextUrl.searchParams.get("t");
  const k = req.nextUrl.searchParams.get("k") ?? "renewal";
  if (t) {
    const tenant = await getTenantByToken(t);
    if (tenant) {
      const ua = req.headers.get("user-agent");
      const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip");
      await logEvent(tenant.id, "email_opened", { kind: k }, ua, ip);
      fireRenewalEvent("renewal_email_opened", tenant.email, {
        pid: tenant.pid ?? undefined,
        rid: tenant.rid ?? undefined,
        kind: k,
      });
    }
  }
  return new Response(PIXEL as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      Pragma: "no-cache",
    },
  });
}
