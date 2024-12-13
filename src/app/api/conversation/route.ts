import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { uuidValidtor } from "@/schemas/conversationSchema";
import { ZodError } from "zod";
import { handleError } from "@/lib/ErrorHandler";

export async function POST(request: Request) {
	try {
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}
		const user = await prisma.user.findUnique({
			where: {
				email: session?.user?.email as string,
			},
			select: {
				id: true,
				conversation: true,
			},
		});
		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}
		const conversation = await prisma.conversation.create({
			data: {
				title: "New conversation",
				userId: user?.id as string,
			},
		});
		if (!conversation) {
			return NextResponse.json(
				{ error: "Conversation not created" },
				{ status: 500 }
			);
		}
		return NextResponse.json(conversation, { status: 200 });
	} catch (error: unknown) {
		const err = handleError(error);
		return NextResponse.json({ error: err }, { status: 500 });
	}
}

export async function GET(request: Request) {
	try {
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}
		const user = await prisma.user.findUnique({
			where: {
				email: session?.user?.email as string,
			},
			select: {
				id: true,
				conversation: true,
			},
		});
		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}
		const url = new URL(request.url);
		const id = url.searchParams.get("id");
		if (id) {
			uuidValidtor.parse(id);
			const conversation = await prisma.conversation.findUnique({
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
			return NextResponse.json(conversation, { status: 200 });
		} else {
			const conversations = user?.conversation;
			return NextResponse.json(conversations, { status: 200 });
		}
	} catch (error: unknown) {
		const err = handleError(error);
		return NextResponse.json({ error: err }, { status: 500 });
	}
}

export async function PATCH(request: Request) {
	try {
		const { id, title }: { id: string; title: string } =
			await request.json();
		const conversation = await prisma.conversation.update({
			where: {
				id: id,
			},
			data: {
				title: title,
			},
		});
		if (!conversation) {
			return NextResponse.json(
				{ error: "Conversation not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(conversation, { status: 200 });
	} catch (error: unknown) {
		const err = handleError(error);
		return NextResponse.json({ error: err }, { status: 500 });
	}
}
