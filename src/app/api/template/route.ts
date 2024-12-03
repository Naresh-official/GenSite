import {
	DEFAULT_BASE_PROMPT,
	DEFAULT_REACT_PROMPT,
	getFilePrompts,
	getInitialPrompt,
} from "@/lib/prompts/defaultPrompts";
import { getTemplateSystemPrompt } from "@/lib/prompts/systemPrompts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { message } = await request.json();
		const genAI = new GoogleGenerativeAI(
			process.env.GEMINI_API_KEY as string
		);
		const model = genAI.getGenerativeModel({
			model: "gemini-1.5-flash",
			systemInstruction: getTemplateSystemPrompt() as string,
		});
		const result = await model.generateContent(message);

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
			},
			{
				status: 200,
			}
		);
	} catch (error: any) {
		return NextResponse.json(error.message, { status: 500 });
	}
}
