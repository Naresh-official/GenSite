import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from "@/lib/prompts/systemPrompts";

export async function POST(request: Request) {
	try {
		const prompt: string = (await request.json()).prompt;
		const genAI = new GoogleGenerativeAI(
			process.env.GEMINI_API_KEY as string
		);
		const model = genAI.getGenerativeModel({
			model: "gemini-1.5-flash",
			systemInstruction: getSystemPrompt() as string,
		});

		const chat = model.startChat({
			history: [
				{
					role: "user",
					parts: [
						{
							text: "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.",
						},
					],
				},
				{
					role: "user",
					parts: [
						{
							text: "<genSite_running_commands>\n</genSite_running_commands>\n\ncreate a simple todo application in react\n\n# File Changes\n\nHere is a list of all files that have been modified since the start of the conversation.\nThis information serves as the true contents of these files!\n\nThe contents include either the full file contents or a diff (when changes are smaller and localized).\n\nUse it to:\n - Understand the latest file modifications\n - Ensure your suggestions build upon the most recent version of the files\n - Make informed decisions about changes\n - Ensure suggestions are compatible with existing code\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - /home/project/.genSite/config.json",
						},
					],
				},
			],
		});
		let result = await chat.sendMessageStream(
			"create a simple todo application in react"
		);
		for await (const chunk of result.stream) {
			const chunkText = chunk.text();
			process.stdout.write(chunkText);
		}

		return NextResponse.json({ message: "Success" }, { status: 200 });
	} catch (error: any) {
		console.error(error);
		return NextResponse.json(
			{ error: error?.message || "Internal Server Error" },
			{ status: 500 }
		);
	}
}
