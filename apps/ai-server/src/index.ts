import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { createLogger } from "@mastra/core/logger";
import { familyHistorianAgent, familyStorytellerAgent } from "@/agents";
import { createFamilyStory } from "@/workflows";

export const mastra = new Mastra({
  agents: { familyHistorianAgent, familyStorytellerAgent },
  vnext_workflows: {
    createFamilyStory,
  },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
});
