import { z } from "zod";

export const signUpSchema = z.object({
	name: z
		.string()
		.max(20, { message: "Name must be at most 20 characters" })
		.min(2, { message: "Name must be at least 2 characters" }),
	email: z
		.string()
		.email()
		.min(6, { message: "Email must be at least 6 characters" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
			message:
				"Password must contain at least one lowercase letter, one uppercase letter, and one number",
		})
		.optional(),
	isSocialLogin: z.boolean().default(false),
	provider: z.enum(["GOOGLE", "GITHUB"]).optional(),
});
