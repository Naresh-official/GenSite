import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from "@/lib/prompts/systemPrompts";
import { uuidValidtor } from "@/schemas/conversationSchema";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/ErrorHandler";

export async function POST(request: Request) {
	try {
		const { templatePrompts, prompt } = (await request.json()) as {
			templatePrompts: string[];
			prompt: string;
		};

		const id = uuidValidtor.parse(
			new URL(request.url).searchParams.get("id")
		);

		if (!templatePrompts && !prompt) {
			return NextResponse.json(
				{ error: "Prompt is required" },
				{ status: 400 }
			);
		}

		let conversation = await prisma.conversation.findUnique({
			where: {
				id: id,
			},
			include: {
				messages: {
					orderBy: {
						createdAt: "asc",
					},
				},
			},
		});
		if (!conversation?.messages && !templatePrompts) {
			return NextResponse.json(
				{ error: "Conversation not found" },
				{ status: 404 }
			);
		}

		if (conversation?.messages.length === 0) {
			templatePrompts.map(async (prompt) => {
				await prisma.message.create({
					data: {
						role: "USER",
						content: prompt,
						conversationId: id,
					},
				});
			});
		}
		conversation = await prisma.conversation.findUnique({
			where: {
				id: id,
			},
			include: {
				messages: {
					orderBy: {
						createdAt: "asc",
					},
				},
			},
		});
		const genAI = new GoogleGenerativeAI(
			process.env.GEMINI_API_KEY as string
		);
		const model = genAI.getGenerativeModel({
			model: "gemini-1.5-flash",
			systemInstruction: getSystemPrompt() as string,
		});

		const chat = model.startChat({
			history: conversation?.messages.map((message) => ({
				role: message.role.toLowerCase(),
				parts: [
					{
						text: message.content,
					},
				],
			})),
		});
		await prisma.message.create({
			data: {
				content: prompt,
				role: "USER",
				conversationId: id,
			},
		});
		let response = "";
		// Create a ReadableStream to send chunks to the frontend
		const stream = new ReadableStream({
			async start(controller) {
				try {
					const result = await chat.sendMessageStream(prompt);
					for await (const chunk of result.stream) {
						const chunkText = chunk.text();
						// Encode the chunk and enqueue it to the stream
						controller.enqueue(new TextEncoder().encode(chunkText));
						response = response + chunkText;
					}
					controller.close(); // Close the stream when done
					await prisma.message.create({
						data: {
							content: response,
							role: "MODEL",
							conversationId: id,
						},
					});
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
		const err = handleError(error);
		return NextResponse.json(
			{ error: err || "Internal Server Error" },
			{ status: 500 }
		);
	}
}
