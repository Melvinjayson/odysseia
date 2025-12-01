import { NextResponse } from "next/server";

import { fallbackApplications } from "../../../../lib/orchestrationData";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(fallbackApplications);
}
