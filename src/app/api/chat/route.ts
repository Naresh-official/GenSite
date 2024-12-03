import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from "@/lib/prompts/systemPrompts";

export async function POST(request: Request) {
	try {
		const { history, prompt } = (await request.json()) as {
			history: { role: string; parts: { text: string }[] }[];
			prompt: string;
		};
		const genAI = new GoogleGenerativeAI(
			process.env.GEMINI_API_KEY as string
		);
		const model = genAI.getGenerativeModel({
			model: "gemini-1.5-flash",
			systemInstruction: getSystemPrompt() as string,
		});

		const chat = model.startChat({
			history: history,
		});
		let result = await chat.sendMessageStream(prompt);
		for await (const chunk of result.stream) {
			const chunkText = chunk.text();
			process.stdout.write(chunkText);
		}

		return NextResponse.json(
			{ message: "Success", data: result },
			{ status: 200 }
		);
	} catch (error: any) {
		console.error(error);
		return NextResponse.json(
			{ error: error?.message || "Internal Server Error" },
			{ status: 500 }
		);
	}
}
