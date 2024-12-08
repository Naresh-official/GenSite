import { z } from "zod";

export const signInSchema = z.object({
	email: z
		.string()
		.email()
		.min(6, { message: "Email must be at least 6 characters" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" }),
});
