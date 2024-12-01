import { NextResponse } from "next/server";
import {
	GenerateContentStreamResult,
	GoogleGenerativeAI,
} from "@google/generative-ai";

export async function POST(request: Request) {
	try {
		const prompt: string = (await request.json()).prompt;
		const genAI = new GoogleGenerativeAI(
			process.env.GEMINI_API_KEY as string
		);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const result: GenerateContentStreamResult =
			await model.generateContentStream(prompt);

		let response: string = "";
		// Print text as it comes in.
		for await (const chunk of result.stream) {
			const chunkText = chunk.text();
			process.stdout.write(chunkText);
			response += chunkText;
		}
		return NextResponse.json(
			{ message: "Success", result: response },
			{ status: 200 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ error: error?.message || "Internal Server Error" },
			{ status: 500 }
		);
	}
}
