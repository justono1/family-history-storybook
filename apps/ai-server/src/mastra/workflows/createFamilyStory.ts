import { createWorkflow, createStep } from "@mastra/core/workflows/vNext";
import {
  familyMemberBaseSchema,
  familyMemberStorySchema,
  familyMemberHistorySchema,
  familyMemberHistoryFeedbackSchema,
} from "@/schemas";

const summarizeAndAskAdditionalQuestions = createStep({
  id: "summarize-and-ask-additional",
  description:
    "Summarizes provided data and generates compelling follow up questions",
  inputSchema: familyMemberBaseSchema,
  outputSchema: familyMemberHistorySchema,
  execute: async ({ inputData, mastra }) => {
    if (!mastra) {
      throw new Error("Mastra is not initialized");
    }

    const { name, dateOfBirth, homeTown, occupation } = inputData;

    const result = await mastra.getAgent("familyHistorianAgent").generate([
      {
        role: "user",
        content: `
                  Name: ${name},
                  Date of Birth: ${dateOfBirth},
                  Hometown: ${homeTown},
                  Occupation: ${occupation}
              `,
      },
    ]);

    return { history: JSON.parse(result.text) };
  },
});

const provideMoreInsight = createStep({
  id: "provide-more-insight",
  inputSchema: familyMemberHistorySchema,
  outputSchema: familyMemberHistorySchema,
  resumeSchema: familyMemberHistoryFeedbackSchema,
  suspendSchema: familyMemberHistorySchema,
  execute: async ({ inputData, mastra, resumeData, suspend, getInitData }) => {
    if (!resumeData?.feedback) {
      await suspend({ history: inputData?.history });
      return {
        history: inputData.history,
      };
    }

    const { feedback } = resumeData;

    const result = await mastra.getAgent("familyHistorianAgent").generate([
      {
        role: "assistant",
        content: inputData.history,
      },
      {
        role: "user",
        content: feedback,
      },
    ]);

    return { history: JSON.parse(result.text) };
  },
});


export const createFamilyStory = createWorkflow({
  id: "create-family-story",
  inputSchema: familyMemberBaseSchema,
  outputSchema: familyMemberStorySchema,
  steps: [summarizeAndAskAdditionalQuestions, provideMoreInsight],
}).then(summarizeAndAskAdditionalQuestions).then(provideMoreInsight).commit();