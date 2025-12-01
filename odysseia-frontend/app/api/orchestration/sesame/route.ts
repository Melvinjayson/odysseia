import { NextResponse } from "next/server";

import { fallbackTasks } from "../../../../lib/orchestrationData";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(fallbackTasks);
}
