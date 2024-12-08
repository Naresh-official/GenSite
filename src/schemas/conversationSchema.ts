import { z } from "zod";

export const uuidValidtor = z.string().uuid({
	message: "Invalid id format",
});
