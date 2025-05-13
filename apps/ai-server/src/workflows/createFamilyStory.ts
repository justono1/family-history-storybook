import { createWorkflow, createStep } from "@mastra/core/workflows/vNext";
import {
  familyMemberBaseSchema,
  familyMemberStorySchema,
  familyMemberHistorySchema,
  generalFeedbackSchema,
} from "@/schemas";
import { z } from "zod";

/**
 * Step: Summarize and Ask Additional Questions
 * Summarizes provided data and generates compelling follow up questions.
 */
const FAMILY_HISTORIAN_AGENT = "familyHistorianAgent" as const;
const FAMILY_STORYTELLER_AGENT = "familyStorytellerAgent" as const;

const summarizeAndAskAdditionalQuestions = createStep({
  id: "summarize-and-ask-additional",
  description:
    "Summarizes provided data and generates compelling follow up questions",
  inputSchema: familyMemberBaseSchema,
  outputSchema: familyMemberHistorySchema,
  execute: async ({ inputData, mastra }) => {
    try {
      if (!mastra) {
        throw new Error("Mastra is not initialized");
      }

      const { name, dateOfBirth, homeTown, occupation } = inputData;

      const result = await mastra.getAgent(FAMILY_HISTORIAN_AGENT).generate([
        {
          role: "user",
          content: `Name: ${name}, Date of Birth: ${dateOfBirth}, Hometown: ${homeTown}, Occupation: ${occupation}`,
        },
      ]);

      if (!result || typeof result.text !== "string") {
        throw new Error("Agent did not return valid history text");
      }

      return { history: result.text };
    } catch (err) {
      console.error("Error in summarizeAndAskAdditionalQuestions:", err);
      throw new Error(
        `summarizeAndAskAdditionalQuestions failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  },
});

/**
 * Step: Provide More Context
 * Allows the user to continuously add more context to the family member.
 */
const provideMoreContext = createStep({
  id: "provide-more-context",
  description:
    "Allows the user to continuously add more context to the family member",
  inputSchema: familyMemberHistorySchema,
  outputSchema: familyMemberHistorySchema,
  resumeSchema: generalFeedbackSchema,
  suspendSchema: familyMemberHistorySchema,
  execute: async ({ inputData, mastra, resumeData, suspend }) => {
    try {
      if (!resumeData?.feedback && !resumeData?.isSatisfied) {
        await suspend({ history: inputData?.history });
        return {
          history: inputData.history,
        };
      }

      const { feedback } = resumeData;

      const result = await mastra.getAgent(FAMILY_HISTORIAN_AGENT).generate([
        {
          role: "assistant",
          content: inputData.history,
        },
        {
          role: "user",
          content: feedback ? feedback : "No further feedback",
        },
      ]);

      if (!result || typeof result.text !== "string") {
        throw new Error("Agent did not return valid history text");
      }

      return { history: result.text };
    } catch (err) {
      console.error("Error in provideMoreContext:", err);
      throw new Error(
        `provideMoreContext failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  },
});

/**
 * Step: Generate Story and Ask for Feedback
 * Generate the initial story based off the history.
 */
const generateStoryAndAskForFeedback = createStep({
  id: "generate-story-and-ask-for-feedback",
  description: "Generate the initial story based off the history",
  inputSchema: familyMemberStorySchema,
  outputSchema: familyMemberStorySchema,
  execute: async ({ inputData, mastra }) => {
    try {
      if (!mastra) {
        throw new Error("Mastra is not initialized");
      }

      const { story } = inputData;

      const result = await mastra.getAgent(FAMILY_STORYTELLER_AGENT).generate([
        {
          role: "user",
          content: `The story so far: ${story}`,
        },
      ]);

      if (!result || typeof result.text !== "string") {
        throw new Error("Agent did not return valid story text");
      }

      return { story: result.text };
    } catch (err) {
      console.error("Error in generateStoryAndAskForFeedback:", err);
      throw new Error(
        `generateStoryAndAskForFeedback failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  },
});

/**
 * Step: Provide Story Feedback
 * Allows the user to interact and provide feedback. If satisfied with the story and no more feedback is requested then resume.
 */
const provideStoryFeedback = createStep({
  id: "provide-story-feedback",
  description:
    "Allows the user to interact and provide feedback. If satisfied with the story and no more feedback is requested then resume",
  inputSchema: familyMemberStorySchema,
  outputSchema: familyMemberStorySchema,
  resumeSchema: generalFeedbackSchema,
  suspendSchema: familyMemberStorySchema,
  execute: async ({ inputData, mastra, resumeData, suspend }) => {
    try {
      if (!resumeData?.feedback && !resumeData?.isSatisfied) {
        await suspend({ story: inputData?.story });
        return {
          story: inputData.story,
        };
      }

      const { feedback } = resumeData;

      const result = await mastra.getAgent(FAMILY_STORYTELLER_AGENT).generate([
        {
          role: "assistant",
          content: inputData.story,
        },
        {
          role: "user",
          content: feedback ? feedback : "No further feedback",
        },
      ]);

      if (!result || typeof result.text !== "string") {
        throw new Error("Agent did not return valid story text");
      }

      return { story: result.text };
    } catch (err) {
      console.error("Error in provideStoryFeedback:", err);
      throw new Error(
        `provideStoryFeedback failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  },
});

/**
 * Workflow: Create Family Story
 * Orchestrates the steps for gathering, summarizing, and refining a family member's story.
 */
export const createFamilyStory = createWorkflow({
  id: "create-family-story",
  inputSchema: familyMemberBaseSchema,
  outputSchema: familyMemberStorySchema,
  steps: [
    summarizeAndAskAdditionalQuestions,
    provideMoreContext,
    generateStoryAndAskForFeedback,
    provideStoryFeedback,
  ],
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
