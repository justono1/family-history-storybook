import { NextResponse } from "next/server";
import { getFamilyStoryWorkflow } from "../mastraClient";

export async function POST(request: Request) {
  try {
    const { runId, step, feedback, isSatisfied } = await request.json();
    if (!runId || !step) {
      return NextResponse.json(
        { error: "Missing runId or step for resume." },
        { status: 400 }
      );
    }
    const workflow = getFamilyStoryWorkflow();
    const result = await workflow.resumeAsync({ runId, step, resumeData: { feedback, isSatisfied } });
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
