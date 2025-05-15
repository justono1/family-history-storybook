import { NextResponse } from "next/server";
import { getFamilyStoryWorkflow } from "../mastraClient";

export async function POST(request: Request) {
  try {
    const { runId, stepId, feedback, isSatisfied } = await request.json();
    if (!runId || !stepId) {
      return NextResponse.json(
        { error: "Missing runId or step for resume." },
        { status: 400 }
      );
    }
    const workflow = getFamilyStoryWorkflow();
    const result = await workflow.resumeAsync({
      runId,
      step: stepId,
      resumeData: { feedback, isSatisfied },
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
