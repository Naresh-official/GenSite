import { z } from "zod";

export const messageSchema = z.object({
	conversationId: z.string(),
  role: z.enum(["USER", "MODEL"]),
  content: z.string(),
});
