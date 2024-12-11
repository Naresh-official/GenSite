import axios from "axios";
import { ZodError } from "zod";

export const handleError = (error: unknown) => {
	if (error instanceof ZodError) {
		console.log(error.errors);
		return error.errors[0].message;
	} else if (axios.isAxiosError(error)) {
		console.log(error?.response?.data?.error);
		return error?.response?.data?.error;
	} else if (error instanceof Error) {
		console.log(error?.message);
		return error?.message;
	} else {
		console.log(error);
		return error;
	}
};
