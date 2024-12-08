import { z } from "zod";

export const messageDataSchema = z.object({
	role: z.string(),
	parts: z.array(
		z.object({
			text: z.string(),
		})
	),
});

export const messageSchema = z.object({
	conversationId: z.string(),
	data: messageDataSchema,
});
