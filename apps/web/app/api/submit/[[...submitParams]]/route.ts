import { NextResponse } from "next/server";
import { getFamilyStoryWorkflow } from "../mastraClient";

export async function POST(request: Request) {
  try {
    const { name, dateOfBirth, hometown, occupation } = await request.json();
    // Get workflow instance
    const workflow = getFamilyStoryWorkflow();
    // Create a new run
    const run = await workflow.createRun();
    // Start the workflow asynchronously with the input data
    const result = await workflow.startAsync({
      runId: run.runId,
      inputData: { name, dateOfBirth, hometown, occupation },
    });
    // Return the workflow result
    return NextResponse.json({ result });
  } catch (error: any) {
    // Handle errors from workflow or input
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
