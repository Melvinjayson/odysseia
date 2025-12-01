import { NextResponse } from "next/server";

import { fallbackMeshNodes } from "../../../../lib/orchestrationData";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(fallbackMeshNodes);
}
