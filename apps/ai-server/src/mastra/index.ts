import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { createLogger } from "@mastra/core/logger";
import { familyHistorianAgent, familyStorytellerAgent } from "@/mastra/agents";
import { createFamilyStory } from "@/mastra/workflows";

export const mastra = new Mastra({
  agents: { familyHistorianAgent, familyStorytellerAgent },
  vnext_workflows: {
    createFamilyStory,
  },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
});
