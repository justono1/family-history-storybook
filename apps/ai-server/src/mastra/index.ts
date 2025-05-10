import { Mastra } from "@mastra/core/mastra";
import { createLogger } from "@mastra/core/logger";
import { familyHistorian, familyStoryteller } from "./agents";

export const mastra = new Mastra({
  agents: { familyHistorian, familyStoryteller },
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
});
