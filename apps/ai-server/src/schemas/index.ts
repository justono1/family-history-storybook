import { z } from "zod";

export const familyMemberHistorySchema = z.object({
  history: z.string(),
});

export const familyMemberStorySchema = z.object({
  story: z.string(),
});

export const familyMemberBaseSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  homeTown: z.string(),
  occupation: z.string(),
});

// export const storytellerSettingsSchema = z.object({
//   tone: z
//     .enum(["warm", "formal", "conversational", "dramatic", "nostalgic"])
//     .default("warm"),
//   focus: z
//     .array(
//       z.enum([
//         "genealogical accuracy",
//         "emotional storytelling",
//         "cultural context",
//         "historical events",
//         "daily life details",
//         "military service",
//         "immigration journey",
//         "religious traditions",
//         "economic circumstances",
//       ])
//     )
//     .default(["emotional storytelling", "cultural context"]),
//   maxLengthWords: z.number().min(1000).max(10000).default(7500),
//   includeFictionalization: z.boolean().default(true),
//   fictionalizationLevel: z.enum(["none", "light", "moderate"]).default("light"),
//   includeSourceNotes: z.boolean().default(false),
//   preferredStructure: z
//     .enum(["chronological", "character-based", "thematic"])
//     .default("chronological"),
//   language: z.string().default("en"),
//   includePhotos: z.boolean().default(false), // For future image integrations
//   allowFirstPersonVoice: z.boolean().default(false),
//   storyPerspective: z
//     .enum(["third-person", "first-person", "omniscient"])
//     .default("third-person"),
// });
