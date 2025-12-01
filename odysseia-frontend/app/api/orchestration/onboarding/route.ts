import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type OnboardingPayload = {
  persona: string;
  memoryMode: string;
  meshEnabled: boolean;
  dataResidency: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OnboardingPayload;
    return NextResponse.json({
      status: `Saved persona "${body.persona}" with ${body.memoryMode}, mesh ${body.meshEnabled ? "active" : "paused"} (${body.dataResidency}).`,
    });
  } catch (error) {
    return NextResponse.json({ status: "Unable to parse onboarding payload." }, { status: 400 });
  }
}
