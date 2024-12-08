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

		// Create a ReadableStream to send chunks to the frontend
		const stream = new ReadableStream({
			async start(controller) {
				try {
					const result = await chat.sendMessageStream(prompt);
					for await (const chunk of result.stream) {
						const chunkText = chunk.text();
						// Encode the chunk and enqueue it to the stream
						process.stdout.write(chunkText);
						controller.enqueue(new TextEncoder().encode(chunkText));
					}
					controller.close(); // Close the stream when done
				} catch (error) {
					controller.error(error); // Handle stream errors
				}
			},
		});

		return new Response(stream, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
			},
		});
	} catch (error: any) {
		console.error(error);
		return NextResponse.json(
			{ error: error?.message || "Internal Server Error" },
			{ status: 500 }
		);
	}
}
