// Stub Mastra client for BFF <-> ai-server connection
import { MastraClient } from "@mastra/client-js";

// TODO: Set the MCP endpoint of your ai-server here
// This could be an env variable or config
const SERVER_ENDPOINT =
  process.env.AI_SERVER_URL || "http://localhost:4111/api";

export const mastraClient = new MastraClient({
  baseUrl: SERVER_ENDPOINT,
  // Optionally, add authentication or headers here if needed
  // headers: { Authorization: `Bearer ${process.env.AI_SERVER_API_KEY}` }
});

// Helper to get a vNext workflow instance
export const getFamilyStoryWorkflow: () => ReturnType<typeof mastraClient.getVNextWorkflow> = () =>
  mastraClient.getVNextWorkflow("create-family-story");
