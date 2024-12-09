import {
	DEFAULT_BASE_PROMPT,
	getFilePrompts,
	getInitialPrompt,
} from "@/lib/prompts/defaultPrompts";
import {
	getConversationTitlePrompt,
	getTemplateSystemPrompt,
} from "@/lib/prompts/systemPrompts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { message } = await request.json();
		const genAI = new GoogleGenerativeAI(
			process.env.GEMINI_API_KEY as string
		);
		const templateModel = genAI.getGenerativeModel({
			model: "gemini-1.5-flash",
			systemInstruction: getTemplateSystemPrompt() as string,
		});
		const result = await templateModel.generateContent(message);

		if (!result) {
			return NextResponse.json(
				{ error: "Unable to process the request. Please try again." },
				{ status: 500 }
			);
		}

		const techStack: string =
			result.response.candidates?.[0]?.content?.parts[0]?.text
				?.toLocaleLowerCase()
				.split("\n")[0] || "";
		if (techStack === "other" || !techStack) {
			return NextResponse.json(
				{
					message:
						"The recommended tech stack is not one of the standard options. Please provide more information about the project to get a more accurate recommendation.",
				},
				{ status: 200 }
			);
		}

		const titleModel = genAI.getGenerativeModel({
			model: "gemini-1.5-flash",
			systemInstruction: getConversationTitlePrompt() as string,
		});
		const titleResult = await titleModel.generateContent(
			`tech stack:${techStack}\nproject description:${message}`
		);
		const title =
			titleResult?.response?.candidates?.[0]?.content?.parts[0]?.text?.trim() ||
			"";
		return NextResponse.json(
			{
				prompts:
					techStack === "nodejs"
						? [getInitialPrompt(techStack) as string]
						: [
								DEFAULT_BASE_PROMPT,
								getInitialPrompt(techStack) as string,
						  ],
				filePrompts: [getFilePrompts(techStack)],
				title: title,
			},
			{
				status: 200,
			}
		);
	} catch (error: any) {
		return NextResponse.json(error.message, { status: 500 });
	}
}
