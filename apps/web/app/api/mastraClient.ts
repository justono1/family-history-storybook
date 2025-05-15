// Stub Mastra client for BFF <-> ai-server connection
import { MastraClient } from "@mastra/client-js";

// Mastra AI server endpoint (do not include trailing API path)
// Override by setting the AI_SERVER_URL environment variable in .env.local
const SERVER_ENDPOINT =
  process.env.AI_SERVER_URL || "http://localhost:4111";

export const mastraClient = new MastraClient({
  baseUrl: SERVER_ENDPOINT,
  // Optionally, add authentication or headers here if needed
  // headers: { Authorization: `Bearer ${process.env.AI_SERVER_API_KEY}` }
});

// Helper to get a vNext workflow instance
export const getFamilyStoryWorkflow: () => ReturnType<typeof mastraClient.getVNextWorkflow> = () =>
  mastraClient.getVNextWorkflow("createFamilyStory");
