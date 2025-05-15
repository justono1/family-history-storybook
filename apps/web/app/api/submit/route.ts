import { NextResponse } from "next/server";
import { getFamilyStoryWorkflow } from "../mastraClient";

export async function POST(request: Request) {
  try {
    const { name, dateOfBirth, hometown, occupation } = await request.json();
    const workflow = getFamilyStoryWorkflow();
    const run = await workflow.createRun();
    const result = await workflow.startAsync({
      runId: run.runId,
      inputData: { name, dateOfBirth, hometown, occupation },
    });
    return NextResponse.json({ success: true, runId: run.runId, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
