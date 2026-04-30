import { REAL_BUILDINGS } from "@/components/secured/data/real-buildings";

export async function GET() {
  return Response.json(REAL_BUILDINGS);
}
