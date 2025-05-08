import { openai } from "@ai-sdk/openai";
import { Step, Workflow } from "@mastra/core/workflows";
import { z } from "zod";

const discoveryWorkflow = new Workflow({
  name: "discovery-workflow",
  triggerSchema: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
});

discoveryWorkflow.commit();

export { discoveryWorkflow };
