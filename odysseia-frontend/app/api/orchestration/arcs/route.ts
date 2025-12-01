import { NextResponse } from "next/server";

import { fallbackArcs } from "../../../../lib/orchestrationData";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(fallbackArcs);
}
