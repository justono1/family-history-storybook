import { NextResponse } from "next/server";
import { getFamilyStoryWorkflow } from "../mastraClient";

export async function POST(request: Request, { params }: { params: { submitParams?: string[] } }) {
  try {
    const submitParams = params?.submitParams || [];
    const workflow = getFamilyStoryWorkflow();

    if (submitParams[0] === "resume") {
      // Resume logic
      const { runId, step, feedback, isSatisfied } = await request.json();
      if (!runId || !step) {
        return NextResponse.json(
          { error: "Missing runId, step, or resumeData for resume." },
          { status: 400 }
        );
      }
      const result = await workflow.resumeAsync({ runId, step, resumeData: { feedback, isSatisfied } });
      return NextResponse.json({ result });
    } else {
      // Start logic (default)
      const { name, dateOfBirth, hometown, occupation } = await request.json();
      const run = await workflow.createRun();
      const result = await workflow.startAsync({
        runId: run.runId,
        inputData: { name, dateOfBirth, hometown, occupation },
      });
      return NextResponse.json({ result });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

