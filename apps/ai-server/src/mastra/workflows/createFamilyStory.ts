import { createWorkflow, createStep } from "@mastra/core/workflows/vNext";
import {
  familyMemberBaseSchema,
  familyMemberStorySchema,
  familyMemberHistorySchema,
} from "@/schemas";
import { z } from "zod";

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

    return { history: result.text };
  },
});

const provideMoreContext = createStep({
  id: "provide-more-context",
  description:
    "Allows the user to continuously add more context to the family member",
  inputSchema: familyMemberHistorySchema,
  outputSchema: familyMemberHistorySchema,
  resumeSchema: z.object({
    feedback: z.string(),
    isSatisfied: z.boolean().optional().default(false),
  }),
  suspendSchema: familyMemberHistorySchema,
  execute: async ({ inputData, mastra, resumeData, suspend }) => {
    if (!resumeData?.feedback && !resumeData?.isSatisfied) {
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

    return { history: result.text };
  },
});

const generateStoryAndAskForFeedback = createStep({
  id: "generate-story-and-ask-for-feedback",
  description: "Generate the initial story based off the history",
  inputSchema: familyMemberStorySchema,
  outputSchema: familyMemberStorySchema,
  execute: async ({ inputData, mastra }) => {
    if (!mastra) {
      throw new Error("Mastra is not initialized");
    }

    const { story } = inputData;

    const result = await mastra.getAgent("familyStorytellerAgent").generate([
      {
        role: "user",
        content: `
          The story far
          ${story}
        `,
      },
    ]);

    return { story: result.text };
  },
});

const provideStoryFeedback = createStep({
  id: "provide-story-feedback",
  description:
    "Allows the user to interact and provide feedback. If satisfied with the story and no more feedback is requested then resume",
  inputSchema: familyMemberStorySchema,
  outputSchema: familyMemberStorySchema,
  resumeSchema: z.object({
    feedback: z.string(),
    isSatisfied: z.boolean().optional().default(false),
  }),
  suspendSchema: familyMemberStorySchema,
  execute: async ({ inputData, mastra, resumeData, suspend }) => {
    if (!resumeData?.feedback && !resumeData?.isSatisfied) {
      await suspend({ story: inputData?.story });
      return {
        story: inputData.story,
      };
    }

    const { feedback } = resumeData;

    const result = await mastra.getAgent("familyStorytellerAgent").generate([
      {
        role: "assistant",
        content: inputData.story,
      },
      {
        role: "user",
        content: feedback,
      },
    ]);

    return { story: result.text };
  },
});

export const createFamilyStory = createWorkflow({
  id: "create-family-story",
  inputSchema: familyMemberBaseSchema,
  outputSchema: familyMemberStorySchema,
  steps: [summarizeAndAskAdditionalQuestions, provideMoreContext],
})
  .then(summarizeAndAskAdditionalQuestions)
  .then(provideMoreContext)
  .map({
    story: {
      //@ts-ignore
      step: provideMoreContext,
      path: "history",
    },
  })
  .then(generateStoryAndAskForFeedback)
  .then(provideStoryFeedback)
  .commit();
